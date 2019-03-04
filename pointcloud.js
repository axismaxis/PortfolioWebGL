const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;

/**
 * 
 * @param {number} pointCount Amount of points generated
 * @returns {Float32Array} List with xyz coords of points
 */
function SpherePointCloud(pointCount)
{
    let points = [];
    for (let i = 0; i < pointCount; i++) {
        const r = () => Math.random() - 0.5;
        const inputPoint = [r(), r(), r()];

        const outputPoint = vec3.normalize(vec3.create(), inputPoint);

        points.push(...outputPoint);
    }
    return points;
}
const vertexData = SpherePointCloud(60);
console.log(vertexData);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
	precision mediump float;

	attribute vec3 position;
    varying vec3 vColor;
    
	uniform mat4 matrix;

	void main(){
		vColor = vec3(1, 0, 0);
		gl_Position = matrix * vec4(position, 1);
	}
`);
gl.compileShader(vertexShader);
console.log(gl.getShaderInfoLog(vertexShader));

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
	precision mediump float;
	varying vec3 vColor;
	void main(){
		gl_FragColor = vec4(vColor, 1);
	}
`);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

//Get vertex attrib locations
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

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

const mvMatrix = mat4.create();
const mvpMatrix = mat4.create();

mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);

mat4.translate(viewMatrix, viewMatrix, [0, 0, 2]);
mat4.invert(viewMatrix, viewMatrix);

function animate(){
	requestAnimationFrame(animate);
    //mat4.rotateX(matrix, matrix, Math.PI/100)
    //mat4.rotateZ(matrix, matrix, Math.PI/80)
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
	gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
	gl.drawArrays(gl.POINTS, 0, vertexData.length / 3);
}

animate();



