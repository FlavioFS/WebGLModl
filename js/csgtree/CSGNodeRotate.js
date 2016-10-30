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
        rv.applyMatrix(rotation_mtx);

        return rv;
    }

    setMembershipRaycast (originPoint, rayVector, transformStack=[]) {
        var rv;

        transformStack.push( {operation: CSG.ROTATE, param: this.param} );
        rv = this.child.setMembershipRaycast(originPoint, rayVector, transformStack);

        return rv;
    }
};