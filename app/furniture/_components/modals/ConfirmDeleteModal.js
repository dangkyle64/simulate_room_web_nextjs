const styles = require('./ConfirmDeleteModal.module.css');

const ConfirmDeleteModal = ({ onDelete, onClose, existingFurniture }) => {

    const handleDelete = async () => {
        console.log("Called handleDelete in Modal");
        await onDelete();
    };

    //console.log("ConfirmDelete Modal loaded.")
    return (
        <div className={styles["confirm-delete-modal-overlay"]} onClick={onClose}>
            <div className={styles["confirm-delete-modal-content"]}>
                <h2>Are you sure you want to delete this furniture below?</h2>
                <h2>{existingFurniture.type}</h2>
                <button onClick={handleDelete}>DELETE</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
// click button -> load up this modal to ask for confirmation -> if yes delete, if not close the window 