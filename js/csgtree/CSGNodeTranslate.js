/**
 * Created by Kienz on 28/10/2016.
 */

// Translation operation
CSG.NodeTranslate = class extends CSG.NodeTransform
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (child = null, param = {x:0, y:0, z:0}) {
        super(child, param, "CSG.NodeTranslate");
    }

    /* =====================================================================================================
     *  Methods
     * ===================================================================================================== */
    geometry () {
        var rv = this.child.geometry();

        var translation_mtx = new THREE.Matrix4();
        translation_mtx.setPosition( new THREE.Vector3(this.param.x, this.param.y, this.param.z) );
        rv.applyMatrix(translation_mtx);

        return rv;
    }
};