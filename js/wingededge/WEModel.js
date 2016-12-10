var WingedEdge = WingedEdge || {};

WingedEdge.Model = class
{
	constructor() {
		this._vertices = [];
		this._edges = [];
		this._faces = [];
	}

	get vertices() { return this._vertices; }
	get edges() { return this._edges; }
	get faces() { return this._faces; }

	// return a vertex list for ThreeJS
	get threeJSVertices() {
		let arr = [];
		for (let i = 0; i < this.vertices.length; i++)
			arr.push(this.vertices[i].vector);
		return arr;
	}

	addVertex(pos) {
		this.vertices.push(new WingedEdge.Vertex(pos));
	}

	// add edges by start/end vertex id
	addEdge(svId, evId) {
		this.edges.push(new WingedEdge.Edge(
			this.vertices[svId], this.vertices[evId])
		);
	}

	addFace(edge) {
		this.faces.push(new WingedEdge.Face(this.edges[edge]));
	}

	// add pccw, nccw, pcw, ncw edges to `edge`
	setTraverseEdges(edge, pccw, nccw, pcw, ncw) {
		this.edges[edge].setTraverseEdges(
			this.edges[pccw],
			this.edges[nccw],
			this.edges[pcw],
			this.edges[ncw]
		);
	}

	// edge has now left and right faces
	// and left/right face points to edge too
	setFacesToEdge(edge, lfId, rfId) {
		let lf = this.faces[lfId];
		let rf = this.faces[rfId];

		this.edges[edge].setFaces(lf, rf);

		lf.isLeftFaceOfEdge(this.edges[edge]);
		rf.isRightFaceOfEdge(this.edges[edge]);
	}


	// Three JS


	get threeJSFaces() {
		let arr = [];
		// let visitedFaces = [];
		// let i = 0;

		// for (let )

		for (let i = 0; i < this.faces.length; i++) {
			if (this.faces[i].leftFaceOf.length > 0) {
				console.log('push left face', i, this.faces[i].leftFaceOf[0]);
				arr.push(this.faces[i].getFace3(this.faces[i].leftFaceOf[0], false));
			}
			else if (this.faces[i].rightFaceOf.length > 0) {
				console.log('push right face', i, this.faces[i].rightFaceOf[0]);
				arr.push(this.faces[i].getFace3(this.faces[i].rightFaceOf[0], true));
			}
		}
		return arr;
	}

	get threeJSFaceNormals() {
		let arr = [];
		for (let i = 0; i < this.faces.length; i++)
			arr.push(this.faces[i].makeFaceNormal());
		return arr;	
	}
}