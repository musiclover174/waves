import * as THREE from 'three';
// import { TweenMax, TimelineMax } from "gsap/TweenMax";

// const OrbitControls = require('three-orbit-controls')(THREE);

export default class Waves {
  constructor() {
    // scene initialize
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // camera initialize
    this.camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      1,
      3000,
    );
    this.camera.position.z = 300;

    // renderer initialize
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerWidth);

    // make container append
    this.container = document.querySelector('.container');
    this.container.appendChild(this.renderer.domElement);

    // helpers
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.axesHelper = new THREE.AxesHelper(100);
    // this.scene.add(this.axesHelper);

    // settings
    this.spacer = 100;
    this.pointAmount = 50;
    this.mouseX = -50;
    this.mouseY = 150;

    this.time = 0;

    this.eventsListener();
    this.resize();
    this.addObjects();
    this.animate();
  }

  eventsListener() {
    window.addEventListener('resize', this.resize.bind(this));
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    document.addEventListener('touchstart', this.onDocumentTouch.bind(this), false);
    document.addEventListener('touchmove', this.onDocumentTouch.bind(this), false);
  }

  onDocumentMouseMove(e) {
    this.mouseX = window.innerWidth / 2 - e.clientX;
    this.mouseY = window.innerHeight / 2 - e.clientY;
  }

  onDocumentTouch(e) {
    if (e.touches.length === 1) {
      this.mouseX = window.innerWidth / 2 - e.touches[0].pageX;
      this.mouseY = window.innerHeight / 2 - e.touches[0].pageY;
    }
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    this.texture = new THREE.TextureLoader().load('i/particle.png');
    this.material = new THREE.PointsMaterial({
      size: 10,
      color: 0xffffff,
      map: this.texture,
      alphaTest: 0.5,
    });
    this.geometry = new THREE.Geometry();

    for (let x = 0; x < this.pointAmount; x += 1) {
      for (let y = 0; y < this.pointAmount; y += 1) {
        this.geometry.vertices.push(
          new THREE.Vector3(
            x * this.spacer - (this.pointAmount * this.spacer / 2),
            0,
            y * this.spacer - (this.pointAmount * this.spacer / 2),
          ),
        );
      }
    }

    this.instance = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.instance);
  }

  animate() {
    const that = this;

    this.time += 0.05;

    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouseY - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    requestAnimationFrame(this.animate.bind(this));
    this.geometry.vertices.forEach((particle, index) => {
      particle.add(new THREE.Vector3(0, Math.sin(that.time + index / 4) * 2, 0));
    });
    this.geometry.verticesNeedUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }
}

const wave = new Waves();
