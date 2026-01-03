import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* --- DETECÇÃO DE TOUCH --- */
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const canvasContainer = document.getElementById('canvas-container');
if (isTouchDevice) {
    document.body.classList.add('is-touch');
    canvasContainer.classList.add('touch-locked');
} else {
    canvasContainer.style.pointerEvents = 'auto';
}

/* --- CONTROLES MOBILE --- */
const enableBtn = document.getElementById('enable-3d-btn');
const disableBtn = document.getElementById('disable-3d-btn');
if(enableBtn && disableBtn) {
    enableBtn.addEventListener('click', () => {
        canvasContainer.classList.remove('touch-locked');
        canvasContainer.classList.add('touch-active');
        enableBtn.classList.add('hidden');
        disableBtn.classList.remove('hidden');
    });
    disableBtn.addEventListener('click', () => {
        canvasContainer.classList.remove('touch-active');
        canvasContainer.classList.add('touch-locked');
        disableBtn.classList.add('hidden');
        enableBtn.classList.remove('hidden');
    });
}

/* --- THEME LOGIC --- */
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
function applyInitialTheme() {
    const saved = localStorage.getItem('theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && sysDark)) body.classList.add('dark-mode');
}
applyInitialTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if(!localStorage.getItem('theme')) e.matches ? body.classList.add('dark-mode') : body.classList.remove('dark-mode');
});
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

/* --- CAROUSEL DRAG --- */
const slider = document.querySelector('.gallery-carousel');
let isDown = false; let startX; let scrollLeft;
slider.addEventListener('mousedown', (e) => { isDown = true; slider.classList.add('active'); startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
slider.addEventListener('mousemove', (e) => { if(!isDown) return; e.preventDefault(); const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk; });

/* --- I18N --- */
const translations = {
    en: {
        // NAVEGAÇÃO
        nav_specs: "SPECS", 
        nav_gallery: "GALLERY", 
        
        // HERO SECTION
        hero_title: "LIQUID<br>CHROME",
        finish: "FINISH: POLISHED SILVER", 
        drag_hint: "[ DRAG TO ROTATE ]", // Texto para Desktop
        enable_3d: "ENABLE 3D",          // Botão Mobile
        disable_3d: "EXIT 3D VIEW",      // Botão Mobile
        
        // DESCRIÇÃO (NARRATIVA)
        desc_title: "SCULPTED<br>VELOCITY.",
        desc_subtitle: "THE PHIL FRANK LEGACY / CIRCA 2002",
        
        desc_text_1: "Executed in brushed stainless steel, the D-Line abandons traditional watch geometry. Its seamless 'liquid metal' architecture unifies the bracelet and the digital module into a single, aerodynamic form designed for motion.",
        
        desc_text_2: "The angled interface isn't just aesthetic; it's a driver-focused ergonomic feature allowing for instant data readability at high speeds. A monolithic artifact of the Y2K industrial design era.",
        
        // ESPECIFICAÇÕES TÉCNICAS
        tech_title: "TECHNICAL SPECIFICATIONS",
        spec_case: "CONSTRUCTION",
        spec_finish: "FINISH",
        spec_display: "DISPLAY OPTICS",
        spec_glass: "LENS",
        spec_mov: "ENGINE",
        spec_dim: "DIMENSIONS",
        spec_wr: "WATER RATING",
        spec_mat: "MATERIAL", // Caso uses a versão curta nalgum sítio
        spec_int: "INTERFACE",
        spec_yr: "YEAR",

        // GALERIA
        gallery_title: "ARCHIVE VISUALS"
    },
    pt: {
        // NAVEGAÇÃO
        nav_specs: "ESPECIFICAÇÕES", 
        nav_gallery: "GALERIA", 
        
        // HERO SECTION
        hero_title: "CROMADO<br>LÍQUIDO",
        finish: "ACABAMENTO: PRATA POLIDO", 
        drag_hint: "[ ARRASTE PARA GIRAR ]",
        enable_3d: "ATIVAR 3D", 
        disable_3d: "SAIR DO 3D",
        
        // DESCRIÇÃO (NARRATIVA)
        desc_title: "VELOCIDADE<br>ESCULPIDA.",
        desc_subtitle: "O LEGADO DE PHIL FRANK / CIRCA 2002",
        
        desc_text_1: "Executado em aço inoxidável escovado, o D-Line abandona a geometria tradicional. A sua arquitetura de 'metal líquido' unifica a pulseira e o módulo digital numa forma única e aerodinâmica, desenhada para o movimento.",
        
        desc_text_2: "A interface angulada não é apenas estética; é um recurso ergonômico focado na pilotagem, permitindo leitura instantânea em alta velocidade. Um artefacto monolítico da era do design industrial Y2K.",
        
        // ESPECIFICAÇÕES TÉCNICAS
        tech_title: "ESPECIFICAÇÕES TÉCNICAS",
        spec_case: "CONSTRUÇÃO",
        spec_finish: "ACABAMENTO",
        spec_display: "ÓTICA DO DISPLAY",
        spec_glass: "LENTE",
        spec_mov: "MOTOR",
        spec_dim: "DIMENSÕES",
        spec_wr: "RESISTÊNCIA À ÁGUA",
        spec_mat: "MATERIAL",
        spec_int: "INTERFACE",
        spec_yr: "ANO",

        // GALERIA
        gallery_title: "ARQUIVO VISUAL"
    }
};
let currentLang = 'en';
function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('lang-toggle').innerText = lang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });
}
const browserLang = navigator.language || navigator.userLanguage;
if (browserLang.toLowerCase().startsWith('pt')) setLanguage('pt');
document.getElementById('lang-toggle').addEventListener('click', () => { setLanguage(currentLang === 'en' ? 'pt' : 'en'); });

