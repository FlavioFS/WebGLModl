var scene, camera, renderer;
var sceneHUD, cameraHUD;

// contains all solids created in the scene
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
}

afterPushingTo(solids, function() {
	// console.log(solids[0].constructor.name)
	// console.log(Primitives.Solid.name)
	if (window_solids != null)
		window_solids.append(new HUD.Button(
			'Solid ' + solids.length/* + ' - ' solids[solids.length-1].className*/,
			{className: 'solid-selection', dataset: {index: solids.length-1}}
		));
})


// [1]
function init ()
{
	// Resolution
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth * 0.9,
		HEIGHT = window.innerHeight * 0.9;


	// Creates renderer
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0x222233, 1);
	renderer.autoClear = false;
	var glcanvas = renderer.domElement;
	glcanvas.className = "glcanvas";
	document.body.appendChild(glcanvas);


	/******
	* HUD 
	*/
	HUD.create(WIDTH, HEIGHT);

	var w = new HUD.Window('Primitives',
		{id: 'window1', width:200, height:700, resizable: true});
	w.append(new HUD.Button('New Cube', {id: 'new-cube'}));
	w.append(new HUD.Button('New Sphere', {id: 'new-sphere'}));
	w.append(new HUD.Button('New Cone', {id: 'new-cone'}));
	w.append(new HUD.Button('New Cylinder', {id: 'new-cylinder'}));
	w.append(new HUD.Button('Export', {id: 'export'}));
	w.append(new HUD.Button('Import', {id: 'import'}));

	w.appendHtml(document.createElement('hr'));

	window_solids = new HUD.Window('Solids in the Scene',
		{width:200, height:700, left: (WIDTH-200)+'px', resizable: true});
	window_solids.append(new HUD.Label('Click to select:', null, null))
	window_solids.append(new HUD.Button(
			'     Deselect     ', {id: 'solid-deselection'}
		));
	
	// w2.append(new HUD.Button('Render', 'render', {}));
	// w2.append(new HUD.Button('Animate', 'animate', {}));
	// w2.append(new HUD.Button('Etc.', 'etc', {}));



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

function generateMesh(model, offset=0) {
	var geometry = Utils.Model.toGeometry(model, offset); // MDL_ variables is defined in "models" folder
	var material = new THREE.MeshPhongMaterial (model.material);
	var mesh = new THREE.Mesh(geometry, material);
	if (model.material.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();
	return mesh;
}

// [3]
function addToScene (model, offset=0) {
	scene.add(generateMesh(model, offset));
}

