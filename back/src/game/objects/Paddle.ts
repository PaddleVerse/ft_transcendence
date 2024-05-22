import { BoundingBox } from "../types/BoundingBox";
import { Vector3 } from "../types/Vector3";

class Paddle {
	id: string;
	position: Vector3;
	velocity: Vector3;
	rotationX: number;
	bounds: BoundingBox;

	constructor(id: string, position: Vector3) {
		this.id = id;
		this.position = position;
		this.velocity = { x: 0, y: 0, z: 0 };
		this.rotationX = Math.PI / 2;
		this.bounds = new BoundingBox(0.1, 3, 1.2, { x: this.position.x, y: this.position.y, z: this.position.z });
	}

	update(data: { paddle: Vector3 }): void {
		this.position = data.paddle;
		this.bounds.updatePosition(this.position);
	}
	}

export default Paddle;
