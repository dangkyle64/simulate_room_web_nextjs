"use client";

const FurnitureCard = require('./_components/furnitureCard/FurnitureCard').default;
const Modal = require('./_components/modals/Modal').default;
const CRUDModal = require('./_components/modals/CRUDModal').default;
const CRUDButtons = require('./_components/button/CRUDButtons').default;
const styles = require('./_components/furnitureCard/FurnitureCard.module.css');

const { useFurnitureState } = require('./_hooks/furnitureState');

export default function furnitureHome() {

    const {
        furnitureData,
        selectedFurniture,
        isUpdatingFurnitureData,
        isDeletingFurnitureData,
        showUpdateModal,
        showCreateModal,
        createFurniture,
        updateFurniture,
        deleteFurniture,
        startUpdating,
        openUpdateModal,
        closeUpdateModal,
        openCreateModal,
        closeCreateModal,
    } = useFurnitureState();

    const handleFurnitureCardClick = (furniture) => {
        //console.log('Selected Furniture', furniture);
        openUpdateModal(furniture);
    };

    const handleCloseCRUDModal = () => {
        closeCreateModal();
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

        await createFurniture(inputNewFurnitureData)
    };

    const handleUpdate = async (inputUpdateFurnitureData) => {

        if (!selectedFurniture.id)  {
            console.error("No selected furniture to update");
            return;
        }

        console.log('Updating furniture:', selectedFurniture);
        startUpdating();

        await updateFurniture(inputUpdateFurnitureData);
    };

    const handleDelete = async (id) => {

        if (!selectedFurniture.id) {
            console.error("No selected furniture to delete");
            return;
        };
        console.log('Deleting Furniture', selectedFurniture);
        await deleteFurniture();
    };

    return (
      <div>
        <h1>Skeleton Furniture Home Page</h1>
        <p>Skeleton Furniture Home Page for Simulate Room</p>

        <CRUDButtons
          onCreate={() => openCreateModal()}
          onDelete={handleDelete}
        />

      <div className={styles['furniture-grid-container']}>
        <div className={styles['furniture-grid']}>
          {!isUpdatingFurnitureData && furnitureData.map(furniture => (
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
          <CRUDModal onClose={handleCloseCRUDModal} onUpdate={handleUpdate} onDelete={handleDelete} existingFurniture={selectedFurniture}/>
        )}
      </div>
    );
};