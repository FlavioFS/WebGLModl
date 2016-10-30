/**
 * Created by Kienz on 26/10/2016.
 */

// Boolean operation nodes
CSG.NodeBoolean = class extends CSG.Node
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (left = null, right = null, name="CSG.NodeBoolean") {
        super(name);
        this._left  = left;
        this._right = right;
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    get left  () { return this._left;  }
    get right () { return this._right; }

    set left  (left)  { this._left  = left;  }
    set right (right) { this._right = right; }

    /* =====================================================================================================
     *  Methods
     * ===================================================================================================== */
    geometry () {
        console.error(new Error ("Call to abstract method 'geometry' of CSG.NodeBoolean."));
        return false;
    }

    setMembershipRaycast (originPoint, rayVector, transformStack=[]) {
        console.error(new Error ("Call to abstract method 'setMembershipRaycast' of CSG.NodeBoolean."));
        return false;
    }
};