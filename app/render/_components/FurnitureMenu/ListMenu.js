const GUI = require('@babylonjs/gui');

const ListMenu = (scene, objectArray, popUpObjectInteractionMenu, onItemClick) => {
    var stackPanel = new GUI.StackPanel();
    stackPanel.isVertical = true; 
    stackPanel.width = "100%";
    stackPanel.height = "100%"; 

    popUpObjectInteractionMenu.addControl(stackPanel);

    objectArray.forEach((obj, index) => {
        var textBlock = new GUI.TextBlock();
        textBlock.text = `Item ${index + 1}: ${obj.name || 'Unnamed'}`; 
        textBlock.color = "white"; 
        textBlock.fontSize = 18;
        textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; 

        textBlock.height = "40px";
        textBlock.paddingTop = "5px"; 

        textBlock.onPointerEnterObservable.add(() => {
            textBlock.color = "yellow"; // Change color to yellow when hovered over
            textBlock.fontSize = 20; // Increase font size for a more pronounced effect
        });

        textBlock.onPointerOutObservable.add(() => {
            textBlock.color = "white"; // Revert color back to white when not hovered
            textBlock.fontSize = 18; // Revert font size
        });

        textBlock.onPointerClickObservable.add(() => {
            console.log('HERE');
        });

        stackPanel.addControl(textBlock);
    });
};

module.exports = { ListMenu };
