import { renderHook, act } from '@testing-library/react';
import { useRoomCaptureState } from '../../roomCapture/_hooks/useRoomCaptureState';
import { vi, beforeEach, describe, expect, afterEach } from 'vitest';

beforeEach(() => {
    global.navigator.mediaDevices = {
        getUserMedia: vi.fn(),
    };
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('useRoomCaptureState', () => {
    it('should initialize with camera not started', () => {
        const { result } = renderHook(() => useRoomCaptureState());

        expect(result.current.isCameraStarted).toBe(false);
    });

    it('should start camera successfully', async () => {
        const { result } = renderHook(() => useRoomCaptureState());

        await act(async () => {
            result.current.startRoomCamera();
        });

        expect(result.current.isCameraStarted).toBe(true);
    });

    it('should stop camera and change state to false when stopCamera is called', () => {
        const { result } = renderHook(() => useRoomCaptureState());

        act(async () => {
            result.current.startRoomCamera();
        });

        act(async () => {
            result.current.stopRoomCamera();
        });

        expect(result.current.isCameraStarted).toBe(false);
    });
});