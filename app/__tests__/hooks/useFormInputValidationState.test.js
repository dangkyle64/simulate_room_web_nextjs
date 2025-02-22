/**
 * @file Unit tests for the useFormInputValidationState hook.
 * Tests various invalid input scenarios for form data and checks that the hook
 * correctly handles errors for different edge cases, as well as valid data.
 */

const { renderHook } = require('@testing-library/react');
const assert = require('assert');

const useFormInputValidationState = require('../../furniture/_hooks/useFormInputValidationState');

describe('useForInputValidationState', () => {
    it('return errors for invalid data', () => {
        const invalidFormData = {
            type: '', 
            modelUrl: 'not-a-url', 
            length: 0, 
            width: -100,  
            height: 0, 
            rotation_x: NaN, 
            rotation_y: NaN, 
            rotation_z: NaN, 
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormData));

        assert.ok(result.current.type);
        assert.ok(result.current.modelUrl);
        assert.ok(result.current.length);
        assert.ok(result.current.width);
        assert.ok(result.current.height);
        assert.ok(result.current.rotation_x);
        assert.ok(result.current.rotation_y);
        assert.ok(result.current.rotation_z);
    });

    it('return errors for invalid type with spaces', () => {
        const invalidFormDataWithSpaces = { 
            type: '   ', 
            modelUrl: 'https://example.com', 
            length: 10, 
            width: 10, 
            height: 10, 
            rotation_x: 0, 
            rotation_y: 0, 
            rotation_z: 0 
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormDataWithSpaces));

        assert.ok(result.current.type);
    });

    it('return errors for invalid type integer input', () => {
        const invalidFormDataWithNonStringType = { 
            type: 123, 
            modelUrl: 'https://example.com', 
            length: 10, 
            width: 10, 
            height: 10, 
            rotation_x: 0, 
            rotation_y: 0, 
            rotation_z: 0 
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormDataWithNonStringType));

        assert.ok(result.current.type);
    });

    it('return errors for invalid type null input', () => {
        const invalidFormDataWithNullType = { 
            type: null, 
            modelUrl: 'https://example.com', 
            length: 10, 
            width: 10, 
            height: 10, 
            rotation_x: 0, 
            rotation_y: 0, 
            rotation_z: 0 
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormDataWithNullType));

        assert.ok(result.current.type);
    });

    it('return errors for invalid type boolean input', () => {
        const invalidFormDataWithBooleanType = { 
            type: true, 
            modelUrl: 'https://example.com', 
            length: 10, 
            width: 10, 
            height: 10, 
            rotation_x: 0, 
            rotation_y: 0, 
            rotation_z: 0 
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormDataWithBooleanType));

        assert.ok(result.current.type);
    });

    it('return errors for invalid url format input', () => {
        const invalidFormDataWithIncorrectUrl = { 
            type: 'Chair', 
            modelUrl: 'www.example.com', 
            length: 10, 
            width: 10, 
            height: 10, 
            rotation_x: 0, 
            rotation_y: 0, 
            rotation_z: 0 
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormDataWithIncorrectUrl));

        assert.ok(result.current.modelUrl);
    });

    it('return errors for slightly over limit integer input', () => {
        const invalidFormDataWithSlightlyOverValues = { 
            type: 'Chair', 
            modelUrl: 'www.example.com', 
            length: 21, 
            width: 21, 
            height: 21, 
            rotation_x: 191, 
            rotation_y: 191, 
            rotation_z: 191 
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormDataWithSlightlyOverValues));

        assert.ok(result.current.modelUrl);
    });

    it('return errors for extremely over limit integer input', () => {
        const invalidFormDataWithExtremeOverValues = { 
            type: 'Chair', 
            modelUrl: 'www.example.com', 
            length: 21000000000000, 
            width: 21000000000000, 
            height: 21000000000000, 
            rotation_x: 191000000000000, 
            rotation_y: 191000000000000, 
            rotation_z: 191000000000000
        };

        const { result } = renderHook(() => useFormInputValidationState(invalidFormDataWithExtremeOverValues));

        assert.ok(result.current.modelUrl);
    });

    it('returns errors for missing required fields', () => {
        const formDataWithMissingFields = {
            // Missing 'type' and 'modelUrl'
            length: 10,
            width: 10,
            height: 10,
            rotation_x: 0,
            rotation_y: 0,
            rotation_z: 0
        };
    
        const { result } = renderHook(() => useFormInputValidationState(formDataWithMissingFields));
    
        assert.ok(result.current.type);
        assert.ok(result.current.modelUrl);
    });

    it('returns errors for invalid characters in type', () => {
        const invalidTypeWithSpecialChars = { 
            type: 'Chair@!', 
            modelUrl: 'https://example.com', 
            length: 10, 
            width: 10, 
            height: 10, 
            rotation_x: 0, 
            rotation_y: 0, 
            rotation_z: 0 
        };
    
        const { result } = renderHook(() => useFormInputValidationState(invalidTypeWithSpecialChars));
    
        assert.ok(result.current.type);
    });
    
    it('returns no errors for valid data', () => {
        const validFormData = {
            type: 'Chair',
            modelUrl: 'https://example.com/chair-model',
            length: 10,
            width: 12,
            height: 15,
            rotation_x: 190,
            rotation_y: 50,
            rotation_z: 100,
        };
    
        const { result } = renderHook(() => useFormInputValidationState(validFormData));

        assert.deepStrictEqual(result.current, {});
    });
});


