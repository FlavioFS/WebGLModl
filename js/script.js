var scene, camera, renderer;
var sceneHUD, cameraHUD;

// contains all solids created in the scene
var grid;
var solids = [];
var csg_solids = [];
var world = null;

var OCTREE_MODEL = 0;
var CSG_MODEL = 1;
var modelType = CSG_MODEL;

// Utilities

// Makes some array trigger a callback function when pushed by overriding push()

// appends to the 'Solids in the Scene' window buttons for selection
// and checkboxes for showing solid/wireframe


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


	// CSG Test
	var test_mat = {
		color: 0xFF0000,
		specular: 0xFFDDDD,
		shininess: 2,
		shading: THREE.FlatShading,
		wireframe: false,
		transparent: true,
		opacity: 1.0
	};

	// Testing CSG
	// var test_cub = new Primitives.SolidCube({x:0, y:0, z:0}, 4);
	// var test_sph = new Primitives.SolidSphere({x:1, y:1, z:1}, 2);
	// var test_cyl = new Primitives.SolidCylinder({x:-1, y:-1, z:-1}, 1, 6);

	// Functional CSG tree geometry test
	// var result_geo = new CSG.NodeDifference(

	// 	new CSG.NodeDifference (

	// 		new CSG.NodeLeaf(
	// 			new Primitives.SolidCube(Utils.Vector.ZERO, 4)
	// 		),

	// 		new CSG.NodeTranslate(
	// 			new CSG.NodeScale(
	// 				new CSG.NodeLeaf(
	// 					new Primitives.SolidSphere(Utils.Vector.ZERO, 1)
	// 				),
	// 				{x:2, y:2, z:2}
	// 			),
	// 			{x:1, y:1, z:1}
	// 		)

	// 	),

	// 	new CSG.NodeTranslate(
	// 		new CSG.NodeLeaf(
	// 			new Primitives.SolidCylinder(Utils.Vector.ZERO, 1, 6)
	// 		),
	// 		{x:-1, y:-1, z:-1}
	// 	)

	// ).geometry();

	// importing CSG

	// // var test_dif1 = new CSG.NodeDifference(test_cub, test_sph);
	// // var test_dif2 = new CSG.NodeDifference(test_dif1, test_cyl);

	// var material = new THREE.MeshPhongMaterial (test_mat);
	// var mesh = new THREE.Mesh(result_geo, material);
	// if (test_mat.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();
	// scene.add(mesh);

}


// custom push() for solids[]
var afterPushingTo = function(arr, callback) {
	arr.push = function(elem) {
		Array.prototype.push.call(arr, elem);
		callback();
		return arr.length;
	}
};

afterPushingTo(solids, function() {
	$(document).ready(function() {
		var index = solids.length-1;

		$('#window-solids').append(" \
			<div data-index='"+index+"' data-model-type='"+OCTREE_MODEL+"'> \
				<input type='button' class='solid-selection' value='OCTREE "+(index+1)+"' data-index='"+index+"' data-model-type='"+OCTREE_MODEL+"'> \
				<input type='color' class='solid-color' data-index='"+index+"' value='#FF0000'> \
				<input type='checkbox' class='show-solid' checked='checked' value='"+index+"' data-model-type='"+OCTREE_MODEL+"'> \
				<input type='checkbox' class='show-bbox' value='"+index+"' data-model-type='"+OCTREE_MODEL+"'> \
				<br> \
			</div> \
		");
	});
});

