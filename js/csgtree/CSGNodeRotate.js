/**
 * Created by Kienz on 28/10/2016.
 */

// Rotation operation
CSG.NodeRotate = class extends CSG.NodeTransform
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (child = null, param = {x:0, y:0, z:0}) {
        super(child, param, "CSG.NodeRotate");
    }

    /* =====================================================================================================
     *  Methods
     * ===================================================================================================== */
    geometry () {
        var rv = this.child.geometry();

        var rotation_mtx = new THREE.Matrix4();
        rotation_mtx.setRotationFromEuler( new THREE.Vector3(this.param.x, this.param.y, this.param.z) );
        // if (this.param.x != 0) rotation_mtx.rotateX(this.param.x);
        // if (this.param.y != 0) rotation_mtx.rotateY(this.param.y);
        // if (this.param.z != 0) rotation_mtx.rotateZ(this.param.z);
        rv.applyMatrix(rotation_mtx);

        return rv;
    }
};