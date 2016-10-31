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


        // I dont know why, but it only seems to work if I make 4 matrix4

        var rotation_mtx = new THREE.Matrix4();
        var rotationX = new THREE.Matrix4();
        var rotationY = new THREE.Matrix4();
        var rotationZ = new THREE.Matrix4();

        if (this.param.x != 0) rotationX.makeRotationX(this.param.x/180*Math.PI);
        if (this.param.y != 0) rotationY.makeRotationY(this.param.y/180*Math.PI);
        if (this.param.z != 0) rotationZ.makeRotationZ(this.param.z/180*Math.PI);

        rotation_mtx.multiplyMatrices(rotationX, rotationY);
        rotation_mtx.multiply(rotationZ);

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