afterPushingTo(csg_solids, function() {
	$(document).ready(function() {
		var index = csg_solids.length-1;

		$('#window-solids').append(" \
			<div data-index='"+index+"' data-model-type='"+CSG_MODEL+"'> \
				<input type='button' class='solid-selection' value='CSG "+(index+1)+"' data-index='"+index+"' data-model-type='"+CSG_MODEL+"'> \
				<input type='color' class='csg-solid-color' data-index='"+index+"' value='#FF0000'> \
				<input type='checkbox' class='show-solid' checked='checked' value='"+index+"' data-model-type='"+CSG_MODEL+"'> \
				<input type='checkbox' class='show-bbox' value='"+index+"' data-model-type='"+CSG_MODEL+"'> \
				<br> \
			</div> \
		");
	});
});

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
function addToScene (model, id, color=null, offset=0) {
	var mesh = generateMesh(model, id, offset);
	mesh.name = 'solid-' + id;
	scene.add(mesh);

	// change color
	if (color != null) {
		// console.log('aqui')
		color = new THREE.Color(color.r, color.g, color.b).getHex().toString(16);

		$(document).ready(function() {
			$('.solid-color[data-index='+index+']').val('#'+color).change();
		});
	}
}



function addWireframeBBOxToScene(solid, id, offset=0, visible=true) {
	var mesh = generateWireframeBBox(solid, offset);
	mesh.name = 'wireframe-' + id;
	mesh.visible = visible;
	scene.add(mesh);
}

function addSolid(solid, color=null) {
	var model = solid.model();
	if (model) {
		var index = solids.push(solid) - 1;	
		addToScene(model, index, color);
		addWireframeBBOxToScene(solids[index], index)
	}
	else
	{
		alert("Empty model");
	}
}

function addCsgSolidToScene(geometry, index)
{
	var test_mat = {
		color: 0xFF0000,
		specular: 0xFFDDDD,
		shininess: 2,
		shading: THREE.FlatShading,
		side: THREE.DoubleSide,
		wireframe: false,
		transparent: true,
		opacity: 1.0
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
	var index = csg_solids.push(solid) - 1;

	addCsgSolidToScene(solid.geometry(), index);

	// change color
	if (color != null) {
		color = new THREE.Color(color.r, color.g, color.b).getHex().toString(16);

		$(document).ready(function() {
			$('.csg-solid-color[data-index='+index+']').val('#'+color).change();
		});
	}

}

// Analyse if a string contains a CSG, Octree or Color
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
	console.log(input)

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
				var center = {
					x: input[++i],
					y: input[++i],
					z: input[++i],
				}
				var bBoxEdge = input[++i];
				var code = input[++i];

				octreeStack[octreeStackI] = new Primitives.Solid(center);
				octreeStack[octreeStackI].fromString(code, bBoxEdge);

				octreeStackI++;

				i++;
				break;

			// CSG primitives
			case 'S':
				csgStack[stackI++] = new Primitives.SolidSphere({
					x: input[++i],
					y: input[++i],
					z: input[++i],
				}, input[++i]);
				
				i++;
				break;

			case 'C':
				var minorVertex = {x: input[++i], y: input[++i], z: input[++i],};
				var r = input[++i];
				var h = input[++i];

				csgStack[stackI++] = new Primitives.SolidCylinder({
					x: minorVertex.x,
					y: (minorVertex.y + h)/2,
					z: minorVertex.z,
				}, r, h);

				i++;
				break;

			case 'B':
				var minorVertex = {x: input[++i], y: input[++i], z: input[++i],};
				var w = input[++i];
				var h = input[++i];
				var d = input[++i];
				var majorVertex = {
					x: minorVertex.x + w,
					y: minorVertex.y + h,
					z: minorVertex.z + d,
				}

				csgStack[stackI++] = new Primitives.SolidCube({
						x: (minorVertex.x + majorVertex.x)/2,
						y: (minorVertex.y + majorVertex.y)/2,
						z: (minorVertex.z + majorVertex.z)/2,
					}, 1);

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
				csgStack[stackI-1] = new CSG.NodeRotate(csgStack[stackI-1], {
											x: input[++i],
											y: input[++i],
											z: input[++i],
										})
				i++; //  ignores the last argument - TODO
				
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
				i++;

		}
		
	}

	return {type: 'Solids', csg: csgStack, octree: octreeStack};
}