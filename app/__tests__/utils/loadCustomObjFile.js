import * as BABYLON from '@babylonjs/core';
import { getObjMeshes, selectMesh } from '../../render/_utils/loadCustomObjFile';

jest.mock('@babylonjs/core', () => ({
    SceneLoader: {
        ImportMeshAsync: jest.fn().mockResolvedValue({ meshes: ['mesh1', 'mesh2'] })
    }
}));

describe('getObjMeshes', () => {
    it('should return valid meshes when given a proper path and scene', async () => {
        const mockScene = { render: jest.fn() };
        const mockPath = '/assets/sofaduplicate.obj';

        const meshes = await getObjMeshes(mockPath, mockScene);

        expect(BABYLON.SceneLoader.ImportMeshAsync).toHaveBeenCalledWith('', mockPath, '', mockScene);

        expect(meshes).toEqual(['mesh1', 'mesh2']);
    });
});

describe('selectMesh', () => {
    it('should return the proper mesh when given a nonempty objMeshes and integer', () => {
        const mockObjMeshes = ['mesh1', 'mesh2'];
        const mockChoice = 0;

        const result = selectMesh(mockObjMeshes, mockChoice);

        expect(result).toEqual('mesh1');
    });
});