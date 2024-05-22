import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BoundingBox } from "./Box";
import { forEach } from "lodash";

interface Position {
  x: number;
  y: number;
  z: number;
}

class Paddle {
  scene: THREE.Scene;
  position: Position;
  object: THREE.Object3D;
  velocity: THREE.Vector3;
  boundingBox: BoundingBox;
  rotationX: number;
  color: String;

  constructor(
    scene: THREE.Scene,
    position: Position,
    rotationX: number = Math.PI / 2,
    color?: String
  ) {
    this.scene = scene;
    this.position = position;
    this.object = new THREE.Object3D(); // Create a new object
    this.velocity = new THREE.Vector3(); // Initialize velocity
    this.load().then((obj) => {
      this.object = obj;
      this.update();
    });
    this.boundingBox = this.createBoundingBox();
    this.rotationX = rotationX;
    this.color = color ? color : "red";
  }

  async load(): Promise<THREE.Object3D> {
    const loader = new GLTFLoader();
    const loadedData = await loader.loadAsync("/Game/models/untitled.gltf");
    loadedData.scene.scale.set(0.1, 0.1, 0.1);
    const associationsMap = loadedData.parser.associations;
    const keysIterator : any = associationsMap.keys();


    for (let key of keysIterator) {
      if (key.name === "Color_A06") {
        const c = this.getRGBColor(this.color);
        key.color.r = c.r;
        key.color.g = c.g;
        key.color.b = c.b;
      }
    }

    loadedData.scene.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    loadedData.scene.rotation.set(0, this.rotationX, 0);

    loadedData.scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.receiveShadow = true;
      }
    });

    this.scene.add(loadedData.scene);
    return loadedData.scene;
  }

  update(): void {
    this.object.position.set(this.position.x, this.position.y, this.position.z);
    this.boundingBox.position.set(
      this.position.x,
      this.position.y + 1,
      this.position.z
    );
    this.boundingBox.update();
  }

  createBoundingBox(): BoundingBox {
    const boundingBox = new BoundingBox(0.1, 2, 1.2, this.position, false);
    this.scene.add(boundingBox);
    return boundingBox;
  }

  getBoundingBoxArea(): number {
    return this.boundingBox.getArea();
  }

  checkCollision(ball: { min: Position; max: Position }): boolean | void {
    if (
      this.boundingBox.max.x > ball.min.x &&
      this.boundingBox.min.x < ball.max.x &&
      this.boundingBox.max.y > ball.min.y &&
      this.boundingBox.min.y < ball.max.y &&
      this.boundingBox.max.z > ball.min.z &&
      this.boundingBox.min.z < ball.max.z
    ) {
      return true;
    }
    return false;
  }

  getFrontPaddle(): number {
    return this.boundingBox.max.x;
  }

  getBackPaddle(): number {
    return this.boundingBox.min.x;
  }

  getRGBColor(color : any): {
    r: number;
    g: number;
    b: number;
  } {
    const colors : any = {
      "red": { r: 1, g: 0, b: 0 },
      "green": { r: 0, g: 1, b: 0 },
      "blue": { r: 0, g: 0, b: 1 },
      "yellow": { r: 1, g: 1, b: 0 },
      "orange": { r: 1, g: 0.5, b: 0 },
      "purple": { r: 0.5, g: 0, b: 1 },
      "white": { r: 1, g: 1, b: 1 },
      "black": { r: 0, g: 0, b: 0 },
      "gray": { r: 0.5, g: 0.5, b: 0.5 },
    };
    return colors[color];
  }
}

export { Paddle as Paddle };
