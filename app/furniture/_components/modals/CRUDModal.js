// import react package and required hooks
const React = require('react');
const { useState, useEffect } = require('react');

// import styles file for the CRUDModal component
const styles = require('./CRUDModal.module.css');

/**
 * CRUDModal component handles the creation, update, and deletion of furniture data.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onCreate - Function to create new furniture.
 * @param {Function} props.onUpdate - Function to update existing furniture.
 * @param {Function} props.onDeleteConfirm - Function to delete furniture.
 * @param {Object|null} props.existingFurniture - Furniture data to edit, or null for creating new furniture.
 * @returns {JSX.Element} - The rendered CRUDModal component.
 */
const CRUDModal = ({ onClose, onCreate, onUpdate, onDeleteConfirm, existingFurniture }) => {

    /**
     * State to manage the form data for the modal.
     * @type {Object}
     * @property {string} type - Type of the furniture.
     * @property {string} modelUrl - URL for the model.
     * @property {string} length - Length of the furniture.
     * @property {string} width - Width of the furniture.
     * @property {string} height - Height of the furniture.
     * @property {string} x_position - X position of the furniture.
     * @property {string} y_position - Y position of the furniture.
     * @property {string} z_position - Z position of the furniture.
     * @property {string} rotation_x - Rotation in the X axis.
     * @property {string} rotation_y - Rotation in the Y axis.
     * @property {string} rotation_z - Rotation in the Z axis.
     */
    const [formData, setFormData] = useState({
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
     * Effect hook to initialize form data with existing furniture data.
     * Runs when `existingFurniture` prop changes.
     * @param {Object} existingFurniture - Furniture object to populate the form fields.
     */
    useEffect(() => {
        if (existingFurniture) {
            setFormData({
                type: existingFurniture.type || '',
                modelUrl: existingFurniture.modelUrl || '',
                length: existingFurniture.length || '',
                width: existingFurniture.width || '',
                height: existingFurniture.height || '',
                x_position: existingFurniture.x_position || '',
                y_position: existingFurniture.y_position || '',
                z_position: existingFurniture.z_position || '',
                rotation_x: existingFurniture.rotation_x || '',
                rotation_y: existingFurniture.rotation_y || '',
                rotation_z: existingFurniture.rotation_z || '',
            });
        };
    }, [existingFurniture]);

    /**
     * Handles changes to form input fields.
     * @param {Event} event - The event triggered by the input change.
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData, 
            [name]: value,
        }));
    };

    /**
     * Handles form submission, either creating or updating furniture data.
     * @param {Event} event - The form submit event.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (existingFurniture) {
            await onUpdate(formData);
        } else {
            await onCreate(formData);
        };
        onClose();
    };

    /**
     * Handles the confirmation of deleting furniture data.
     * @param {Event} event - The event triggered by the delete button.
     */
    const handleDeleteConfirm = (event) => {
        console.log("Called handleDeleteConfirm. ")
        if (existingFurniture) {
            onDeleteConfirm();
        };
    };

    return (
        <div className={styles["crud-modal"]}>
            <div className={styles["crud-modal-content"]}>
                <h2>{existingFurniture ? 'Update Furniture' : 'Create New Furniture'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Type:</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    />

                    <label>Model URL:</label>
                    <input
                        type="text"
                        name="modelUrl"
                        value={formData.modelUrl}
                        onChange={handleChange}
                    />

                    <label>Length:</label>
                    <input
                        type="text"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                    />

                    <label>Width:</label>
                    <input
                        type="text"
                        name="width"
                        value={formData.width}
                        onChange={handleChange}
                    />

                    <label>Height:</label>
                    <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                    />

                    <label>Rotation X:</label>
                    <input
                        type="number"
                        name="rotation_x"
                        value={formData.rotation_x}
                        onChange={handleChange}
                    />

                    <div>
                        <button type="submit">{existingFurniture ? 'Update Furniture' : 'Create Furniture'}</button>
                        {existingFurniture && (
                            <button type="button" onClick={handleDeleteConfirm} className={styles["delete-button"]}>
                                Delete Furniture
                            </button>
                        )}
                        <button type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CRUDModal;

