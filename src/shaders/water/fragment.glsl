precision mediump float;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vViewPosition;

// fog
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying float vViewZ;
varying float vFogDepth;

varying vec2 vUv;
uniform vec3 uBackgroundColor;

void main()
{

    // Color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    #include <colorspace_fragment>

    // Fog
    #include <fog_pars_fragment>
    
    /* BORDERS FADE */
    float distX = min(vUv.x, 1.0 - vUv.x);
    float distY = min(vUv.y, 1.0 - vUv.y);
    float dist = min(distX, distY);
    float alpha = smoothstep(0.0, 0.11, dist);

    vec3 finalColor = mix(color, uBackgroundColor, 1.0 - alpha);

    gl_FragColor = vec4(finalColor, 1.0);

    // gl_FragColor = vec4(color, 1.0);


}