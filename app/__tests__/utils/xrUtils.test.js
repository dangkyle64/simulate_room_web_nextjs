import { describe, it, vi, expect, beforeEach } from 'vitest';
import * as xrUtils from '../../roomCapture/_utils/xrUtils';
import { useErrorState } from '../../roomCapture/_hooks/useErrorState';

vi.mock('../../roomCapture/_hooks/useErrorState', () => ({
    useErrorState: vi.fn(),
}));

describe('xrUtils', () => {

    let mockPopulateSetXRError;

    beforeEach(() => {
        vi.clearAllMocks();
        mockPopulateSetXRError = vi.fn();

        useErrorState.mockReturnValue({
            xrError: null,
            populateSetXRError: mockPopulateSetXRError,
        });
    });

    it('should return false if WebXR is not supported', async () => {
        global.navigator = { xr: undefined };

        const result = await xrUtils.initialLoadingChecks();

        expect(mockPopulateSetXRError).toHaveBeenCalledWith('WebXR is not supported on this device. :( ');
        expect(result).toBe(false);
    });

    it('should return false if AR is not supported', async () => {
        global.navigator = {
            xr: {
                isSessionSupported: vi.fn().mockResolvedValue(false),
            },
        };

        const result = await xrUtils.initialLoadingChecks();

        expect(mockPopulateSetXRError).toHaveBeenCalledWith('AR is not supported on this device. :( ');
        expect(result).toBe(false);
    });

    it('should return true if WebXR and AR are supported', async () => {
        global.navigator = {
            xr: {
                isSessionSupported: vi.fn().mockResolvedValue(true),
            },
        };

        const result = await xrUtils.initialLoadingChecks();

        expect(result).toBe(true);
    });

    it('should handle an undefined navigator gracefully', async () => {
        global.navigator = undefined;

        const result  = await xrUtils.initialLoadingChecks();

        expect(mockPopulateSetXRError).toHaveBeenCalledWith('Navigator object is undefined.');
        expect(result).toBe(false);
    });
});

describe('performHitTest', () => {
    it('should return the correct position and normal when hit is detected', async () => {
        const mockSession = {
            requestHitTestSource: vi.fn().mockResolvedValue({
                getResults: vi.fn().mockResolvedValue([
                    {
                        pose: {
                            transform: {
                                position: { x: 1, y: 2, z: 3},
                                orientation: { x: 0, y: 1, z: 0, w: 0},
                            },
                        },
                    },
                ]),
            }),
        };

        const mockReferenceSpace = {};

        const hitTestResult = await xrUtils.performHitTest(mockSession, mockReferenceSpace);

        expect(hitTestResult).toEqual([
            {
            position: { x: 1, y:2, z: 3},
            normal: { x: 0, y: 1, z: 0, w: 0 },
            }
        ]);
    });

    it('should return null if no hits are detected', async () => {
        const mockSession = {
            requestHitTestSource: vi.fn().mockResolvedValue({
                getResults: vi.fn().mockResolvedValue([]),
            }),
        };

        const mockReferenceSpace = {};

        const hitTestResult = await xrUtils.performHitTest(mockSession, mockReferenceSpace);

        expect(hitTestResult).toEqual([]);
    });
});

