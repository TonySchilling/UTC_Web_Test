import { useState } from 'react'
import { useEffect } from 'react';
import reactLogo from './assets/react.svg'
//import './App.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'dat.gui';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';


import SceneInit from './lib/SceneInit';
import { Mesh } from 'three';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    // NEW SHIT
    const renderScene = new RenderPass(test.scene, test.camera);
    const composer = new EffectComposer(test.renderer);
    composer.addPass(renderScene);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      .4,
      .1,
      .1
    );
    composer.addPass(bloomPass);

    const bases = new THREE.Group();
    bases.userData.name = 'BasesGroup';

    const walls = new THREE.Group();
    const creators = new THREE.Group();
    const doors = new THREE.Group();
    const windows = new THREE.Group();
    const columns = new THREE.Group();
    const largeAssets = new THREE.Group();
    
    test.scene.add(bases);
    test.scene.add(walls);
    test.scene.add(creators);
    test.scene.add(columns);
    test.scene.add(windows);
    test.scene.add(doors);
    
    // var currentBase = null;
    var currentObject = null;

    // const boxGeometry = new THREE.BoxGeometry(24, 24, 24);
    // const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    // test.scene.add(boxMesh);


    const gui = new GUI();


    // var fs = require('fs');
    // var files = fs.readdirSync('./src/assets/models/base');
    // console.log(files);
    const baseAssets = { 'BioLab': 'Base_Biolab1', 'Cyberpunk': 'CP_Base', 'Cobblestone': 'Cobblestone' };
    const wallAssets = { Castle: 'CastleWall1', Cyberpunk: 'CyberpunkBrickWall', Tavern: 'TavernWall' };
    const windowAssets = { Cyberpunk:'CyberpunkWindow1'};
    const doorAssets = { Cyberpunk: 'CyberpunkDoor'};
    const columnAssets = { Cyberpunk: 'cyberpunkColumn'};
    // const windowAssets = { Castle: 'CastleWall1', Cyberpunk: 'CyberpunkBrickWall', Tavern: 'TavernWall' };
    // const doorAssets = { Castle: 'CastleWall1', Cyberpunk: 'CyberpunkBrickWall', Tavern: 'TavernWall' };
    const defaultValues = {base: 'Base_Biolab1', wall:'CastleWall1', window:'CyberpunkWindow1', door:'CyberpunkDoor', column: 'cyberpunkColumn'};
    const assetClasses = {base: baseAssets, wall:wallAssets, window:windowAssets, door:doorAssets, column:columnAssets,};
    let currentAssetClass = baseAssets;
    var assetPath = 'base';

    const assetTypeFolder = gui.addFolder('AssetType');

    var assetType = 'base';
    var text0 =
    {
        assetTypes: 'someName'
    }
    let assetTypedropdown = assetTypeFolder.add(text0, 'assetTypes', { Bases: 'base', Walls: 'wall', Doors: 'door', Window: 'window', Columns: 'column', LargeAssets: 'largeAsset' } ).onChange((value)=> {
      assetType = value;
      creators.traverse(function(obj) {

        if (obj.isMesh) {
          if (obj.name.includes(assetType)) {

            obj.visible = true;
            obj.layers.enable(0);
          }
          else {
            obj.visible = false;
            obj.layers.disable(0);
          }
        }

      });

      assetTypeFolder.removeFolder(assetFolder);
      assetFolder = assetTypeFolder.addFolder('Assets');

      let assetDropdown = assetFolder.add(assets, 'asset', assetClasses[assetType]).onChange((value) => {
        assetPath = value;
      });
      assetDropdown.setValue(defaultValues[assetType]);
      assetFolder.open()
      // currentAssetClass = assetClasses[assetType];

    });
    
    // var assetFolder = gui.addFolder('Assets');
    var assetFolder = assetTypeFolder.addFolder('Assets');
    var assets = {asset: 'someName'}
    let assetDropdown = assetFolder.add(assets, 'asset', currentAssetClass).onChange((value) => {
      assetPath = value;
    });

    // assetTypedropdown.setValue('base');
    assetTypeFolder.open();
    assetTypedropdown.setValue('base');

    var loadedModel;
    const glftLoader = new GLTFLoader();
    glftLoader.load('./src/assets/models/rsrcs/Background.gltf', (gltfScene) => {
      loadedModel = gltfScene;
      test.scene.add(gltfScene.scene);
      gltfScene.name = 'Background'
      
    });

    glftLoader.load('./src/assets/models/rsrcs/basePlanes3.gltf', (gltfScene) => {
      loadedModel = gltfScene;
      gltfScene.scene.position.y = 2;
      creators.add(gltfScene.scene);
    });

    // Import function
    function ImportModel(type, model, x,y,z, group, objectData, rot=0) {
      glftLoader.load(`./src/assets/models/${type}/${model}.gltf`, (gltfScene) => {

        gltfScene.scene.position.set(x,y,z);
        gltfScene.scene.rotation.y=rot;
        gltfScene.scene.children[0].material.color.set(0xff0000);
        gltfScene.scene.userData.name = objectData[0];
        gltfScene.scene.userData.type = objectData[1];
        gltfScene.scene.userData.parent = objectData[2];
        group.add(gltfScene.scene);
        currentObject = gltfScene.scene;
        console.log('Import Finished');
      });
    };

    ImportModel('rsrcs', 'wallPlanes', 0,0,0, creators,['wallCreators', 'creator', creators]);
    ImportModel('rsrcs', 'windowPlanes2', 0,0,0, creators,['windowCreators', 'creator', creators]);
    ImportModel('rsrcs', 'doorPlanes', 0,0,0, creators,['coorCreators', 'creator', creators]);
    ImportModel('rsrcs', 'columnPlane', 0,0,0, creators,['columnCreator', 'creator', creators]);
    // const testModel = TestImport('base', 'CP_Base', 20,0,0, bases,['TESTBASE', 'base', bases]);

    var testObject = creators;
    let editFolder = gui.addFolder('Edit');


    //CLEAR MATERIALS
    function ClearMaterials(group, color=0xdbdbdb) {
      group.traverse(function(obj) {
        if (obj.isMesh) {
          obj.material.color.set(color);
        }
      });
    }
    
    //DELETE EXISTING
    function DeleteExisting(group,x,z) {
      let existing = [];
      group.traverse(function(obj){
        if (obj.position.x == x && obj.position.z == z) {
          existing.push(obj);
        }
      })
      for (const e of existing) {
        group.remove(e);
      }
    }

    function DeleteAll(group) {
      let existing = [];

      group.traverse(function(obj) {
        existing.push(obj);
      });

      for (const e of existing) {
        group.remove(e);
      }

      test.scene.remove(group);
    }

    //Get Current Base
    function getCurrentBase(x,z) {
      let currentBase = '';
      bases.traverse(function(obj) {
      if (obj.userData.type == 'base' && obj.position.x == x && obj.position.z == z) {
        currentBase = obj;
      }
      })
      return currentBase;
    }

    // CLEAR MATS AND SET ACTIVE
    function setActive(obj) {
      ClearMaterials(bases);
      ClearMaterials(walls);
      ClearMaterials(columns);
      ClearMaterials(doors);
      ClearMaterials(windows);
      obj.material.color.set(0xff0000);
    }
    //MOVE CREATORS
    function moveObject(obj,x,z) {
      obj.position.x = x;
      obj.position.z = z;
    }


    function updateGUI(obj, asset_type) {

      gui.removeFolder(editFolder);
      editFolder = gui.addFolder('Edit');
      if (asset_type=='base') {
        editFolder.add(obj.scale, 'y', .5,2).name('Height');
        let rotFunc = {add:function() {obj.rotation.y += Math.PI/2}};
        editFolder.add(rotFunc, 'add').name('Rotate 90°');
      }
      if (asset_type=='wall') {
        editFolder.add(obj.scale, 'y', .5,2).name('Height');
        editFolder.add(obj.scale, 'z', .5,2).name('Thickness');
        editFolder.add(obj.scale, 'x', .5,1).name('Width');
      }
      if (asset_type=='column') {
        editFolder.add(obj.scale, 'z', .5,2).name('Thickness');
        editFolder.add(obj.scale, 'x', .5,2).name('Width');
        editFolder.add(obj.position, 'x', -5,5).name('X Location');
        editFolder.add(obj.position, 'z', -5,5).name('Z Location');
        editFolder.add(obj.rotation, 'y', 0, Math.PI).name('Rotation');
      }
      if (asset_type=='door') {
        editFolder.add(obj.scale, 'y', .5,2).name('Height');
        editFolder.add(obj.scale, 'z', .5,2).name('Thickness');
        editFolder.add(obj.scale, 'x', .5,3).name('Width');
        editFolder.add(obj.position, 'x', -4,4).name('X Location');

      }
      if (asset_type=='window') {
        editFolder.add(obj.scale, 'y', .5,2).name('Height');
        editFolder.add(obj.scale, 'z', .5,2).name('Thickness');
        editFolder.add(obj.scale, 'x', .5,2).name('Width');
        editFolder.add(obj.position, 'x', -4,4).name('X Location');
        editFolder.add(obj.position, 'y', -4,4).name('Y Location');

      }
      let deleteFunc = {add: function() {DeleteAll(obj.parent)}};
      editFolder.add(deleteFunc, 'add').name('Delete');
      editFolder.open();

    }

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(0);

    const onMouseMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, test.camera);
      const intersects = raycaster.intersectObjects(test.scene.children);
      let selectedName = '';
      let handVec = new THREE.Vector3();

      if (intersects.length > 0) {

        selectedName = intersects[0].object.name;
        console.log(selectedName);
        let testVec = intersects[0].object.getWorldPosition(handVec);
        testObject = intersects[0].object;

        if (bases.children.includes(intersects[0].object.parent)) {
          moveObject(creators, testVec.x, testVec.z);
          setActive(intersects[0].object);
          updateGUI(testObject, 'base');
        }

        if (walls.children.includes(intersects[0].object.parent)) {
          setActive(intersects[0].object);
          let parentBase = intersects[0].object.parent.userData.parent;
          moveObject(creators, parentBase.position.x,parentBase.position.z);
          updateGUI(testObject, 'wall');          
        }

        if (columns.children.includes(intersects[0].object.parent)) {
          setActive(intersects[0].object);
          let parentBase = intersects[0].object.parent.userData.parent;
          moveObject(creators, parentBase.position.x,parentBase.position.z);
          updateGUI(testObject, 'column');          
        }
        if (windows.children.includes(intersects[0].object.parent)) {
          setActive(intersects[0].object);
          let parentBase = intersects[0].object.parent.userData.parent;
          moveObject(creators, parentBase.position.x,parentBase.position.z);
          updateGUI(testObject, 'window');          
        }
        if (doors.children.includes(intersects[0].object.parent)) {
          setActive(intersects[0].object);
          let parentBase = intersects[0].object.parent.userData.parent;
          moveObject(creators, parentBase.position.x,parentBase.position.z);
          updateGUI(testObject, 'door');          
        }

        //PLANE CLICK
        if (creators.children.includes(intersects[0].object.parent)) {
          if (selectedName.includes('base')) {
            DeleteExisting(bases,testVec.x,testVec.z);
            ClearMaterials(bases);
            ClearMaterials(walls);
            //name, type, parent
            let objectData=[`Base_${testVec.x}_${testVec.z}`, 'base', bases]
            ImportModel('base', assetPath,testVec.x,0,testVec.z, bases, objectData);
            creators.position.x = testVec.x;
            creators.position.z = testVec.z;

          }

          if (selectedName.includes('wall')) {
            let currentBase = getCurrentBase(testVec.x, testVec.z);
            let possible_transforms = {'wallUpPlane': [0,-5,0], 'wallDownPlane': [0,5,Math.PI], 'wallRightPlane': [5,0, -Math.PI/2], 'wallLeftPlane': [-5,0,Math.PI/2]}
            let trans = possible_transforms[selectedName];
            let x = testVec.x+trans[0]
            let z = testVec.z+trans[1]
            ClearMaterials(bases);
            ClearMaterials(walls);
            let objectData=[`Wall_${x}_${z}`, 'wall', currentBase];
            let existing = [];
            walls.traverse(function(obj) {
              if (obj.parent.userData.name ==`Wall_${x}_${z}` && obj.parent.userData.parent == currentBase) {
                existing.push(obj.parent);
              }
            });
            for (const e of existing) {
              walls.remove(e);
            }

            // DeleteExisting(currentBase.parent,testVec.x+trans[0],testVec.x+trans[1]);
            ImportModel('wall', assetPath, testVec.x+trans[0],0,testVec.z+trans[1], walls, objectData, trans[2]);

          }

          if (selectedName.includes('door') || selectedName.includes('window')) {
            let currentBase = getCurrentBase(testVec.x, testVec.z);
            let possible_transforms = {'Up': [0,-5,0], 'Down': [0,5,Math.PI], 'Right': [5,0, -Math.PI/2], 'Left': [-5,0,Math.PI/2]}
            let trans = possible_transforms[selectedName.replace('door','').replace('window','').replace('Plane','')];
            let x = testVec.x+trans[0]
            let z = testVec.z+trans[1]
            ClearMaterials(bases);
            ClearMaterials(walls);
            let objectData=[`Wall_${x}_${z}`, 'wall', currentBase];
            let existing = [];
            walls.traverse(function(obj) {
              if (obj.parent.userData.name ==`Wall_${x}_${z}` && obj.parent.userData.parent == currentBase) {
                existing.push(obj.parent);
              }
            });

            if (existing.length>0) {
              let activeWall = existing[0];
              let y = 0
              let folder = 'door'
              let group = doors;
              if (selectedName.includes('window')){
                console.log(activeWall);
                let boundingBox = new THREE.Box3().setFromObject(activeWall.children[0]);
                console.log(boundingBox);
                // let size = boundingBox.getSize();
                let size = boundingBox.max.y;
                console.log(size);

              
                y = size/2;
                folder = 'window';
                group = windows;
              }

              objectData=[`${folder}_${x}_${z}`, folder, activeWall];


              ImportModel(folder, assetPath, testVec.x+trans[0],y,testVec.z+trans[1], group, objectData, trans[2]);
              // ImportModel(folder, assetPath, 0,0,0, walls, objectData, trans[2]);
              
            }



          }

          
          if (selectedName.includes('column')) {
            let currentBase = getCurrentBase(testVec.x, testVec.z);
            let objectData=['column', 'column', currentBase];
            console.log(assetPath);
            ImportModel('column', assetPath, testVec.x,0,testVec.z, columns, objectData, 0);


          }

        }

      }
    };

    window.addEventListener('click', onMouseMove, {passive:true});

    const animate = () => {
      // if (loadedModel) {
      //   // test.scene.getObjectByName('rightPlane').rotation.z += .05;
      //   // test.scene.getObjectByName('upPlane').rotation.z += .5;
      //   // test.scene.getObjectByName('downPlane').rotation.z += -.005;
      //   //loadedModel.scene.rotation.x += 0.01;
      //   //loadedModel.scene.rotation.y += 0.01;
      //   //loadedModel.scene.rotation.z += 0.01;
      // }
      composer.render();
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App
