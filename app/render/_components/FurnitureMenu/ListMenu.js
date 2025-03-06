import * as GUI from '@babylonjs/gui';
import { ListItemBase } from './ListItem';

export const ListMenu = (scene, objectArray, popUpObjectInteractionMenu) => {
    var stackPanel = new GUI.StackPanel();
    stackPanel.isVertical = true; 
    stackPanel.width = "100%";
    stackPanel.height = "100%"; 

    popUpObjectInteractionMenu.addControl(stackPanel);
    objectArray.forEach((obj) => {
        ListItemBase(scene, obj, stackPanel);
    });
};

