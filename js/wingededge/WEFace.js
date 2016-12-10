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

	// For Three JS
	// get this face's vertex list
	getFace3(edge, rightTraverse=true) {
		if (rightTraverse)
			return new THREE.Face3(edge.ncw.ev.id, edge.sv.id, edge.ev.id);
		// else // leftTraverse
		return new THREE.Face3(edge.ev.id, edge.sv.id, edge.nccw.ev.id);
	}

};