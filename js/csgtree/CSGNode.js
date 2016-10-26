/**
 * Created by Kienz on 26/10/2016.
 */

// Namespace
var CSG = CSG || {};

// Constants
CSG.UNION = 0;
CSG.INTERSECTION = 1;
CSG.DIFFERENCE = 2;

// CSG tree generic node
CSG.Node = class
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (parent = null) {
        this._parent = parent;
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    get parent ()       { return this._parent;   }
    set parent (parent) { this._parent = parent; }

    /* =====================================================================================================
     *  Methods
     * ===================================================================================================== */
    geometry () {
        console.error(new Error ("Call to abstract method 'geometry' of CSG.Node."));
        return false;
    }
};