import * as GUI from '@babylonjs/gui';
import * as BABYLON from '@babylonjs/core';

export const ListMenu = (scene, objectArray, popUpObjectInteractionMenu) => {
    var stackPanel = new GUI.StackPanel();
    stackPanel.isVertical = true; 
    stackPanel.width = "100%";
    stackPanel.height = "100%"; 

    popUpObjectInteractionMenu.addControl(stackPanel);
    objectArray.forEach((obj) => {
        ListItemBase(scene, obj, stackPanel);
    });
};

const ListItemBase = (scene, obj, parentPanel) => {
    var listItemStack = new GUI.TextBlock();
    listItemStack.width = "100%";
    listItemStack.height = "10px";

    var header = listItem(obj, parentPanel);
    var listDetails = listItemDetails(scene, obj, parentPanel);
    
    listDetails.isVisible = false;

    header.onPointerClickObservable.add(() => {
        if (!listDetails.isVisible) {
            listDetails.isVisible = true;
            console.log('Change visible to true');
        } else {
            listDetails.isVisible = false;
            console.log('Change visible to false');
        };
    });

    parentPanel.addControl(listItemStack);
};

const listItem = (obj, listItemStack) => {
    var listItemHeader = new GUI.TextBlock();
    listItemHeader.width = "100%";
    listItemHeader.height = "40px";
    listItemHeader.marginBottom = "10px";

    listItemHeader.text = `Type ${obj.type}`
    listItemHeader.color = "white";

    listItemStack.addControl(listItemHeader);

    listItemHeader.onPointerEnterObservable.add(() => {
        listItemHeader.color = "yellow";
        listItemHeader.fontSize = 20;
    });

    listItemHeader.onPointerOutObservable.add(() => {
        listItemHeader.color = "white";
        listItemHeader.fontSize = 18;
    });

    return listItemHeader;
};

const listItemDetails = (scene, obj, listItemStack) => {
    var listItemStackDetails = new GUI.TextBlock();
    listItemStackDetails.width = "100%";
    listItemStackDetails.height = "40px";
    listItemStackDetails.marginBottom = "10px";

    listItemStackDetails.text = `Details: Length ${obj.length}, Width ${obj.width}`;
    listItemStackDetails.color = "white"; 

    createFurnitureButton(scene, listItemStack);
    updateFurnitureButton(scene, listItemStack);
    deleteFurnitureButton(scene, listItemStack);
    listItemStack.addControl(listItemStackDetails);

    return listItemStackDetails;
};

const createFurnitureButton = (scene, advancedTextureMainMenu) => {
    const createButton = GUI.Button.CreateSimpleButton("createButton", "Create");

    createButton.width = "50px";
    createButton.height = "50px";
    createButton.color = "red";

    createButton.top = "10px";

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

const updateFurnitureButton = (scene, advancedTextureMainMenu) => {
    const updateButton = GUI.Button.CreateSimpleButton("updateButton", "Update");

    updateButton.width = "50px";
    updateButton.height = "50px";
    updateButton.color = "green";

    updateButton.top = "70px";
    advancedTextureMainMenu.addControl(updateButton);

    updateButton.onPointerClickObservable.add(() => {
        dummyUpdate(scene);
    });
};

const dummyUpdate = () => {
    console.log('Updated content here');
};

const deleteFurnitureButton = (scene, advancedTextureMainMenu) => {
    const deleteButton = GUI.Button.CreateSimpleButton("deleteButton", "Delete");

    deleteButton.width = "50px";
    deleteButton.height = "50px";
    deleteButton.color = "green";

    deleteButton.top = "130px";

    advancedTextureMainMenu.addControl(deleteButton);

    deleteButton.onPointerClickObservable.add(() => {
        dummyDelete(scene);
    });
};

const dummyDelete = () => {
    console.log('Deleted content here');
};

