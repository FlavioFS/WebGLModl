var WingedEdge = WingedEdge || {};


WingedEdge.Material =
{
    color: 0x00FF00,
    specular: 0x00FFDD,
    shininess: 2,
    shading: THREE.FlatShading,
    wireframe: false,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
};

WingedEdge.Utils = class
{

	constructor() {}

	// we start from a initial edge 'e' and iterate throught its relations
	static generateThreeeJSMesh(e) {
		console.log(e.ev.vector);

		console.log(face);
	}

}