var scene, camera, renderer;
var sceneHUD, cameraHUD;

// [0]
// check end of this file

// function main () {
// 	init();
// 	animate();
// }

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

	// GUI
	// GUI.publicMethod();
	// GUI.setCanvas(glcanvas);

	// var tab1 = new GUI.FloatingWindow('Objects', 10, 20);
	// var tab2 = new GUI.FloatingWindow('Shaders', 50, 200);
	// tab1.show();
	// tab2.show();
	// tab1.show();


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
	light.position.set(-100,200,100);
	scene.add(light);

	light = new THREE.AmbientLight(0xFFFFFF, 0.1);
	scene.add(light);	

	// addToScene (MDL_kunai);   // 1
	// addToScene (MDL_target);  // 2

	// 3
	var solid = new Primitives.SolidCylinder({x:0, y:0, z:0}, 2, 4);
	solid.calcOctree(2);
	var model = solid.model();
	addToScene(model);

	// Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);


	// HUD

	// console.log(WIDTH)
	// console.log(HEIGHT)
	HUD.create(WIDTH, HEIGHT);

	var w = new HUD.Window('Window',
		{width:200, height:400, backgroundColor:'#AAAAAA'},
		{resizable: true});
	var b1 = new HUD.Button('New Cube', {});
	var b2 = new HUD.Button('New Sphere', {});
	var b3 = new HUD.Button('New Torus', {});
	w.append(b1);
	w.append(b2);
	w.append(b3);
	

	var w2 = new HUD.Window('Another Window',
		{width:200, height:400, backgroundColor:'#AAAAAA', left: (WIDTH-200)+'px'},
		{resizable: true});
	var b4 = new HUD.Button('Render', {});
	var b5 = new HUD.Button('Animate', {});
	var b6 = new HUD.Button('Etc.', {});
	w2.append(b4);
	w2.append(b5);
	w2.append(b6);
}

// [2]
function animate ()
{
	renderer.render(scene, camera);
	renderer.render(HUD.getScene(), HUD.getCamera());
	controls.update();
	requestAnimationFrame(animate);
}

// [3]
function addToScene (model, offset=0) {
	var geometry = Utils.JSONList2Geometry(model, offset); // MDL_ variables is defined in "models" folder
	var material = new THREE.MeshPhongMaterial (model.material);
	var mesh = new THREE.Mesh(geometry, material);
	if (model.material.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();
	scene.add(mesh);
}

$(document).ready(function() {
	init();
	animate();

	$('div').draggable({handle: '.draggable'});
	$('.resizable').resizable();
});