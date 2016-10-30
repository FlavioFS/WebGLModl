/**
 * Created by Kienz on 28/10/2016.
 */

// Translate, Scale, Rotate
CSG.NodeTransform = class extends CSG.Node
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (child = null, param = null, name="Node.Transform") {
        super(name);
        this.child  = child;
        this.param  = param;
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    get child  () { return this._child;  }
    get param  () { return this._param;  }

    set child  (child)  { this._child  = child;  }
    set param  (param)  { this._param  = param;  }

    /* =====================================================================================================
     *  Methods
     * ===================================================================================================== */
    geometry () {
        return this.child.geometry();
    }

    setMembershipRaycast (originPoint, rayVector, transformStack=[]) {
        console.error(new Error ("Call to abstract method 'setMembershipRaycast' of CSG.Transform."));
        return false;
    }
};