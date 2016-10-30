/**
 * Created by Kienz on 29/10/2016.
 */

// Namespace
var CSG = CSG || {};

// Answers
CSG.InOnOut._inOnOutU = [
    [CSG.IN, CSG.IN,  CSG.IN],
    [CSG.IN, CSG.ON,  CSG.ON],
    [CSG.IN, CSG.ON, CSG.OUT]
];

CSG.InOnOut._inOnOutI = [
    [CSG.IN,   CSG.ON, CSG.OUT],
    [CSG.ON,   CSG.ON, CSG.OUT],
    [CSG.OUT, CSG.OUT, CSG.OUT]
];

CSG.InOnOut._inOnOutD = [
    [CSG.OUT,  CSG.ON, CSG.IN],
    [CSG.OUT,  CSG.ON, CSG.ON],
    [CSG.OUT, CSG.OUT, CSG.OUT]
];

/* =====================================================================================================
 *  Static methods
 * ===================================================================================================== */
// In, on, out classifier functions
CSG.InOnOut.unionInOnOut = function (class1, class2) {
    return CSG.InOnOut._inOnOutU[class1][class2];
};

CSG.InOnOut.intersectionInOnOut = function (class1, class2) {
    return CSG.InOnOut._inOnOutI[class1][class2];
};

CSG.InOnOut.differenceInOnOut = function (class1, class2) {
    return CSG.InOnOut._inOnOutD[class1][class2];
};

/**
 * Merges 2 raycasts
 * @param raycastIntList1
 * @param raycastIntList2
 * @returns {Array}
 */
CSG.InOnOut.sortedMerge = function (raycastIntList1, raycastIntList2)
{
    let
        i=0,  j=0,  k=0,
        t1 = null,
        t2 = null;

    var rv = [];

    while (i < raycastIntList1.length && j < raycastIntList2.length) {
        t1 = raycastIntList1[i].tstart;
        t2 = raycastIntList2[j].tstart;

        // Selects the shortest
        if ( t1 <= t2 ) {
            rv[k] = raycastIntList1[i];
            i++;
        }
        else {
            rv[k] = raycastIntList2[j];
            j++;
        }

        k++;
    }

    // List 2 finished sooner
    while (i < raycastIntList1.length) {
        rv[k] = raycastIntList1[i];
        i++;
        k++;
    }

    // List 1 finished sooner
    while (j < raycastIntList2.length) {
        rv[k] = raycastIntList2[j];
        j++;
        k++;
    }
    return rv;
};


/**
 * Decides if a floating number t belongs to a given interval.
 * @param t
 * @param interval
 * @returns {boolean}
 */
CSG.InOnOut.belongsTo = function(t, interval)
{
    let insideInterval = (interval.tstart < t) && (t < interval.tend);
    if ( insideInterval ) return true;
    return false;
};

/**
 * Given a point (strictly) inside an interval, splits interval using the point.
 * @param newPoint
 * @param intervalList
 * @param position
 */
CSG.InOnOut.splitInterval = function (newPoint, intervalList, position)
{
    // Splits interval into 2 intervals, using the new point
    intervalList.splice(position, 0, intervalList[position]);
    intervalList[position].tend = newPoint;
    intervalList[position+1].tstart = newPoint;
};


/**
 * Stretches borders of lists so they belong to the same intervals
 * @param intervals_left
 * @param intervals_right
 */
