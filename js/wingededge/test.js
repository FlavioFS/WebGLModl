// tetrahedron
// https://www.cs.mtu.edu/~shene/COURSES/cs3621/NOTES/model/winged-e.html
var B = new WingedEdge.Vertex({x: 0, y: 0, z: 0});
var C = new WingedEdge.Vertex({x: 1, y: 0, z: 1});
var A = new WingedEdge.Vertex({x: 0, y: 1, z: 1});
var D = new WingedEdge.Vertex({x: 2, y: 2, z: 2});

var a = new WingedEdge.Edge(A, D);
var b = new WingedEdge.Edge(A, B);
var c = new WingedEdge.Edge(B, D);
var d = new WingedEdge.Edge(B, C);
var e = new WingedEdge.Edge(C, D);
var f = new WingedEdge.Edge(A, C);

var F1 = new WingedEdge.Face([a, c, b]);
var F2 = new WingedEdge.Face([c, e, d]);
var F3 = new WingedEdge.Face([a, f, e]);
var F4 = new WingedEdge.Face([b, f, d]);

a.setFaces(F3, F1);
b.setFaces(F1, F4);
c.setFaces(F1, F2);
d.setFaces(F2, F4);
e.setFaces(F2, F3);
f.setFaces(F4, F3);

a.setTraverseEdges(e, f, b, c);
b.setTraverseEdges(c, a, f, d);
c.setTraverseEdges(a, b, d, e);
d.setTraverseEdges(e, c, d, f);
e.setTraverseEdges(c, d, f, a);
f.setTraverseEdges(d, b, a, e);