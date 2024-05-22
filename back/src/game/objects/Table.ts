import { Vector3 } from "../types/Vector3";
import { BoundingBox } from "../types/BoundingBox";
class Table {
	position: Vector3;
	tableBounds: any | null;
	netBound: any | null;
	tableTopBound: any | null;

	constructor() {
		this.position = { x: 0, y: 0, z: 0 };
		this.tableBounds = null;
		this.netBound = new BoundingBox(17.5, 1.6, 17.5, { x: 8.5, y: 9, z: 8 }, { x: 0, y: 0, z: 0 });
		this.tableTopBound = null;
	}

	async loadTable(): Promise<void> {
		let tablebounds1: Vector3 = {
			x: 14.324529477110308,
			y: 7.6894180925291765,
			z: -7.927491150069679,
		};
		let tablebounds2: Vector3 = {
			x: -14.33,
			y: 8.3,
			z: 7.9,
		};

		let width = Math.abs(tablebounds2.x - tablebounds1.x);
		let height = Math.abs(tablebounds2.y - tablebounds1.y);
		let depth = Math.abs(tablebounds2.z - tablebounds1.z);

		let centerX = (tablebounds1.x + tablebounds2.x) / 2;
		let centerY = (tablebounds1.y + tablebounds2.y) / 2;
		let centerZ = (tablebounds1.z + tablebounds2.z) / 2;

		this.tableBounds = {
			width,
			height,
			depth,
			max: { x: tablebounds1.x, y: tablebounds1.y, z: tablebounds1.z },
			min: { x: tablebounds2.x, y: tablebounds2.y, z: tablebounds2.z },
			center: { x: centerX, y: centerY, z: centerZ },
		};

		this.createNetBound();
		this.createTableTopBound();
	}

	createNetBound(): void {
		let netbounds1: Vector3 = {
			x: 8.5,
			y: 9,
			z: -0.75,
		};
		let netbounds2: Vector3 = {
			x: 8.5,
			y: 10.6,
			z: 16.75,
		};

		let netWidth = Math.abs(netbounds2.x - netbounds1.x);
		let netHeight = Math.abs(netbounds2.y - netbounds1.y);
		let netDepth = Math.abs(netbounds2.z - netbounds1.z);

		let netCenterX = (netbounds1.x + netbounds2.x) / 2;
		let netCenterY = (netbounds1.y + netbounds2.y) / 2;
		let netCenterZ = (netbounds1.z + netbounds2.z) / 2;

		this.netBound = {
			width: netWidth,
			height: netHeight,
			depth: netDepth,
			max: { x: netbounds1.x, y: netbounds1.y, z: netbounds1.z },
			min: { x: netbounds2.x, y: netbounds2.y, z: netbounds2.z },
			center: { x: netCenterX, y: netCenterY, z: netCenterZ },
			position: { x: netCenterX, y: netCenterY, z: netCenterZ }
		};
	}

	createTableTopBound(): void {
		let tablebounds1: Vector3 = {
			x: 14.1,
			y: 8.3,
			z: -8,
		};
		let tablebounds2: Vector3 = {
			x: -14.1,
			y: 8.3,
			z: 8,
		};

		let width = Math.abs(tablebounds2.x - tablebounds1.x);
		let height = Math.abs(tablebounds2.y - tablebounds1.y);
		let depth = Math.abs(tablebounds2.z - tablebounds1.z);

		let centerX = (tablebounds1.x + tablebounds2.x) / 2;
		let centerY = (tablebounds1.y + tablebounds2.y) / 2;
		let centerZ = (tablebounds1.z + tablebounds2.z) / 2;

		this.tableTopBound = {
			width,
			height,
			depth,
			max: { x: tablebounds1.x, y: tablebounds1.y, z: tablebounds1.z },
			min: { x: tablebounds2.x, y: tablebounds2.y, z: tablebounds2.z },
			center: { x: centerX, y: centerY, z: centerZ },
			position: { x: centerX, y: centerY, z: centerZ }
		};
	}
}

export default Table;
