// // Namespace
var WingedEdge = WingedEdge || {};


let static_edge_id = 0;


WingedEdge.Edge = class
{

	constructor(sv, ev) {
		this._id = static_edge_id++;

		// vertice references
		this._sv = sv;
		this._ev = ev;

		this._pccw = null;
		this._nccw = null;
		this._pcw  = null;
		this._ncw  = null;

		this._lf = null;
		this._rf = null;
	}

	get id() { return this._id; }

	// vertices
	get sv() { return this._sv; }
	get ev() { return this._ev; }

	// edges
	set pccw(pccw) { this._pccw = pccw; }
	set nccw(nccw) { this._nccw = nccw; }
	set pcw(pcw)   { this._pcw  = pcw;  }
	set ncw(ncw)   { this._ncw  = ncw;  }
	get pccw()     { return this._pccw; }
	get nccw()     { return this._nccw; }
	get pcw()      { return this._pcw;  }
	get ncw()      { return this._ncw;  }

	setLeftTraverse(pccw, nccw) {
		this.pccw = pccw;
		this.nccw = nccw;
	}

	setRightTraverse(pcw, ncw) {
		this.pcw = pcw;
		this.ncw = ncw;
	}


	// faces
	set lf(lf) { this._lf = lf; } // fccw
	set rf(rf) { this._rf = rf; } // fcw

	isLeftFaceNull() {
		return (this.pccw == null && this.nccw == null);
	}

	isRightFaceNull() {
		return (this.pcw == null && this.ncw == null);
	}


	/* Return a valid index for non null edges. i.e:
		edges[0] = {..., id: 0}
		edges[1] = null --> deleted edge
		edges[2] = {..., id: 2}
		So if we want edges 0 and 2, it must return 0 and 1 as indexes.
		*/
	// Not needed yet
	// getEdgeArrayIndex(edges, edgeId) {
	// 	let index = 0;
	// 	for (let i = 0; i < edges.length; i++) {
	// 		if (edges[i] != null) {
	// 			if (edges[i].id === edgeId)
	// 				return index;
	// 			index++;
	// 		}
	// 	}
	// 	console.error('Edge index not found');
	// 	return -1;
	// }

	// given all edges, look for a edge.id == edgeId and return its neighbors
	// edgeToEdgeNeighbors(edges, edgeId) {
	// 	let arr = [];
	// 	let e = edges[this.getEdgeArrayIndex(edges, edgeId)];
	// 	console.log('analysing edge', edgeId, e);
	// }
	

};