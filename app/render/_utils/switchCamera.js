import * as BABYLON from '@babylonjs/core';

export const switchCamera = (scene, canvas, cameras) => {

        if (!scene || !canvas || !cameras) {
            console.log('One of the arguments is missing inside of the switchCamera util file.');
            console.log('Scene: ', scene);
            console.log('Canvas: ', canvas);
            console.log('Cameras: ', cameras);
            return;
        };
        scene.activeCamera.detachControl(canvas);

        // Finding next camera to rotate properly through all of them
        const currentCameraIndex = cameras.findIndex(camera => camera === scene.activeCamera);
        const nextCameraIndex = (currentCameraIndex + 1) % cameras.length;
        scene.activeCamera  = cameras[nextCameraIndex];

        scene.activeCamera.attachControl(canvas, true);

        if (scene.activeCamera instanceof BABYLON.UniversalCamera) {
            scene.activeCamera.speed = 1.0;  // Adjust movement speed
            scene.activeCamera.inertia = 0.9; // Adjust inertia (smoothness of movement)
        };

        canvas.focus();
};
