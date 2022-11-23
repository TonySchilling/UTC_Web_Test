import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
// import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
// import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
// import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';


export default class SceneInit {
    constructor(canvasId) {
      // NOTE: Core components to initialize Three.js app.
      this.scene = undefined;
      this.camera = undefined;
      this.renderer = undefined;

      //New stuff

      // this.renderScene = new RenderPass(this.scene, this.camera);
      // this.composer = new EffectComposer(renderer);
      // this.composer.addPass(this.renderScene);

  
      // NOTE: Camera params;
      this.fov = 45;
      this.nearPlane = 1;
      this.farPlane = 1000;
      this.canvasId = canvasId;
  
      // NOTE: Additional components.
      this.clock = undefined;
      this.stats = undefined;
      this.controls = undefined;
  
      // NOTE: Lighting is basically required.
      this.ambientLight = undefined;
      this.directionalLight = undefined;
      this.directionalLighttwo = undefined;
  
      // Background cubemap
    //   this.loader = new THREE.CubeTextureLoader();
    //   this.texture = this.loader.load([
    //     './assets/pics/yellowcloud_rt.jpg',
    //     './assets/pics/yellowcloud_lf.jpg',
    //     './assets/pics/yellowcloud_up.jpg',
    //     './assets/pics/yellowcloud_dn.jpg',
    //     './assets/pics/yellowcloud_bk.jpg',
    //     './assets/pics/yellowcloud_ft.jpg',
    //   ]);
  
    //   // HDRI
  
      // this.hdriLoader = new RGBELoader();
      // this.hdritext = this.hdriLoader.load('./assets/pics/NewCartoonHDR.hdr', function (texture) {
      //     texture.mapping = THREE.EquirectangularReflectionMapping;
      //   });
    }
  
  
    initialize() {
      this.scene = new THREE.Scene();
    //   this.scene.background = this.texture
    //   this.scene.background = this.hdritext
    //   this.scene.environment = this.hdritext
      this.camera = new THREE.PerspectiveCamera(
        this.fov,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.z = 60;
      this.camera.position.y = 25;
  
      // NOTE: Specify a canvas which is already created in the HTML.
      const canvas = document.getElementById(this.canvasId);
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        // NOTE: Anti-aliasing smooths out the edges.
        antialias: true,
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // this.renderer.shadowMap.enabled = true;
      document.body.appendChild(this.renderer.domElement);


      //NEW STUFF
  
      this.clock = new THREE.Clock();
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.stats = Stats();
      document.body.appendChild(this.stats.dom);
  
      // ambient light which is for the whole scene
      this.ambientLight = new THREE.AmbientLight(0xffffff, 10);
      this.ambientLight.castShadow = true;
      // this.scene.add(this.ambientLight);
  
      // directional light - parallel sun rays
      this.directionalLight = new THREE.DirectionalLight(0xffffff, .8);
      this.directionalLight.castShadow = true;
      this.directionalLight.position.set(0,10,10);
  
      this.directionalLighttwo = new THREE.DirectionalLight(0xffffff, .8);
      // this.directionalLight.castShadow = true;
      this.directionalLighttwo.position.set(0,10,-10);
     
      this.scene.add(this.directionalLight);
      this.scene.add(this.directionalLighttwo);
      
      // if window resizes
      window.addEventListener('resize', () => this.onWindowResize(), false);
  
      // NOTE: Load space background.
      // this.loader = new THREE.TextureLoader();
      // this.scene.background = this.loader.load('./pics/space.jpeg');
  
      // NOTE: Declare uniforms to pass into glsl shaders.
      // this.uniforms = {
      //   u_time: { type: 'f', value: 1.0 },
      //   colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
      //   colorA: { type: 'vec3', value: new THREE.Color(0xffffff) },
      // };
    }
  
    animate() {
      // NOTE: Window is implied.
      // requestAnimationFrame(this.animate.bind(this));
      window.requestAnimationFrame(this.animate.bind(this));
      this.render();
      this.stats.update();
      this.controls.update();

      // this.composer.render()
      // window.requestAnimationFrame(this.animate.bind(this));
    }
    // animate();
  
    render() {
      // NOTE: Update uniform data on each render.
      // this.uniforms.u_time.value += this.clock.getDelta();
      this.renderer.render(this.scene, this.camera);
    }
  
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  