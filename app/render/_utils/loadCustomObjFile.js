const BABYLON = require('@babylonjs/core');
const { OBJFileLoader } = require('@babylonjs/loaders');

const loadCustomObjFile = async (scene, path, fileName) => {
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
        if (plugin.name === "obj") {
            console.log("OBJ loader is now ready");
        };
    });

    try {
        path = path || '/assets/';
        fileName = fileName || 'sofa1.obj';

        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            path,
            fileName,
            scene,
        );

        const meshes = result.meshes;
        //console.log('Loaded meshes: ', meshes);

        const sofa = meshes[0];

        sofa.refreshBoundingInfo();

        sofa.position.y = sofa.getBoundingInfo().boundingBox.maximum.y;

        const dragBehaviorSofa = new BABYLON.PointerDragBehavior();
        sofa.addBehavior(dragBehaviorSofa); 

        dragBehaviorSofa.onDragStartObservable.add(() => {
            sofa.material = new BABYLON.StandardMaterial("dragMaterial", scene);
            sofa.material.diffuseColor = BABYLON.Color3.Green();

            sofa.physicsImpostor.mass = 0;
            sofa.physicsImpostor.isKinematic = true;
            
            sofa.checkCollisions = true;
        });

        dragBehaviorSofa.onDragEndObservable.add((event) => {
            sofa.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
            sofa.material.diffuseColor  = BABYLON.Color3.White();
            
            sofa.physicsImpostor.mass = 1;
            sofa.physicsImpostor.isKinematic = false;

            const finalPosition = sofa.position;
            console.log('Final position of the object1:', finalPosition);

            sofa.checkCollisions = true;
        });

        sofa.physicsImpostor = new BABYLON.PhysicsImpostor(sofa, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.5 }, scene);
    
    } catch(error) {
        console.error("Error loading .obj file", error);
    };
};

module.exports = { loadCustomObjFile };