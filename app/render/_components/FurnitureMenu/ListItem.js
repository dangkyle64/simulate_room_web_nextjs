import * as GUI from '@babylonjs/gui';

const ListItemBase = (scene, obj, parentPanel) => {
    var listItemStack = new GUI.TextBlock();
    listItemStack.width = "100%";
    listItemStack.height = "10px";

    var header = listItem(obj, parentPanel);
    var listDetails = listItemDetails(obj, parentPanel);
    
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

const listItemDetails = (obj, listItemStack) => {
    var listItemStackDetails = new GUI.TextBlock();
    listItemStackDetails.width = "100%";
    listItemStackDetails.height = "40px";
    listItemStackDetails.marginBottom = "10px";

    listItemStackDetails.text = `Details: Length ${obj.length}, Width ${obj.width}`;
    listItemStackDetails.color = "white"; 

    listItemStack.addControl(listItemStackDetails);

    listItemDetailSlider(obj, listItemStack);

    return listItemStackDetails;
};

const listItemDetailSlider = (objProperty, listItemStack) => {
    var listItemDetailSlider = new GUI.Slider();
    
    listItemDetailSlider.minimum = 1;
    listItemDetailSlider.maximum = 20;
    listItemDetailSlider.value = objProperty.length;

    listItemDetailSlider.background = "red";

    listItemDetailSlider.height = "20px";
    listItemDetailSlider.width = "200px";
    listItemDetailSlider.top = "200px";
    listItemDetailSlider.left = "10px";
    listItemDetailSlider.isVertical = false;

    listItemStack.addControl(listItemDetailSlider);

    listItemDetailSlider.onValueChangedObservable.add((value) => {
        objProperty.length = value;
        console.log(objProperty.length)
    });

    
};

export { ListItemBase, listItem, listItemDetails };


