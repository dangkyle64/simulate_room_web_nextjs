"use client";

const { fetchFurnitureData } = require('../_api/furnitureApi');
const FurnitureCard = require('./FurnitureCard').default;
const { useEffect, useState } = require('react');
const Modal = require('./Modal').default;
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

    const handleCloseModal = () => {
      setSelectedFurniture(null); // Close the modal
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
          <Modal selectedFurniture={selectedFurniture} onClose={handleCloseModal} />
        )}
        
      </div>
    );
};