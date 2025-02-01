const GUI = require('@babylonjs/gui');

const confirmPopupWindow = (scene) => {
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    var confirmPopUpWindow = new GUI.StackPanel();
    confirmPopUpWindow.width = "300px";
    confirmPopUpWindow.height = "200px";
    confirmPopUpWindow.top = "20%";
    confirmPopUpWindow.left = "35%";
    confirmPopUpWindow.isHitTestVisible = true;
    confirmPopUpWindow.background = "rgba(0, 0, 0, 0.7)";
    advancedTexture.addControl(confirmPopUpWindow);

    var contentText = new GUI.TextBlock();
    contentText.text = "Here content";
    contentText.color = "white";
    confirmPopUpWindow.addControl(contentText);

    var inputField = new GUI.InputText();
    inputField.width = "200px";
    inputField.height = "40px";
    inputField.top = "50px";
    inputField.color = "white";
    inputField.background = "black";
    inputField.text = "";
    confirmPopUpWindow.addControl(inputField);

    var closeButton = GUI.Button.CreateSimpleButton("closeButton", "Close");
    closeButton.width = "100px";
    closeButton.height = "40px";
    closeButton.top = "150px";
    closeButton.background = "red";
    closeButton.onPointerUpObservable.add(function() {
        confirmPopUpWindow.isVisible = false;
    });
    confirmPopUpWindow.addControl(closeButton);

    var submitButton = GUI.Button.CreateSimpleButton("submitButton", "Submit");
    submitButton.width = "100px";
    submitButton.height = "40px";
    submitButton.top = "100px";
    submitButton.background = "green";
    submitButton.onPointerClickObservable.add(function() {
        var userInput = inputField.text;
        console.log("User Input in the Popup is: ", userInput);

        //example function call with userinput
        //useInputData(userInput);
    });

    confirmPopUpWindow.addControl(submitButton);
};

module.exports = { confirmPopupWindow }