const { useState } = require('react');

/**
 * Custom hook to manage form errors and validation.
 * @returns {Object} error state and a function to set errors
 */

const useErrorState =  () => {
    const [errors, setErrors] = useState({
        type: '',
        modelUrl: '',
        length: '',
        width: '',
        height: '',
        x_position: '',
        y_position: '',
        z_position: '',
        rotation_x: '',
        rotation_y: '',
        rotation_z: '',
    });

    /**
     * Sets error messages based on validation checks.
     * @param {Object} newErrors - Error object to update state.
     */
    const setFormErrors = (newErrors) => {
        setErrors(newErrors);
    };

    return {
        errors,
        setFormErrors,
    };
};

export default useErrorState;