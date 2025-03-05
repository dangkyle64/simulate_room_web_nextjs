import * as GUI from '@babylonjs/gui';

let currentPopUp = null;

export const objectInfoWindow = (scene, object) => {

    if(currentPopUp) {
        currentPopUp.isVisible = false;
    };

    var advancedTextureObjectInfoWindow = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    var popUpObjectInfoWindow = new GUI.Rectangle();

    const updatePopupWidth = () => {
        const dynamicWidth = (window.innerWidth * 0.2) + "px"; // 20% of the window width
        popUpObjectInfoWindow.width = dynamicWidth;
    };

    updatePopupWidth();

    popUpObjectInfoWindow.height = "100vh";
    popUpObjectInfoWindow.right = "0%";
    popUpObjectInfoWindow.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

    popUpObjectInfoWindow.isHitTestVisible = true;
    popUpObjectInfoWindow.background = "rgba(0, 0, 0, 0.7)";
    advancedTextureObjectInfoWindow.addControl(popUpObjectInfoWindow);

    var objectInfo = new GUI.TextBlock();
    objectInfo.text = "";
    objectInfo.color = "white";
    popUpObjectInfoWindow.addControl(objectInfo);

    let object_pos_x = object.position.x.toFixed(2);
    let object_pos_y = object.position.y.toFixed(2);
    let object_pos_z = object.position.z.toFixed(2);
    objectInfo.text += "\nObject Name: " + object.name.toString();
    objectInfo.text += "\nPosition X: " + object_pos_x.toString();
    objectInfo.text += "\nPosition Y: " + object_pos_y.toString();
    objectInfo.text += "\nPosition Z: " + object_pos_z.toString();

    window.addEventListener("resize", function(){
        
        updatePopupWidth();
        //adjustTextSize();
    });

    currentPopUp = popUpObjectInfoWindow;
};

