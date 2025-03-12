import { useEffect, useState } from 'react';
import { initialLoadingChecks } from '../_utils/xrUtils';
import { useRoomCaptureState } from './useRoomCaptureState';

export const useWebXR = () => {
    const { session, referenceSpace, setSessionState, setReferenceSpaceState } = useRoomCaptureState();
    const [xrError, setXRError] = useState(null);

    useEffect(() => {

        const checkWebXR = async () => {
            if (typeof navigator === 'undefined') {
                setXRError('Navigator object is undefined.');
                return;
            }

            if (!navigator.xr) {
                setXRError('WebXR is not supported on this device.');
                return;
            }

            const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
            if (!isARSupported) {
                setXRError('AR is not supported on this device.');
                return;
            }
        }

        const startSession = async () => {
            try {
                await startARSession();
            } catch (error) {
                console.error(error);
                setXRError(`Error starting AR session: ${error.message}`);
            }
        };

        startSession();

        return () => {
            if (session) {
                session.end();
                setSessionState(null);
                setReferenceSpaceState(null);
            }
        };
    }, [session, setSessionState, setReferenceSpaceState]);

    const startARSession = async () => {

        try {
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local', 'hit-test'],
            });

            const webGL = document.createElement('canvas').getContext('webgl');
            session.updateRenderState({ baseLayer: new XRWebGLLayer(session, webGL) });

            session.requestReferenceSpace('local').then((referenceSpace) => {
                setSessionState(session);
                setReferenceSpaceState(referenceSpace);
            });

            session.addEventListener('end', () => {
                setSessionState(null);
            });

        } catch (error) {
            console.log('Error: ', error);
            setXRError('Error starting AR session: ' + error.message);
        };
    };

    return {
        session,
        referenceSpace,
        xrError,
    };
};

