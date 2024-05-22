import { Vector3 } from "./Vector3";

class BoundingBox {
	width: number;
	height: number;
	depth: number;
	rotation: Vector3;
	max: Vector3;
	min: Vector3;
	center: Vector3;
	position?: Vector3;

	constructor(width: number, height: number, depth: number, position: Vector3, rotation?: Vector3) {
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.rotation = rotation;
		this.max = { x: position.x + width / 2, y: position.y + height / 2, z: position.z + depth / 2 };
		this.min = { x: position.x - width / 2, y: position.y - height / 2, z: position.z - depth / 2 };
		this.center = { x: position.x, y: position.y, z: position.z };
		this.position = position;
	}
	updatePosition(position: Vector3): void {
		this.position = position;
		this.max = { x: position.x + this.width / 2, y: position.y + this.height / 2, z: position.z + this.depth / 2 };
		this.min = { x: position.x - this.width / 2, y: position.y - this.height / 2, z: position.z - this.depth / 2 };
		this.center = { x: position.x, y: position.y, z: position.z };
	}
	
}

export { BoundingBox };