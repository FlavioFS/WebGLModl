/**
 * Created by Kienz on 26/10/2016.
 */

// Namespace
var CSGTree = CSGTree || {};

// Constants
CSGTree.UNION = 0;
CSGTree.INTERSECTION = 1;
CSGTree.DIFFERENCE = 2;

// Tree structure
CSGTree.Node = class
{
    /* =====================================================================================================
     *  CONSTRUCTOR
     * ===================================================================================================== */
    constructor (parent = null, value = null, left = null, right = null)
    {
        this._parent = parent;
        this._value = value;
        this._left = left;
        this._right = right;
        this._willBeRendered = true;
    }

    /* =====================================================================================================
     *  GETTERS & SETTERS
     * ===================================================================================================== */
    get parent ()        { return this._parent;         }
    get value ()         { return this._value;          }
    get left ()          { return this._left;           }
    get right ()         { return this._right;          }
    get willBeRendered() { return this._willBeRendered; }

    set parent (parent)    { this._parent = parent;    }
    set value (value)      { this._value = value;      }
    set left (left)        { this._left = left;        }
    set right (right)      { this._right = right;      }
    set willBeRendered (b) { this._willBeRendered = b; }
};