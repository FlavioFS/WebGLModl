/**
 * Created by Kienz on 26/10/2016.
 */

// Namespace
var CSG = CSG || {};

// CSG tree generic node
CSG.Node = class
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (name = "CSG.Node") {
        this.name = name;
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    get name  () { return this._name;  }

    set name  (name)  { this._name  = name;  }

    /* =====================================================================================================
     *  Methods
     * ===================================================================================================== */
    geometry () {
        console.error(new Error ("Call to abstract method 'geometry' of CSG.Node."));
        return false;
    }

    setMembershipRaycast (originPoint, rayVector, transformStack=[]) {
        console.error(new Error ("Call to abstract method 'setMembershipRaycast' of CSG.Node."));
        return false;
    }


};