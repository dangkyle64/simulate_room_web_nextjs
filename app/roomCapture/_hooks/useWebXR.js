import { useEffect } from 'react';
import { useRoomCaptureState } from './useRoomCaptureState';
import { useErrorState } from './useErrorState';

export const useWebXR = () => {
    const { session, referenceSpace, isSessionEnded, setSessionState, setReferenceSpaceState, toggleIsSessionEnded } = useRoomCaptureState();
    const { xrError, populateSetXRError } = useErrorState();

    useEffect(() => {

        checkWebXRPossible(populateSetXRError);

        return () => {
            if (session && !isSessionEnded) {
                session.end();
                setSessionState(null);
                setReferenceSpaceState(null);
                toggleIsSessionEnded();
            };
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
            console.log('onXRFRame started. referenceSpace: ', referenceSpace);

            session.requestAnimationFrame((time, frame) => onXRFrame(session, referenceSpace, time, frame));

        } catch (error) {
            console.log('Error: ', error);
            populateSetXRError('Error starting AR session: ' + error.message);
        };
    };

    return {
        session,
        referenceSpace,
        xrError,
        handleStartARSession,
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

export const onXRFrame = (session, referenceSpace, time, frame) => {
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

    session.requestAnimationFrame((time, frame) => onXRFrame(session, referenceSpace, time, frame));
};