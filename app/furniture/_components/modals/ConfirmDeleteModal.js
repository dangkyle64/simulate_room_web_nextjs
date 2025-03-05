import styles from './ConfirmDeleteModal.module.css';

/**
 * ConfirmDeleteModal component - A modal that asks the user to confirm if they want to delete a furniture item.
 * 
 * @param {Object} props
 * @param {function} props.onDelete - Function to call when the user confirms deletion.
 * @param {function} props.onClose - Function to call when the modal is closed without deletion.
 * @param {Object} props.existingFurniture - The furniture item to be deleted, contains properties like `type`.
 * 
 * @returns {JSX.Element} The modal UI with options to delete or close.
 */

const ConfirmDeleteModal = ({ onDelete, onClose, existingFurniture }) => {

    // handles delete action
    // calls `onDelete` prop function to delete the item 
    const handleDelete = async () => {
        await onDelete();
    };

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

// Export the component so it can be used in other parts of the application
export default ConfirmDeleteModal;
