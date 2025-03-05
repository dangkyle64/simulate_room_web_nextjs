import * as GUI from '@babylonjs/gui';

export const FurnitureMenuButton = (scene, toggleMenuCallback) => {
    var button = GUI.Button.CreateImageOnlyButton("cornerButton", "textures/menu_icon2.png");
    
    button.width = "50px"; 
    button.height = "50px";
    button.color = "transparent";
    button.background = "transparent"

    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    button.left = "-10px";
    button.top = "10px";
    
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    advancedTexture.addControl(button);

    button.onPointerUpObservable.add(() => {
        toggleMenuCallback();
    });
};
