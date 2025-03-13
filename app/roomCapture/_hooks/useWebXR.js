import { useEffect, useState } from 'react';
import { useRoomCaptureState } from './useRoomCaptureState';

export const useWebXR = () => {
    const { session, referenceSpace, setSessionState, setReferenceSpaceState } = useRoomCaptureState();
    const [xrError, setXRError] = useState(null);

    useEffect(() => {

        const checkWebXR = async () => {
            if (typeof navigator === 'undefined') {
                setXRError('Navigator object is undefined.');
                return;
            };

            if (!navigator.xr) {
                setXRError('WebXR is not supported on this device.');
                return;
            };

            const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
            if (!isARSupported) {
                setXRError('AR is not supported on this device.');
                return;
            };
        };

        checkWebXR();

        return () => {
            if (session) {
                session.end();
                setSessionState(null);
                setReferenceSpaceState(null);
            }
        };
    }, [session, setSessionState, setReferenceSpaceState]);

    const handleStartARSession = async () => {

        try {
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local', 'hit-test'],
            });

            const canvas = document.createElement('canvas');
            const webGL = canvas.getContext('webgl2', { xrCompatible: true });

            if (!webGL) {
                throw new Error('WebGL context not available.');
            };

            const xrLayer = new XRWebGLLayer(session, webGL);
            session.updateRenderState({ baseLayer: xrLayer });

            const referenceSpace = await session.requestReferenceSpace('local');
            setSessionState(session);
            setReferenceSpaceState(referenceSpace);

            session.addEventListener('end', () => {
                setSessionState(null);
            });

            let hitTestSource = null;
            let hitTestSourceInitialized = false;

            const createHitTestSource = async () => {
                if (hitTestSourceInitialized) return;
                
                try {
                    const referenceSpace = await session.requestReferenceSpace('viewer');
                    hitTestSource = await session.requestHitTestSource({
                        space: referenceSpace,
                        // Optionally, add other parameters for hit testing, such as ray origin or direction
                    });
                    hitTestSourceInitialized = true;
                    console.log('Hit test source initialized.');
                } catch (error) {
                    console.error('Error creating hit test source:', error);
                }
            };

            console.log('onXRFRame started. referenceSpace: ', referenceSpace);
            const onXRFrame = async (time, frame) => {
                if (!referenceSpace || !hitTestSource) {
                    session.requestAnimationFrame(onXRFrame);
                    return;
                };
                
                const xrPose = frame.getViewerPose(referenceSpace);

                if(xrPose) {
                    const pose = xrPose.views[0];
                    const transform = pose.transform;
                    const cameraPosition = transform.position;
                    const cameraRotation = transform.orientation;

                    //console.log('Camera Position:', cameraPosition);
                    //console.log('Camera Rotation (Quaternion):', cameraRotation);

                    const hitTestResults = await session.getHitTestResults(hitTestSource);
                    if (hitTestResults.length > 0) {
                        const hitTestResult = hitTestResults[0]; // Get the first hit (if any)
                        const hitPose = hitTestResult.getPose(referenceSpace); // Get the pose of the hit object
                        
                        if (hitPose) {
                            const hitPosition = hitPose.transform.position;
                            const hitRotation = hitPose.transform.orientation;

                            console.log('Hit Position:', hitPosition);
                            console.log('Hit Rotation:', hitRotation);

                            // Place a virtual object at the hit position (e.g., a sphere or model)
                            placeARObject(hitPosition, hitRotation);
                        };
                    };
                };

                session.requestAnimationFrame(onXRFrame);
            };

            session.requestAnimationFrame(onXRFrame);

        } catch (error) {
            console.log('Error: ', error);
            setXRError('Error starting AR session: ' + error.message);
        };
    };

    return {
        session,
        referenceSpace,
        xrError,
        handleStartARSession,
    };
};

const placeARObject = (hitPosition, hitRotation) => {
    // Replace with your AR object logic (e.g., add a 3D model or sphere)
    console.log('Placing object at:', hitPosition, 'Rotation:', hitRotation);
};