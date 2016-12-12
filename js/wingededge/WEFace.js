// Namespace
var WingedEdge = WingedEdge || {};

let static_face_id = 0;

WingedEdge.Face = class
{

	// initial edge, then we go to i.e. edge->ncw and edge->pcw
	constructor() {
		this._id = static_face_id++;

		// this face is left/right face of the edges on the arrays:
		this._leftFaceOf  = [];
		this._rightFaceOf = [];
	}

	get id() { return this._id; }

	get leftFaceOf()  { return this._leftFaceOf;  }
	get rightFaceOf() { return this._rightFaceOf; }

	isLeftFaceOfEdge(edge) {
		this._leftFaceOf.push(edge);
	}

	isRightFaceOfEdge(edge) {
		this._rightFaceOf.push(edge);
	}

	// NOT USED
	// p1 and p2 are the vertices of this._edge
	// p3 is the pcw's end vertex.
	// then u = p2 - 1 and v = p3 - p1, so normal = u x v
	makeFaceNormal() {
		let p1 = this._edge.sv.vector;
		let p2 = this._edge.ev.vector;
		let p3 = this._edge.pcw.ev.vector;

		let u = new THREE.Vector3();
		u.subVectors(p2, p1);
		let v = new THREE.Vector3();
		v.subVectors(p3, p1);

		let n = new THREE.Vector3();
		n.crossVectors(u, v);

		return n;
	}

	/* Return a valid index for non null vertices. i.e:
		vertices[0] = {..., id: 0}
		vertices[1] = null --> deleted vertex
		vertices[2] = {..., id: 2}
		So if a face has vertex 0 and 2, it must return 0 and 1 as indexes.
		*/
	getVertexArrayIndex(vertices, id) {
		var index = 0;
		for (var i = 0; i < vertices.length; i++) {
			if (vertices[i] != null) {
				if (vertices[i].id === id)
					return index;
				index++;
			}
		}
		console.error('Vertex index not found');
		return -1;
	}

	// For Three JS
	// get this face's vertex list
	// if must return the WEMode.vertices[index], because a vertex may be deleted (null)
	getFace3(vertices, edge, rightTraverse=true) {

		if (rightTraverse)
			return new THREE.Face3(
				this.getVertexArrayIndex(vertices, edge.ncw.ev.id),
				this.getVertexArrayIndex(vertices, edge.sv.id),
				this.getVertexArrayIndex(vertices, edge.ev.id));
		// else // leftTraverse
		return new THREE.Face3(
			this.getVertexArrayIndex(vertices, edge.ev.id),
			this.getVertexArrayIndex(vertices, edge.sv.id),
			this.getVertexArrayIndex(vertices, edge.nccw.ev.id));
	}

};