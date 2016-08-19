var canvas;
var gl;
var vertexShader;
var fragmentShader;
var program;
var changedShaders = true;
var positionAttributeLocation;

// [1]
function main () {
	init();
	mainloop();
}

// [2]
function init ()
{
	canvas = document.getElementById('can');
	gl = canvas.getContext("webgl");

	if (!gl)
	{
		alert("WebGL not working!");
		return;
	}

	gl.clearColor(0.05, 0.0, 0.2, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	initShaderFields();
	positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	setInterval(mainloop, 0.1);
}

function mainloop ()
{
	if (changedShaders)
	{
		initShaderFields();
		changedShaders = false;
	}
	drawSample();
}


// []
function drawSample () {
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	var positions = [
		0,     0,
		0,   0.5,
		0.7,   0
	];
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}


///////////////////////////////////////////// INIT/SETUP
// [3]
function createShader (gl, type, source)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success)
	{
		changedShaders = true;
		document.getElementById('vlamp').className = "signal";
		document.getElementById('flamp').className = "signal";
		return shader;
	}

	if (type == gl.VERTEX_SHADER) document.getElementById('vlamp').className = "signal problem";
	else                          document.getElementById('flamp').className = "signal problem";

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}


// [4]
function createProgram (gl, vertexShader, fragmentShader)
{
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	var success = gl.getProgramParameter (program, gl.LINK_STATUS);
	if (success) return program;

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}


// [5]
function updateVertexShader () {
	var vertexShaderSource   = document.getElementById('vshader').value;
	vertexShader   = createShader(gl,   gl.VERTEX_SHADER, vertexShaderSource);
	program = createProgram(gl, vertexShader, fragmentShader);
	changedShaders = true;
}
// [6]
function updateFragmentShader () {
	var fragmentShaderSource = document.getElementById('fshader').value;
	fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	program = createProgram(gl, vertexShader, fragmentShader);
	changedShaders = true;
}

// [5]
function initShaderFields () {

	// Vertex	
	var vInput = document.getElementById('vInput');
	var vDisplayArea = document.getElementById('vshader');

	// File Load Field
	vInput.addEventListener('change', function(e) {
		var file = vInput.files[0];

		var reader = new FileReader();
		reader.onload = function(e) {
			vDisplayArea.value = reader.result;
		}

		reader.readAsText(file);
		updateVertexShader();
	});

	// Text Area
	vshader.addEventListener('change', function (e) {
		updateVertexShader();
	});

	// Fragment
	var fInput = document.getElementById('fInput');
	var fDisplayArea = document.getElementById('fshader');

	fInput.addEventListener('change', function(e) {
		var file = fInput.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			fDisplayArea.value = reader.result;
		}

		reader.readAsText(file);
		updateFragmentShader();
	});

	fshader.addEventListener('change', function (e) {
		updateFragmentShader();
	});

	// First run
	var vertexShaderSource   = document.getElementById('vshader').value;
	var fragmentShaderSource = document.getElementById('fshader').value;
	vertexShader   = createShader(gl,   gl.VERTEX_SHADER, vertexShaderSource);
	fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	program = createProgram(gl, vertexShader, fragmentShader);
}

$(document).ready(main);