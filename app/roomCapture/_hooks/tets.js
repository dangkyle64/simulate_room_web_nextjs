import { useEffect, useState } from 'react';
import { initialLoadingChecks } from '../_utils/xrUtils';
import { useRoomCaptureState } from './useRoomCaptureState';

export const useWebXR = () => {
    const { session, referenceSpace, setSessionState, setReferenceSpaceState } = useRoomCaptureState();
    const [xrError, setXRError] = useState(null);

    useEffect(() => {
        const initialChecks = initialLoadingChecks();

        if (!initialChecks) {
            setXRError('Initial checks failed.');
            return;
        }

        const startSession = async () => {
            try {
                await startARSession();
            } catch (error) {
                console.error('Error starting AR session:', error);
                setXRError('Error starting AR session: ' + error.message);
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
    }, [session, setSessionState, setReferenceSpaceState]); // session as dependency ensures the effect reruns

    // The startARSession function that starts the AR session
    const startARSession = async () => {
        try {
            const xrSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local', 'hit-test'],
            });

            // Setup the WebGL context and layer for rendering
            const webGL = document.createElement('canvas').getContext('webgl');
            xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, webGL) });

            // Request the reference space and store session & referenceSpace
            const referenceSpace = await xrSession.requestReferenceSpace('local');
            setSessionState(xrSession);
            setReferenceSpaceState(referenceSpace);

            // Listen for session end
            xrSession.addEventListener('end', () => {
                setSessionState(null);
                setReferenceSpaceState(null);
            });

        } catch (error) {
            console.error('Error initializing AR session:', error);
            setXRError('Error initializing AR session: ' + error.message);
        }
    };

    return {
        session,
        referenceSpace,
        xrError, // Return error message if any
    };
};
