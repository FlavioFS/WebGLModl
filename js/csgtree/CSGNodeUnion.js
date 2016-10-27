/**
 * Created by Kienz on 26/10/2016.
 */

// Union node
CSG.NodeUnion = class extends CSG.NodeBoolean
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (parent = null, left = null, right = null) {
        super(parent, left, right);
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    geometry ()  {
        var left_bsp = new ThreeBSP (this._left.geometry());
        var right_bsp = new ThreeBSP (this._right.geometry());

        var rv = left_bsp.union(right_bsp).toGeometry();
        return rv;
    }
};