const React = require('react');
const styles = require('./CRUDModal.module.css');
const { useState, useEffect } = require('react');

const CRUDModal = ({ onClose, onCreate, onUpdate, onDelete, existingFurniture }) => {
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData, 
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (existingFurniture) {
            await onUpdate(formData);
        } else {
            await onCreate(formData);
        };
        onClose();
    };

    const handleDelete = async (event) => {
        if (existingFurniture) {
            await onDelete();
            onClose();
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
                            <button type="button" onClick={handleDelete} className={styles["delete-button"]}>
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

