/**
 * Created by Kienz on 26/10/2016.
 */

// Union node
CSG.NodeUnion = class extends CSG.NodeBoolean
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (left = null, right = null) {
        super(left, right, "CSG.NodeUnion");
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    geometry ()  {
        var left_bsp = new ThreeBSP (this.left.geometry());
        var right_bsp = new ThreeBSP (this.right.geometry());

        var rv = left_bsp.union(right_bsp).toGeometry();
        return rv;
    }
};