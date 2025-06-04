// Set the default precision for floating point numbers.
precision mediump float;

// Uniforms are variables passed from the application to the shader.
// uMainSampler: The main texture we are applying the effect to.
uniform sampler2D uMainSampler;
// uResolution: The resolution of the screen or render target (width, height).
uniform vec2 uResolution;
// uTime: A time value that can be used for animations (like flicker).
uniform float uTime;

// Varyings are variables passed from the vertex shader to the fragment shader.
// outTexCoord: The texture coordinates for the current fragment.
varying vec2 outTexCoord

// CRT effect parameters - constants that can be tweaked.
// CURVATURE: Controls the intensity of the screen curvature effect.
const float CURVATURE = 0.03;
// SCANLINE_INTENSITY: Controls how visible the scanlines are.
const float SCANLINE_INTENSITY = 0.5;
// SCANLINE_COUNT: Controls the number of scanlines visible on the screen.
const float SCANLINE_COUNT = 400.0;
// GLOW_INTENSITY: Controls the intensity of the phosphor glow effect.
const float GLOW_INTENSITY = 0.5;
// FLICKER_INTENSITY: Controls the intensity of the screen flicker effect.
const float FLICKER_INTENSITY = 0.05;

// Function to apply screen curvature to UV coordinates.
vec2 curve(vec2 uv) {
    // Center the UV coordinates around (0, 0) from the default [0, 1] range.
    uv = uv * 2.0 - 1.0;
    // Calculate an offset based on the square of the UV coordinates, scaled by the curvature.
    vec2 offset = uv * uv * CURVATURE;
    // Apply the offset and scale the UVs back to the [0, 1] range.
    return (uv + offset) * 0.5 + 0.5;
}

// The main function of the fragment shader, executed for each pixel.
void main() {
    // Apply screen curvature to the outgoing texture coordinates.
    vec2 uv = curve(outTexCoord);
    
    // Initialize color with zero.
    vec4 color = vec4(0.0);
    // Sample the main texture at the curved UV coordinate and add to color with a weight.
    color += texture2D(uMainSampler, uv) * 0.5;
    // Sample the texture slightly to the right for color bleeding and add with a smaller weight.
    color += texture2D(uMainSampler, uv + vec2(0.001, 0.0)) * 0.25;
    // Sample the texture slightly to the left for color bleeding and add with a smaller weight.
    color += texture2D(uMainSampler, uv - vec2(0.001, 0.0)) * 0.25;
    
    // Add scanlines based on the original vertical coordinate to ensure even distribution.
    // Calculate a sine wave pattern based on the original vertical texture coordinate and scanline count.
    // The sine function creates the dark and light bands of the scanlines.
    float scanline = sin(outTexCoord.y * SCANLINE_COUNT) * 0.5 + 0.5;
    // Multiply the color by the inverse of the scanline intensity to darken the lines.
    color.rgb *= 1.0 - (scanline * SCANLINE_INTENSITY);
    
    // Add phosphor glow effect.
    // Resample the texture at the curved UV for the glow.
    vec4 glow = texture2D(uMainSampler, uv);
    // Add the glow color scaled by the glow intensity to the main color.
    color.rgb += glow.rgb * GLOW_INTENSITY;
    
    // Add screen flicker effect.
    // Calculate a flicker value based on time using a sine wave.
    float flicker = 1.0 - (sin(uTime * 10.0) * FLICKER_INTENSITY);
    // Multiply the color by the flicker value to create a pulsating effect.
    color.rgb *= flicker;
    
    // Add vignette effect (darkening towards the edges).
    // Calculate the distance from the center of the screen.
    vec2 center = vec2(0.5, 0.5);
    float dist = length(uv - center);
    // Darken the color based on the distance from the center.
    color.rgb *= 1.0 - dist * 0.5;
    
    // Ensure color component values do not exceed 1.0 (maximum brightness).
    color.rgb = min(color.rgb, 1.0);
    
    // Output the final calculated color for the current pixel.
    gl_FragColor = color;
} 