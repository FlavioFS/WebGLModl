var canvas = document.getElementByIdsrc="shaders/vertex-shader"('can');
var gl = canvas.getContext("webgl");

// [1]
function main () {
	
};

// [2]
function init ()
{
	if (!gl)
	{
		alert("WebGL not working!");
		return;
	}

	gl.clearColor(0.0, 0.0, 0.3, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var vertexShaderSource   = $('#vertex-shader');
	var fragmentShaderSource = $('#fragment-shader');

	var vertexShader   = createShader(gl,   gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	var program = createProgram(gl, vertexShader, fragmentShader);
}


// [3]
function createShader (gl, type, source)
{
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) return shader;

	alert("Shader problem");
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

	alert("Program problem");
	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

$(document).ready(main);