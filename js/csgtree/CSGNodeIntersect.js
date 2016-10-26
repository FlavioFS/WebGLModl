/**
 * Created by Kienz on 26/10/2016.
 */

// Intersect node
CSG.NodeIntersect = class extends CSG.NodeBoolean
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
        var left_bsp = new ThreeBSP.Node(left.geometry());
        var right_bsp = new ThreeBSP.Node(right.geometry());

        return left_bsp.intersect(right_bsp).toGeometry();
    }
};