// Namespace
var Utils = Utils || {};
Utils.Array = Utils.Array || {};

/* =====================================================================================================
 *  Utility functions for arrays
 * ===================================================================================================== */

// Centroid of a triangle
Utils.Array.centroid = function (A, B, C)
{
	return {
		x: (A[0] + B[0] + C[0])/3,
		y: (A[1] + B[1] + C[1])/3,
		z: (A[2] + B[2] + C[2])/3
	};
};

/* Offsets array to the right by <offset> for
 * every element above a minimum value <min>.
 */
Utils.Array.offset = function (array, offset=1, min=0)
{
	for (let i = 0; i < array.length; i++)
		if (array[i] > min) array[i] += offset;
};

// Replaces <oldValue> with <newValue>.
Utils.Array.replaceElement = function (array, oldValue, newValue)
{
	for (let i = 0; i < array.length; i++)
		if (array[i] == oldValue) array[i] = newValue;
};

// Transforms the array into a Set
Utils.Array.removeDuplicates = function (array)
{
	var rv = [];

	for (let i = 0; i < array.length-1; i++) {
		for (let j = i+1; j < array.length; j++) {
			if (array[j].equals(array[i])) {
				rv.push( {"oldValue": j, "newValue": i} );
				array.splice(j, 1);
			}
		}
	}

	return rv;
};


// --------------------------------------
/** Adding equality operation to built-in javascript element Array
  * Credits:
  *  http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
  */

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});