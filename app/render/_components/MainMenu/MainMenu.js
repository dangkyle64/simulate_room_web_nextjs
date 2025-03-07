import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui'; 

export const MainMenu = (scene) => {
    var advancedTextureMainMenu = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIMainMenu", true, scene);
    
    var mainMenu = new GUI.Rectangle();
    mainMenu.width = "400px";
    mainMenu.height = "900px";
    mainMenu.background = "rgba(0,0,0,0.7)";
    
    mainMenu.isVisible = false;

    mainMenu.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    mainMenu.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    
    advancedTextureMainMenu.addControl(mainMenu);
    
    createFurnitureButton(scene, advancedTextureMainMenu);
    mainMenu.isPointerBlocker = true;
};

const createFurnitureButton = (scene, advancedTextureMainMenu) => {
    const createButton = GUI.Button.CreateSimpleButton("createButton", "Create");

    createButton.width = "50px";
    createButton.height = "50px";
    createButton.color = "red";

    advancedTextureMainMenu.addControl(createButton);

    createButton.onPointerClickObservable.add(() => {
        dummyCreate(scene);
    });
};

const dummyCreate = (scene, type = "box", size = 2, position = { x: 0, y: 55, z: 0 }) => {
    let object; 
    let uniqueName = `object_${Date.now()}`;

    if(type === "box") {
        object = BABYLON.MeshBuilder.CreateBox(uniqueName, { size: size }, scene);
    };
    
    object.position.set(position.x, position.y, position.z);
    
    object.material = new BABYLON.StandardMaterial("material", scene);
    object.material.diffuseColor  = BABYLON.Color3.Blue();
    object.physicsImpostor = new BABYLON.PhysicsImpostor(object, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);

    return object;
};
