/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		cylinderName = new Cylinder ({"x": 1, "y": 2}, 7);

	Wrong:
		var 	cylinderName = new Cylinder ({"x": 1, "y": 2}, 7);
		const 	cylinderName = new Cylinder ({"x": 1, "y": 2}, 7);
		let		cylinderName = new Cylinder ({"x": 1, "y": 2}, 7);

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Class
Primitives.Cylinder = class extends Primitives.Solid
{
	constructor (centerJSON, radius, height)
	{
		super (centerJSON);
		this.radius = radius;
		this.height = height;
	}
}