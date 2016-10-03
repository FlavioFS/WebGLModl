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


	/******
	* HUD 
	*/
	HUD.create(WIDTH, HEIGHT);

	var w = new HUD.Window('Primitives',
		{width:200, height:400, resizable: true});
	w.append(new HUD.Button('New Cube', 'new-cube', {}));
	w.append(new HUD.Button('New Sphere', 'new-sphere', {}));
	w.append(new HUD.Button('New Cone', 'new-cone', {}));
	w.append(new HUD.Button('New Cylinder', 'new-cylinder', {}));
	w.append(new HUD.Button('Export', 'export', {}));
	w.append(new HUD.Button('Import', 'import', {}));
	

	// var w2 = new HUD.Window('Another Window',
	// 	{width:200, height:400, left: (WIDTH-200)+'px', resizable: true});
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

	// addToScene (MDL_kunai);   // 1
	// addToScene (MDL_target);  // 2

	// var loading = new HUD.Loading('Creating Sphere...').show();

	// // reason to use timeout: a solid would be calculated BEFORE showing a loading

	// setTimeout(function() {
	// 	// solid = new Primitives.SolidSphere({x:0, y:0, z:0}, 3)
	// 	// solid = new Primitives.SolidCone({x:0, y:0, z:0}, 3, 5, true)
	// 	solid = new Primitives.SolidCylinder({x:0, y:-3, z:0}, 2, 10, true)
	// 	// solid = new Primitives.SolidCube({x:0, y:0, z:0}, 3)
	// 	solid.calcOctree(5);
	// 	// console.log(solid.octree);
	// 	var model = solid.model();
	// 	if (model) addToScene(model);
	// 	else console.log("Empty model!!");	

	// 	loading.endTimer().hide(5000);
	// }, 50);

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

// [3]
function addToScene (model, offset=0) {
	var geometry = Utils.Model.toGeometry(model, offset); // MDL_ variables is defined in "models" folder
	var material = new THREE.MeshPhongMaterial (model.material);
	var mesh = new THREE.Mesh(geometry, material);
	if (model.material.shading == THREE.SmoothShading) mesh.geometry.computeVertexNormals();
	scene.add(mesh);
}
