#version 300 es

/* Lecture 22: Advanced Shader Programming
 * CSCI 4611, Spring 2024, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

precision mediump float;

// material properties: coeff. of reflection for the material
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

// animation data
uniform float waveAngle;
uniform float waveScale;

// per-vertex data
in vec3 position;
in vec3 normal;
in vec4 color;
in vec2 texCoord;

// data we want to send to the rasterizer and eventually the fragment shader
out vec3 vertPositionWorld;
// out vec3 vertNormalWorld;
out vec4 vertColor;
out vec2 uv;

void main() 
{
    vec3 vertPositionDeformed = position + (cos(position.x*20.0 + waveAngle) * 0.5 + 0.5) * waveScale * normal;

    // position in homogenous coords is x, y, z, 1
    vertPositionWorld = (modelMatrix * vec4(vertPositionDeformed, 1)).xyz;

    // vector in homogenous coords is x, y, z, 0
    // vertNormalWorld = normalize((normalMatrix * vec4(normal, 0)).xyz);

    // output the vertex color to the fragment shader
    vertColor = color;

    // output the texture coordinate to the fragment shader
    uv = texCoord.xy; 

    // compute the 2D screen coordinate position
    gl_Position = projectionMatrix * viewMatrix * vec4(vertPositionWorld, 1);
}
