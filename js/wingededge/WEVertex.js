// Namespace
var WingedEdge = WingedEdge || {};

let static_vertex_id = 1;

WingedEdge.Vertex = class
{

	constructor(pos) {
		this._pos = pos;
		// this._edge = edge; // object reference to WingedEdge.Edge
		this._id = static_vertex_id++;

		// console.log(this.pos);
	}

	get pos() { return this._pos; }
	set pos(pos) { this._pos = pos; }

	get id() { return this._id; }

	get edge() { return this._edge; }

	toString() {
		return this._pos.x + ', ' + this._pos.y + ', ' + this._pos.z;
	}

};