/* --- THREE.JS SUPER OPTIMIZED --- */
const container = document.getElementById('canvas-container');
const loaderEl = document.getElementById('loader');
const progressBar = document.getElementById('progress-bar');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.02);
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 15);

// OTIMIZAÇÃO CRÍTICA: Configurações do Renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: !isTouchDevice, 
    alpha: true, 
    powerPreference: "high-performance",
    precision: isTouchDevice ? "mediump" : "highp"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(isTouchDevice ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = false; 

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
mainLight.position.set(5, 10, 5);
mainLight.castShadow = true;
// Sombras menores no mobile
const shadowSize = isTouchDevice ? 512 : 1024;
mainLight.shadow.mapSize.width = shadowSize;
mainLight.shadow.mapSize.height = shadowSize;
scene.add(mainLight);

const backLight = new THREE.SpotLight(0xffffff, 5.0);
backLight.position.set(0, 5, -10);
scene.add(backLight);

const loader = new GLTFLoader();
let model;

// IMPORTANTE: CAMINHO DO MODELO ATUALIZADO PARA assets/model.glb
loader.load('assets/model.glb', (gltf) => {
    model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).y, box.getSize(new THREE.Vector3()).z);
    const scale = 4.2 / maxDim;
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    model.rotation.y = -Math.PI / 6; model.rotation.x = Math.PI / 12;
    
    model.traverse((node) => {
        if (node.isMesh && node.material) {
            node.castShadow = true; node.receiveShadow = true;
            node.material.color.setHex(0xffffff);
            node.material.metalness = 1.0;
            node.material.roughness = 0.15;
            node.material.envMapIntensity = 2.5;
        }
    });
    scene.add(model);
    setTimeout(() => { loaderEl.style.opacity = '0'; setTimeout(() => { loaderEl.style.display = 'none'; }, 500); }, 500);
}, (xhr) => { progressBar.style.width = (xhr.loaded / xhr.total * 100) + '%'; });

// INTERSECTION OBSERVER
let isVisible = true;
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { isVisible = entry.isIntersecting; });
}, { threshold: 0.1 });
observer.observe(document.getElementById('hero'));

function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    controls.update();
    const isDark = document.body.classList.contains('dark-mode');
    const fogColor = isDark ? new THREE.Color(0x050505) : new THREE.Color(0xffffff);
    scene.fog.color.lerp(fogColor, 0.1);
    if (model) model.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});