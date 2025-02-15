const React = require('react');
const styles = require('./CRUDModal.module.css');
const { useState } = require('react');

const CRUDModal = ({ onClose, onCreate }) => {
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData, 
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onCreate(formData);
        onClose();
    };

    return (
        <div className={styles["crud-modal"]}>
            <div className={styles["crud-modal-content"]}>
                <h2>Create New Furniture</h2>
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

                    <div>
                        <button type="submit">Create Furniture</button>
                        <button type="button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CRUDModal;

