import * as THREE from 'three';

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Bounds {
  max: Position;
  min: Position;
}

class BoundingBox extends THREE.Mesh {
  visible: boolean;
  width: number;
  height: number;
  depth: number;
  top: number;
  bottom: number;
  max: Position;
  min: Position;

  constructor(
    width: number = 1,
    height: number = 1,
    depth: number = 1,
    position: Position = { x: 0, y: 0, z: 0 },
    visible: boolean = true // Assuming `visible` should be a boolean with a default value
  ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ visible: visible, wireframe: visible });

    super(geometry, material);

    this.position.set(position.x, position.y, position.z);
    this.visible = visible;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.top = position.y + height / 2;
    this.bottom = position.y - height / 2;
    this.max = {
      x: position.x + width / 2,
      y: position.y + height / 2,
      z: position.z + depth / 2,
    };
    this.min = {
      x: position.x - width / 2,
      y: position.y - height / 2,
      z: position.z - depth / 2,
    };
  }

  getArea(): number {
    return this.width * this.height * this.depth;
  }

  getBounds(): Bounds {
    return {
      max: this.max,
      min: this.min,
    };
  }

  update(): void {
    this.max = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
      z: this.position.z + this.depth / 2,
    };
    this.min = {
      x: this.position.x - this.width / 2,
      y: this.position.y - this.height / 2,
      z: this.position.z - this.depth / 2,
    };
  }
}

export { BoundingBox };
