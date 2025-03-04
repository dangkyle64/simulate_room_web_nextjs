const GUI = require('@babylonjs/gui');
const { InteractionMenu } = require('./InteractionMenu');
const { FurnitureMenuButton } = require('./FurnitureMenuButton');

const FurnitureMenu = (scene) => {
    var testObjectArray = ['object1', 'object2'];
    var interactionMenuVisible = false; 
    var interactionMenu = InteractionMenu(scene, testObjectArray);

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

// Export the FurnitureMenu function
module.exports = { FurnitureMenu };
