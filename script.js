const MOLECULES = {
            water: {
                atoms: [
                    { element: 'O', position: [0, 0, 0], color: 0xff0000 },
                    { element: 'H', position: [-0.8, 0.6, 0], color: 0xffffff },
                    { element: 'H', position: [0.8, 0.6, 0], color: 0xffffff }
                ],
                bonds: [[0, 1], [0, 2]],
                info: {
                    formula: 'H₂O',
                    structure: 'Bent geometry',
                    angles: '104.5°',
                    properties: [
                        'Universal solvent',
                        'High heat capacity',
                        'Essential for life',
                        'Forms hydrogen bonds',
                        'Polar molecule'
                    ]
                }
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
                info: {
                    formula: 'CH₄',
                    structure: 'Tetrahedral',
                    angles: '109.5°',
                    properties: [
                        'Simplest hydrocarbon',
                        'Greenhouse gas',
                        'Natural gas component',
                        'Used in fuel production',
                        'Nonpolar molecule'
                    ]
                }
            },
            // Additional molecules continued in next message due to length...
            // ... (previous code remains the same until MOLECULES definition)

            ethanol: {
                atoms: [
                    { element: 'C', position: [0, 0, 0], color: 0x808080 },
                    { element: 'C', position: [1.54, 0, 0], color: 0x808080 },
                    { element: 'O', position: [2.8, 0, 0], color: 0xff0000 },
                    { element: 'H', position: [-0.4, 0.9, 0], color: 0xffffff },
                    { element: 'H', position: [-0.4, -0.9, 0], color: 0xffffff },
                    { element: 'H', position: [1.94, 0.9, 0], color: 0xffffff },
                    { element: 'H', position: [1.94, -0.9, 0], color: 0xffffff },
                    { element: 'H', position: [3.2, 0.9, 0], color: 0xffffff }
                ],
                bonds: [[0, 1], [1, 2], [0, 3], [0, 4], [1, 5], [1, 6], [2, 7]],
                info: {
                    formula: 'C₂H₅OH',
                    structure: 'Tetrahedral with C-C single bond',
                    angles: '109.5° (C-C-O)',
                    properties: [
                        'Common alcohol',
                        'Used as a solvent',
                        'Biofuel component',
                        'Antiseptic properties',
                        'Important industrial chemical'
                    ]
                }
            },
            ammonia: {
                atoms: [
                    { element: 'N', position: [0, 0, 0], color: 0x0000ff },
                    { element: 'H', position: [0.8, 0.6, 0], color: 0xffffff },
                    { element: 'H', position: [-0.4, 0.6, 0.7], color: 0xffffff },
                    { element: 'H', position: [-0.4, 0.6, -0.7], color: 0xffffff }
                ],
                bonds: [[0, 1], [0, 2], [0, 3]],
                info: {
                    formula: 'NH₃',
                    structure: 'Pyramidal',
                    angles: '107°',
                    properties: [
                        'Used in fertilizer production',
                        'Common cleaning agent',
                        'Industrial refrigerant',
                        'Polar molecule',
                        'Hydrogen bond donor'
                    ]
                }
            },
            carbonDioxide: {
                atoms: [
                    { element: 'C', position: [0, 0, 0], color: 0x808080 },
                    { element: 'O', position: [1.2, 0, 0], color: 0xff0000 },
                    { element: 'O', position: [-1.2, 0, 0], color: 0xff0000 }
                ],
                bonds: [[0, 1], [0, 2]],
                info: {
                    formula: 'CO₂',
                    structure: 'Linear',
                    angles: '180°',
                    properties: [
                        'Greenhouse gas',
                        'Used in carbonated beverages',
                        'Product of combustion',
                        'Critical in photosynthesis',
                        'Nonpolar molecule'
                    ]
                }
            }
        };

        let scene, camera, renderer, molecule;
        let isRotating = true;

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(document.getElementById('molecule-viewer').offsetWidth, 
                           document.getElementById('molecule-viewer').offsetHeight);
            document.getElementById('molecule-viewer').appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0x404040);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(1, 1, 1);
            scene.add(ambientLight);
            scene.add(directionalLight);

            camera.position.z = 5;

            document.getElementById('moleculeSelect').addEventListener('change', (e) => {
                createMolecule(e.target.value);
            });

            animate();
        }

        function createMolecule(moleculeName) {
            if (molecule) {
                scene.remove(molecule);
            }

            if (!moleculeName || !MOLECULES[moleculeName]) {
                clearInfo();
                return;
            }

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
            updateInfo(moleculeData.info);
        }

        function updateInfo(info) {
            document.getElementById('formula').textContent = info.formula;
            document.getElementById('structure').textContent = info.structure;
            document.getElementById('angles').textContent = info.angles;

            const applicationsList = document.getElementById('applications');
            applicationsList.innerHTML = '';
            info.properties.forEach(prop => {
                const li = document.createElement('li');
                li.textContent = prop;
                applicationsList.appendChild(li);
            });
        }

        function clearInfo() {
            document.getElementById('formula').textContent = '-';
            document.getElementById('structure').textContent = '-';
            document.getElementById('angles').textContent = '-';
            document.getElementById('applications').innerHTML = '';
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

        window.addEventListener('resize', () => {
            const viewer = document.getElementById('molecule-viewer');
            camera.aspect = viewer.offsetWidth / viewer.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(viewer.offsetWidth, viewer.offsetHeight);
        });

        init();