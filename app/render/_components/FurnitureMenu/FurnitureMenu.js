import { InteractionMenu } from './InteractionMenu';
import { FurnitureMenuButton } from'./FurnitureMenuButton';

export const FurnitureMenu = (scene) => {
    const objectsArray = [
        { name: "obj1", property1: "Value 1", property2: "Detail 1" },
        { name: "obj2", property1: "Value 2", property2: "Detail 2" },
        { name: "obj3", property1: "Value 3", property2: "Detail 3" }
    ];
    var interactionMenuVisible = false; 
    var interactionMenu = InteractionMenu(scene, objectsArray);

    const toggleInteractionMenu = () => {
        if (interactionMenuVisible) {
            interactionMenu.isVisible = false;
        } else {
            interactionMenu.isVisible = true;
        };
        interactionMenuVisible = !interactionMenuVisible;
    };

    const onItemClick = () => {
        console.log('HERE');
    };

    FurnitureMenuButton(scene, toggleInteractionMenu, onItemClick);
};
