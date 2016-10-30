/**
 * Created by Kienz on 29/10/2016.
 */

// Namespace
var CSG = CSG || {};

// Boolean
CSG.UNION = 0;
CSG.INTERSECTION = 1;
CSG.DIFFERENCE = 2;

// Stack Operations
CSG.TRANSLATE = -4;
CSG.ROTATE = -5;
CSG.SCALE = -6;

// Raycast near and far
CSG.NEAR = 0.01;
CSG.FAR = 500;

// Raycast classifiers
CSG.IN  = 0;
CSG.ON  = 1;
CSG.OUT = 2;

// Default material
CSG.MATERIAL =
{
    color: 0xFF0000,
    specular: 0xFFDDDD,
    shininess: 2,
    shading: THREE.FlatShading,
    wireframe: false,
    transparent: true,
    opacity: 1.0
};