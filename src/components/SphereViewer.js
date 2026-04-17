import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class SphereViewer {
    constructor(containerId, jsonData) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.jsonData = jsonData;
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 0, 5);
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.25;

        this.loadNodes();

        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.animate();
    }

    loadNodes() {
        const geometry = new THREE.SphereGeometry(0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.jsonData.forEach(node => {
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(node.x, node.y, node.z);
            this.scene.add(sphere);
        });

        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.jsonData.forEach(node => {
            node.connections.forEach(conn => {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(6);
                positions[0] = node.x;  // Start x
                positions[1] = node.y;  // Start y
                positions[2] = node.z;  // Start z
                positions[3] = conn.x;  // End x
                positions[4] = conn.y;  // End y
                positions[5] = conn.z;  // End z
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                const line = new THREE.Line(geometry, edgesMaterial);
                this.scene.add(line);
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default SphereViewer;