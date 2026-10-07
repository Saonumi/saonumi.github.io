varying float vLightY;
varying float vWave;

uniform float uProgress;

#define COLOR vec3(0.82,0.18,0.40)

void main() {
  // Reduce opacity where wave is positive (y going down)
  float waveOpacity = 1.0 - smoothstep(0.0, 0.25, vWave);
  gl_FragColor = vec4(COLOR, (1. - vLightY) * 0.3 * waveOpacity * uProgress);
}
