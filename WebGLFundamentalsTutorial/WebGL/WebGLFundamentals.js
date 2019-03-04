const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;
const vertexData = [
    100, 100,
    500, 500,
    100, 500
];

function main()
{
    const canvas = document.createElement("canvas");
    document.querySelector('body').appendChild(canvas);
    const gl = canvas.getContext('webgl');
    
    const vertexShaderSource = document.getElementById("vertex-shader").textContent;
    const fragmentShaderSource = document.getElementById("fragment-shader").textContent;
    
    const vertexShader = CreateShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = CreateShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    const program = CreateProgram(gl, vertexShader, fragmentShader);
    
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    
    ResizeCanvasToBrowser(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    //Set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 2);
}

main();