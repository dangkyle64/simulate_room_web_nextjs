import { InteractionMenu } from './InteractionMenu';
import { FurnitureMenuButton } from'./FurnitureMenuButton';
import { fetchFurnitureData } from '../../../_furnitureApi/furnitureApi';
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

const saveLocalFurnitureData = (data) => {
    localStorage.setItem('furnitureData', JSON.stringify(data));
};

const loadLocalFurnitureData = () => {
    const data = localStorage.getItem('furnitureData');
    return data ? JSON.parse(data) : null;
}