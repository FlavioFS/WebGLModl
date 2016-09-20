/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		coneName = new SolidCone ({"x": 1, "y": 2}, 7);

	Wrong:
		var 	coneName = new SolidCone ({"x": 1, "y": 2}, 7);
		const 	coneName = new SolidCone ({"x": 1, "y": 2}, 7);
		let		coneName = new SolidCone ({"x": 1, "y": 2}, 7);

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Class
Primitives.SolidCone = class extends Primitives.Solid
{
	constructor (centerJSON, radius, height)
	{
		super (centerJSON);
		this.radius = radius;
		this.height = height;
	}
}