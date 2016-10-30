/**
 * Created by Kienz on 29/10/2016.
 */

// Namespace
var Utils = Utils || {};

Utils.RaycasterInstance = null;

// A singleton raycaster
Utils.RaycasterSingleton = class {

    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor ()  {
        if (Utils.RaycasterInstance != null)
            return Utils.RaycasterInstance;

        Utils.RaycasterInstance = new THREE.Raycaster();
        return Utils.RaycasterInstance;
    }

};