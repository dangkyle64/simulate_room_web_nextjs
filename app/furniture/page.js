"use client";

const { fetchFurnitureData } = require('../_api/furnitureApi');
const FurnitureCard = require('./FurnitureCard').default;
const { useEffect, useState } = require('react');
const styles = require('./FurnitureCard.module.css')
export default function furnitureHome() {

    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [furnitureData, setFurnitureData] = useState([]);

    useEffect(() => {
      async function fetchData() {
        const data = await fetchFurnitureData();
        setFurnitureData(data);
      }

      fetchData();
    }, []);

    const handleFurnitureCardClick = (furniture) => {
        console.log('Selected Furniture', furniture);
        setSelectedFurniture(furniture);
    };

    return (
      <div>
        <h1>Skeleton Furniture Home Page</h1>
        <p>Skeleton Furniture Home Page for Simulate Room</p>
        <div className={styles['furniture-grid-container']}>
          <div className={styles['furniture-grid']}>
            {furnitureData.map(furniture => (
              <FurnitureCard
                key={furniture.id}
                furniture={furniture}
                onClick={handleFurnitureCardClick}
              />
            ))}
          </div>
        </div>

        {selectedFurniture && (
          <div className="furniture-details">
            <h2>{selectedFurniture.type}</h2>
            <p>Length: {selectedFurniture.length}, Width: {selectedFurniture.width}, Height: {selectedFurniture.height}</p>
            <p>Location: x:{selectedFurniture.x_position}, y:{selectedFurniture.y_position}, z:{selectedFurniture.z_position}</p>
            <p>Rotation: x: {selectedFurniture.rotation_x} y: {selectedFurniture.rotation_y} z: {selectedFurniture.rotation_z}</p>
          </div>
        )}
        
      </div>
    );
};