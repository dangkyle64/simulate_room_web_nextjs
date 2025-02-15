"use client";

const { fetchFurnitureData, createFurnitureData, updateFurnitureData, deleteFurnitureData } = require('../_furnitureApi/furnitureApi')
const { useEffect, useState } = require('react');
const FurnitureCard = require('./FurnitureCard').default;
const Modal = require('./Modal').default;
const CRUDButtons = require('./CRUDButtons').default;
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

    const handleCreate = async () => {
        const newFurniture = await createFurnitureData();
        setFurnitureData(prev => [...prev, newFurniture]);
    };

    const handleUpdate = async (id) => {
        const updatedFurniture = await updateFurnitureData(id);
        setFurnitureData(prev => 
            prev.map(furniture =>
                furniture.id === id ? updatedFurniture : furniture
            )
        );
    };

    const handleDelete = async (id) => {
        await deleteFurnitureData(id);
        setFurnitureData(prev => prev.filter(furniture => furniture.id !== id));
    };

    return (
      <div>
        <h1>Skeleton Furniture Home Page</h1>
        <p>Skeleton Furniture Home Page for Simulate Room</p>

        <CRUDButtons
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        
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