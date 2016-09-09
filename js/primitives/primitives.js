/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		primName = new Primitive ({x: 1, y: 2});

	Wrong:
		var 	primName = new Primitive ({x: 1, y: 2});
		const 	primName = new Primitive ({x: 1, y: 2});
		let		primName = new Primitive ({x: 1, y: 2});

	DO NOT use "var", "const" or "let".
*/

// Namespace
var Primitives = Primitives || {};

// Base class for primitives
// Every primitive has a center 
Primitives.Solid = class
{
	constructor (centerJSON)
	{
		this.center = centerJSON;
	}
}