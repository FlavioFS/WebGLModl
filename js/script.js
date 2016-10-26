var scene, camera, renderer;
var sceneHUD, cameraHUD;

// contains all solids created in the scene
var grid;
var solids = [];
var world = null;

// window for solids in the scene
var window_solids = null;


// Utilities

// Makes some array trigger a callback function when pushed by overriding push()
var afterPushingTo = function(arr, callback) {
	arr.push = function(elem) {
		Array.prototype.push.call(arr, elem);
		callback();
		return arr.length;
	}
};

// appends to the 'Solids in the Scene' window buttons for selection
// and checkboxes for showing solid/wireframe
afterPushingTo(solids, function() {
	if (window_solids != null) {
		
		ws = document.getElementById('window-solids');
		var div = document.createElement('div');
		div.dataset.index = solids.length-1;
		ws.appendChild(div);

		var button = document.createElement('input');
		button.setAttribute('type', 'button');
		button.className = 'solid-selection';
		button.value = 'Solid ' + solids.length;
		button.dataset.index = solids.length-1;
		div.appendChild(button);

		var colorPicker = document.createElement('input');
		colorPicker.setAttribute('type', 'color');
		colorPicker.className = 'solid-color';
		colorPicker.value = '#FF0000';
		colorPicker.dataset.index = solids.length-1;
		div.appendChild(colorPicker);

		var c1 = document.createElement('input');
		c1.setAttribute('type', 'checkbox');
		c1.setAttribute('class', 'show-solid');
		c1.setAttribute('checked', 'checked');
		c1.value = solids.length-1;
		div.appendChild(c1);

		var c2 = document.createElement('input');
		c2.setAttribute('type', 'checkbox');
		c2.setAttribute('class', 'show-wireframe');
		c2.value = solids.length-1;
		div.appendChild(c2);

		var br = document.createElement('br');
		div.appendChild(br);
		
		
		
	}
});


// [1]
function init ()
{
	// Resolution
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth * 0.9,
		HEIGHT = window.innerHeight * 0.9;


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

	var w = new HUD.Window('Primitives',
		{id: 'window1', width:200, height:800, resizable: true});
	w.append(new HUD.Button('New Cube', {id: 'new-cube'}));
	w.append(new HUD.Button('New Sphere', {id: 'new-sphere'}));
	w.append(new HUD.Button('New Cone', {id: 'new-cone'}));
	w.append(new HUD.Button('New Cylinder', {id: 'new-cylinder'}));
	w.append(new HUD.Button('New Torus', {id: 'new-torus'}));
	w.appendHtml(document.createElement('hr'));
	w.append(new HUD.Button('Export', {id: 'export'}));
	w.append(new HUD.Button('Import', {id: 'import'}));
	w.appendHtml(document.createElement('hr'));
	w.append(new HUD.Button('Duplicate Solid', {id: 'duplicate'}));
	w.append(new HUD.Button('Delete Solid', {id: 'delete'}));

	window_solids = new HUD.Window('Solids in the Scene',
		{id:'window-solids', width:200, height:700, left: (WIDTH-50)+'px', resizable: true});
	window_solids.append(new HUD.Label('Click to select:', null, null));
	window_solids.append(new HUD.Button(
			'     Deselect     ', {id: 'solid-deselection'}
		));
	
	// w2.append(new HUD.Button('Render', 'render', {}));
	// w2.append(new HUD.Button('Animate', 'animate', {}));
	// w2.append(new HUD.Button('Etc.', 'etc', {}));

	// var torus = new Primitives.SolidTorus({x:0, y:0, z:0}, 4, 1);
	// torus.calcOctree(1);
	// var mymdl = torus.model();
	// if (mymdl) addToScene(mymdl);
	// else console.log("Empty model!!");

	// Camera
	camera = new THREE.PerspectiveCamera (45, WIDTH / HEIGHT, 0.1, 20000);
	camera.position.set(0,6,0);
	camera.position.z = 10;
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
	var test_cub = new Primitives.SolidCube({x:0, y:0, z:0}, 4);
	var test_sph = new Primitives.SolidSphere({x:1, y:1, z:1}, 2);
	var test_cyl = new Primitives.SolidCylinder({x:-1, y:-1, z:-1}, 1, 6);

	var test_dif1 = new CSG.NodeDifference(null, test_cub, test_sph);
	var test_dif2 = new CSG.NodeDifference(null, test_dif1, test_cyl);

	var material = new THREE.MeshPhongMaterial (test_mat);
	var mesh = new THREE.Mesh(test_dif2.geometry(), material);
	if (test_mat.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();
	scene.add(mesh);


	// world = new Primitives.Solid({x:0,y:0,z:0});
	// world.createWorldOctree(16, 5);
	// console.log(world.toString())

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
function addToScene (model, id, offset=0) {
	var mesh = generateMesh(model, id, offset);
	mesh.name = 'solid-' + id;
	scene.add(mesh);
}



function addWireframeBBOxToScene(solid, id, offset=0, visible=true) {
	var mesh = generateWireframeBBox(solid, offset);
	mesh.name = 'wireframe-' + id;
	mesh.visible = visible;
	scene.add(mesh);
}

function addSolid(solid) {
	var model = solid.model();
	if (model) {
		var index = solids.push(solid) - 1;	
		addToScene(model, index);
		addWireframeBBOxToScene(solids[index], index)
	}
	else
	{
		alert("Empty model");
	}
}
