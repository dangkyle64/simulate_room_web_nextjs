const React = require('react');
const styles = require('./FurnitureCard.module.css')

export default function FurnitureCard({ furniture, onClick }) {
    return (
        <div className={styles.card} onClick={() => onClick(furniture)}>
            <h2>{furniture.type}</h2>
            <p>Length: {furniture.length}, Width: {furniture.width}, Height: {furniture.height}</p>
            <p>Location: x:{furniture.x_position}, y:{furniture.y_position}, z:{furniture.z_position}</p>
            <p>Rotation: x: {furniture.rotation_x} y: {furniture.rotation_y} z: {furniture.rotation_z}</p>
        </div>
    );
}