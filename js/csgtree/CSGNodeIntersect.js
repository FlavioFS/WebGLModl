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
     *  METHODS
     * ===================================================================================================== */
    geometry ()  {
        var left_bsp = new ThreeBSP (this.left.geometry());
        var right_bsp = new ThreeBSP (this.right.geometry());

        var rv = left_bsp.intersect(right_bsp).toGeometry();
        return rv;
    }

    setMembershipRaycast (originPoint, rayVector, transformStack=[]) {
        var intervals_left  = this.left.setMembershipRaycast(originPoint, rayVector);
        var intervals_right = this.right.setMembershipRaycast(originPoint, rayVector);
        // var sortedIntervals = sortedMerge(intervals_left, intervals_right);

        // Creates detailed list 1
        var detailed_left = [];
        let ts = 0, te = 0;

        //// In this section, both lists will be completed
        // Lists are now inside of same interval
        CSG.InOnOut.stretchIntervalLists(intervals_left, intervals_right);

        // Completes internal details - forces all intervals to match tstart and tend
        CSG.InOnOut.matchIntervals(intervals_left, intervals_right);

        // Calculates Difference
        let Ltstart, Ltend, Rtstart, Rtend, Litype, Ritype, rv_itype;
        var rv = [];

        for (let i = 0; i < intervals_left.length; i++) {
            Ltstart = intervals_left[i].tstart;
            Rtstart = intervals_right[i].tstart;
            Ltend   = intervals_left[i].tend;
            Rtend   = intervals_right[i].tend;
            Litype  = intervals_left[i].itype;
            Ritype  = intervals_right[i].itype;

            // Should be always true
            if (Ltstart == Rtstart && Ltend == Rtend) {
                rv_itype = CSG.InOnOut.intersectionInOnOut(Litype, Ritype);
                rv.push({tstart: Lstart, tend: Lend, itype: rv_itype});
            }
            else {
                // TODO Remove this debug message once its working
                console.log(new Error("CSGNodeDifference: setMembershipRaycast - different intervals!"));
            }
        }

        // When a point is totally IN or totally OUT, removes it by merging its neighbor intervals
        CSG.InOnOut.removeUnnecessaryPoints(rv);

        return rv;
    }
};