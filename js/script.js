var scene, camera, renderer;

// [0]
function main () {
	init();
	animate();
}

// [1]
function init ()
{
	// Resolution
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth,
		HEIGHT = window.innerHeight;

	// Creates renderer
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);

	// Camera
	camera = new THREE.PerspectiveCamera (45, WIDTH / HEIGHT, 0.1, 20000);
	camera.position.set(0,6,0);
	scene.add(camera);

	// Events
	window.addEventListener('resize',
		function()
		{
			var WIDTH = window.innerWidth,
				HEIGHT = window.innerHeight;
			renderer.setSize(WIDTH, HEIGHT);
			camera.aspect = WIDTH / HEIGHT;
			camera.updateProjectionMatrix();
		}
	);

	// Lights
	var light = new THREE.PointLight(0xffffff);
	light.position.set(-100,200,100);
	scene.add(light);

	// Default Mesh
	var loader = new THREE.JSONLoader();
	loader.load("models/threehouse_logo.js", // STUDY HOW THIS MODEL IS BUILT AND HOW THREEJS HANDLES MODELS
		function (geometry)
		{
			var material = new THREE.MeshLambertMaterial({color: 0xAAFFAA});
			mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);
		}
	);

	// Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
}

// [2]
function animate ()
{
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
	controls.update();
}

$(document).ready(main);