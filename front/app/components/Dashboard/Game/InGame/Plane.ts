import * as THREE from 'three';

interface Position {
  x: number;
  y: number;
  z: number;
}

class Plane extends THREE.Mesh {
  height: number;
  width: number;
  boundingBox: THREE.Box3 | undefined;

  constructor(
    height: number = 1,
    width: number = 1,
    position: Position = { x: 0, y: 0, z: 0 },
    rotationX: number = -Math.PI / 2,
    texture: string = '/Game/textures/plane.png',
  ) {
    const geometry = new THREE.PlaneGeometry(height, width);
    const material = new THREE.MeshStandardMaterial(); // Temporary material, will be replaced
    super(geometry, material);

    this.height = height;
    this.width = width;
    this.rotation.x = rotationX;

    const loader = new THREE.TextureLoader();
    loader.load(texture, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(20, 20);

      this.material = new THREE.MeshStandardMaterial({
        map: texture,
      });

      this.rotation.x = rotationX;
      this.position.set(position.x, position.y, position.z);
      this.receiveShadow = true;

      // Bounding box can be calculated now, but it may need to be recalculated if the mesh changes later
      this.boundingBox = new THREE.Box3().setFromObject(this);
    });
  }
}

export { Plane };
