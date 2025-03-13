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

            session.requestReferenceSpace('local').then((referenceSpace) => {
                setSessionState(session);
                setReferenceSpaceState(referenceSpace);
            });

            session.addEventListener('end', () => {
                setSessionState(null);
            });

            const onXRFrame = (time, frame) => {
                const referenceSpace = referenceSpace;
                const xrPose = frame.getViewerPose(referenceSpace);

                if(xrPose) {
                    const pose = xrPose.views[0];
                    const transform = pose.transform;
                    const cameraPosition = transform.position;
                    const cameraRotation = transform.orientation;

                    console.log('Camera Position:', cameraPosition);
                    console.log('Camera Rotation (Quaternion):', cameraRotation);
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

