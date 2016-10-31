/**
 * Created by Kienz on 29/10/2016.
 */

// Namespace
var CSG = CSG || {};
CSG.InOnOut = CSG.InOnOut || {};

// Raycast classifiers
CSG.IN  = 0;
CSG.ON  = 1;
CSG.OUT = 2;

// Colors
CSG.InOnOut.LINE_IN_MAT = new THREE.LineBasicMaterial({color: 0xFFFFFF});
CSG.InOnOut.LINE_OUT_MAT = new THREE.LineBasicMaterial({color: 0xFF0000});

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
/**
 * In, on, out classifier functions
 */
CSG.InOnOut.unionInOnOut = function (itype1, itype2) {
    return CSG.InOnOut._inOnOutU[itype1][itype2];
};

CSG.InOnOut.intersectionInOnOut = function (itype1, itype2) {
    return CSG.InOnOut._inOnOutI[itype1][itype2];
};

CSG.InOnOut.differenceInOnOut = function (itype1, itype2) {
    return CSG.InOnOut._inOnOutD[itype1][itype2];
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
    let ts = intervalList[position].tstart;
    let te = intervalList[position].tend;
    let it = intervalList[position].itype;
    var new_interval = { tstart: ts, tend: te, itype: it};

    intervalList.splice(position, 0, new_interval);
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
    var new_interval;
    if (Lfirst < Rfirst) {
        new_interval = { tstart: Lfirst, tend: Rfirst, itype: CSG.OUT };
        intervals_right.splice(0, 0, new_interval);   // Duplicates FIRST element
    }

    // Right starts first, same logic as above
    else if (Lfirst > Rfirst) {
        new_interval = { tstart: Rfirst, tend: Lfirst, itype: CSG.OUT };
        intervals_left.splice(0, 0, new_interval);
    }

    // Repeating the previous steps to the ends of these lists
    let Llast = intervals_left[intervals_left.length-1].tend;
    let Rlast = intervals_right[intervals_right.length-1].tend;
    let Lsize = intervals_left.length;
    let Rsize = intervals_right.length;
    if (Llast > Rlast) {
        new_interval = { tstart: Rlast, tend: Llast, itype: CSG.OUT };
        intervals_right.splice(Rsize, 0, new_interval);   // Duplicates LAST element
    }

    // Right starts first, same logic as above
    else if (Llast < Rlast) {
        new_interval = { tstart: Llast, tend: Rlast, itype: CSG.OUT };
        intervals_left.splice(Lsize, 0, new_interval);
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
            if ( CSG.InOnOut.belongsTo(intervals_right[j].tstart, intervals_left[i]) ) {
                CSG.InOnOut.splitInterval(intervals_right[j].tstart, intervals_left, i);
                i++;
            }

            // Same for the end point
            if ( CSG.InOnOut.belongsTo(intervals_right[j].tend, intervals_left[i]) ) {
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
            if ( CSG.InOnOut.belongsTo(intervals_left[j].tstart, intervals_right[i]) ) {
                CSG.InOnOut.splitInterval(intervals_left[j].tstart, intervals_right, i);
                i++;    // Steps forward, since length of interval was just increased through splitting
            }

            // Same for the end point
            if ( CSG.InOnOut.belongsTo(intervals_left[j].tend, intervals_right[i]) ) {
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

        // Never starts with CSG.OUT
        if (intervalList.length > 0 && intervalList[0].itype == CSG.OUT)
            intervalList.splice(0, 1);

        // Never ends with CSG.OUT
        if (intervalList.length > 0 && intervalList[intervalList.length-1].itype == CSG.OUT)
            intervalList.splice(intervalList.length-1, 1);
    }
};

CSG.rayLineObjectGroup = function (rayOrigin, rayDirection, intervalList) {
    // This group will gather the lines and be added to the scene
    var rv = new THREE.Object3D();
    rv.name = "Raycast";
    var segment_geo;
    var line, mat;
    let t, xt, yt, zt;

    // Empty Set
    if (intervalList.length == 0) {
        segment_geo = new THREE.Geometry();
        segment_geo.vertices.push(rayOrigin);

        t = CSG.FAR;
        xt = rayOrigin.x + t * rayDirection.x;
        yt = rayOrigin.y + t * rayDirection.y;
        zt = rayOrigin.z + t * rayDirection.z;
        segment_geo.vertices.push(new THREE.Vector3 (xt, yt, zt));

        line = new THREE.Line(segment_geo, CSG.InOnOut.LINE_OUT_MAT);
        rv.add(line);

        return rv;
    }


    // First interval is OUT
    if (intervalList[0].tstart > 0) {
        segment_geo = new THREE.Geometry();
        segment_geo.vertices.push(rayOrigin);

        t = intervalList[0].tstart;
        xt = rayOrigin.x + t * rayDirection.x;
        yt = rayOrigin.y + t * rayDirection.y;
        zt = rayOrigin.z + t * rayDirection.z;
        segment_geo.vertices.push(new THREE.Vector3 (xt, yt, zt));


        line = new THREE.Line(segment_geo, CSG.InOnOut.LINE_OUT_MAT);
        rv.add(line);
    }

    for (let i=0; i<intervalList.length; i++) {
        segment_geo = new THREE.Geometry();

        t = intervalList[i].tstart;
        xt = rayOrigin.x + t * rayDirection.x;
        yt = rayOrigin.y + t * rayDirection.y;
        zt = rayOrigin.z + t * rayDirection.z;
        segment_geo.vertices.push(new THREE.Vector3 (xt, yt, zt));

        t = intervalList[i].tend;
        xt = rayOrigin.x + t * rayDirection.x;
        yt = rayOrigin.y + t * rayDirection.y;
        zt = rayOrigin.z + t * rayDirection.z;
        segment_geo.vertices.push(new THREE.Vector3 (xt, yt, zt));

        if (intervalList[i].itype == CSG.IN)
            line = new THREE.Line(segment_geo, CSG.InOnOut.LINE_IN_MAT);
        else if (intervalList[i].itype == CSG.OUT)
            line = new THREE.Line(segment_geo, CSG.InOnOut.LINE_OUT_MAT);

        rv.add(line);
    }

    // Last part
    t = intervalList[intervalList.length-1].tend;
    if (t < CSG.FAR) {
        segment_geo = new THREE.Geometry();

        xt = rayOrigin.x + t * rayDirection.x;
        yt = rayOrigin.y + t * rayDirection.y;
        zt = rayOrigin.z + t * rayDirection.z;
        segment_geo.vertices.push(new THREE.Vector3 (xt, yt, zt));

        t = CSG.FAR;
        xt = rayOrigin.x + t * rayDirection.x;
        yt = rayOrigin.y + t * rayDirection.y;
        zt = rayOrigin.z + t * rayDirection.z;
        segment_geo.vertices.push(new THREE.Vector3 (xt, yt, zt));

        line = new THREE.Line(segment_geo, CSG.InOnOut.LINE_OUT_MAT);
        rv.add(line);
    }


    return rv;
};