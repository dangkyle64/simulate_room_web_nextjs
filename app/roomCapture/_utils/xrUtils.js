export const initWebXR = async (onSurfaceData, rendererRef) => {
    if (!navigator.xr) {
        alert('WebXR is not supported on this device. :( ');
        return;
    };

    const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!isARSupported) {
        alert('AR is not supported on this device. :( ');
    };

    const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures:  ['hit-test'],
    });

    const glContext = rendererRef.current.getContext();
    const xrLayer = new XRWebGLLayer(session, glContext);

    session.updateRenderState({
        baseLayer: xrLayer
    });

    const xrReferenceSpace = await session.requestReferenceSpace('local');

    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, webGL)
    });

    session.requestAnimationFrame((time, frame) => onXRFrame(time, frame, session, xrReferenceSpace, onSurfaceData)); 

    const scannedData = { surfaces: [], depthPoints: [] };

    async function onXRFrame(time, frame, session, referenceSpace, onSurfaceData) {
        const pose = frame.getViewerPose(referenceSpace);
        if (pose) {
            const hitTestResults = await performHitTest(session, referenceSpace);
            scannedData.surfaces = hitTestResults;

            scannedData.depthPoints.push(pose.transform.position);

            onSurfaceData(scannedData);

            //update UI or send data here 
        };

        session.requestAnimationFrame((time, frame) => onXRFrame(time, frame, session, referenceSpace, onSurfaceData));
    };

    const performHitTest = async (session, referenceSpace) => {
        const hitTestSource = await session.requestHitTestSource({
            space: referenceSpace
        });

        const hitTestResults = await hitTestSource.getResults();
        return hitTestResults.map(hit => ({
            position: hit.pose.transform.position,
            normal: hit.pose.transform.orientation,
        }));
    };

    return scannedData;
};