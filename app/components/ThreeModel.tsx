'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { materialGroups } from '../others/materials';

interface PartConfig {
    name: string;
    axis: 'x' | 'y' | 'z';
    openValue: number;
    closedValue: number;
    position: { x: number; y: number; z: number };
}

export interface MaterialGroup {
    name?: string;
    color: number;
    metalness: number;
    roughness: number;
    emissive?: number;
    emissiveIntensity?: number;
    transparent?: boolean;
    opacity?: number;
    side?: THREE.Side;
    meshes: string[];
}

export default function ThreeModel() {
    const mountRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    const [openParts, setOpenParts] = useState<Set<string>>(new Set());
    const [partsPos, setPartsPos] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});
    const [isInteracting, setIsInteracting] = useState(false);
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const bodyMeshesRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());
    const [currentColor, setCurrentColor] = useState('#FF4789');

    const animationRef = useRef<number | null>(null);

    const animateColorTransition = (fromColor: string, toColor: string, duration: number = 500) => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        const startColor = new THREE.Color(fromColor);
        const endColor = new THREE.Color(toColor);
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            const currentColor = startColor.clone().lerp(endColor, eased);

            bodyMeshesRef.current.forEach((material) => {
                material.color.copy(currentColor);
            });

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                animationRef.current = null;
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const partsConfig: PartConfig[] = [
        {
            name: 'hood-flap001',
            axis: 'x',
            openValue: -0.87,
            closedValue: 0,
            position: { x: -0.8, y: 0.3, z: 1.2 }
        },
        {
            name: 'doorL001',
            axis: 'y',
            openValue: -0.87,
            closedValue: 0,
            position: { x: -1.2, y: 0.2, z: 0 }
        },
        {
            name: 'doorR001',
            axis: 'y',
            openValue: 0.87,
            closedValue: 0,
            position: { x: 1.2, y: 0.2, z: 0 }
        },
        {
            name: 'engine-hood001',
            axis: 'x',
            openValue: -0.78,
            closedValue: 0,
            position: { x: 0, y: 0.2, z: -1.2 }
        },
        {
            name: 'fuel_filler-cap001',
            axis: 'z',
            openValue: -1.74,
            closedValue: -0.05,
            position: { x: 0, y: 0.2, z: -1.2 }
        }
    ];

    const colors = [
        { name: 'Black', value: '#222222', metalness: 0.85, roughness: 0.25 },
        { name: 'Signal Yellow', value: '#ffdd44', metalness: 0.4, roughness: 0.35 },
        { name: 'Verde Mantis', value: '#00FF66', metalness: 0.4, roughness: 0.35 },
    ];


    const createShadowTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
            gradient.addColorStop(0, 'rgba(0,0,0,0.6)');
            gradient.addColorStop(0.5, 'rgba(0,0,0,0.2)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);
        }
        return new THREE.CanvasTexture(canvas);
    };

    const applyMaterials = (model: THREE.Object3D) => {
        materialGroups.forEach(group => {
            model.traverse((child) => {
                if (child.isMesh && group.meshes.includes(child.name)) {
                    const materialProps: any = {
                        color: group.color,
                        metalness: group.metalness,
                        roughness: group.roughness,
                        emissive: group.emissive || 0x000000,
                        emissiveIntensity: group.emissiveIntensity || 0
                    };

                    if (group.transparent) {
                        materialProps.transparent = true;
                        materialProps.opacity = group.opacity || 0.5;
                    }

                    if (group.side) {
                        materialProps.side = group.side;
                    }

                    const material = new THREE.MeshStandardMaterial(materialProps);
                    child.material = material;

                    // Zapisz referencję jeśli to karoseria
                    if (group.name === 'body') {
                        bodyMeshesRef.current.set(child.name, material);
                    }
                }
            });
        });
    };

    const changeBodyColor = (color: string, metalness?: number, roughness?: number) => {
        animateColorTransition(currentColor, color, 400);
        setCurrentColor(color);

        // Jeśli przekazano parametry metalness/roughness, zaktualizuj materiał
        if (metalness !== undefined && roughness !== undefined) {
            bodyMeshesRef.current.forEach((material) => {
                material.metalness = metalness;
                material.roughness = roughness;
            });
        }
    };

    const fixModelIssues = (model: THREE.Object3D, scene: THREE.Scene) => {
        // 1. Dziura w wydechu - zaślepka
        const exhaustPart = model.getObjectByName('Cube028_2');
        if (exhaustPart) {
            const exhaustPos = exhaustPart.position.clone();
            const exhaustRot = exhaustPart.rotation.clone();

            const plugGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.02);
            const plugMaterial = new THREE.MeshStandardMaterial({
                color: 0x111111,
                metalness: 0.2,
                roughness: 0.8
            });
            const plug = new THREE.Mesh(plugGeometry, plugMaterial);

            plug.position.copy(exhaustPos);
            plug.rotation.copy(exhaustRot);
            plug.position.z += -1.3;
            plug.position.y -= -0.2;

            scene.add(plug);
        }

        // Tu możesz dodawać kolejne "brzydkie" poprawki
        // np.:
        // - przykrywanie dziur
        // - dorabianie brakujących elementów
        // - korekta pozycji niektórych części
    };


    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF3F4F6);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(3, 2, 5);
        camera.lookAt(0, 0.5, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });

        const updateSize = () => {
            if (!mountRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = width;

            renderer.setSize(width, height);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        updateSize();
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 0.8;
        controls.panSpeed = 0.5;
        controls.enableZoom = true;
        controls.enablePan = true;

        controls.minDistance = 5;
        controls.maxDistance = 6;

        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = Math.PI / 6;

        controls.target.set(0, 0.5, 0);

        controls.update();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
        mainLight.position.set(3, 5, 2);
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
        fillLight.position.set(0, 2, 4);
        scene.add(fillLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
        backLight.position.set(0, 1.5, -4);
        scene.add(backLight);

        const leftLight = new THREE.PointLight(0xffffff, 0.7);
        leftLight.position.set(-4, 2, 1);
        scene.add(leftLight);

        const rightLight = new THREE.PointLight(0xffffff, 0.7);
        rightLight.position.set(4, 2, 1);
        scene.add(rightLight);

        const topLight = new THREE.PointLight(0xffffff, 0.6);
        topLight.position.set(0, 4, 0);
        scene.add(topLight);

        const shadowGeometry = new THREE.CircleGeometry(2.0, 32);
        const shadowMaterial = new THREE.MeshStandardMaterial({
            map: createShadowTexture(),
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const shadowDisc = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadowDisc.rotation.x = -Math.PI / 2;
        shadowDisc.position.y = -0.14;
        scene.add(shadowDisc);

        const loader = new GLTFLoader();

        loader.load('/3d-model/porsche.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            scene.add(model);
            modelRef.current = model;

            fixModelIssues(model, scene);
            applyMaterials(model);

            updateAllHotspotPositions();
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });

        const updatePartHotspotPosition = (partConfig: PartConfig) => {
            if (!modelRef.current || !mountRef.current || !controlsRef.current) return;

            const partObject = modelRef.current.getObjectByName(partConfig.name);
            if (!partObject) return;

            const vector = partObject.position.clone();
            const camera = controlsRef.current.object;
            vector.project(camera);

            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;

            const screenX = (vector.x * 0.5 + 0.5) * width;
            const screenY = (-vector.y * 0.5 + 0.5) * height;

            setPartsPos(prev => ({
                ...prev,
                [partConfig.name]: {
                    x: screenX,
                    y: screenY,
                    visible: vector.z < 1
                }
            }));
        };

        const updateAllHotspotPositions = () => {
            partsConfig.forEach(config => updatePartHotspotPosition(config));
        };

        const handleStartInteraction = () => {
            setIsInteracting(true);
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
        };

        const handleEndInteraction = () => {
            interactionTimeoutRef.current = setTimeout(() => {
                setIsInteracting(false);
                updateAllHotspotPositions();
            }, 300);
        };

        if (controlsRef.current) {
            controlsRef.current.addEventListener('start', handleStartInteraction);
            controlsRef.current.addEventListener('end', handleEndInteraction);
            controlsRef.current.addEventListener('change', updateAllHotspotPositions);
        }

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);

            if (!isInteracting && modelRef.current) {
                updateAllHotspotPositions();
            }
        };

        animate();

        const handleResize = () => {
            updateSize();
            updateAllHotspotPositions();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (controlsRef.current) {
                controlsRef.current.removeEventListener('start', handleStartInteraction);
                controlsRef.current.removeEventListener('end', handleEndInteraction);
                controlsRef.current.removeEventListener('change', updateAllHotspotPositions);
            }
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
            controls.dispose();
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    const animatePart = (partConfig: PartConfig, targetValue: number) => {
        if (!modelRef.current) return;

        const part = modelRef.current.getObjectByName(partConfig.name);
        if (!part) {
            console.error('Part not found:', partConfig.name);
            return;
        }

        let startRotation: number;
        if (partConfig.axis === 'x') startRotation = part.rotation.x;
        else if (partConfig.axis === 'y') startRotation = part.rotation.y;
        else startRotation = part.rotation.z;

        const endRotation = targetValue;
        const duration = 600;
        const startTime = performance.now();

        const animateRotation = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const newRotation = startRotation + (endRotation - startRotation) * easeProgress;

            if (partConfig.axis === 'x') part.rotation.x = newRotation;
            else if (partConfig.axis === 'y') part.rotation.y = newRotation;
            else part.rotation.z = newRotation;

            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            }
        };

        requestAnimationFrame(animateRotation);
    };

    const togglePart = (partConfig: PartConfig) => {
        if (openParts.has(partConfig.name)) {
            animatePart(partConfig, partConfig.closedValue);
            setOpenParts(prev => {
                const newSet = new Set(prev);
                newSet.delete(partConfig.name);
                return newSet;
            });
        } else {
            animatePart(partConfig, partConfig.openValue);
            setOpenParts(prev => new Set(prev).add(partConfig.name));
        }
    };

    const handleZoomIn = () => {
        if (controlsRef.current) {
            const camera = controlsRef.current.object;
            const currentDistance = camera.position.length();
            const newDistance = Math.max(controlsRef.current.minDistance, currentDistance - 0.3);
            const direction = camera.position.clone().normalize();
            camera.position.copy(direction.multiplyScalar(newDistance));
            controlsRef.current.update();
        }
    };

    const handleZoomOut = () => {
        if (controlsRef.current) {
            const camera = controlsRef.current.object;
            const currentDistance = camera.position.length();
            const newDistance = Math.min(controlsRef.current.maxDistance, currentDistance + 0.3);
            const direction = camera.position.clone().normalize();
            camera.position.copy(direction.multiplyScalar(newDistance));
            controlsRef.current.update();
        }
    };

    return (
        <div className="relative w-full flex justify-center items-center">
            <div className="relative w-full max-w-[1000px]">
                <div ref={mountRef} className="w-full aspect-square relative" />

                {partsConfig.map((partConfig) => {
                    const pos = partsPos[partConfig.name];
                    if (!pos || !pos.visible || isInteracting) return null;

                    return (
                        <button
                            key={partConfig.name}
                            onClick={() => togglePart(partConfig)}
                            className="absolute w-6 h-6 bg-white/40 hover:bg-white/70 rounded-full backdrop-blur-sm transition-all cursor-pointer"
                            style={{
                                left: pos.x - 12,
                                top: pos.y - 12,
                            }}
                        />
                    );
                })}

                <div className="absolute bottom-16 right-4 flex flex-wrap justify-end gap-2 z-10 max-w-[120px]">
                    {colors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => changeBodyColor(color.value, color.metalness, color.roughness)}
                            className={`w-8 h-8 rounded-full border-2 shadow-lg transition-transform hover:scale-110 ${currentColor === color.value ? 'border-white scale-110' : 'border-gray-400'
                                }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>

                <div className="absolute bottom-16 left-4 flex flex-col gap-2 z-10">
                    <button
                        onClick={handleZoomIn}
                        className="w-10 h-10 bg-black/70 hover:bg-black text-white text-xl font-bold rounded-full backdrop-blur-sm transition-all cursor-pointer"
                        type="button"
                    >
                        +
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="w-10 h-10 bg-black/70 hover:bg-black text-white text-xl font-bold rounded-full backdrop-blur-sm transition-all cursor-pointer"
                        type="button"
                    >
                        -
                    </button>
                </div>
            </div>
        </div>
    );
}