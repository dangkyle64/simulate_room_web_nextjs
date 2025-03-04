const GUI = require('@babylonjs/gui');

const FurnitureMenu = (scene) => {
    var button = GUI.Button.CreateImageOnlyButton("cornerButton", "textures/menu_icon2.png");
    
    // Set button dimensions
    button.width = "50px"; 
    button.height = "50px";
    button.color = "transparent";
    button.background = "transparent"

    // Set the position of the button (top-right corner)
    button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    button.left = "-10px"
    // Add the button to the scene
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    advancedTexture.addControl(button);

    // Add a click event handler
    button.onPointerUpObservable.add(() => {
        alert("Button clicked!");
    });
};

// Export the FurnitureMenu function
module.exports = { FurnitureMenu };
