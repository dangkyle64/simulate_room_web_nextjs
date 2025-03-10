import { describe, it, vi, expect, beforeEach } from 'vitest';
import { initialLoadingChecks } from '../../roomCapture/_utils/xrUtils';

global.alert = vi.fn();

describe('xrUtils', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return false if WebXR is not supported', async () => {
        global.navigator = { xr: undefined };

        const result = await initialLoadingChecks();

        expect(alert).toHaveBeenCalledWith('WebXR is not supported on this device. :( ');
        expect(result).toBe(false);
    });

    it('should return false if AR is not supported', async () => {
        global.navigator = {
            xr: {
                isSessionSupported: vi.fn().mockResolvedValue(false),
            },
        };

        const result = await initialLoadingChecks();

        expect(alert).toHaveBeenCalledWith('AR is not supported on this device. :( ');
        expect(result).toBe(false);
    });

    it('should return true if WebXR and AR are supported', async () => {
        global.navigator = {
            xr: {
                isSessionSupported: vi.fn().mockResolvedValue(true),
            },
        };

        const result = await initialLoadingChecks();

        expect(result).toBe(true);
    });

    it('should handle an undefined navigator gracefully', async () => {
        global.navigator = undefined;

        const result  = await initialLoadingChecks();

        expect(alert).toHaveBeenCalledWith('Navigator object is undefined.');
        expect(result).toBe(false);
    });
});
