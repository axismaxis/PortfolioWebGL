const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;

const vertexData = [
	-0.5,-0.5,-0.5, // triangle 1 : begin
    -0.5,-0.5, 0.5,
    -0.5, 0.5, 0.5, // triangle 1 : end
     0.5, 0.5,-0.5, // triangle 2 : begin
    -0.5,-0.5,-0.5,
    -0.5, 0.5,-0.5, // triangle 2 : end
     0.5,-0.5, 0.5,
    -0.5,-0.5,-0.5,
     0.5,-0.5,-0.5,
     0.5, 0.5,-0.5,
     0.5,-0.5,-0.5,
    -0.5,-0.5,-0.5,
    -0.5,-0.5,-0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5,-0.5,
     0.5,-0.5, 0.5,
    -0.5,-0.5, 0.5,
    -0.5,-0.5,-0.5,
    -0.5, 0.5, 0.5,
    -0.5,-0.5, 0.5,
     0.5,-0.5, 0.5,
     0.5, 0.5, 0.5,
     0.5,-0.5,-0.5,
     0.5, 0.5,-0.5,
     0.5,-0.5,-0.5,
     0.5, 0.5, 0.5,
     0.5,-0.5, 0.5,
     0.5, 0.5, 0.5,
     0.5, 0.5,-0.5,
    -0.5, 0.5,-0.5,
     0.5, 0.5, 0.5,
    -0.5, 0.5,-0.5,
    -0.5, 0.5, 0.5,
     0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
     0.5,-0.5, 0.5
];

function randomColor()
{
	return [Math.random(), Math.random(), Math.random()];
}


let colorData = [];
for(let face = 0; face < 6; face++)
{
	let faceColor = randomColor();
	for(let vertex = 0; vertex < 6; vertex++)
	{
		colorData.push(...faceColor);
	}
}

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);


const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
	precision mediump float;

	attribute vec3 position;
	attribute vec3 color;

	varying vec3 vColor;
	uniform mat4 matrix;

	void main(){
		vColor = color;
		gl_Position = matrix * vec4(position, 1);
	}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
	precision mediump float;
	varying vec3 vColor;
	void main(){
		gl_FragColor = vec4(vColor, 1);
	}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

//Get vertex attrib locations
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

gl.enable(gl.DEPTH_TEST);

//Get uniform locations
const uniformLocations = {
	matrix: gl.getUniformLocation(program, `matrix`)
};

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix,
                75 * Math.PI / 180,
                canvas.width / canvas.height,
                1e-4,
                1e4);

const finalMatrix = mat4.create();

mat4.translate(modelMatrix, modelMatrix, [-1.5, 0, -2]);

mat4.translate(viewMatrix, viewMatrix, [-3, 0, 1]);
mat4.invert(viewMatrix, viewMatrix);

function animate(){
	requestAnimationFrame(animate);
    //mat4.rotateX(matrix, matrix, Math.PI/100)
    //mat4.rotateZ(matrix, matrix, Math.PI/80)
    mat4.multiply(finalMatrix, viewMatrix, modelMatrix);
    mat4.multiply(finalMatrix, projectionMatrix, finalMatrix);
	gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();



