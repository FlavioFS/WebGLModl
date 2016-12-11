var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.05;

var selected_edges = [];

var EDGE_SELECTED_COLOR   = 0xF05839;
var EDGE_DESELECTED_COLOR = 0x6F86B8;
var VERTEX_SELECTED_COLOR = 0xB7DB76;
var VERTEX_DESELECTED_COLOR = 0x6F86B8;
var FACE_SELECTED_COLOR = 0x4B7EF2;
var FACE_DESELECTED_COLOR = 0x6F86B8;

$(document).ready(function() {

	var selected_vertices = [];
	var selected_vertex = null;

	$(document).on('click', '#new-mesh', function() {
		
		we = new WingedEdge.Model();
		console.log(we.addVertex({x: 0, y: 0, z: 0})); // vertex 0
		console.log(we.mev(0, {x: 0, y: 0, z: 1})); // edge 0, v1
		console.log(we.mev(0, {x: 1, y: 0, z: 1})); // e1, v2
		console.log(we.mef(0, 1)); // e2
		console.log(we.mev(0, {x: 1, y: 0, z: 0})); // e3, v3
		console.log(we.mef(1, 3)); // e4
		console.log(we.mev(0, {x: 0, y: -1, z: 0})); // e5, v4
		console.log(we.mef(5, 0)); // e6
		console.log(we.mev(1, {x: 0, y: -1, z: 1})); // e7 v5
		console.log(we.mef(7, 6)); // e8

		brep_solids.push(we);

		var geometry = createBRepMesh(we.threeJSVertices, we.threeJSFaces);


		var edges = new THREE.Object3D();
		edges.name = 'we-edges';

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
		deselectAllEdges();

		return false;

	});

	$(document).on('submit', '#mef', function() {
		var newEF;
		console.log(selected_edges);
		if (selected_edges.length == 2) {
			newEF = brep_solids[0].mef(
				selected_edges[0].userData.edgeId,
				selected_edges[1].userData.edgeId);

			console.log('MEF:', newEF);

			updateBRepMesh();
			addEdgesToLineGroup([newEF]);
			deselectAllEdges();
		}
		else
			console.error('You must select two edges. You can deselect all edge and start again.');

		return false;
	});

	// VERTEX/EDGE SELECTION
	$(document).on('mousedown', 'body', function(e){
		e.preventDefault();

		mouse.x =  ( e.clientX / renderer.domElement.width  ) * 2 - 1;
		mouse.y = -( e.clientY / renderer.domElement.height ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		var intersects;



		// vertices
		try {
			var points = scene.getObjectByName('we-vertices');
			intersects = raycaster.intersectObject( points, true );

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
				
				// return;
			}
		} catch(err) {
			// probably because points dont exist yet
		}

		// edges
		// when an edge is clicked, check if is already selected.
		// If not select it (highlight material) it and add it to selected_edges[]
		// If already selected, remove it from selected_edges[]
		try {
			var lineGroup = scene.getObjectByName('we-edges');
			intersects = raycaster.intersectObjects(lineGroup.children, true);

			if (intersects.length > 0) {
				for (var i = 0; i < lineGroup.children.length; i++) {
					if (intersects[0].object === lineGroup.children[i]) {
						// console.log(intersects[0].object);
						var index = selected_edges.indexOf(intersects[0].object);
						if (index === -1) {
							selected_edges.push(intersects[0].object);
							intersects[0].object.material.color.setHex(EDGE_SELECTED_COLOR);
							intersects[0].object.geometry.colorsNeedUpdate = true;
						}
						else if (index > -1) {
							selected_edges.splice(index, 1);
							intersects[0].object.material.color.setHex(EDGE_DESELECTED_COLOR);
							intersects[0].object.geometry.colorsNeedUpdate = true;
						}

						console.log('selected edges', selected_edges);

						// return;
						
					}
				}
			}

		} catch(err) {
			// probably because points dont exist yet
		}
	})

	// KEYBOARD EVENTS
	$(document).on('keypress', function(e) {
		// console.log('keypress: ' + e.which);
		if ((e.which == 69 || e.which == 101) || (e.key == 69 || e.key == 101))  // e/E
		{
			$('input#mev').click();
		}
		else if ((e.which == 65 || e.which == 97) || (e.key == 65 || e.key == 97))  // a/E
		{
			deselectAllEdges();
		}

	});

});

