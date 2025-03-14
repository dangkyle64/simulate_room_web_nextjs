import * as BABYLON from '@babylonjs/core';

export const applyDragBehavior = (object, scene) => {

    if (object.isDragBehaviorApplied) {
        return;
    };

    object.isDragBehaviorApplied = true;

    const dragBehavior = new BABYLON.PointerDragBehavior();
    object.addBehavior(dragBehavior);

    dragBehavior.onDragStartObservable.add(() => {

        if (!object.isPickable) {
            return;
        };

        object.material = new BABYLON.StandardMaterial("dragMaterial", scene);
        object.material.diffuseColor = BABYLON.Color3.Green();

        object.physicsImpostor.linearDamping = 0.9;
    });

    dragBehavior.onDragEndObservable.add((event) => {
        object.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
        object.material.diffuseColor  = BABYLON.Color3.White();

        const finalPosition = object.position;
        console.log('Final position of the object1:', finalPosition);

        object.physicsImpostor.linearDamping = 0;

        object.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        object.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
    });

    return dragBehavior;
};
