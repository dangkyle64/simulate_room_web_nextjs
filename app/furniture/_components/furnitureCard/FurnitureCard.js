import React from 'react';
import styles from './FurnitureCard.module.css';

/**
 * FurnitureCard component displays an individual furniture item.
 * It renders a card with the furniture type, which is clickable.
 * 
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.furniture - The furniture object to display.
 * @param {string} props.furniture.type - The type of the furniture (e.g., chair, table).
 * @param {Function} props.onClick - The callback function to call when the card is clicked.
 * 
 * @returns {JSX.Element} The rendered FurnitureCard component.
 */

export default function FurnitureCard({ furniture, onClick }) {
    return (
        <div className={styles.card} onClick={() => onClick(furniture)}>
            <h2>{furniture.type}</h2>
        </div>
    );
}