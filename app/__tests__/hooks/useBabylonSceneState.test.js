const BABYLON = require('@babylonjs/core');
const { renderHook } = require('@testing-library/react');
const { useBabylonSceneState } = require('../../render/_hooks/useBabylonSceneState');

jest.mock('@babylonjs/core', () => ({
    Engine: jest.fn(),
    Scene:jest.fn(),
}));

describe('useBabylonSceneState', () => {
    it('should initialize with the default values null', () => {
        const { result } = renderHook(() => useBabylonSceneState());
        expect(result.current.canvasRef.current).toBe(null);
        expect(result.current.sceneRef.current).toBe(null);
        expect(result.current.selectedObjectRef.current).toBe(null);
    });

    it('should initialize the camera array with default value []', () => {
        const { result } = renderHook(() => useBabylonSceneState());
        expect(result.current.camerasRef.current).toStrictEqual([]);
    });

    it('should set canvasRef.current when canvas element exists', async () => {
        const mockCanvasElement = { id: 'renderCanvas' };

        const { result } = renderHook(() => useBabylonSceneState());

        result.current.setCanvas(mockCanvasElement);

        expect(result.current.canvasRef.current).toBe(mockCanvasElement)
    });

    it('should set sceneRef.current when scene object exists', () => {
        const mockEngine = { createScene: jest.fn() };
        const mockScene = { render: jest.fn() };
        BABYLON.Engine.mockImplementation(() => mockEngine);
        BABYLON.Scene.mockImplementation(() => mockScene);

        const { result } = renderHook(() => useBabylonSceneState());

        result.current.setScene(mockScene);

        expect(result.current.sceneRef.current).toBe(mockScene);
    });

    it('should set camerasRef.current when camera array exists', () => {
        const mockCamera1 = ''
        const mockCamera2 = ''
        const mockCameraArray = [mockCamera1, mockCamera2];

        const { result } = renderHook(() => useBabylonSceneState());

        result.current.setCameras(mockCameraArray);

        expect(result.current.camerasRef.current).toBe(mockCameraArray);
    });

    it('should set selectedObjectRef.current when the interacted object exists', () => {
        const mockPickResult = {
            hit: true,
            pickedMesh: { id: 1, name: 'Test Object'},
        };

        const { result } = renderHook(() => useBabylonSceneState());

        result.current.setSelectedObject(mockPickResult);

        expect(result.current.selectedObjectRef.current).toBe(mockPickResult);
    });
});