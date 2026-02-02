// Original shader collected from: https://www.shadertoy.com/view/WsVSzV
// Licensed under Shadertoy's default since the original creator didn't provide any license. (CC BY NC SA 3.0)
// Slight modifications were made to give a green-ish effect.

precision highp float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
varying vec2 outTexCoord;

float warp = 0.25; // simulate curvature of CRT monitor
float scan = 0.50; // simulate darkness between scanlines

void main()
{
    vec2 screenUV = gl_FragCoord.xy / iResolution.xy;
    vec2 uv = outTexCoord;
    vec2 dc = abs(0.5 - screenUV);
    dc *= dc;
    
    // warp the fragment coordinates based on screen position
    uv.x -= 0.5; uv.x *= 1.0 + (dc.y * (0.3 * warp)); uv.x += 0.5;
    uv.y -= 0.5; uv.y *= 1.0 + (dc.x * (0.4 * warp)); uv.y += 0.5;

    // sample inside boundaries, otherwise set to black
    if (uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0)
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    else
    {
        // determine if we are drawing in a scanline
        float apply = abs(sin(gl_FragCoord.y) * 0.5 * scan);
        
        // sample the texture and apply a teal tint
        vec3 color = texture2D(iChannel0, uv).rgb;
        vec3 tealTint = vec3(0.0, 0.8, 0.6); // teal color (slightly more green than blue)

        // mix the sampled color with the teal tint based on scanline intensity
        gl_FragColor = vec4(mix(color * tealTint, vec3(0.0), apply), 1.0);
    }
}
