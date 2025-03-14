import { vi, beforeEach, describe, expect, afterEach } from 'vitest';
import { useWebXR, checkWebXRPossible } from '../../roomCapture/_hooks/useWebXR';

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