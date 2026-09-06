/**
 * BLOSSOM DENTAL & IMPLANT STUDIO - 3D TOOTH & GUM INTERACTIVE STATION
 * Procedural Three.js 3D dental anatomy viewer with interactive rotation and layers
 */

class ToothViewer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.toothGroup = null;
    this.enamelMesh = null;
    this.pulpCanalsMesh = null;
    this.gumTissueMesh = null;

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationSpeed = 0.005;
    this.autoRotate = true;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Loading fallback canvas visualization.');
      this.initFallback2D();
      return;
    }

    const width = this.canvas.clientWidth || 500;
    const height = this.canvas.clientHeight || 450;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 8);

    // 2. Renderer with soft antialiasing & alpha background
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Lighting (Soft studio medical lighting)
    const ambientLight = new THREE.AmbientLight(0xFFF9F7, 0.85);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xFFFFFF, 1.1);
    dirLight1.position.set(5, 8, 5);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xFA7268, 0.45); // Subtle coral rim light
    dirLight2.position.set(-5, -3, -4);
    this.scene.add(dirLight2);

    // 4. Build Procedural 3D Tooth & Gum Model
    this.toothGroup = new THREE.Group();
    this.buildToothModel();
    this.scene.add(this.toothGroup);

    // 5. Event Listeners for Mouse and Touch Orbiting
    this.setupInteractivity();

    // 6. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // 7. Window Resize
    window.addEventListener('resize', () => this.onResize());
  }

  buildToothModel() {
    // A. Crown (Upper molar shape)
    const crownGeo = new THREE.CylinderGeometry(1.3, 1.1, 1.4, 32, 16);
    const pos = crownGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i);
      let x = pos.getX(i);
      let z = pos.getZ(i);
      if (y > 0.5) {
        const cuspHeight = Math.sin(x * 3) * Math.cos(z * 3) * 0.18;
        pos.setY(i, y + cuspHeight);
      }
    }
    crownGeo.computeVertexNormals();

    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xFDFEFE,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      transmission: 0.2,
      transparent: true,
      opacity: 0.95
    });

    this.enamelMesh = new THREE.Mesh(crownGeo, enamelMat);
    this.enamelMesh.position.y = 0.7;
    this.toothGroup.add(this.enamelMesh);

    // B. Roots
    const rootMat = new THREE.MeshStandardMaterial({
      color: 0xF5EDE4,
      roughness: 0.4,
      metalness: 0.0
    });

    const rootCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, 0.1, 0),
      new THREE.Vector3(-0.6, -0.9, 0.1),
      new THREE.Vector3(-0.7, -1.9, -0.05)
    ]);
    const rootGeo1 = new THREE.TubeGeometry(rootCurve1, 24, 0.35, 16, false);
    const rootMesh1 = new THREE.Mesh(rootGeo1, rootMat);
    this.toothGroup.add(rootMesh1);

    const rootCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.45, 0.1, 0),
      new THREE.Vector3(0.6, -0.9, -0.1),
      new THREE.Vector3(0.68, -1.9, 0.05)
    ]);
    const rootGeo2 = new THREE.TubeGeometry(rootCurve2, 24, 0.35, 16, false);
    const rootMesh2 = new THREE.Mesh(rootGeo2, rootMat);
    this.toothGroup.add(rootMesh2);

    // C. Internal Root Canal (Pulp Chamber & Canals glowing coral)
    this.pulpCanalsMesh = new THREE.Group();
    const pulpChamberGeo = new THREE.SphereGeometry(0.5, 20, 20);
    pulpChamberGeo.scale(1.2, 0.7, 0.9);
    const pulpMat = new THREE.MeshStandardMaterial({
      color: 0xFA7268,
      emissive: 0xFA7268,
      emissiveIntensity: 0.65,
      roughness: 0.2
    });
    const pulpChamber = new THREE.Mesh(pulpChamberGeo, pulpMat);
    pulpChamber.position.y = 0.65;
    this.pulpCanalsMesh.add(pulpChamber);

    const canalTube1 = new THREE.TubeGeometry(rootCurve1, 24, 0.12, 12, false);
    const canalMesh1 = new THREE.Mesh(canalTube1, pulpMat);
    this.pulpCanalsMesh.add(canalMesh1);

    const canalTube2 = new THREE.TubeGeometry(rootCurve2, 24, 0.12, 12, false);
    const canalMesh2 = new THREE.Mesh(canalTube2, pulpMat);
    this.pulpCanalsMesh.add(canalMesh2);

    this.toothGroup.add(this.pulpCanalsMesh);

    // D. Gingival Gum Base
    const gumGeo = new THREE.TorusGeometry(1.6, 0.45, 16, 40);
    gumGeo.rotateX(Math.PI / 2);
    const gumMat = new THREE.MeshStandardMaterial({
      color: 0xE88882,
      roughness: 0.35,
      metalness: 0.0
    });
    this.gumTissueMesh = new THREE.Mesh(gumGeo, gumMat);
    this.gumTissueMesh.position.y = -0.1;
    this.toothGroup.add(this.gumTissueMesh);

    this.toothGroup.rotation.x = 0.2;
    this.toothGroup.rotation.y = -0.35;
  }

  setupInteractivity() {
    const handleStart = (clientX, clientY) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const handleMove = (clientX, clientY) => {
      if (!this.isDragging || !this.toothGroup) return;
      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.toothGroup.rotation.y += deltaX * this.rotationSpeed;
      this.toothGroup.rotation.x += deltaY * this.rotationSpeed;
      this.toothGroup.rotation.x = Math.max(-0.6, Math.min(0.6, this.toothGroup.rotation.x));

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const handleEnd = () => {
      this.isDragging = false;
      clearTimeout(this.idleTimeout);
      this.idleTimeout = setTimeout(() => {
        this.autoRotate = true;
      }, 3000);
    };

    this.canvas.addEventListener('mousedown', e => handleStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleEnd);

    this.canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', handleEnd);
  }

  setLayer(layerName) {
    if (!this.toothGroup) return;

    if (layerName === 'all') {
      this.enamelMesh.material.opacity = 0.95;
      this.enamelMesh.material.transparent = true;
      this.pulpCanalsMesh.visible = true;
      this.gumTissueMesh.visible = true;
    } else if (layerName === 'root-canal') {
      this.enamelMesh.material.opacity = 0.28;
      this.enamelMesh.material.transparent = true;
      this.pulpCanalsMesh.visible = true;
      this.gumTissueMesh.visible = false;
      this.toothGroup.rotation.y = 0.2;
    } else if (layerName === 'gum-care') {
      this.enamelMesh.material.opacity = 0.9;
      this.pulpCanalsMesh.visible = false;
      this.gumTissueMesh.visible = true;
      this.toothGroup.rotation.x = -0.15;
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (this.autoRotate && this.toothGroup) {
      this.toothGroup.rotation.y += 0.004;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  initFallback2D() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = '16px Lora, serif';
    ctx.fillStyle = '#271329';
    ctx.textAlign = 'center';
    ctx.fillText('3D Interactive Tooth Station Initialized', this.canvas.width / 2, this.canvas.height / 2);
  }
}

window.initThreeToothViewer = function() {
  const viewer = new ToothViewer('threeToothCanvas');
  window.currentToothViewer = viewer;

  const layerButtons = document.querySelectorAll('.layer-toggle-btn');
  const layerInfoTitle = document.getElementById('layerInfoTitle');
  const layerInfoDesc = document.getElementById('layerInfoDesc');

  const layerData = {
    'all': {
      title: 'Complete Natural Tooth & Gingival Complex',
      desc: 'Featuring protective porcelain-grade enamel, dentinal tubules, root apex, and healthy supportive periodontal tissues.'
    },
    'root-canal': {
      title: 'Microscopic Endodontic Root Canal Anatomy',
      desc: 'Carl Zeiss 25x magnification exposes intricate micro-canals, eliminating infected pulp tissue with 100% precision and preserving your natural tooth roots.'
    },
    'gum-care': {
      title: 'Gingival Sulcus & Periodontal Wellness',
      desc: 'Biolase gentle laser therapy sterilizes 4-7mm periodontal pockets, eradicating anaerobic bacteria and re-attaching firm healthy pink gum tissue.'
    }
  };

  layerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      layerButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layer = btn.getAttribute('data-layer');
      if (viewer && viewer.setLayer) {
        viewer.setLayer(layer);
      }
      if (layerData[layer] && layerInfoTitle && layerInfoDesc) {
        layerInfoTitle.textContent = layerData[layer].title;
        layerInfoDesc.textContent = layerData[layer].desc;
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE !== 'undefined') {
    window.initThreeToothViewer();
  } else {
    window.addEventListener('load', () => {
      if (typeof THREE !== 'undefined') {
        window.initThreeToothViewer();
      }
    });
  }
});
