const { useEffect, useState } = require('react');
const { fetchFurnitureData } = require('../../_furnitureApi/furnitureApi');

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

    const openUpdateModal = (furniture) => {
        setSelectedFurniture(furniture);
        setUpdateShowModal(true);
    };

    const closeUpdateModal = () => {
        setSelectedFurniture(null);
        setUpdateShowModal(false);
    };

    return {
        selectedFurniture,
        showUpdateModal,
        openUpdateModal,
        closeUpdateModal,  
    };
};