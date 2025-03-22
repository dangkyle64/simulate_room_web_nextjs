import { vi, beforeEach, describe, expect, it } from 'vitest';
import { useWebXR, checkWebXRPossible, onXRFrame, initializeWebGl2 } from '../../roomCapture/_hooks/useWebXR';

describe('useWebXR', () => {
    let populateSetXRErrorMock;

    beforeEach(() => {
        populateSetXRErrorMock = vi.fn();
    });

    it('should return the proper error message if navigator is undefined', async () => {
        global.navigator = undefined;
        await checkWebXRPossible(populateSetXRErrorMock); 
        expect(populateSetXRErrorMock).toHaveBeenCalledWith('Navigator object is undefined.');
    });

    it('should return the proper error message if webXR is not supported', async () => {
        global.navigator = { xr: undefined };
        await checkWebXRPossible(populateSetXRErrorMock);
        expect(populateSetXRErrorMock).toHaveBeenCalledWith('WebXR is not supported on this device.');
    });

    it('should return the proper error message if AR is not supported', async () => {
        global.navigator = { xr: { isSessionSupported: vi.fn().mockResolvedValue(false) } };
        await checkWebXRPossible(populateSetXRErrorMock);
        expect(populateSetXRErrorMock).toHaveBeenCalledWith('AR is not supported on this device.');
    });

    it('should not run the populateSetXRError if everything is valid', async () => {
        global.navigator = { xr: { isSessionSupported: vi.fn().mockResolvedValue(true) } };
        await checkWebXRPossible(populateSetXRErrorMock);
        expect(populateSetXRErrorMock).not.toHaveBeenCalled();
    });
});

describe('onXRFrame', () => {
    let mockSession;
    let mockReferenceSpace;
    let mockFrame;

    beforeEach(() => {
        mockSession = {
            requestAnimationFrame: vi.fn()
        };
        mockReferenceSpace = {};
        mockFrame = {
            getViewerPose: vi.fn()
        };
    });

    it('should request animation frame if referenceSpace is null', () => {
        onXRFrame(mockSession, null, 0, mockFrame);
        expect(mockSession.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should request animation frame if referenceSpace is undefined', () => {
        onXRFrame(mockSession, undefined, 0, mockFrame);
        expect(mockSession.requestAnimationFrame).toHaveBeenCalled();
    });
});

describe('initializeWebGl2', () => {
    let mockSession;
    let xrLayer;

    beforeEach(() => {
        mockSession = {
            updateRenderState: vi.fn(),
        };
        
        const mockWebGLContext = {
            someWebGLProperty: 'test',
          };

        global.document.createElement = vi.fn(() => ({
            getContext: vi.fn(() => mockWebGLContext)
        }));

        global.XRWebGLLayer = vi.fn().mockImplementation(() => ({
            mockLayerProperty: 'mockValue',
        }));
    });

    it('should verify that createElement called to create canvas', () => {
        xrLayer = initializeWebGl2(mockSession);

        expect(global.document.createElement).toHaveBeenCalledWith('canvas');
    });

    // test webGL here

    it('should verify that XRWebGLLayer was created', () => {
        xrLayer = initializeWebGl2(mockSession);

        expect(global.XRWebGLLayer).toHaveBeenCalledWith(mockSession, {
            "someWebGLProperty": "test",
        });
        expect(xrLayer).toEqual({ mockLayerProperty: 'mockValue' });

        expect(mockSession.updateRenderState).toHaveBeenCalledWith({ baseLayer: xrLayer });
    });

    it('should throw an error if WebGL2 context is not available', () => {
        global.document.createElement = vi.fn(() => ({
          getContext: vi.fn(() => null),
        }));
    
        expect(() => initializeWebGl2(mockSession)).toThrowError('WebGL context not available.');
      });
});