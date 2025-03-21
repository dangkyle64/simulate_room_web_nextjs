import { useEffect, useState } from 'react';
import { useRoomCaptureState } from './useRoomCaptureState';
import { useErrorState } from './useErrorState';

export const useWebXR = () => {
    const { session, referenceSpace, setSessionState, setReferenceSpaceState, toggleIsSessionEnded } = useRoomCaptureState();
    const { xrError, populateSetXRError } = useErrorState();

    const [hitTestSource, setHitTestSource] = useState(null);

    useEffect(() => {
        checkWebXRPossible(populateSetXRError);
    }, []);

    const handleStartARSession = async () => {

        const overlayElement = document.getElementById('overlay');
        
        try {

            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local', 'hit-test'],
                optionalFeatures: ['dom-overlay'],
                domOverlay: { root: overlayElement}
            });

            initializeWebGl2(session);
            
            const referenceSpace = await session.requestReferenceSpace('viewer');
            setSessionState(session);
            setReferenceSpaceState(referenceSpace);

            const initializedHitTestSource = await session.requestHitTestSource({ space: referenceSpace });
            console.log('HitTestSource initialized:', initializedHitTestSource);
            setHitTestSource(initializedHitTestSource);

            session.addEventListener('end', () => {
                setSessionState(null);
            });
            console.log('onXRFRame started. referenceSpace: ', referenceSpace);

            session.requestAnimationFrame((time, frame) => onXRFrame(session, referenceSpace, time, frame, initializedHitTestSource));

        } catch (error) {
            console.log('Error: ', error);
            populateSetXRError('Error starting AR session: ' + error.message);
        };
    };

    const handleEndARSession = async () => {
        console.log(session);
        if (session && typeof session.requestAnimationFrame === 'function') {
            try {
                await session.end();
                setSessionState(null);
                setReferenceSpaceState(null);
                toggleIsSessionEnded();

                if (hitTestSource) {
                    hitTestSource.cancel();
                    hitTestSource = null;
                };

            } catch(error) {
                populateSetXRError('Error ending AR session: ' + error.message);
            };
        } else {
            console.log('No active AR session to end');
        };
    };

    return {
        session,
        referenceSpace,
        xrError,
        handleStartARSession,
        handleEndARSession,
    };
};

export const checkWebXRPossible = async (populateSetXRError) => {
    if (typeof navigator === 'undefined') {
        populateSetXRError('Navigator object is undefined.');
        return;
    };

    if (!navigator.xr) {
        populateSetXRError('WebXR is not supported on this device.');
        return;
    };

    const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!isARSupported) {
        populateSetXRError('AR is not supported on this device.');
        return;
    };
};

const initializeWebGl2 = (session) => {
    const canvas = document.createElement('canvas');
    const webGL = canvas.getContext('webgl2', { xrCompatible: true });

    if (!webGL) {
        throw new Error('WebGL context not available.');
    };

    const xrLayer = new XRWebGLLayer(session, webGL);
    session.updateRenderState({ baseLayer: xrLayer });

    return xrLayer;
};

export const onXRFrame = (session, referenceSpace, time, frame, hitTestSource) => {
    if (!referenceSpace) {
        session.requestAnimationFrame((time, frame) => onXRFrame(session, referenceSpace, time, frame));
        return;
    };
    
    const xrPose = frame.getViewerPose(referenceSpace);

    if(xrPose) {
        const pose = xrPose.views[0];
        const transform = pose.transform;
        const cameraPosition = transform.position;
        const cameraRotation = transform.orientation;

        console.log('Camera Position:', cameraPosition);
        console.log('Camera Rotation (Quaternion):', cameraRotation);
    };

    if (hitTestSource) {
        performHitTest(time, frame, referenceSpace, hitTestSource);
    };

    session.requestAnimationFrame((time, frame) => onXRFrame(session, referenceSpace, time, frame, hitTestSource));
};

let hitTestData = [];

const performHitTest = (time, frame, referenceSpace, hitTestSource) => {
    const hitTestResults = frame.getHitTestResults(hitTestSource);

    console.log('Hit Test Results: ', hitTestResults);

    if (hitTestResults.length > 0) {
        const hitPose = hitTestResults[0].getPose(referenceSpace);
        if (hitPose) {
            console.log('Hit Pose:', hitPose);

            hitTestData.push({
                time: time,
                hitPose: hitPose,
                orientation: hitPose.transform.orientation,  
            });
        };
    } else {
        console.log('No hit test results found');
    };

    console.log('Hit test data test: ', hitTestData);
};