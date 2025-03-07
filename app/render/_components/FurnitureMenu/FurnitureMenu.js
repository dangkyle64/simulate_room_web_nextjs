import * as GUI from '@babylonjs/gui';
import { fetchFurnitureData } from '../../../_furnitureApi/furnitureApi';
import { ListMenu } from './ListMenu';

export const FurnitureMenu = async (scene) => {
    
    let furnitureData = loadLocalFurnitureData();
    if (!furnitureData) {
        furnitureData = await fetchFurnitureData();
        saveLocalFurnitureData(furnitureData);
    };

    var interactionMenuVisible = false; 
    var interactionMenu = InteractionMenu(scene, furnitureData);

    const toggleInteractionMenu = () => {
        if (interactionMenuVisible) {
            interactionMenu.isVisible = false;
        } else {
            interactionMenu.isVisible = true;
        };
        interactionMenuVisible = !interactionMenuVisible;
    };

    FurnitureMenuButton(scene, toggleInteractionMenu);
};

const InteractionMenu = (scene, objectsArray) => {
    var advancedTextureInteractionMenu = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIInteractionMenu", true, scene);
    
    var popUpObjectInteractionMenu = new GUI.Rectangle();
    popUpObjectInteractionMenu.width = "400px";
    popUpObjectInteractionMenu.height = "900px";
    popUpObjectInteractionMenu.background = "rgba(0,0,0,0.7)";
    
    popUpObjectInteractionMenu.isVisible = false;

    popUpObjectInteractionMenu.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    popUpObjectInteractionMenu.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    
    advancedTextureInteractionMenu.addControl(popUpObjectInteractionMenu);

    ListMenu(scene, objectsArray, popUpObjectInteractionMenu);
    popUpObjectInteractionMenu.isPointerBlocker = true;
    return popUpObjectInteractionMenu;
};

const FurnitureMenuButton = (scene, toggleMenuCallback) => {
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

const saveLocalFurnitureData = (data) => {
    localStorage.setItem('furnitureData', JSON.stringify(data));
};

const loadLocalFurnitureData = () => {
    const data = localStorage.getItem('furnitureData');
    return data ? JSON.parse(data) : null;
};