function createBRepMesh(vertices, faces) {
	var material = new THREE.MeshPhongMaterial ({
		color: FACE_SELECTED_COLOR,
		shading: THREE.FlatShading,
		depthWrite: false,
		// side: THREE.DoubleSide,
		// depthTest: false,
		// wireframe: true,
	});

	var geometry = new THREE.Geometry();
	geometry.dynamic = true;
	geometry.vertices = vertices;//we.threeJSVertices;
	geometry.faces = faces;//we.threeJSFaces;
	geometry.verticesNeedUpdate = true;
	geometry.colorsNeedUpdate = true;
	geometry.computeFaceNormals();

	var mesh = new THREE.Mesh(geometry, material);
	mesh.name = 'we';

	scene.add(mesh);

	return geometry;
}

function updateBRepMesh() {
	var vertices = we.threeJSVertices;
	var faces = we.threeJSFaces;
	console.log(faces);
	// var edge_pairs = we.threeJSEdges;

	
	var points = scene.getObjectByName('we-vertices');

	// update geometry
	// var mesh = scene.getObjectByName('we');
	// mesh.geometry.dynamic = true;
	// mesh.geometry.vertices = vertices;
	// mesh.geometry.faces = faces;
	// mesh.geometry.verticesNeedUpdate = true;
	// mesh.geometry.elementsNeedUpdate = true;
	// mesh.geometry.colorsNeedUpdate = true;
	// mesh.geometry.computeBoundingSphere(); // needed to update raycast intersections
	// mesh.geometry.computeFaceNormals();
	// // mesh.geometry.computeVertexNormals(); // this is giving an error

	// create new object
	scene.remove(scene.getObjectByName('we'));

	var geometry = createBRepMesh(vertices, faces);

	generatePoints(geometry);
}

function addEdgesToLineGroup(edgeList) {
	var edgeGroup = scene.getObjectByName('we-edges');

	edgeList.forEach(function(el) {

		var edge_material = new THREE.LineBasicMaterial({ color: EDGE_DESELECTED_COLOR, linewidth: 3 });

		var g = new THREE.Geometry();
		g.vertices.push(el.edge.ev.vector);
		g.vertices.push(el.edge.sv.vector);

		var line = new THREE.Line(g, edge_material);

		line.userData.edgeId = el.edge.id;

		edgeGroup.add(line);

		// var g = new THREE.Geometry();
		// g.vertices.push(el.edge.ev.vector);
		// g.vertices.push(el.edge.sv.vector);

		// var line = new THREE.MeshLine();
		// line.setGeometry( g );

		// var material = new THREE.MeshLineMaterial( { 
		// 	useMap: false,
		// 	color: new THREE.Color( EDGE_DESELECTED_COLOR ),
		// 	opacity: 1,
		// 	sizeAttenuation: false,
		// 	lineWidth: 0.005
		// });
		// var mesh = new THREE.Mesh( line.geometry, material ); // this syntax could definitely be improved!
		// edgeGroup.add( mesh );
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
		geometry.colors.push(new THREE.Color(VERTEX_SELECTED_COLOR));
		points.userData.particles.push(vertex);
	});
	scene.add(points);

}

function deselectAllVertices() {
	var points = scene.getObjectByName('we-vertices');
	// console.log(points.geometry.colors);
	for (var i = 0; i < points.geometry.colors.length; i++)
		points.geometry.colors[i].setHex(VERTEX_DESELECTED_COLOR);
	points.geometry.colorsNeedUpdate = true;
	selected_vertex = null;
}

function deselectAllEdges() {
	var lineGroup = scene.getObjectByName('we-edges');
	
	for (var i = 0; i < lineGroup.children.length; i++) {
		lineGroup.children[i].material.color.setHex(EDGE_DESELECTED_COLOR);
		lineGroup.children[i].geometry.colorsNeedUpdate = true;
	}
	
	selected_edges = [];
}