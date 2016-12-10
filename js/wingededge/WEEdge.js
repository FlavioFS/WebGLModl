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
	}

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

	setTraverseEdges(pccw, nccw, pcw, ncw) {
		this.pccw = pccw;
		this.nccw = nccw;
		this.pcw = pcw;
		this.ncw = pcw;
	}

	// faces
	set lf(lf) { this._lf = lf; } // fccw
	set rf(rf) { this._rf = rf; } // fcw

	setFaces(lf, rf) {
		this.lf = lf;
		this.rf = rf;
	}

	get id() { return this._id; }

};