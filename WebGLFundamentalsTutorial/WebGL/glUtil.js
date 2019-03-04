"use strict";

/**
 * @param {WebGLRenderingContext} glContext Webrendering context
 * @param {number} type Shader type, gl.FRAGMENT_SHADER etc...
 * @param {string} source Source text for the shader
 * @returns {number} Handle for shader
 */
function CreateShader(glContext, type, source)
{
    const shader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);
    const success = glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);
    if(success){
        return shader;
    }

    console.log(glContext.getShaderInfoLog(shader));
    glContext.deleteShader(shader);
}

/**
 * @param {WebGLRenderingContext} glContext Webrendering context
 * @param {number} vertexShader Handle for vertex shader
 * @param {number} fragmentShader Handle for fragment shader
 * @returns {number} Handle for created program
 */
function CreateProgram(glContext, vertexShader, fragmentShader)
{
    const program = glContext.createProgram();
    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);
    const success = glContext.getProgramParameter(program, glContext.LINK_STATUS);
    if(success){
        return program;
    }

    console.log(glContext.getProgramInfoLog(program));
    glContext.deleteProgram(program);
}

/**
 * @param {HTMLCanvasElement} canvas the canvas HTML Element that needs to be resized
 */
function ResizeCanvasToBrowser(canvas)
{
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if(canvas.width != displayWidth || canvas.height != displayHeight)
    {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}