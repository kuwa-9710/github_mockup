uniform vec3 directionalLightDirection;
uniform vec3 directionalLightColor;
uniform vec3 ambientLightColor;
uniform float ambientLightIntensity;

varying vec3 vNormal;

void main() {
    vec3 lightDirection = normalize(directionalLightDirection);
    float diffuse = max(dot(vNormal, lightDirection), 0.0);

    vec3 ambient = ambientLightColor * ambientLightIntensity;
    vec3 diffuseColor = diffuse * directionalLightColor;

    vec4 finalColor = vec4(ambient + diffuseColor, 1.0);
    gl_FragColor = finalColor;
}
