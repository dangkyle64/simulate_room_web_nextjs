const GUI = require('@babylonjs/gui');
const { ListItemBase } = require('./ListItem');

const ListMenu = (scene, objectArray, popUpObjectInteractionMenu, onItemClick) => {
    var stackPanel = new GUI.StackPanel();
    stackPanel.isVertical = true; 
    stackPanel.width = "100%";
    stackPanel.height = "100%"; 

    popUpObjectInteractionMenu.addControl(stackPanel);
    objectArray.forEach((obj) => {
        ListItemBase(scene, obj, stackPanel);
    });
};

module.exports = { ListMenu };
