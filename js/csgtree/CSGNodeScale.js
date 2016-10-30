/**
 * Created by Kienz on 28/10/2016.
 */

// Scaling operation
CSG.NodeScale = class extends CSG.NodeTransform
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (child = null, param = {x:1, y:1, z:1}) {
        super(child, param, "CSG.NodeScale");
    }

    /* =====================================================================================================
     *  Methods
     * ===================================================================================================== */
    geometry () {
        var rv = this.child.geometry();

        var translation_mtx = new THREE.Matrix4();
        translation_mtx.scale( new THREE.Vector3(this.param.x, this.param.y, this.param.z) );
        rv.applyMatrix(translation_mtx);

        return rv;
    }

    setMembershipRaycast (originPoint, rayVector, transformStack=[]) {
        var rv;

        transformStack.push( {operation: CSG.SCALE, param: this.param} );
        rv = this.child.setMembershipRaycast(originPoint, rayVector, transformStack);

        return rv;
    }
};