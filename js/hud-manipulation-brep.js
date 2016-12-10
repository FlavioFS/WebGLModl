var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.15;

var edge_material = new THREE.LineBasicMaterial({
            color: 0xFFFFff
        });

$(document).ready(function() {

	var selected_vertices = [];
	var selected_vertex = null;

	$(document).on('click', '#new-mesh', function() {
		
		we = new WingedEdge.Model();
		console.log(we.addVertex({x: 0, y: 0, z: 0})); // vertex 0
		// console.log(we.mev(0, {x: 0, y: 0, z: 1})); // edge 0, v1
		// console.log(we.mev(0, {x: 1, y: 0, z: 1})); // e1, v2
		// console.log(we.mef(0, 1)); // e2
		// console.log(we.mev(0, {x: 1, y: 0, z: 0})); // e3, v3
		// console.log(we.mef(1, 3)); // e4
		// console.log(we.mev(0, {x: 0, y: -1, z: 0})); // e5, v4
		// console.log(we.mef(5, 0)); // e6
		// console.log(we.mev(1, {x: 0, y: -1, z: 1})); // e7 v5
		// console.log(we.mef(7, 6)); // e8

		brep_solids.push(we);


		// generate mesh
		var material = new THREE.MeshPhongMaterial ({
			color: 0x00FF00,
			shading: THREE.FlatShading,
			depthWrite: false,
			side: THREE.DoubleSide,
			// depthTest: false,
			// wireframe: true,
		});

		
		
		var geometry = new THREE.Geometry();
		geometry.dynamic = true;
		geometry.vertices = we.threeJSVertices;
		geometry.faces = we.threeJSFaces;
		geometry.verticesNeedUpdate = true;
		geometry.colorsNeedUpdate = true;
		geometry.computeFaceNormals();
		
		// var edges_geometry = new THREE.Geometry();
		// edges_geometry.dynamic = true;
		// edges_geometry.vertices = we.threeJSEdges;
		// edges_geometry.verticesNeedUpdate = true;
		// edges_geometry.elementsNeedUpdate = true;


		var mesh = new THREE.Mesh(geometry, material);
		mesh.name = 'we';


		var edges = new THREE.Object3D();
		edges.name = 'we-edges';

		scene.add(mesh);
		scene.add(edges);

		addEdgesToLineGroup(we.threeJSEdges);
		
		generatePoints(geometry);
		
	});

	$(document).on('submit', '#mev', function() {

		pos = {
			x: parseFloat($(this).find('input[name=x]').val()),
			y: parseFloat($(this).find('input[name=y]').val()),
			z: parseFloat($(this).find('input[name=z]').val())
		};

		var newEV = null;
		if (selected_vertex)
			newEV = brep_solids[0].mev(selected_vertex, pos);
		else
			newEV = brep_solids[0].mev(0, pos);

		updateBRepMesh();
		addEdgesToLineGroup([newEV]);

		return false;

	});

	$(document).on('submit', '#mef', function() {
		var newEF = brep_solids[0].mef(0, 1);

		updateBRepMesh();
		addEdgesToLineGroup([newEF]);

		return false;
	});

	// VERTEX SELECTION
	$(document).on('mousedown', 'body', function(e){
		e.preventDefault();

		mouse.x =  ( e.clientX / renderer.domElement.width  ) * 2 - 1;
		mouse.y = -( e.clientY / renderer.domElement.height ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );

		try {
			var points = scene.getObjectByName('we-vertices');
			var intersects = raycaster.intersectObject( points, true );

			if (intersects.length > 0) {
				intersects = intersects.sort( function( a, b ) {
					return a.distanceToRay - b.distanceToRay;
				});

				deselectAllVertices();

				var vertex = intersects[0];
				console.log('vertex', vertex.index, 'clicked, pos =', points.geometry.vertices[vertex.index]);
				selected_vertex = vertex.index;

				vertex.object.geometry.colors[ vertex.index ].setHex( 0xFF0000);
				points.geometry.colorsNeedUpdate = true;
			
			}
		} catch(err) {
			// probably because points dont exist yet
		}
	})

	// KEYBOARD EVENTS
	$(document).on('keypress', function(e) {
		// console.log('keypress: ' + e.which);
		if ((e.which == 69 || e.which == 101) || (e.key == 69 || e.key == 101))  // e or E
		{
			$('input#mev').click();
		}

	});

});

function updateBRepMesh() {
	var vertices = we.threeJSVertices;
	var faces = we.threeJSFaces;
	// var edge_pairs = we.threeJSEdges;

	var mesh = scene.getObjectByName('we');
	var points = scene.getObjectByName('we-vertices');

	// update geometry
	mesh.geometry.dynamic = true;
	mesh.geometry.vertices = vertices;
	mesh.geometry.faces = faces;
	mesh.geometry.verticesNeedUpdate = true;
	mesh.geometry.elementsNeedUpdate = true;
	mesh.geometry.computeBoundingSphere(); // needed to update raycast intersections

	generatePoints(mesh.geometry);
}

function addEdgesToLineGroup(edgeList) {
	var edgeGroup = scene.getObjectByName('we-edges')

	edgeList.forEach(function(el) {
		var g = new THREE.Geometry();
		g.vertices.push(el.edge.ev.vector);
		g.vertices.push(el.edge.sv.vector);
		var line = new THREE.Line(g, edge_material);

		edgeGroup.add(line);
	})
}

function generatePoints(geometry, index=0) {
	if (scene.getObjectByName('we-vertices'))
		scene.remove(scene.getObjectByName('we-vertices'));

	var material_points = new THREE.PointsMaterial({
		// color: 0xffffcc,
		size: 0.2,
		vertexColors: THREE.VertexColors,
	});

	var points = new THREE.Points(geometry, material_points);
	points.name = 'we-vertices';
	points.userData.particles = [];
	geometry.vertices.forEach(function(vertex) {
		geometry.colors.push(new THREE.Color(0xFFFFFF));
		points.userData.particles.push(vertex);
	})
	scene.add(points);

}

function deselectAllVertices() {
	var points = scene.getObjectByName('we-vertices');
	// console.log(points.geometry.colors);
	for (var i = 0; i < points.geometry.colors.length; i++)
		points.geometry.colors[i].setHex(0xFFFFFF)
	points.geometry.colorsNeedUpdate = true;
	selected_vertex = null;
}

