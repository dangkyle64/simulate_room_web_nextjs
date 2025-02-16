"use client";

const { fetchFurnitureData, createFurnitureData, updateFurnitureData, deleteFurnitureData } = require('../_furnitureApi/furnitureApi')
const { useEffect, useState } = require('react');
const FurnitureCard = require('./FurnitureCard').default;
const Modal = require('./Modal').default;
const CRUDModal = require('./CRUDModal').default;
const CRUDButtons = require('./CRUDButtons').default;
const styles = require('./FurnitureCard.module.css')
export default function furnitureHome() {

    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [furnitureData, setFurnitureData] = useState([]);
    const [showCreateModal, setCreateShowModal] = useState(false);
    const [showUpdateModal, setUpdateShowModal] = useState(false);

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
        setUpdateShowModal(true)
    };

    const handleCloseModal = () => {
      setSelectedFurniture(null); // Close the modal
    };

    const handleCloseCRUDModal = () => {
      setCreateShowModal(false);
      setUpdateShowModal(false);
    };

    const handleCreate = async (inputNewFurnitureData) => {
        //test input
        inputNewFurnitureData = {
            type: 'Chair',
            modelUrl: 'https://example.com/chair-model',
            length: 50,
            width: 60,
            height: 100,
            x_position: 10,
            y_position: 20,
            z_position: 30,
            rotation_x: 0,
            rotation_y: 45,
            rotation_z: 90,
        };

        const newFurniture = await createFurnitureData(inputNewFurnitureData);
        setFurnitureData(prev => [...prev, newFurniture]);
        setCreateShowModal(false);
    };

    const handleUpdate = async (inputUpdateFurnitureData) => {

        inputUpdateFurnitureData = {
          type: 'Updated Chair',
          modelUrl: 'https://example.com/updated-chair-model',
          length: 55,
          width: 65,
          height: 110,
          x_position: 15,
          y_position: 25,
          z_position: 35,
          rotation_x: 10,
          rotation_y: 50,
          rotation_z: 100,
        };

        id = 1

        const updatedFurniture = await updateFurnitureData(selectedFurniture.id, inputUpdateFurnitureData);
        setFurnitureData(prev => 
            prev.map(furniture =>
                furniture.id === selectedFurniture.id ? updatedFurniture : furniture
            )
        );

        setUpdateShowModal(false);
        setSelectedFurniture(null);
    };

    const handleDelete = async (id) => {
        await deleteFurnitureData(id);
        setFurnitureData(prev => prev.filter(furniture => furniture.id !== id));
    };

    const handleUpdateButtonClick = () => {
      console.log('selectedFurniture in handleUpdateButtonClick:', selectedFurniture);
      if (selectedFurniture) {
          setUpdateShowModal(true); 
      } else {
          alert('Please select a piece of furniture to update.');
      }
    };
    return (
      <div>
        <h1>Skeleton Furniture Home Page</h1>
        <p>Skeleton Furniture Home Page for Simulate Room</p>

        <CRUDButtons
          onCreate={() => setCreateShowModal(true)}
          onDelete={handleDelete}
        />

        <div className={styles['furniture-grid-container']}>
          <div className={styles['furniture-grid']}>
            {furnitureData.map(furniture => (
              <FurnitureCard
                key={furniture.id}
                furniture={furniture}
                onClick={() => handleFurnitureCardClick(furniture)}
              />
            ))}
          </div>
        </div>
        
        {showCreateModal && (
          <CRUDModal onClose={handleCloseCRUDModal} onCreate={handleCreate} existingFurniture={null}/>
        )}
        {showUpdateModal && selectedFurniture &&(
          <CRUDModal onClose={handleCloseCRUDModal} onUpdate={handleUpdate} existingFurniture={selectedFurniture}/>
        )}
      </div>
    );
};

/*

        {selectedFurniture && !showCreateModal && !showUpdateModal && (
          <Modal selectedFurniture={selectedFurniture} onClose={handleCloseModal} />
        )}

*/