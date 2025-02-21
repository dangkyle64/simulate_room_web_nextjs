const { renderHook } = require('@testing-library/react');
const assert = require('assert');

const useFormInputValidationState = require('../../furniture/_hooks/useFormInputValidationState');

describe('useForInputValidationState', () => {
    it('return errors for invalid data', () => {
        const invalidFormData = {
            type: '', 
            modelUrl: 'not-a-url', 
            length: 0, 
            width: 0,  
            height: 0, 
            rotation_x: NaN, 
            rotation_y: NaN, 
            rotation_z: NaN, 
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormData));

        assert.strictEqual(result.current.type, 'Type is required (Example: Chair)');
    });
});