var scene, camera, renderer;
var sceneHUD, cameraHUD;


var grid;

// contains all solids created in the scene
var solids = []; // octree solids
var csg_solids = [];

var OCTREE_MODEL = 0;
var CSG_MODEL = 1;
var modelType = OCTREE_MODEL;

var raycast = {origin: [3, 4, 3], direction: [-1.4, -1.6, -1.1]}

// for import/export rotation 
var ONE_AXIS = 0;
var THREE_AXIS = 1;
var rotationType = THREE_AXIS;

// TODO Move this to Utils/UtilsStatic.js
// utils
function rgbToHex(r, g, b, multiplyTimes255=true) {
	if (multiplyTimes255)
	{
		r *= 255;
		g *= 255;
		b *= 255;
	}
	r = parseInt(r);
	g = parseInt(g);
	b = parseInt(b);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// [1]
function init ()
{
	// Resolution
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth - 10,
		HEIGHT = window.innerHeight - 10;


	// Creates renderer
	renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0x222233, 1);
	renderer.autoClear = false;
	var glcanvas = renderer.domElement;
	glcanvas.className = "glcanvas";
	document.body.appendChild(glcanvas);

	grid = new THREE.GridHelper(10, 10);
	scene.add(grid);


	/******
	 * HUD
	 */
	HUD.create(WIDTH, HEIGHT);

	var windowWidth = 220;

	// Camera
	camera = new THREE.PerspectiveCamera (45, WIDTH / HEIGHT, 0.1, 20000);
	camera.position.set(0,6,10);
	scene.add(camera);


	// Events
	window.addEventListener('resize',
		function()
		{
			var WIDTH = window.innerWidth * 0.9,
				HEIGHT = window.innerHeight * 0.9;
			renderer.setSize(WIDTH, HEIGHT);
			camera.aspect = WIDTH / HEIGHT;
			camera.updateProjectionMatrix();
		}
	);


	// Lights
	var light = new THREE.PointLight(0xFFFFFF);
	light.position.set(200,200,200);
	scene.add(light);

	light = new THREE.PointLight(0xFFFFFF, 0.5);
	light.position.set(-200,-200,-200);
	scene.add(light);

	light = new THREE.PointLight(0xFFFFFF);
	light.position.set(-200,0,200);
	scene.add(light);

	light = new THREE.AmbientLight(0xFFFFFF, 0.1);
	scene.add(light);

	// Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);

}

// [2]
function animate ()
{
	renderer.render(scene, camera);
	renderer.render(HUD.getScene(), HUD.getCamera());
	controls.update();
	requestAnimationFrame(animate);
}

