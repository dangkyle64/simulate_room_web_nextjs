const { useEffect, useState } = require('react');
const { fetchFurnitureData, fetchSpecificFurnitureData, createFurnitureData, updateFurnitureData, deleteFurnitureData } = require('../../_furnitureApi/furnitureApi');

export function useFurnitureState() {

    const [furnitureData, setFurnitureData] = useState([]);
    const [selectedFurniture, setSelectedFurniture] = useState(null);

    const [isUpdatingFurnitureData, setIsUpdatingFurnitureData] = useState(false);
    const [isDeletingFurnitureData, setIsDeletingFurnitureData] = useState(false);

    const [showCreateModal, setCreateShowModal] = useState(false);
    const [showUpdateModal, setUpdateShowModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const data = await fetchFurnitureData();
            setFurnitureData(data);
        };

        fetchData();
    }, []);

    const createFurniture = async (inputNewFurnitureData) => {
        try {
            const newFurniture = await createFurnitureData(inputNewFurnitureData);
            setFurnitureData((prev) => [...prev, newFurniture]);
            setCreateShowModal(false);
        } catch(error) {
            console.error(error);
            setError(error.message);
        };
    };

    const updateFurniture = async (inputUpdateFurnitureData) => {
        try {
            const updateFurniture = await updateFurnitureData(selectedFurniture.id, inputUpdateFurnitureData);

            console.log('Updated Furniture from Backend:', updateFurniture);
            
            const updatedFurnitureFromBackend = await fetchSpecificFurnitureData(selectedFurniture.id);
            console.log('Refetched updated furniture:', updatedFurnitureFromBackend);

            setFurnitureData((prev) =>
                prev.map(furniture => 
                    furniture.id === updatedFurnitureFromBackend.id ? updatedFurnitureFromBackend : furniture
                )
            );
            setUpdateShowModal(false);
            setSelectedFurniture(null);
            setIsUpdatingFurnitureData(false);
        } catch(error) {
            console.error(error);
            setError(error.message);
        };
    };

    const deleteFurniture  = async () => {
        try {
            await deleteFurnitureData(selectedFurniture.id);

            console.log('Deleted Furniture from Backend: ', selectedFurniture );

            setFurnitureData((prev) =>
                prev.filter(furniture => furniture.id !== selectedFurniture.id)
            );

            setSelectedFurniture(null);
            setIsDeletingFurnitureData(false);

        } catch(error) {
            console.error(error);
            setError(error.message);
        };
    };

    const startUpdating = () => {
        setIsUpdatingFurnitureData(true);
    };

    const stopUpdating = () => {
        setIsUpdatingFurnitureData(false);
    };

    const startDeleting = () => {
        setIsDeletingFurnitureData(true);
    };

    const stopDeleting = () => {
        setIsDeletingFurnitureData(false);
    };

    const openCreateModal = () => {
        setCreateShowModal(true);
    };

    const closeCreateModal = () => {
        setCreateShowModal(false);
    };

    const openUpdateModal = (furniture) => {
        setSelectedFurniture(furniture);
        setUpdateShowModal(true);
    };

    const closeUpdateModal = () => {
        setSelectedFurniture(null);
        setUpdateShowModal(false);
    };

    return {
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
        stopUpdating,
        startDeleting,
        stopDeleting,
        openUpdateModal,
        closeUpdateModal,
        openCreateModal,
        closeCreateModal,
    };
};