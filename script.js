const MOLECULES = {
    water: {
        atoms: [
            { element: 'O', position: [0, 0, 0], color: 0xff0000 },
            { element: 'H', position: [-0.8, 0.6, 0], color: 0xffffff },
            { element: 'H', position: [0.8, 0.6, 0], color: 0xffffff }
        ],
        bonds: [[0, 1], [0, 2]],
        info: 'Water molecule (H₂O) - Bent geometry with ~104.5° angle. It is soluble in various compound and that is the reason it is called universal solvent'
    },
    methane: {
        atoms: [
            { element: 'C', position: [0, 0, 0], color: 0x0000ff },
            { element: 'H', position: [0.8, 0.8, 0.8], color: 0xffffff },
            { element: 'H', position: [-0.8, -0.8, 0.8], color: 0xffffff },
            { element: 'H', position: [0.8, -0.8, -0.8], color: 0xffffff },
            { element: 'H', position: [-0.8, 0.8, -0.8], color: 0xffffff }
        ],
        bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
        info: 'Methane (CH₄) - Tetrahedral geometry with 109.5° angles. '
    },
    ethanol: {
        atoms: [
            { element: 'C', position: [0, 0, 0], color: 0x808080 },
            { element: 'C', position: [1.54, 0, 0], color: 0x808080 },
            { element: 'O', position: [2.8, 0, 0], color: 0xff0000 },
            { element: 'H', position: [-0.4, 0.9, 0], color: 0xffffff },
            { element: 'H', position: [-0.4, -0.9, 0], color: 0xffffff },
            { element: 'H', position: [1.94, 0.9, 0], color: 0xffffff },
            { element: 'H', position: [1.94, -0.9, 0], color: 0xffffff },
            { element: 'H', position: [3.2, 0.9, 0 ], color: 0xffffff }
        ],
        bonds: [[0, 1], [1, 2], [0, 3], [0, 4], [1, 5], [1, 6], [2, 7]],
        info: 'Ethanol (C₂H₅OH) - Contains C-C single bond and C-O-H group. It is an alcohol'
    },
    ammonia: {
        atoms: [
            { element: 'N', position: [0, 0, 0], color: 0x0000ff },
            { element: 'H', position: [0.8, 0.6, 0], color: 0xffffff },
            { element: 'H', position: [-0.4, 0.6, 0.7], color: 0xffffff },
            { element: 'H', position: [-0.4, 0.6, -0.7], color: 0xffffff }
        ],
        bonds: [[0, 1], [0, 2], [0, 3]],
        info: 'Ammonia (NH₃) - Pyramidal geometry with 107° angles'
    },
    carbonDioxide: {
        atoms: [
            { element: 'C', position: [0, 0, 0], color: 0x808080 },
            { element: 'O', position: [1.2, 0, 0], color: 0xff0000 },
            { element: 'O', position: [-1.2, 0, 0], color: 0xff0000 }
        ],
        bonds: [[0, 1], [0, 2]],
        info: 'Carbon Dioxide (CO₂) - Linear geometry with double bonds'
    }
};

let scene, camera, renderer, molecule;
let isRotating = true;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Camera position
    camera.position.z = 5;

    // Controls
    document.getElementById('moleculeSelect').addEventListener('change', (e) => {
        createMolecule(e.target.value);
    });

    // Animation
    animate();
}

function createMolecule(moleculeName) {
    // Remove existing molecule
    if (molecule) {
        scene.remove(molecule);
    }

    if (!moleculeName || !MOLECULES[moleculeName]) return;

    molecule = new THREE.Group();
    const moleculeData = MOLECULES[moleculeName];

    // Create atoms
    moleculeData.atoms.forEach(atom => {
        const geometry = new THREE.SphereGeometry(atom.element === 'H' ? 0.2 : 0.3);
        const material = new THREE.MeshPhongMaterial({ color: atom.color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(...atom.position);
        molecule.add(sphere);
    });

    // Create bonds
    moleculeData.bonds.forEach(bond => {
        const [atom1, atom2] = bond;
        const start = new THREE.Vector3(...moleculeData.atoms[atom1].position);
        const end = new THREE.Vector3(...moleculeData.atoms[atom2].position);
        
        const direction = end.clone().sub(start);
        const length = direction.length();
        
        const geometry = new THREE.CylinderGeometry(0.05, 0.05, length);
        const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
        
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.copy(start);
        cylinder.position.lerp(end, 0.5);
        cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        
        molecule.add(cylinder);
    });

    scene.add(molecule);
    document.getElementById('info').textContent = moleculeData.info;
}

function toggleRotation() {
    isRotating = !isRotating;
}

function resetCamera() {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (molecule && isRotating) {
        molecule.rotation.y += 0.01;
        molecule.rotation.x += 0.005;
    }
    
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the scene
init();