function generateMesh(model, id, offset=0) {
	var geometry = Utils.Model.toGeometry(model, offset); // MDL_ variables is defined in "models" folder
	var material = new THREE.MeshPhongMaterial (model.material);
	var mesh = new THREE.Mesh(geometry, material);
	if (model.material.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();
	return mesh;
}

function generateWireframeBBox(solid, offset=0, visible=false) {
	var model = solid._octree.boundingBox.model();
	

	var geometry = Utils.Model.toGeometry(model, offset);

	var material = new THREE.MeshBasicMaterial ({
		color: model.material.color,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide,
		depthWrite: false,
		// depthTest: false,
		wireframe: true,
	});
	
	if (!visible) {
		material.transparent = true;
		material.opacity = 0;
		material.wireframe = false;
	}

	var mesh = new THREE.Mesh(geometry, material);
	
	if (model.material.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();

	return mesh;
}

// [3]
function addToScene (model, index, color=null, offset=0) {
	var mesh = generateMesh(model, index, offset);
	mesh.name = 'solid-' + index;
	scene.add(mesh);

}


function addWireframeBBOxToScene(solid, index, offset=0, visible=true) {
	var mesh = generateWireframeBBox(solid, offset);
	mesh.name = 'wireframe-' + index;
	mesh.visible = visible;
	scene.add(mesh);
}

function addSolid(solid, color=null, solidsIndex=null) {
	var model = solid.model();
	var index;

	if (model) {
		solids.push(solid);
		
		index = solids.length-1;
		addToScene(model, index, color);
		addWireframeBBOxToScene(solids[index], index)

		addSelectionSolidButton(index, OCTREE_MODEL);

		updateColor(index, OCTREE_MODEL, color);
	}
	else
	{
		alert("Empty model");
	}
}

function addCsgSolidToScene(geometry, index)
{
	var test_mat = {
		color: 0x00FF00,
		specular: 0xFFDDDD,
		shininess: 2,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide,
		wireframe: false,
		transparent: true,
		opacity: 1,
	};

	var material = new THREE.MeshPhongMaterial (test_mat);

	var mesh = new THREE.Mesh(geometry, material);
	mesh.name = 'csg-solid-' + index;

	if (test_mat.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();
	scene.add(mesh);

	// create bounding box
	var bBox = new THREE.BoundingBoxHelper(mesh, 0xff0000);
	bBox.update();
	bBox.name = 'csg-bbox-'+index;

	var material = bBox.material;
	bBox.material = material;
	material.transparent = true;
	material.opacity = 0;
	material.wireframe = false;
	material.depthWrite = false;

	scene.add(bBox);
}

function addCsgSolid(solid, color=null)
{
	csg_solids.push(solid);
	var index = csg_solids.length-1;

	// setSmcRaycast(solid, index);

	// solid may be a nodeLeaf in case of "new primitive"
	if (solid instanceof CSG.NodeLeaf) {
		solid = solid.solid;
	}

	addCsgSolidToScene(solid.geometry(), index);

	addSelectionSolidButton(index, CSG_MODEL);

	updateColor(index, CSG_MODEL, color);

}

function setSmcRaycast(solid, index, origin=null, direction=null)
{
	// remove any previous SMC raycast that this CSG may have
	scene.remove(scene.getObjectByName('smc-raycast-'+index));

	if (origin == null)
		origin = new THREE.Vector3().fromArray(raycast.origin);

	if (direction == null)
		direction = new THREE.Vector3().fromArray(raycast.direction);
	direction = direction.normalize();


    var intervalList = solid.setMembershipRaycast(origin, direction);
    var raycastLineGroup = CSG.rayLineObjectGroup(origin, direction, intervalList);
    raycastLineGroup.name = 'smc-raycast-'+index;
    scene.add(raycastLineGroup);

    console.log(intervalList);
}

// add a select button for the last added solid
function addSelectionSolidButton(index, model, color=null) {
	$(document).ready(function() {
		var prefix = (model == OCTREE_MODEL) ? 'OCT ' : 'CSG ';

		var showSMCButton = '';
		if (model == CSG_MODEL)
		{
			showSMCButton = "<input type='checkbox' class='show-smc' value='"+index+"' data-model-type='"+model+"'>";
		}

		if (color == null)
			if (model == CSG_MODEL)
				color = '#00FF00';
			else if (model == OCTREE_MODEL)
				color = '#FF0000';

		$('#window-solids').append(" \
			<div data-index='"+index+"' data-model-type='"+model+"'> \
				<input type='button' class='solid-selection' value='"+prefix+(index+1)+"' data-index='"+index+"' data-model-type='"+model+"'> \
				<input type='color' class='solid-color' data-index='"+index+"' value='"+color+"' data-model-type='"+model+"'> \
				<input type='checkbox' class='show-solid' checked='checked' value='"+index+"' data-model-type='"+model+"'> \
				<input type='checkbox' class='show-bbox' value='"+index+"' data-model-type='"+model+"'> \
				"+showSMCButton+"<br> \
			</div> \
		");

	});
}

function updateColor(index, modelType, color=null)
{
	if (color != null) {
		$(document).ready(function() {
			$('.solid-color[data-index='+index+'][data-model-type='+modelType+']')
			.val(rgbToHex(color.r, color.g, color.b)).change();
		});
	}
}


// IMPORT

function importOnlyOctreeFromString(input, solidsIndex=null)
{
	input = input.split(' ');

	var i = 0;

	// parseFloat if possible
	for (i = 0; i < input.length; i++)
		if (!isNaN(parseFloat(input[i])))
			input[i] = parseFloat(input[i]);

	i = -1;

	var center = {
		x: input[++i],
		y: input[++i],
		z: input[++i],
	}
	var bBoxEdge = input[++i];
	var code = input[++i];

	var solid = new Primitives.Solid(center);
	solid.fromString(code, bBoxEdge);
	addSolid(solid, solidsIndex);

	return solid;

}
// Analyse if a string contains a CSG, Octree or Color and import it
function importString(input) {
	input = input.split(' ');
	var i = 0;

	var csgStack = [],
		octreeStack = [];
	var stackI = 0,
		octreeStackI = 0;
	
	// parseFloat if possible
	for (i = 0; i < input.length; i++)
		if (!isNaN(parseFloat(input[i])))
			input[i] = parseFloat(input[i]);

	i = 0;

	var avoidInfiniteLoop = 0;

	while (i < input.length && avoidInfiniteLoop++ < 1000)
	{
		// primitives
		switch(input[i])
		{
			// comment
			case '#':
				// just comment
				return null;

			// comment-funcionalities 
			case '#c':
				return {type: 'Color', rgb: {r: input[++i], g: input[++i], b: input[++i]} };

			// Octree only
			case 'O':
				// bottom-left vertex
				var minorVertex = {
					x: input[++i],
					y: input[++i],
					z: input[++i],
				}
				var bBoxEdge = input[++i];
				var code = input[++i];

				octreeStack[octreeStackI] = new Primitives.Solid({
					x: minorVertex.x + bBoxEdge/2,
					y: minorVertex.y + bBoxEdge/2,
					z: minorVertex.z + bBoxEdge/2,
				});
				octreeStack[octreeStackI].fromString(code, bBoxEdge);

				octreeStackI++;

				i++;
				break;

			// CSG primitives

			case 'S': // Sphere
				csgStack[stackI++] = new CSG.NodeLeaf(new Primitives.SolidSphere({
					x: input[++i],
					y: input[++i],
					z: input[++i],
				}, input[++i]));
				
				i++;
				break;

			case 'C': // Cylinder
				var minorVertex = {x: input[++i], y: input[++i], z: input[++i],}; //bottom-left vertex
				var r = input[++i];
				var h = input[++i];

				csgStack[stackI++] = new CSG.NodeLeaf(new Primitives.SolidCylinder({
					x: minorVertex.x,
					y: (minorVertex.y + h)/2,
					z: minorVertex.z,
				}, r, h));

				i++;
				break;

			case 'K': // Cone
				var minorVertex = {x: input[++i], y: input[++i], z: input[++i],}; //bottom-left vertex
				var r = input[++i];
				var h = input[++i];

				csgStack[stackI++] = new CSG.NodeLeaf(new Primitives.SolidCone({
					x: minorVertex.x,
					y: (minorVertex.y + h)/2,
					z: minorVertex.z,
				}, r, h));

				i++;
				break;

			case 'T': // Torus
				csgStack[stackI++] = new CSG.NodeLeaf(new Primitives.SolidTorus({
					x: input[++i],
					y: input[++i],
					z: input[++i],
				}, input[++i], input[++i]));

				i++;
				break;

			case 'B': // Box
				var minorVertex = {x: input[++i], y: input[++i], z: input[++i],};
				var w = input[++i];
				var h = input[++i];
				var d = input[++i];
				var majorVertex = {
					x: minorVertex.x + w,
					y: minorVertex.y + h,
					z: minorVertex.z + d,
				}

				csgStack[stackI++] = new CSG.NodeLeaf(new Primitives.SolidCube({
						x: (minorVertex.x + majorVertex.x)/2,
						y: (minorVertex.y + majorVertex.y)/2,
						z: (minorVertex.z + majorVertex.z)/2,
					}, 1));

				// scale if needed
				if (w != 1 || h != 1 || d != 1)
					csgStack[stackI-1] = new CSG.NodeScale(csgStack[stackI-1], {x: w, y: h, z: d})
				
				i++;
				break;


			// transformations
			case 't':
				csgStack[stackI-1] = new CSG.NodeTranslate(csgStack[stackI-1], {
											x: input[++i],
											y: input[++i],
											z: input[++i],
										})
				
				i++;
				break;

			case 's':
				csgStack[stackI-1] = new CSG.NodeScale(csgStack[stackI-1], {
											x: input[++i],
											y: input[++i],
											z: input[++i],
										})
				
				i++;
				break;

			case 'r':
				if (rotationType == THREE_AXIS)
				{
					csgStack[stackI-1] = new CSG.NodeRotate(csgStack[stackI-1], {
											x: input[++i],
											y: input[++i],
											z: input[++i],
										})
				}
				else if (rotationType == ONE_AXIS)
				{
					var pos = {
						x: input[++i],
						y: input[++i],
						z: input[++i],
					}
					var angle = input[++i];

					csgStack[stackI-1] = new CSG.NodeRotate(csgStack[stackI-1], {
						x: pos.x*angle,
						y: pos.y*angle,
						z: pos.z*angle,
					})
				}
				
				i++;
				break;

			// case boolean operations
			case 'u':
				csgStack[stackI-2] = new CSG.NodeUnion(csgStack[stackI-2], csgStack[stackI-1]);
				csgStack[stackI-1] = null;
				stackI--;
				
				i++;
				break;

			case 'i':
				csgStack[stackI-2] = new CSG.NodeIntersect(csgStack[stackI-2], csgStack[stackI-1]);
				csgStack[stackI-1] = null;
				stackI--;
				
				i++;
				break;

			case 'd':
				csgStack[stackI-2] = new CSG.NodeDifference(csgStack[stackI-2], csgStack[stackI-1]);
				csgStack[stackI-1] = null;
				stackI--;
				
				i++;
				break;

			// just ignores something else
			default:
				
				// other unknown primitives
				if (/[A-Z]/.test(input[i])) {
					console.log('Unknown CSG Primitive');
					csgStack[stackI++] = new CSG.NodeLeaf(
						new Primitives.SolidCube({ x: 0.5, y: 0.5, z: 0.5 }, 1)
					);
				}

				i++;

		}
		
	}

	return {type: 'Solids', csg: csgStack, octree: octreeStack};
}

// EXPORT

// Iterate through a CSG Solid and stack its kids (from top to bottom, right to left).
// Then print the stack from backwards
function exportCsg(solid)
{
	var s = {stack: []}

	exportCsgRecursion(solid, s);

	var output = '';

	var minorVertex;

	for (var i = s.stack.length-1; i >= 0; i--)
	{
		switch(s.stack[i].name)
		{
			// primitives
			case 'Sphere':
				output += ['S', s.stack[i].center.x, s.stack[i].center.y, s.stack[i].center.z, s.stack[i].radius].join(' ');
				output += ' ';
				break;

			case 'Cube':
				params = [
					// bottom-left vertex
					s.stack[i].center.x - s.stack[i].edge/2, 
					s.stack[i].center.y - s.stack[i].edge/2, 
					s.stack[i].center.z - s.stack[i].edge/2,

					s.stack[i].edge,
					s.stack[i].edge,
					s.stack[i].edge,
				];

				var whd = [s.stack[i].edge, s.stack[i].edge, s.stack[i].edge]
				output += 'B ' + params.join(' ');
				output += ' ';
				break;

			case 'Cylinder':
				params = [
					// bottom-left vertex (minor)
					s.stack[i].center.x, 
					s.stack[i].center.y - s.stack[i].height/2, 
					s.stack[i].center.z,

					s.stack[i].radius,
					s.stack[i].height,
				];

				output += 'C ' + params.join(' ');
				output += ' ';
				break;

			case 'Cone':
				params = [
					// bottom-left vertex (minor)
					s.stack[i].center.x, 
					s.stack[i].center.y - s.stack[i].height/2, 
					s.stack[i].center.z,

					s.stack[i].radius,
					s.stack[i].height,
				];

				output += 'K ' + params.join(' ');
				output += ' ';
				break;

			case 'Torus':
				params = [
					// bottom-left vertex (minor)
					s.stack[i].center.x, 
					s.stack[i].center.y, 
					s.stack[i].center.z,

					s.stack[i].radius,
					s.stack[i].tubeRadius,
				];

				// var whd = [s.stack[i].edge, s.stack[i].edge, s.stack[i].edge]
				output += 'T ' + params.join(' ');
				output += ' ';
				break;
			
			// boolean operations
			case 'CSG.NodeUnion':
				output += 'u ';
				break;

			case 'CSG.NodeDifference':
				output += 'd ';
				break;

			case 'CSG.NodeIntersect':
				output += 'i ';
				break;

			// transformations
			case 'CSG.NodeTranslate':
				output += 't ' + [s.stack[i].param.x, s.stack[i].param.y, s.stack[i].param.z].join(' ');
				output += ' ';
				break;

			case 'CSG.NodeScale':
				output += 's ' + [s.stack[i].param.x, s.stack[i].param.y, s.stack[i].param.z].join(' ');
				output += ' ';
				break;

			case 'CSG.NodeRotate':
				if (rotationType == THREE_AXIS)
				{
					output += 'r ' + [s.stack[i].param.x, s.stack[i].param.y, s.stack[i].param.z].join(' ');
					output += ' ';
				}
				else if (rotationType == ONE_AXIS)
				{
					output += 'r 1 0 0 ' + s.stack[i].param.x + ' ';
					output += 'r 0 1 0 ' + s.stack[i].param.y + ' ';
					output += 'r 0 0 1 ' + s.stack[i].param.z + ' ';
				}
				break;

			default:
				output += '';
		}
	}

	return output.trim();
}

function exportCsgRecursion(node, p)
{
	if (node == null)
		return;

	p.stack.push(node);

	if (node.name == 'CSG.NodeUnion' || node.name == 'CSG.NodeDifference' || node.name == 'CSG.NodeIntersect')
	{
		exportCsgRecursion(node.right, p);	
		exportCsgRecursion(node.left, p);
	}
	else if (node.name == 'CSG.NodeTranslate' || node.name == 'CSG.NodeRotate' || node.name == 'CSG.NodeScale')
		exportCsgRecursion(node.child, p);
	else if (node.name == 'CSG.NodeLeaf')
		exportCsgRecursion(node.solid, p);
}
