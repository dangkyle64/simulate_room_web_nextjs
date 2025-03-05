import * as GUI from '@babylonjs/gui';
import { ListMenu } from './ListMenu';

export const InteractionMenu = (scene, objectsArray, onItemClick) => {
    var advancedTextureInteractionMenu = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIInteractionMenu", true, scene);
    
    var popUpObjectInteractionMenu = new GUI.Rectangle();
    popUpObjectInteractionMenu.width = "400px";
    popUpObjectInteractionMenu.height = "900px";
    popUpObjectInteractionMenu.background = "rgba(0,0,0,0.7)";
    
    popUpObjectInteractionMenu.isVisible = false;

    popUpObjectInteractionMenu.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    popUpObjectInteractionMenu.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    
    advancedTextureInteractionMenu.addControl(popUpObjectInteractionMenu);

    ListMenu(scene, objectsArray, popUpObjectInteractionMenu, onItemClick);
    popUpObjectInteractionMenu.isPointerBlocker = true;
    return popUpObjectInteractionMenu;
};
