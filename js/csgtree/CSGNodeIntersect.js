/**
 * Created by Kienz on 26/10/2016.
 */

// Intersect node
CSG.NodeIntersect = class extends CSG.NodeBoolean
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (left = null, right = null) {
        super(left, right, "CSG.NodeIntersect");
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    geometry ()  {
        var left_bsp = new ThreeBSP (this.left.geometry());
        var right_bsp = new ThreeBSP (this.right.geometry());

        var rv = left_bsp.intersect(right_bsp).toGeometry();
        return rv;
    }
};