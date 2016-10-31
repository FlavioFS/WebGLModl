/**
 * Created by Kienz on 26/10/2016.
 */

// Boolean operation nodes
CSG.NodeLeaf = class extends CSG.Node
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (solid = null) {
        super("CSG.NodeLeaf");
        this.solid  = solid;
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    get solid  () { return this._solid;  }

    set solid  (solid)  { this._solid  = solid;  }

    /* =====================================================================================================
     *  Methods
     * ===================================================================================================== */
    geometry () {
        return this.solid.geometry();
    }

    setMembershipRaycast (originPoint, rayVector, transformStack=[]) {
        var geo = this.solid.geometry();
        var transform;

        // Applies stacked transforms
        while (transformStack.length > 0)
        {
            transform = transformStack.pop();
            var transform_mtx = new THREE.Matrix4();
            var param_vec = new THREE.Vector3 ( transform.param.x,  transform.param.y,  transform.param.z );

            switch (transform.operation)
            {
                case CSG.TRANSLATE:
                    transform_mtx.setPosition( param_vec );
                    break;

                case CSG.ROTATE:
                    transform_mtx.setRotationFromEuler( param_vec );
                    break;

                case CSG.SCALE:
                    transform_mtx.scale( param_vec );
                    break;
            }

            geo.applyMatrix(transform_mtx);
        }

        // Creates a mesh for this shape
        var raycaster = new THREE.Raycaster(originPoint, rayVector, CSG.NEAR, CSG.FAR);
        var node_mesh = new THREE.Mesh(geo, CSG.MATERIAL);

        // Casts the ray
        node_mesh.updateMatrixWorld();
        var intersects = raycaster.intersectObject(node_mesh, false);
        let intCount = 0;
        var rv = [];
        let ts = 0, te = 0, type = CSG.IN;

        // Remove repetitions
        for (var i=0; i < intersects.length-1; i++) {
            for (var j=i+1; j < intersects.length; j++) {
                if (Math.abs(intersects[i].distance - intersects[j].distance) < 0.01) {
                    intersects.splice(j, 1);
                    j--;
                }
            }
        }

        // Calculates result
        for (let i=0; i < intersects.length-1; i++) {
            ts = (intersects[i].point.x - originPoint.x) / rayVector.x;
            te = (intersects[i+1].point.x - originPoint.x) / rayVector.x;

            if (intCount % 2 == 0)
                type = CSG.IN;
            else
                type = CSG.OUT;

            // Parametric list of intersections
            rv.push( {tstart: ts, tend: te, itype: type} );
            intCount++;
        }

        return rv;
    }
};