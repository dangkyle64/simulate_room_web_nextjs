const Modal = ({ selectedFurniture, onClose }) => {
    console.log("Testing", selectedFurniture);
    if (!selectedFurniture) return null;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{selectedFurniture.type}</h2>
          <p>Length: {selectedFurniture.length}, Width: {selectedFurniture.width}, Height: {selectedFurniture.height}</p>
          <p>Location: x:{selectedFurniture.x_position}, y:{selectedFurniture.y_position}, z:{selectedFurniture.z_position}</p>
          <p>Rotation: x: {selectedFurniture.rotation_x} y: {selectedFurniture.rotation_y} z: {selectedFurniture.rotation_z}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  