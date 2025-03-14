import { describe, it, vi, expect, beforeEach } from 'vitest';
import * as xrUtils from '../../roomCapture/_utils/xrUtils';


global.alert = vi.fn();

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

