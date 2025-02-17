const { useEffect, useState } = require('react');
const { fetchFurnitureData, createFurnitureData } = require('../../_furnitureApi/furnitureApi');

export function useFurnitureState() {

    const [furnitureData, setFurnitureData] = useState([]);
    const [selectedFurniture, setSelectedFurniture] = useState(null);

    const [isUpdating, setIsUpdating] = useState(false);
    
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
        showUpdateModal,
        showCreateModal,
        createFurniture,
        openUpdateModal,
        closeUpdateModal,
        openCreateModal,
        closeCreateModal,
    };
};