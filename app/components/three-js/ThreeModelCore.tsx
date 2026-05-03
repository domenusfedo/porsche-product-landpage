'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { materialGroups } from '../../others/materials';
import LoaderOverlay from './LoaderOverlay';

interface PartConfig {
    name: string;
    axis: 'x' | 'y' | 'z';
    openValue: number;
    closedValue: number;
    position: { x: number; y: number; z: number };
}

interface ThreeModelCoreProps {
    isNight: boolean;
    setIsNight: (value: boolean) => void;
    onError?: () => void;
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

export default function ThreeModelCore({ isNight, setIsNight, onError }: ThreeModelCoreProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    const [isModelReady, isModelReadySet] = useState(false);
    const [openParts, setOpenParts] = useState<Set<string>>(new Set());
    const [partsPos, setPartsPos] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});
    const [isInteracting, setIsInteracting] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
    const mainLightRef = useRef<THREE.DirectionalLight | null>(null);
    const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
    const backLightRef = useRef<THREE.DirectionalLight | null>(null);
    const leftLightRef = useRef<THREE.PointLight | null>(null);
    const rightLightRef = useRef<THREE.PointLight | null>(null);
    const topLightRef = useRef<THREE.PointLight | null>(null);

    const ringLightsRef = useRef<THREE.MeshStandardMaterial[]>([]);
    const otherLightsRef = useRef<THREE.MeshStandardMaterial[]>([]);

    const bodyMeshesRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());
    const [currentColor, setCurrentColor] = useState('#222222');

    const animationRef = useRef<number | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                //@ts-ignore
                if (child instanceof THREE.Mesh && group.meshes.includes(child.name)) {
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
                    //@ts-ignore
                    child.material = material;

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

        if (metalness !== undefined && roughness !== undefined) {
            bodyMeshesRef.current.forEach((material) => {
                material.metalness = metalness;
                material.roughness = roughness;
            });
        }
    };

    const fixModelIssues = (model: THREE.Object3D, scene: THREE.Scene) => {
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

        const seatbelt = model.getObjectByName('interior-back-seatbelts001');
        if (seatbelt) {
            seatbelt.visible = false;
        }
    };

    const collectEmissiveParts = (model: THREE.Object3D) => {
        const ringNames = ['front-led-ring001', 'back-light-ring001'];
        const otherNames = ['main-lights001', 'main-light001', 'back-stop-light001'];

        ringLightsRef.current = [];
        otherLightsRef.current = [];

        model.traverse((child) => {
            //@ts-ignore
            if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {

                //@ts-ignore
                const oldMaterial = child.material;

                if (ringNames.includes(child.name)) {
                    //@ts-ignore
                    child.material = oldMaterial.clone();
                    //@ts-ignore
                    child.material.toneMapped = false;
                    //@ts-ignore
                    child.material.emissiveIntensity = 1;
                    //@ts-ignore
                    ringLightsRef.current.push(child.material);

                } else if (otherNames.includes(child.name)) {
                    //@ts-ignore
                    child.material = oldMaterial.clone();
                    //@ts-ignore
                    child.material.toneMapped = false;
                    //@ts-ignore
                    child.material.emissiveIntensity = isNight ? 50 : 1;
                    //@ts-ignore
                    otherLightsRef.current.push(child.material);
                }
            }
        });
    };

    const updateLighting = () => {
        if (isNight) {
            if (ambientLightRef.current) ambientLightRef.current.intensity = 0.15;
            if (mainLightRef.current) mainLightRef.current.intensity = 0.3;
            if (fillLightRef.current) fillLightRef.current.intensity = 0.2;
            if (backLightRef.current) backLightRef.current.intensity = 0.4;
            if (leftLightRef.current) leftLightRef.current.intensity = 0.15;
            if (rightLightRef.current) rightLightRef.current.intensity = 0.15;
            if (topLightRef.current) topLightRef.current.intensity = 0.1;

            ringLightsRef.current.forEach(mat => mat.emissiveIntensity = 100);
            otherLightsRef.current.forEach(mat => mat.emissiveIntensity = 100);
        } else {
            if (mainLightRef.current) mainLightRef.current.intensity = 2.5;
            if (fillLightRef.current) fillLightRef.current.intensity = 1.2;
            if (backLightRef.current) backLightRef.current.intensity = 0.8;
            if (leftLightRef.current) leftLightRef.current.intensity = 0.7;
            if (rightLightRef.current) rightLightRef.current.intensity = 0.7;
            if (topLightRef.current) topLightRef.current.intensity = 0.6;

            ringLightsRef.current.forEach(mat => mat.emissiveIntensity = 100);
            otherLightsRef.current.forEach(mat => mat.emissiveIntensity = 0);
        }
    };

    useEffect(() => {
        updateLighting();
    }, [isNight]);

    const toggleDayNight = () => {
        setIsNight(!isNight);
    };

    useEffect(() => {
        if (!mountRef.current) return;

        try {
            const scene = new THREE.Scene();
            scene.background = null;

            const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
            camera.position.set(3, 2, 5);
            camera.lookAt(0, 0.5, 0);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.toneMapping = THREE.ReinhardToneMapping;
            renderer.toneMappingExposure = 2.5;

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

            // Ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
            ambientLightRef.current = ambientLight;
            scene.add(ambientLight);

            // Main light
            const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
            mainLight.position.set(3, 5, 2);
            mainLightRef.current = mainLight;
            scene.add(mainLight);

            // Fill light
            const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
            fillLight.position.set(0, 2, 4);
            fillLightRef.current = fillLight;
            scene.add(fillLight);

            // Back light
            const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
            backLight.position.set(0, 1.5, -4);
            backLightRef.current = backLight;
            scene.add(backLight);

            // Left light
            const leftLight = new THREE.PointLight(0xffffff, 0.7);
            leftLight.position.set(-4, 2, 1);
            leftLightRef.current = leftLight;
            scene.add(leftLight);

            // Right light
            const rightLight = new THREE.PointLight(0xffffff, 0.7);
            rightLight.position.set(4, 2, 1);
            rightLightRef.current = rightLight;
            scene.add(rightLight);

            // Top light
            const topLight = new THREE.PointLight(0xffffff, 0.6);
            topLight.position.set(0, 4, 0);
            topLightRef.current = topLight;
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

            isModelReadySet(false)

            timeoutRef.current = setTimeout(() => {
                loader.load('/3d-model/porsche.glb', (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(1, 1, 1);
                    model.position.set(0, 0, 0);
                    scene.add(model);
                    modelRef.current = model;

                    fixModelIssues(model, scene);
                    applyMaterials(model);
                    collectEmissiveParts(model);

                    updateLighting();
                    updateAllHotspotPositions();
                    setIsModelLoaded(true);
                    isModelReadySet(true)
                }, undefined, (error) => {
                    console.error('Error loading model:', error);
                    isModelReadySet(true)
                    if (onError) onError();
                });
            }, 3000);


            const updatePartHotspotPosition = (partConfig: PartConfig) => {
                if (!modelRef.current || !mountRef.current || !controlsRef.current) return;

                const partObject = modelRef.current.getObjectByName(partConfig.name);
                if (!partObject) return;

                const vector = partObject.position.clone();
                const camera = controlsRef.current.object;
                //@ts-ignore
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

                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                renderer.dispose();
            };
        } catch (error) {
            console.error('Error initializing 3D scene:', error);
            if (onError) onError();
        }
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
                <div ref={mountRef} className="w-full aspect-square relative" style={{ background: 'transparent' }} />
                {!isModelReady ? <LoaderOverlay /> : <>
                    <div className="absolute top-16 right-4 flex flex-col gap-2 z-10">
                        <button
                            onClick={toggleDayNight}
                            className="w-10 h-10 bg-black/70 hover:bg-black text-white rounded-full backdrop-blur-sm transition-all cursor-pointer flex items-center justify-center"
                            type="button"
                        >
                            {isNight ? (
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="4" strokeWidth="2" />
                                    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" strokeWidth="2" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path
                                        d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {isModelLoaded && partsConfig.map((partConfig) => {
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
                </>}

            </div>
        </div>
    );
}