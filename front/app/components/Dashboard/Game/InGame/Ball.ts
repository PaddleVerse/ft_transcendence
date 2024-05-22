import * as THREE from 'three';

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Velocity {
  x: number;
  y: number;
  z: number;
}

class Ball extends THREE.Mesh {
  velocity: THREE.Vector3;
  radius: number;
  mass: number;
  boundingBox: THREE.Box3;
  min: Position;
  max: Position;
  targetPosition: Position | null = null;
  texture: string;
  constructor(
    radius: number = 1,
    position: Position = { x: 0, y: 0, z: 0 },
    velocity: Velocity = { x: 0, y: 0, z: 0 },
    texture: string,
  ) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(texture),
    });

    super(geometry, material);
    this.texture = texture;
    this.position.set(position.x, position.y, position.z);
    this.castShadow = true;
    this.velocity = new THREE.Vector3(velocity.x, velocity.y, velocity.z);
    this.radius = radius;
    this.mass = 0.01;
    this.boundingBox = new THREE.Box3().setFromObject(this);
    this.min = {
      x: this.position.x - this.radius,
      y: this.position.y - this.radius,
      z: this.position.z - this.radius,
    };
    this.max = {
      x: this.position.x + this.radius,
      y: this.position.y + this.radius,
      z: this.position.z + this.radius,
    };

    if ((this.material as THREE.MeshStandardMaterial).map) {
      const standardMaterial = this.material as THREE.MeshStandardMaterial;
      if (standardMaterial.map) {

        standardMaterial.map.wrapS = THREE.RepeatWrapping;
        standardMaterial.map.wrapT = THREE.RepeatWrapping;
      }

    }
  }

  update() {
    this.applyRotation();
  }
  // Call this method in your animation loop or similar periodic update function.
  updatePosition() {
    if (!this.targetPosition) return; // No target position set, do nothing.

    // Calculate the next position using LERP for smooth transition while using velocity.
    this.position.x += (this.targetPosition.x - this.position.x) * this.velocity.x;
    this.position.y += (this.targetPosition.y - this.position.y) * this.velocity.y;
    this.position.z += (this.targetPosition.z - this.position.z) * this.velocity.z;
    
    // Optionally, you can set a threshold to clear the target position when close enough.
    const distance = this.position.distanceTo(new THREE.Vector3(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z));
    if (distance < 0.01) {
      this.targetPosition = null; // Arrived at target position, clear it.
    }
  }
  moveToPosition(targetPosition: Position) {
    this.targetPosition = targetPosition;
    // Speed can be adjusted according to your needs.
    this.updatePosition();
  }
  applyGravity(GRAVITY: number = 0.01) {
    this.velocity.y -= GRAVITY;
  }
  applyRotation(): void {
		// rotation of the ball depending on the velocity and the direction
		if (this.velocity.x === 0 && this.velocity.z === 0) return;
		this.rotation.x += this.velocity.z;
		this.rotation.y += this.velocity.x;
		this.rotation.z += this.velocity.y;
	}


  speedLimit() {
    this.velocity.x = Math.min(this.velocity.x, 0.5);
    this.velocity.y = Math.min(this.velocity.y, 1);
    this.velocity.z = Math.min(this.velocity.z, 1);
  }
}

export { Ball };
