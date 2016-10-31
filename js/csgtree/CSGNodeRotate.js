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

        rotationX.makeRotationX(this.param.x/180*Math.PI);
        rotationY.makeRotationY(this.param.y/180*Math.PI);
        rotationZ.makeRotationZ(this.param.z/180*Math.PI);

        rotation_mtx.multiplyMatrices(rotationX, rotationY);
        rotation_mtx.multiply(rotationZ);

        // TODO Remove this
        // the commment code below does not work
        // rv.applyMatrix(rotation);
        // var rotation_mtx = new THREE.Matrix4();
        // // makeRotationFromEuler is weirdly not working
        // console.log(new THREE.Vector3(this.param.x/180*Math.PI, this.param.y/180*Math.PI, this.param.z/180*Math.PI))
        // rotation_mtx.makeRotationFromEuler(
        //     new THREE.Vector3(this.param.x/180*Math.PI, this.param.y/180*Math.PI, this.param.z/180*Math.PI)
        //     );
        // // if (this.param.x != 0) rotation_mtx.rotateX(this.param.x);
        // // if (this.param.y != 0) rotation_mtx.rotateY(this.param.y);
        // // if (this.param.z != 0) rotation_mtx.rotateZ(this.param.z);
        // rotation_mtx.makeRotationX(this.param.x/180*Math.PI);
        // rotation_mtx.makeRotationY(this.param.y/180*Math.PI);
        // rotation_mtx.makeRotationZ(this.param.z/180*Math.PI);

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