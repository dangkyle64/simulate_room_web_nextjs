const BABYLON = require('@babylonjs/core');
const { OBJFileLoader } = require('@babylonjs/loaders');

//Figure out testing for this
const loadObjPlugin = async () => {
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
        if (plugin.name === "obj") {
            console.log("OBJ loader is now ready");
        };
    });
};

const getObjMeshes = async (path, scene) => {
    try {
        
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            path,
            "",
            scene,
        );

        const meshes = result.meshes;

        return meshes;

    } catch(error) {
        console.error("Error loading .obj file", error);
        return [];
    };
};

const selectMesh = (objMeshes, selectedMeshPosition) => {
    selectedMeshPosition = selectedMeshPosition || 0;
    const selectedMesh = objMeshes[selectedMeshPosition];

    return selectedMesh;
};

const addPropertiesToMesh = (selectedMesh) => {

    selectedMesh.refreshBoundingInfo();

    selectedMesh.position.y = selectedMesh.getBoundingInfo().boundingBox.maximum.y;

    const dragBehaviorSofa = new BABYLON.PointerDragBehavior();
    selectedMesh.addBehavior(dragBehaviorSofa); 

    dragBehaviorSofa.onDragStartObservable.add(() => {
        selectedMesh.material = new BABYLON.StandardMaterial("dragMaterial", scene);
        selectedMesh.material.diffuseColor = BABYLON.Color3.Green();

        selectedMesh.physicsImpostor.mass = 0;
        selectedMesh.physicsImpostor.isKinematic = true;
            
        selectedMesh.checkCollisions = true;
    });

    dragBehaviorSofa.onDragEndObservable.add((event) => {
        selectedMesh.material = new BABYLON.StandardMaterial("defaultMaterial", scene);
        selectedMesh.material.diffuseColor  = BABYLON.Color3.White();
            
        selectedMesh.physicsImpostor.mass = 1;
        selectedMesh.physicsImpostor.isKinematic = false;

        const finalPosition = selectedMesh.position;
        console.log('Final position of the object1:', finalPosition);

        selectedMesh.checkCollisions = true;
    });

    selectedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(selectedMesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.5 }, scene);
    
};

const loadCustomObjFile = async (path, scene) => {

    try {

        await loadObjPlugin();

        path = path || '/assets/sofa1.obj';
        const objMeshes = await getObjMeshes(path, scene);

        const selectedMesh = selectMesh(objMeshes);

        addPropertiesToMesh(selectedMesh);

    } catch(error) {
        console.error("Error loading .obj file", error);
    };
};

module.exports = { loadCustomObjFile, getObjMeshes, selectMesh };