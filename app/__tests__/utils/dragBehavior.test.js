const BABYLON = require('@babylonjs/core');
const { applyDragBehavior } = require('../../render/_utils/dragBehavior');

jest.mock('@babylonjs/core', () => ({
    PointerDragBehavior: jest.fn(),
    StandardMaterial: jest.fn(),
    Color3: {
        Green: jest.fn(() => ({ diffuseColor: 'green' })),
        White: jest.fn(() => ({ diffuseColor: 'white' })),
    },
    PhysicsImpostor: jest.fn().mockImplementation(() => ({
        setLinearVelocity: jest.fn(),
        setAngularVelocity: jest.fn(),
        linearDamping: 0, 
    })),
    Vector3: jest.fn().mockImplementation((x, y, z) => {
        return { x, y, z };
    }),
}));

let mockObject;
let mockScene;
let mockDragBehavior;

beforeEach(() => {
    mockObject = {
        addBehavior: jest.fn(),  
        position: { x: 0, y: 0, z: 0 },
        material: null,
        physicsImpostor: new BABYLON.PhysicsImpostor(),
        isPickable: true,
        isDragBehaviorApplied: false,
    };

    mockScene = {}

    mockDragBehavior = {
        onDragStartObservable: {
            add: jest.fn(),
        },
        onDragEndObservable: {
            add: jest.fn(),
        }
    };

    // Make sure PointerDragBehavior returns the mock drag behavior
    BABYLON.PointerDragBehavior.mockImplementation(() => mockDragBehavior);
});

describe('applyDragBehavior', () => {
    it('should apply drag behavior to the object given', () => {
        const result = applyDragBehavior(mockObject, mockScene);
    
        expect(mockObject.addBehavior).toHaveBeenCalledWith(mockDragBehavior);
        expect(result).toBe(mockDragBehavior);
    });

    it('should modify object material and physics on the drag start', () => {

        applyDragBehavior(mockObject, mockScene);

        const dragStartCallback = mockDragBehavior.onDragStartObservable.add.mock.calls[0][0];

        dragStartCallback();

        expect(mockObject.material).toBeInstanceOf(BABYLON.StandardMaterial);
        expect(mockObject.material.diffuseColor.diffuseColor).toBe('green');

        expect(mockObject.physicsImpostor.linearDamping).toBe(0.9);
    });

    it('should modify object material and physics on the drag end', () => {

        applyDragBehavior(mockObject, mockScene);

        const dragEndCallback = mockDragBehavior.onDragEndObservable.add.mock.calls[0][0];

        dragEndCallback();

        expect(mockObject.material).toBeInstanceOf(BABYLON.StandardMaterial);
        expect(mockObject.material.diffuseColor.diffuseColor).toBe('white');

        expect(mockObject.physicsImpostor.linearDamping).toBe(0);
    });

    it('should not add the same behavior multiple times', () => {
        const result = applyDragBehavior(mockObject, mockScene);
        
        applyDragBehavior(mockObject, mockScene);
        
        expect(mockObject.addBehavior).toHaveBeenCalledTimes(1);
    });

    it('should not modify object material and physics if drag behavior is disabled', () => {
        mockObject.isPickable = false;
        
        applyDragBehavior(mockObject, mockScene);
    
        const dragStartCallback = mockDragBehavior.onDragStartObservable.add.mock.calls[0][0];
        dragStartCallback();
    
        expect(mockObject.physicsImpostor.linearDamping).toBe(0);
    });
    
});

