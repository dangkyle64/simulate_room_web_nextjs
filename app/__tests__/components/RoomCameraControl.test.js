import { beforeEach, describe, vi, expect } from "vitest";
import { startCameraFeed, stopCameraFeed } from "../../roomCapture/_component/RoomCameraControl";

describe('startCameraFeed and stopCameraFeed', () => {
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