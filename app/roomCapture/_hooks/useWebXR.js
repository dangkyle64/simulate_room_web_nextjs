import { useEffect, useState } from 'react';
import { initialLoadingChecks } from '../_utils/xrUtils';
import { useRoomCaptureState } from './useRoomCaptureState';
export const useWebXR = async () => {

    const { session, referenceSpace } = useRoomCaptureState();
    useEffect(() => {
        const initialChecks = initialLoadingChecks();

        if (!initialChecks) {
            return;
        };

        startARSession();

        return () => {
            if(session) {
                session.end();
            }
        };
    }, [session]);

    return {
        session,
        referenceSpace,
    };
};

const startARSession = async () => {
    const { setSessionState, setReferenceSpaceState } = useRoomCaptureState();

    try {
        const session = await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures:  ['local', 'hit-test'],
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

    } catch(error) {
        console.log('Error: ', error);
        //setXRError('Error starting AR session: ' + error.message);
    };
};