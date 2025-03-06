import { InteractionMenu } from './InteractionMenu';
import { FurnitureMenuButton } from'./FurnitureMenuButton';
import { fetchFurnitureData } from '../../../_furnitureApi/furnitureApi';
export const FurnitureMenu = async (scene) => {
    
    const furnitureData = await fetchFurnitureData();

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
