/** IMPORTANT: How to create instances OUTSIDE of this file
	
	Correct:
		cubeName = new Cube ({"x": 1, "y": 2}, 7);

	Wrong:
		var 	cubeName = new Cube ({"x": 1, "y": 2}, 7);
		const 	cubeName = new Cube ({"x": 1, "y": 2}, 7);
		let		cubeName = new Cube ({"x": 1, "y": 2}, 7);

	DO NOT use "var", "const" or "let".
*/

class Cube extends Primitive
{
	constructor (centerJSON, edge)
	{
		super (centerJSON);
		this.edge = edge;
	}
}