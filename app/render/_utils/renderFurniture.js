import * as BABYLON from '@babylonjs/core';

export const load3DFurniture = (scene, type = "box", size = 2, position = { x: 0, y: 55, z: 0 }) => {
    let object; 
    let uniqueName = `object_${Date.now()}`;

    // select type
    if(type === "box") {
        object = BABYLON.MeshBuilder.CreateBox(uniqueName, { size: size }, scene);
    };
    
    object.position.set(position.x, position.y, position.z);
    
    // object properties
    object.material = new BABYLON.StandardMaterial("material", scene);
    object.material.diffuseColor  = BABYLON.Color3.Blue();
    object.physicsImpostor = new BABYLON.PhysicsImpostor(object, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1 }, scene);

    return object;
};
