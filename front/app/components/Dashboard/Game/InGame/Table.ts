import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BoundingBox } from "./Box.ts";
import * as THREE from "three";

interface Position {
  x: number;
  y: number;
  z: number;
}

class TableModule {
  scene: THREE.Scene;
  position: Position;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.position = { x: -0.0027352614448457047, y: 7.994709046264589, z: -0.013745575034839419 };
  }

  async loadTable(): Promise<void> {
    const loader = new GLTFLoader();
    const loadedData = await loader.loadAsync("/Game/models/table.gltf");

    loadedData.scene.scale.set(0.1, 0.1, 0.1);
    loadedData.scene.position.set(0, 0, 0);
    loadedData.scene.rotation.set(0, Math.PI / 2, 0);
    loadedData.scene.receiveShadow = true;
    loadedData.scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.receiveShadow = true;
      }
    });

    this.scene.add(loadedData.scene);

    const tablebounds1 = { x: 14.324529477110308, y: 7.6894180925291765, z: -7.927491150069679 };
    const tablebounds2 = { x: -14.33, y: 8.30, z: 7.90 };

    let width = Math.abs(tablebounds2.x - tablebounds1.x);
    let height = Math.abs(tablebounds2.y - tablebounds1.y);
    let depth = Math.abs(tablebounds2.z - tablebounds1.z);

    let centerX = (tablebounds1.x + tablebounds2.x) / 2;
    let centerY = (tablebounds1.y + tablebounds2.y) / 2;
    let centerZ = (tablebounds1.z + tablebounds2.z) / 2;

    const tableBox = new BoundingBox(width, height, depth, { x: centerX, y: centerY, z: centerZ }, false);
    this.scene.add(tableBox);
  }

  createNet(): void {
    const netPlane = new THREE.PlaneGeometry(17.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/Game/textures/net.png"),
      side: THREE.DoubleSide,
      transparent: true,
    });
    if (material.map) material.map.repeat.set(50, 50 / 14);
    const net = new THREE.Mesh(netPlane, material);
    net.position.set(0, 9, 0);
    net.rotation.y = -Math.PI / 2;
    net.matrixAutoUpdate = false;
    net.castShadow = false;
    net.updateMatrix();
    this.scene.add(net);
  }

  createNetBound(): BoundingBox {
    const netbounds1 = { x: 8.5, y: 9, z: -0.75 };
    const netbounds2 = { x: 8.5, y: 10.6, z: 16.75 };

    let netWidth = Math.abs(netbounds2.x - netbounds1.x);
    let netHeight = Math.abs(netbounds2.y - netbounds1.y);
    let netDepth = Math.abs(netbounds2.z - netbounds1.z);

    let netCenterX = (netbounds1.x + netbounds2.x) / 2;
    let netCenterY = (netbounds1.y + netbounds2.y) / 2;
    let netCenterZ = (netbounds1.z + netbounds2.z) / 2;

    const netBox = new BoundingBox(netWidth, netHeight, netDepth, { x: netCenterX, y: netCenterY, z: netCenterZ }, false);
    this.scene.add(netBox);
    return netBox;
  }

  createTableTopBound(): BoundingBox {
    const tablebounds1 = { x: 14.1, y: 8.3, z: -8 };
    const tablebounds2 = { x: -14.1, y: 8.3, z: 8 };

    let width = Math.abs(tablebounds2.x - tablebounds1.x);
    let height = Math.abs(tablebounds2.y - tablebounds1.y);
    let depth = Math.abs(tablebounds2.z - tablebounds1.z);

    let centerX = (tablebounds1.x + tablebounds2.x) / 2;
    let centerY = (tablebounds1.y + tablebounds2.y) / 2;
    let centerZ = (tablebounds1.z + tablebounds2.z) / 2;

    const tableBox = new BoundingBox(width, height, depth, { x: centerX, y: centerY, z: centerZ }, false);
    this.scene.add(tableBox);
    return tableBox;
  }
}

export { TableModule };
