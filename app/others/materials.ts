import * as THREE from 'three';
import { MaterialGroup } from '../components/three-js/ThreeModelCore';


export const materialGroups: MaterialGroup[] = [
    {
        name: 'body',
        color: 0x222222,
        metalness: 0.85,
        roughness: 0.25,
        side: THREE.DoubleSide,
        meshes: ['Circle268', 'Circle268_1', 'Circle242', 'Circle265', 'Circle264', 'doorR001', 'doorL001',
            'Circle069', 'spoiler002', 'Circle241', 'hood-logo-base001', 'Cube055', 'Cube056',
            'door-handleL001', 'door-handleR001', 'Circle248', 'Circle247',
            // hood
            'hood-flap001',
            'front-splitter-deco001',
            //engine hood
            'engine-hood-dco001', 'engine-hood-vents001', 'engine-hood001',
            //other
            "fuel_filler-cap001",
            //mirrors
            'mirrorL001', 'mirrorR001'
        ]
    },
    {
        // Inne basic czarne elementy
        color: 0x000000,
        metalness: 0.85,
        roughness: 0.25,
        side: THREE.DoubleSide,
        meshes: [
            //other
            "whiperL001", "whiperR001", "side-vents001",
            //rim
            'front-wheels-rimL001', 'front-wheels-rimR001', 'front-wheels-rimL001', 'front-wheels-rimR001', 'back-wheels-rim001'
        ]
    },
    {
        // Szyba przednia
        color: 0x88aaff,
        metalness: 0.95,
        roughness: 0.1,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.4,
        meshes: ['Circle244', 'front-plastic002', 'back-plastic-glass001', 'blinker-plastic001']
    },
    {
        // Szyby drzwiowe (lewa i prawa)
        color: 0x88aaff,
        metalness: 0.95,
        roughness: 0.1,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.35,
        meshes: ['door-windshieldL001', 'door-windshieldR001']
    },
    {
        // Szyba tylna
        color: 0x335577,
        metalness: 0.9,
        roughness: 0.12,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.8,
        meshes: ['Circle082', 'Circle275']
    },
    {
        // Światła / blinkiery - wyłączone (czarne)
        color: 0x000000,
        metalness: 0.5,
        roughness: 0.5,
        emissive: 0x000000,
        emissiveIntensity: 0,
        meshes: ['blinker-lightL001', 'blinker-lightR001', 'blinker-light-ringL001', 'blinker-light-ringR001', 'back-blinkers002', 'back-blinkers003', 'mirror-blinkerR001', 'mirror-blinkerL001']
    },
    {
        // Opony
        color: 0x111111,
        metalness: 0.1,
        roughness: 0.8,
        meshes: ['Circle245_1', 'Circle246_1', 'Circle276_1'],
        //Circle276 Circle276_1 Circle276_2 Circle245
    },
    {
        // Wnętrze - fotele i wnętrze
        color: 0x222222,
        metalness: 0.3,
        roughness: 0.6,
        side: THREE.DoubleSide,
        meshes: ["interior-back-middle-vents001",
            "interior-back-seats001",
            "interior-back-vents001",
            "interior-door-screenL001",
            "interior-door-screenR001",
            "interior-door-ventsL001",
            "interior-door-ventsR001",
            "interior-floor001",
            "interior-front-middle-vents001",
            "interior-front-side-vents001",
            "interior-google-maps-screen001",
            "interior-hood-sprinklers-cap001",
            "interior-main-front-vents001",
            "interior-main-middle-vents-1001",
            "interior-main-middle-vents-2001",
            "interior-pedals001",
            "interior-plastic002",
            "interior-screens-base001",
            "interior-seatbelts-base-2001",
            "interior-seatbelts-base-3001",
            "interior-seatbelts-base001",
            "interior-side-vents001",
            "interior-speedometr001",
            "interior-seats001",
            "Cube026_1",
            "Cube026_2",
            //steering-wheel
            "interior-steering-wheel001",
            "Circle210",
            "Circle210_1",
            "Circle210_2",
            "Circle210_3",
            "interior-steering-whel-base001",
            //doors
            "interior-doorR001",
            "Circle230",
            "Circle230_1",
            "interior-door-ventsR001",
            "interior-doorL001",
            "Circle231",
            "Circle231_1",
            "interior-door-ventsL001",
            //middle-console
            "interior-middle-console001",
            "Circle220",
            "Circle220_1",
            "Circle220_2",
            "Circle220_3",
            "Circle239",
            //hood
            "interior-hood-base001",
            "Circle225",
            "Circle225_1",
            "Circle242_1"
        ]
    },
    {
        // Plastikowy element - niebieski
        color: 0x2255aa,
        metalness: 0.1,
        roughness: 0.7,
        meshes: ['interior-hood-sprinklers-cap001']
    },

    {
        // Wnętrze - deska rozdzielcza
        color: 0x333333,
        metalness: 0.2,
        roughness: 0.5,
        meshes: []
    },
    {
        // Kierownica
        color: 0x111111,
        metalness: 0.4,
        roughness: 0.3,
        meshes: []
    },
    {
        // Wydech
        color: 0x888888,
        metalness: 0.95,
        roughness: 0.2,
        side: THREE.DoubleSide,
        meshes: ['exhaust002', 'engine-parts001', 'Cube028_1', 'Cube028_2', 'Cube053', 'Cube053_1']
    },
    {
        // zaciski - ostre żółte
        color: 0xffdd44,
        metalness: 0.1,
        roughness: 0.8,
        emissive: 0xff6600,
        emissiveIntensity: 0.1,
        meshes: ['back-clampsL001', 'back-clampsR001', 'front-brake-discR002', 'front-brake-discL002', 'Circle210_2', 'Circle216', 'Circle216', 'Circle268_1']
    },

    {
        // tarcze - techniczny metal
        color: 0xaabbcc,
        metalness: 0.9,
        roughness: 0.3,
        meshes: ['front-brake-discR003', 'front-brake-discL003', 'back-brake-discL001', 'back-brake-discR001', 'Circle225_1', 'Circle242_2']
    },

    {
        // dyfuzory / grill - carbon look
        color: 0x2a2a2a,
        metalness: 0.35,
        roughness: 0.45,
        side: THREE.DoubleSide,
        meshes: ['front-grill001', 'back-splitter001']
    },
];

