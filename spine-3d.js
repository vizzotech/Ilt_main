// Initialize 3D Cervical Spine Model
function initializeSpine3D() {
  const container = document.getElementById('spine-3d-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = null;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, 80);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lighting - enhanced for better visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(30, 30, 30);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.4);
  pointLight.position.set(-30, 0, 30);
  scene.add(pointLight);

  // Create spine group
  const spineGroup = new THREE.Group();
  scene.add(spineGroup);

  // Materials
  const boneColor = 0xe8d4c0;
  const boneMaterial = new THREE.MeshPhongMaterial({
    color: boneColor,
    shininess: 120,
    side: THREE.DoubleSide
  });

  const discColor = 0xff8c42;
  const discMaterial = new THREE.MeshPhongMaterial({
    color: discColor,
    shininess: 80,
    side: THREE.DoubleSide
  });

  // Vertebra positions (C1-C7)
  const vertebraeData = [
    { y: 42, size: 1.0, name: 'C1' },
    { y: 33, size: 1.1, name: 'C2' },
    { y: 24, size: 1.2, name: 'C3' },
    { y: 15, size: 1.3, name: 'C4' },
    { y: 6, size: 1.35, name: 'C5' },
    { y: -3, size: 1.3, name: 'C6' },
    { y: -12, size: 1.2, name: 'C7' }
  ];

  // Create vertebrae
  vertebraeData.forEach((data, index) => {
    const vertebra = createRealisticVertebra(data.size, boneMaterial);
    vertebra.position.y = data.y;
    vertebra.castShadow = true;
    vertebra.receiveShadow = true;
    spineGroup.add(vertebra);

    // Add disc between vertebrae
    if (index < vertebraeData.length - 1) {
      const nextData = vertebraeData[index + 1];
      const discY = (data.y + nextData.y) / 2;
      const disc = createIntervertebralDisc(data.size * 0.75, discMaterial);
      disc.position.y = discY;
      disc.castShadow = true;
      disc.receiveShadow = true;
      spineGroup.add(disc);
    }
  });

  // Animation variables
  let time = 0;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    time += 0.01;

    // Rotating animation
    spineGroup.rotation.x = Math.sin(time * 0.5) * 0.3;
    spineGroup.rotation.z = Math.cos(time * 0.3) * 0.4;
    spineGroup.rotation.y += 0.004;

    renderer.render(scene, camera);
  }

  // Handle resize
  function onWindowResize() {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }

  window.addEventListener('resize', onWindowResize);

  // Start animation
  animate();
}

// Create a realistic vertebra
function createRealisticVertebra(size, material) {
  const group = new THREE.Group();

  // Vertebral body (main disc-like structure)
  const bodyGeometry = new THREE.CylinderGeometry(size * 0.45, size * 0.5, size * 0.6, 32);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Vertebral arch - posterior part
  const archGeometry = new THREE.BoxGeometry(size * 0.9, size * 0.4, size * 0.5);
  const arch = new THREE.Mesh(archGeometry, material);
  arch.position.z = size * 0.4;
  arch.castShadow = true;
  arch.receiveShadow = true;
  group.add(arch);

  // Laminae (sides of arch)
  const laminaGeometry = new THREE.BoxGeometry(size * 0.15, size * 0.35, size * 0.4);

  const leftLamina = new THREE.Mesh(laminaGeometry, material);
  leftLamina.position.set(-size * 0.35, 0, size * 0.3);
  leftLamina.castShadow = true;
  group.add(leftLamina);

  const rightLamina = new THREE.Mesh(laminaGeometry, material);
  rightLamina.position.set(size * 0.35, 0, size * 0.3);
  rightLamina.castShadow = true;
  group.add(rightLamina);

  // Spinous process (extending posteriorly)
  const spinousGeometry = new THREE.BoxGeometry(size * 0.2, size * 0.3, size * 0.8);
  const spinous = new THREE.Mesh(spinousGeometry, material);
  spinous.position.z = size * 0.7;
  spinous.castShadow = true;
  group.add(spinous);

  // Left transverse process
  const processGeometry = new THREE.BoxGeometry(size * 0.2, size * 0.15, size * 1.8);

  const leftProcess = new THREE.Mesh(processGeometry, material);
  leftProcess.position.set(-size * 0.6, size * 0.1, size * 0.1);
  leftProcess.rotation.z = 0.3;
  leftProcess.castShadow = true;
  group.add(leftProcess);

  // Right transverse process
  const rightProcess = new THREE.Mesh(processGeometry, material);
  rightProcess.position.set(size * 0.6, size * 0.1, size * 0.1);
  rightProcess.rotation.z = -0.3;
  rightProcess.castShadow = true;
  group.add(rightProcess);

  // Superior articular processes (facets)
  const facetGeometry = new THREE.BoxGeometry(size * 0.15, size * 0.15, size * 0.25);

  const leftFacetSup = new THREE.Mesh(facetGeometry, material);
  leftFacetSup.position.set(-size * 0.35, size * 0.25, size * 0.35);
  group.add(leftFacetSup);

  const rightFacetSup = new THREE.Mesh(facetGeometry, material);
  rightFacetSup.position.set(size * 0.35, size * 0.25, size * 0.35);
  group.add(rightFacetSup);

  // Inferior articular processes (facets)
  const leftFacetInf = new THREE.Mesh(facetGeometry, material);
  leftFacetInf.position.set(-size * 0.35, -size * 0.25, size * 0.35);
  group.add(leftFacetInf);

  const rightFacetInf = new THREE.Mesh(facetGeometry, material);
  rightFacetInf.position.set(size * 0.35, -size * 0.25, size * 0.35);
  group.add(rightFacetInf);

  return group;
}

// Create intervertebral disc
function createIntervertebralDisc(size, material) {
  const group = new THREE.Group();

  // Annulus fibrosus (outer ring)
  const annulusGeometry = new THREE.CylinderGeometry(size, size, 0.4, 32);
  const annulus = new THREE.Mesh(annulusGeometry, material);
  annulus.castShadow = true;
  annulus.receiveShadow = true;
  group.add(annulus);

  // Nucleus pulposus (inner core) - slightly different color
  const nucleusGeometry = new THREE.CylinderGeometry(size * 0.6, size * 0.6, 0.35, 32);
  const nucleusMaterial = new THREE.MeshPhongMaterial({
    color: 0xffa366,
    shininess: 60
  });
  const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
  nucleus.position.z = 0.05;
  nucleus.castShadow = true;
  group.add(nucleus);

  return group;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSpine3D);
} else {
  initializeSpine3D();
}
