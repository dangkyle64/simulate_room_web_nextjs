/**
 * Custom hook to handle form validation logic.
 * @param {Object} formData - Form data to validate.
 * @returns {Object} - Returns validation errors for the fields.
 */
const useFormInputValidationState = (formData) => {
    const validate = () => {
        const newErrors = {};
        // Stop special characters with this pattern
        const validTypePattern = /^[a-zA-Z0-9\s-']+$/;
        if (typeof formData.type !== 'string' || !validTypePattern.test(formData.type) || formData.type.trim().length === 0 ) {
            newErrors.type = 'Type is required (Example: Chair)';
        };
        
        const urlPattern = /^(https?:\/\/)[a-z0-9]+([-\w]*[a-z0-9])*\.[a-z]{2,}(:[0-9]+)?(\/[-\w]*)*(\?[;&a-z\%=]*)?(#[a-z]*)?$/i;
        if (typeof formData.type !== 'string' || formData.modelUrl.trim().length === 0 || !urlPattern.test(formData.modelUrl)) {
            newErrors.modelUrl = 'modelUrl is required (Example: https://example.com/chair-model)';
        };

        if (!Number.isInteger(Number(formData.length)) || formData.length > 20 || formData.length <= 0) {
            newErrors.length = 'Length is required and currently only supports up to a nonzero positive 20 measurements (Example: 15)';
        };

        if (!Number.isInteger(Number(formData.width)) || formData.width > 20 || formData.length <= 0) {
            newErrors.width = 'Width is required and currently only supports up to a nonzero positive 20 measurements (Example: 12)';
        };

        if (!Number.isInteger(Number(formData.height)) || formData.height > 20 || formData.length <= 0) {
            newErrors.height = 'Height is required and currently only supports up to a nonzero positive 20 measurements (Example: 1)';
        };

        if (!Number.isInteger(Number(formData.rotation_x))) {
            newErrors.rotation_x = 'Rotation X value is required (Example: 190)';
        };

        if (!Number.isInteger(Number(formData.rotation_y))) {
            newErrors.rotation_y = 'Rotation Y value is required (Example: 50)';
        };

        if (!Number.isInteger(Number(formData.rotation_z))) {
            newErrors.rotation_z = 'Rotation Z value is required (Example: 100)';
        };

        return newErrors;
    };

    return validate();
};

module.exports = useFormInputValidationState;