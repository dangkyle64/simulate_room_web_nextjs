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

    it('should stop camera and change state to false when stopCamera is called', async () => {
        const { result } = renderHook(() => useRoomCaptureState());

        await act(async () => {
            result.current.startRoomCamera();
        });

        await act(async () => {
            result.current.stopRoomCamera();
        });

        expect(result.current.isCameraStarted).toBe(false);
    });

    it('should load the session initially as null', () => {
        const { result } = renderHook(() => useRoomCaptureState());

        expect(result.current.session).toBeNull();
    });

    it('should set session state', async () => {
        const { result } = renderHook(() => useRoomCaptureState());
        const mockSession = { id: 123 };

        await act(async () => {
            result.current.setSessionState(mockSession);
        });

        expect(result.current.session).toEqual(mockSession);
    });

    it('should initialize referenceSpace state as null', () => {
        const { result } = renderHook(() => useRoomCaptureState());

        expect(result.current.referenceSpace).toBeNull();
    });

    it('should set referenceSpace state', async () => {
        const { result } = renderHook(() => useRoomCaptureState());
        const mockReferenceSpace = { type: 'floor' };

        await act(async () => {
            result.current.setReferenceSpaceState(mockReferenceSpace);
        });

        expect(result.current.referenceSpace).toEqual(mockReferenceSpace);
    });

    it('should initialize hitTestSource state as null', () => {
        const { result } = renderHook(() => useRoomCaptureState());

        expect(result.current.hitTestSource).toBeNull();
    });

    it('should set hitTestSource state', async () => {
        const { result } = renderHook(() => useRoomCaptureState());
        const mockHitTestSource = { sourceId: 'xyz' };

        await act(async () => {
            result.current.setHitTestSourceState(mockHitTestSource);
        });

        expect(result.current.hitTestSource).toEqual(mockHitTestSource);
    });

    it('should initialize isSessionActive state as false', () => {
        const { result } = renderHook(() => useRoomCaptureState());

        expect(result.current.isSessionActive).toBe(false);
    });

    it('should set isSessionActive state to true', async () => {
        const { result } = renderHook(() => useRoomCaptureState());

        await act(async () => {
            result.current.setSessionActive();
        });

        expect(result.current.isSessionActive).toBe(true);
    });

    it('should set isSessionActive state to false', async () => {
        const { result } = renderHook(() => useRoomCaptureState());

        await act(async () => {
            result.current.setSessionActive();
        });

        await act(async () => {
            result.current.setSessionNotActive();
        });

        expect(result.current.isSessionActive).toBe(false);
    });
});