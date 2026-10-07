varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec3 uVignetteColor;
uniform float uOpacity;
void main() {
    vec3 color = texture2D(uTexture, vUv).rgb;
    float vignette = smoothstep(0.3, 0.8, distance(vUv, vec2(0.5)) * 0.8);
    color = mix(color, uVignetteColor, vignette);
    gl_FragColor = vec4(mix(uVignetteColor, color, uOpacity), 1.0);
    #include <colorspace_fragment>
}
