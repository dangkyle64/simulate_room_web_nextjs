"use client";

const { fetchFurnitureData, createFurnitureData, updateFurnitureData, deleteFurnitureData } = require('../_furnitureApi/furnitureApi')
const { useEffect, useState } = require('react');
const FurnitureCard = require('./_components/furnitureCard/FurnitureCard').default;
const Modal = require('./_components/modals/Modal').default;
const CRUDModal = require('./_components/modals/CRUDModal').default;
const CRUDButtons = require('./_components/button/CRUDButtons').default;
const styles = require('./_components/furnitureCard/FurnitureCard.module.css');

const { useFurnitureState } = require('./_hooks/furnitureState');

export default function furnitureHome() {

    const [isUpdating, setIsUpdating] = useState(false);
    //const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [furnitureData, setFurnitureData] = useState([]);
    const [showCreateModal, setCreateShowModal] = useState(false);
    //const [showUpdateModal, setUpdateShowModal] = useState(false);

    useEffect(() => {
      async function fetchData() {
        const data = await fetchFurnitureData();
        setFurnitureData(data);
      }

      fetchData();
    }, []);

    const {
        selectedFurniture,
        showUpdateModal,
        openUpdateModal,
        closeUpdateModal,  
    } = useFurnitureState();

    const handleFurnitureCardClick = (furniture) => {
        //console.log('Selected Furniture', furniture);
        openUpdateModal(furniture);
    };

    const handleCloseCRUDModal = () => {
        closeUpdateModal();
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

        if (!selectedFurniture.id)  {
          console.error("No selected furniture to update");
          return;
        }

        console.log('Updating furniture:', selectedFurniture);
        setIsUpdating(true); // Set loading state
        try {
          
          const updatedFurniture = await updateFurnitureData(selectedFurniture.id, inputUpdateFurnitureData);
          
          if (updatedFurniture) {
            setFurnitureData(prev =>
            prev.map(furniture =>
              furniture.id === selectedFurniture.id ? updatedFurniture : furniture
            )
          );
          } else {
            console.error("Update failed, no data returned from the server");
          }
          // Update the furnitureData list
          

          // Close modal after update and clear selectedFurniture
          setIsUpdating(false);
          setUpdateShowModal(false);
          setSelectedFurniture(null);

        } catch(error) {
          console.error("Error updating furniture:", error);
        }  
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
          onCreate={() => setCreateShowModal(true)}
          onDelete={handleDelete}
        />

      <div className={styles['furniture-grid-container']}>
        <div className={styles['furniture-grid']}>
          {!isUpdating && furnitureData.map(furniture => (
            furniture && furniture.id ? (
              <FurnitureCard
                key={furniture.id}
                furniture={furniture}
                onClick={() => handleFurnitureCardClick(furniture)}
              />
            ) : null
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