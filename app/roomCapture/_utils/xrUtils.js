export const initWebXR = async (onSurfaceData) => {
    
    const initialAREnvironmentChecks = await initialLoadingChecks();

    if (!initialAREnvironmentChecks) {
        return;
    };

    const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures:  ['hit-test'],
    });

    const webGL = document.createElement('canvas').getContext('webgl');
    const xrReferenceSpace = await session.requestReferenceSpace('local');

    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, webGL)
    });

    const scannedData = { surfaces: [], depthPoints: [] };

    session.requestAnimationFrame((time, frame) => onXRFrame(scannedData, time, frame, session, xrReferenceSpace)); 

    return scannedData;
};

// centralizing the initialChecks to make it easier to add in the future / refactor to  different file
export const initialLoadingChecks = async () => {

    if (typeof navigator === 'undefined') {
        alert('Navigator object is undefined.');
        return false;
    };
    
    if (!navigator.xr) {
        alert('WebXR is not supported on this device. :( ');
        return false;
    };

    const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!isARSupported) {
        alert('AR is not supported on this device. :( ');
        return false;
    };

    return true;
};

export const performHitTest = async (session, referenceSpace) => {
    const hitTestSource = await session.requestHitTestSource({
        space: referenceSpace
    });

    // return the position and normal in an array format to better handle multiple hits in future
    // if no hits, returns an empty array [] rather than null to stay with arrays
    const hitTestResults = await hitTestSource.getResults();
    return hitTestResults.map(hit => ({
        position: hit.pose.transform.position,
        normal: hit.pose.transform.orientation,
    }));
};

export async function onXRFrame(scannedData, time, frame, session, referenceSpace) {

    const pose = frame.getViewerPose(referenceSpace);
    if (pose) {
        const hitTestResults = await performHitTest(session, referenceSpace);
        scannedData.surfaces = hitTestResults;

        scannedData.depthPoints.push(pose.transform.position);
    };

    session.requestAnimationFrame((time, frame) => onXRFrame(time, frame, session, referenceSpace, onSurfaceData));
};