import * as THREE from 'three';

interface Position {
  x: number;
  y: number;
  z: number;
}

class Lighting extends THREE.DirectionalLight {
  constructor(
    color: THREE.Color | string | number = 0xffffff,
    intensity: number = 1,
    position: Position = { x: 0, y: 0, z: 0 },
  ) {
    super(color, intensity);
    this.position.set(position.x, position.y, position.z);
    this.castShadow = true;
  }
}

class AmbientLighting extends THREE.AmbientLight {
  constructor(
    color: THREE.Color | string | number = 0xffffff,
    intensity: number = 1
  ) {
    super(color, intensity);
  }
}

export { Lighting, AmbientLighting };