CSG.InOnOut.stretchIntervalLists = function (intervals_left, intervals_right)
{
    // Left starts first, stretches Right interval until it matches the Left one
    let Lfirst = intervals_left[0].tstart;
    let Rfirst = intervals_right[0].tstart;
    if (Lfirst < Rfirst) {
        intervals_right.splice(0, 0, intervals_right[0]);   // Duplicates FIRST element
        intervals_right[0].tstart = Lfirst;                 // Continues from last point
        intervals_right[0].tend = Rfirst;                   // Until the shortest value
        intervals_right.itype = CSG.OUT;                    // Doesn't belong to the solid
    }

    // Right starts first, same logic as above
    else if (Lfirst > Rfirst) {
        intervals_left.splice(0, 0, intervals_left[0]);
        intervals_left[0].tstart = Rfirst;
        intervals_left[0].tend = Lfirst;
        intervals_left.itype = CSG.OUT;
    }

    // Repeating the previous steps to the ends of these lists
    let Llast = intervals_left[intervals_left.length-1].tstart;
    let Rlast = intervals_right[intervals_right.length-1].tstart;
    let Lsize = intervals_left.length;
    let Rsize = intervals_right.length;
    if (Llast > Rlast) {
        intervals_right.splice(Rsize, 0, intervals_right[Rsize]);   // Duplicates LAST element
        intervals_right[Rsize].tstart = Rlast;                      // Continues from last point
        intervals_right[Rsize].tend = Llast;                        // Until the largest value
        intervals_right.itype = CSG.OUT;                            // Doesn't belong to the solid
    }

    // Right starts first, same logic as above
    else if (intervals_left[0].tstart > intervals_right[0].tstart) {
        intervals_left.splice(Lsize, 0, intervals_left[Lsize]);
        intervals_left[Lsize].tstart = Llast;
        intervals_left[Lsize].tend = Rlast;
        intervals_left.itype = CSG.OUT;
    }
};

/**
 * Splits intervals in both lists so all intervals match.
 * @param intervals_left
 * @param intervals_right
 */
CSG.InOnOut.matchIntervals = function (intervals_left, intervals_right) {
    // Imports Right points into Left list, through interval splitting
    for (let i = 0; i < intervals_left.length; i++) {
        for (let j = 0; j < intervals_right.length; j++) {

            // Right is too big - no intersection
            if (intervals_left[i].tend < intervals_right[j].tstart) break;

            // Right is too small - no intersection
            if (intervals_left[i].tstart > intervals_right[j].tend) continue;

            // If the right point belongs to interval (strictly inside),
            // splits the interval using the point
            if ( belongsTo(intervals_right[j].tstart, intervals_left[i]) ) {
                CSG.InOnOut.splitInterval(intervals_right[j].tstart, intervals_left, i);
                i++;
            }

            // Same for the end point
            if ( belongsTo(intervals_right[j].tend, intervals_left[i]) ) {
                CSG.InOnOut.splitInterval(intervals_right[j].tend, intervals_left, i);
                i++;
            }
        }
    }

    // Same for the right
    for (let i = 0; i < intervals_right.length; i++) {
        for (let j = 0; j < intervals_left.length; j++) {

            // Left is too big - no intersection
            if (intervals_right[i].tend <= intervals_left[j].tstart) break;

            // Left is too small - no intersection
            if (intervals_right[i].tstart >= intervals_left[j].tend) continue;

            // If the right point belongs to interval (strictly inside),
            // splits the interval using the point
            if ( belongsTo(intervals_left[j].tstart, intervals_right[i]) ) {
                CSG.InOnOut.splitInterval(intervals_left[j].tstart, intervals_right, i);
                i++;    // Steps forward, since length of interval was just increased through splitting
            }

            // Same for the end point
            if ( belongsTo(intervals_left[j].tend, intervals_right[i]) ) {
                CSG.InOnOut.splitInterval(intervals_left[j].tend, intervals_right, i);
                i++;
            }
        }
    }
};

/**
 * Merges intervals whose start or end points are not ON the surface frontier
 * @param intervalList
 */
CSG.InOnOut.removeUnnecessaryPoints = function (intervalList) {
    for (let i=0; i < intervalList.length-1; i++) {
        while (intervalList[i].itype == intervalList[i+1].itype && i < intervalList.length-1 ) {
            intervalList[i].tend = intervalList[i+1].tend;
            intervalList.splice(i+1, 1);    // Removes interval - This operation shortens list (length changes)
        }
    }
};