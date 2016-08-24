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
	var light = new THREE.PointLight(0xFFFFFF);
	light.position.set(-100,200,100);
	scene.add(light);

	light = new THREE.AmbientLight(0xFFFFFF, 0.1);
	scene.add(light);	

	// Default Mesh - Geometry, Material, Mesh
	var geometry = JSONList2Geometry
	({
		"vertices":
		[
			[ 1, 1, 1],
			[ 1,-1, 1],
			[-1,-1, 1],
			[-1, 1, 1],

			[ 1, 1,-1],
			[ 1,-1,-1],
			[-1,-1,-1],
			[-1, 1,-1]
		],
		"faces":
		[
			[0, 2, 1],
			[0, 3, 2],

			[0, 1, 4],
			[4, 1, 5],
			[0, 7, 3],
			[0, 4, 7],
			[3, 6, 2],
			[3, 7, 6],
			[1, 2, 6],
			[1, 6, 5],

			[4, 5, 6],
			[4, 6, 7]
		]
	});

	var material = new THREE.MeshPhongMaterial
	({
		color: 0xAAFFAA,
		specular: 0x009900,
		shininess: 30,
		shading: THREE.FlatShading
	});

	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 10;

	// var loader = new THREE.JSONLoader();
	// loader.load("models/threehouse_logo.js", // STUDY HOW THIS MODEL IS BUILT AND HOW THREEJS HANDLES MODELS
	// 	function (geometry)
	// 	{
	// 		var material = new THREE.MeshLambertMaterial({color: 0xAAFFAA});
	// 		mesh = new THREE.Mesh(geometry, material);
	// 		scene.add(mesh);
	// 	}
	// );

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

// [3]
function JSONList2Geometry (jsonlist)
{
	var rv = new THREE.Geometry ();
	var temp;

	for (var i = 0; i < jsonlist.vertices.length; i++) {
		temp = jsonlist.vertices[i];
		rv.vertices.push ( new THREE.Vector3(temp[0], temp[1], temp[2]) );
	}

	for (var i = 0; i < jsonlist.faces.length; i++) {
		temp = jsonlist.faces[i];
		rv.faces.push ( new THREE.Face3(temp[0], temp[1], temp[2]) );
	}

	return rv;
}

$(document).ready(main);