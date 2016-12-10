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
		let nv = new WingedEdge.Vertex(pos);
		this.vertices.push(nv);
		return nv;
	}

	// add edges by start/end vertex id
	addEdge(svId, evId) {
		let ne = new WingedEdge.Edge(this.vertices[svId], this.vertices[evId]);
		this.edges.push(ne);
		return ne;
	}

	addFace(edge) {
		let nf = new WingedEdge.Face(this.edges[edge]);
		this.faces.push(nf);
		return nf;
	}

	// add pccw, nccw, pcw, ncw edges to `edge`
	setTraverseEdges(edge, pccw, nccw, pcw, ncw) {
		edge.setTraverseEdges(
			pccw,
			nccw,
			pcw,
			ncw
		);
	}

	// edge has now left and right faces
	// and left/right face points to edge too
	setFacesToEdge(edge, lf, rf) {
		edge.setFaces(lf, rf);

		if (lf != null)
			lf.isLeftFaceOfEdge(edge);

		if (rf != null)
			rf.isRightFaceOfEdge(edge);
	}

	setLeftFaceTo(edge, face) {
		if (edge.lf == null) {
			edge.lf = face;
			face.isLeftFaceOfEdge(edge);
		} else {
			console.log('trying to add again')
		}
	}

	setRightFaceTo(edge, face) {
		if (edge.rf == null) {
			edge.rf = face;
			face.isRightFaceOfEdge(edge);
		} else {
			console.log('trying to add again')
		}
	}


	// Euler operators

	flipNormal() {

	}

	mvfs() {
		let nv = this.addVertex(newVertexPos);
	}

	kvfs() {

	}

	mev(startVertexId, newVertexPos) {
		let nv = this.addVertex(newVertexPos);
		let ne = this.addEdge(startVertexId, nv.id);

		// return created elements
		return {edge: ne, vertex: nv};
	}

	kev() {

	}

	/* create a new edge connecting edge1 and edge2 then create a face connecting those 3 edges.
		Also create relations between edges.
		A face must be left face of 1 edge and right one of 2 other edges, or
			left one of 2 edges and right one of 1 other edge. This is important to set the normal
			direction.
		
		Default: first face to e1's right, first face to e2's left and first face to e2's right
	*/ 
	mef(edge1Id, edge2Id) {
		let e1 = this.edges[edge1Id];
		let e2 = this.edges[edge2Id];
		let e3 = this.addEdge(e1.ev.id, e2.ev.id);
		let nf = this.addFace();

		if (e1.isRightFaceNull()) {
			e1.setRightTraverse(e2, e3);
			this.setRightFaceTo(e1, nf);
		} else if (e1.isLeftFaceNull()) {
			e1.setLeftTraverse(e2, e3);
			this.setLeftFaceTo(e1, nf);
		} else {
			console.error('Edge is already attached to two faces');
		}

		if (e2.isLeftFaceNull()) {
			e2.setLeftTraverse(e3, e1);
			this.setLeftFaceTo(e2, nf);
		} else if (e2.isRightFaceNull()) {
			e2.setRightTraverse(e3, e1);
			this.setLeftFaceTo(e2, nf);
		} else {
			console.error('Edge is already attached to two faces');
		}

		e3.setRightTraverse(e1, e2);
		this.setRightFaceTo(e3, nf);

		// return created elements
		return {edge: e3, face: nf};
	}

	kef() {

	}

	// Three JS
	
	get threeJSFaces() {
		let arr = [];

		for (let i = 0; i < this.faces.length; i++) {
			if (this.faces[i].leftFaceOf.length > 0) {
				// console.log('push left face', i, this.faces[i].leftFaceOf[0]);
				arr.push(this.faces[i].getFace3(this.faces[i].leftFaceOf[0], false));
			}
			else if (this.faces[i].rightFaceOf.length > 0) {
				// console.log('push right face', i, this.faces[i].rightFaceOf[0]);
				arr.push(this.faces[i].getFace3(this.faces[i].rightFaceOf[0], true));
			}
		}
		return arr;
	}

	// return an array of edges that will be converted to a pair of vertices later on
	get threeJSEdges() {
		let arr = [];

		for (let i = 0; i < this.edges.length; i++) {
			arr.push({edge: this.edges[i]});
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