const GUI = require('@babylonjs/gui');

const ListMenu = (scene, objectArray, popUpObjectInteractionMenu) => {
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

        stackPanel.addControl(textBlock);
    });
};

module.exports = { ListMenu };
