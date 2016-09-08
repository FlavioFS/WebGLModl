/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		primName = new Primitive ({"x": 1, "y": 2});

	Wrong:
		var 	primName = new Primitive ({"x": 1, "y": 2});
		const 	primName = new Primitive ({"x": 1, "y": 2});
		let		primName = new Primitive ({"x": 1, "y": 2});

	DO NOT use "var", "const" or "let".
*/

// Base class for primitives
// Every primitive has a center 
class Primitive
{
	constructor (centerJSON)
	{
		this.center = centerJSON;
	}
}