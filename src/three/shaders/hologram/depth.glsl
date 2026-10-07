#include ../includes/avatar-progress/fragment.glsl;

void main() {
    // Write only the portion revealed by the scan, so concealed geometry
    // cannot show through the face, hair, glasses, or shirt.
    if (1.0 - getProgress() <= 0.001) discard;
    gl_FragColor = vec4(0.0);
}
