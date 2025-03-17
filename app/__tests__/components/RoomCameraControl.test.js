import { beforeEach, describe, vi, expect, it } from "vitest";
import { handleARSession } from "../../roomCapture/_component/RoomCameraControl";

describe('handleARSession', () => {

    let handleStartARSession;
    let handleEndARSession;
    let session;

    beforeEach(() => {
        vi.clearAllMocks();

        handleStartARSession = vi.fn();
        handleEndARSession = vi.fn();

        session = { requestAnimationFrame: () => {} };
    });

    it('should call handleEndARSession when session is truthy', async () => {

        await handleARSession(session, handleEndARSession, handleStartARSession);

        expect(handleEndARSession).toHaveBeenCalledTimes(1);
        expect(handleStartARSession).toHaveBeenCalledTimes(0);
    });

    it('should call handleStartARSession when session is null', async () => {
        
        session = null;
        
        await handleARSession(session, handleEndARSession, handleStartARSession);

        expect(handleEndARSession).toHaveBeenCalledTimes(0);
        expect(handleStartARSession).toHaveBeenCalledTimes(1);
    });

    it('should call handleStartARSession when session is undefined', async () => {
        
        session = undefined;
        
        await handleARSession(session, handleEndARSession, handleStartARSession);

        expect(handleEndARSession).toHaveBeenCalledTimes(0);
        expect(handleStartARSession).toHaveBeenCalledTimes(1);
    });

    it('should call handleStartARSession when session is false', async () => {
        
        session = false;
        
        await handleARSession(session, handleEndARSession, handleStartARSession);

        expect(handleEndARSession).toHaveBeenCalledTimes(0);
        expect(handleStartARSession).toHaveBeenCalledTimes(1);
    });
});

/**
 * describe('startCameraFeed and stopCameraFeed', () => {
    let mockVideoRef;
    let mockSetIsCameraStarted;

    beforeEach(() => {
        vi.clearAllMocks();
        global.navigator.mediaDevices = {
            getUserMedia: vi.fn()
        };

        mockVideoRef = {
            current: {
                srcObject: null, 
                play: vi.fn(),
            },
        };
        
        mockSetIsCameraStarted = vi.fn();
    });

    it('should set the video stream and start playing', async () => {
        
        const mockStream = { getTracks: vi.fn() };
        global.navigator.mediaDevices.getUserMedia.mockResolvedValue(mockStream);

        await startCameraFeed(mockVideoRef, mockSetIsCameraStarted);

        expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 },
            },
        });

        expect(mockVideoRef.current.srcObject).toBe(mockStream);
        expect(mockVideoRef.current.play).toHaveBeenCalled();
        expect(mockSetIsCameraStarted).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
        const mockConsoleError = vi.fn();
        global.console.error = mockConsoleError;

        global.navigator.mediaDevices.getUserMedia.mockRejectedValue(new Error('Camera access denied'));

        await startCameraFeed(mockVideoRef, mockSetIsCameraStarted);

        expect(mockConsoleError).toHaveBeenCalledWith("Error accessing the camera: ", expect.any(Error));
        expect(mockSetIsCameraStarted).not.toHaveBeenCalled();
    });

    it('should handle null videoRef.current gracefully', async () => {
        mockVideoRef.current = null;
        const mockStream = { getTracks: vi.fn() };
        global.navigator.mediaDevices.getUserMedia.mockResolvedValue(mockStream);

        await startCameraFeed(mockVideoRef, mockSetIsCameraStarted);

        expect(mockVideoRef.current).toBeNull();
        expect(mockSetIsCameraStarted).toBeCalled();
    });

    it('should handle when device is not supported', async () => {
        global.navigator.mediaDevices = undefined;

        await startCameraFeed(mockVideoRef, mockSetIsCameraStarted);

        expect(global.navigator.mediaDevices).toBeUndefined();
        expect(mockSetIsCameraStarted).not.toHaveBeenCalled();
    });

    it('should mute the video feed when starting the camera', async () => {
        const mockStream = { getTracks: vi.fn() };
        global.navigator.mediaDevices.getUserMedia(mockStream);

        await startCameraFeed(mockVideoRef, mockSetIsCameraStarted);

        expect(mockVideoRef.current.muted).toBe(true);
        expect(mockVideoRef.current.play).toHaveBeenCalled();
    });

    it('should handle autoplay rejection gracefully', async () => {
        const mockStream = { getTracks: vi.fn() };
        global.navigator.mediaDevices.getUserMedia.mockResolvedValue(mockStream);

        mockVideoRef.current.play.mockRejectedValue(new Error('Autoplay blocked'));

        await startCameraFeed(mockVideoRef, mockSetIsCameraStarted);

        expect(mockVideoRef.current.play).toHaveBeenCalled();
        expect(mockVideoRef.current.srcObject).toBe(mockStream);
        expect(global.console.error).toHaveBeenCalledWith('Error starting video playback: ', expect.any(Error));
    });
    
    it('should stop all tracks and set isCameraStarted to false', () => {
        const mockStream = {
            getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
        };
        mockVideoRef.current.srcObject = mockStream;

        stopCameraFeed(mockVideoRef, mockSetIsCameraStarted);

        expect(mockStream.getTracks()[0].stop).toHaveBeenCalled();
        expect(mockSetIsCameraStarted).toHaveBeenCalled();
    });
});
 */