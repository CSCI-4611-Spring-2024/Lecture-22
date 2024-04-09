#version 300 es

/* Lecture 22: Advanced Shader Programming
 * CSCI 4611, Spring 2024, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

precision mediump float;

#define POINT_LIGHT 0
#define DIRECTIONAL_LIGHT 1

const int MAX_LIGHTS = 8;

// position of the camera in world coordinates
uniform vec3 eyePositionWorld;

// properties of the lights in the scene
uniform int numLights;
uniform int lightTypes[MAX_LIGHTS];
uniform vec3 lightPositionsWorld[MAX_LIGHTS];
uniform vec3 ambientIntensities[MAX_LIGHTS];
uniform vec3 diffuseIntensities[MAX_LIGHTS];
uniform vec3 specularIntensities[MAX_LIGHTS];

// material properties (coefficents of reflection)
uniform vec3 kAmbient;
uniform vec3 kDiffuse;
uniform vec3 kSpecular;
uniform float shininess;

// texture data
uniform int useTexture;
uniform sampler2D textureImage;

// data passed in from the vertex shader
in vec3 vertPositionWorld;
// in vec3 vertNormalWorld;
in vec4 vertColor;
in vec2 uv;

// fragment shaders can only output a single color
out vec4 fragColor;

void main() 
{
    // Calculate the face normal using shader derivatives
    // http://www.aclockworkberry.com/shader-derivative-functions/
    vec3 n = normalize(cross(dFdx(vertPositionWorld), dFdy(vertPositionWorld)));

    // Normalize the interpolated normal vector
    // vec3 n = normalize(vertNormalWorld);

    // light calculations
    vec3 illumination = vec3(0, 0, 0);
    for(int i=0; i < numLights; i++)
    {
        // Ambient component
        illumination += kAmbient * ambientIntensities[i];

        // Don't forget to normalize the vectors!
        vec3 l;
        if(lightTypes[i] == POINT_LIGHT)
            l = normalize(lightPositionsWorld[i] - vertPositionWorld);
        else
            l = normalize(lightPositionsWorld[i]); 

        // Diffuse component
        float diffuseComponent = max(dot(n, l), 0.0);
        illumination += diffuseComponent * kDiffuse * diffuseIntensities[i];

        // Compute the vector from the vertex to the eye
        vec3 e = normalize(eyePositionWorld - vertPositionWorld);

        // Compute the halfway vector for the Blinn-Phong reflection model
        vec3 h = normalize(l + e);

        // Specular component
        float specularComponent = pow(max(dot(h, n), 0.0), shininess);
        illumination += specularComponent * kSpecular * specularIntensities[i];
    }

    fragColor = vertColor;
    fragColor.rgb *= illumination;

    if(useTexture != 0)
    {
        fragColor *= texture(textureImage, uv);
    }
}