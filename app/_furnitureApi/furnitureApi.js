async function fetchFurnitureData() {
    try {
        //const response = await fetch('https://simulate-room-nodejs.onrender.com/api/furniture/');
        const response = await fetch('http://localhost:5000/api/furniture/');

        if (!response.ok) {
            throw new Error('Failed to fetch data, response was not okay.');
        };

        const data = await response.json();
        //console.log(data);
        return data;

    } catch(error) {
        console.log('There was an error getting the data: ', error);
        return [];
    };
};

async function createFurnitureData(newFurniture) {
    try {
        //const response = await fetch('https://simulate-room-nodejs.onrender.com/api/furniture/', {method: 'POST'});
        const response = await fetch('http://localhost:5000/api/furniture/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFurniture),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create data, response was not okay.');
        };

        const data = await response.json();
        return data;

    } catch(error) {
        console.log('There was an error creating new furniture data: ', error);
        return;
    };
};

async function updateFurnitureData(id) {
    try {
        //const response = await fetch(`https://simulate-room-nodejs.onrender.com/api/furniture/${id}`, {method: 'PUT'});
        const response = await fetch(`http://localhost:5000/api/furniture/${id}`, {method: 'PUT'});
        if (!response.ok) {
            throw new Error('Failed to update data, response was not okay.');
        };

        const data = await response.json();
        return data;
        
    } catch(error) {
        console.log('There was an error updating the furniture data: ', error);
        return;
    };
};

async function deleteFurnitureData(id) {
    try {
        //const response = await fetch(`https://simulate-room-nodejs.onrender.com/api/furniture/${id}`, {method: 'DELETE'});
        const response = await fetch(`http://localhost:5000/api/furniture/${id}`);
        if (!response.ok) {
            throw new Error('Failed to update data, response was not okay.');
        };

        const data = await response.json();
        return data;
        
    } catch(error) {
        console.log('There was an error deleting the furniture data: ', error);
        return;
    };
};

module.exports = { 
    fetchFurnitureData,
    createFurnitureData,
    updateFurnitureData,
    deleteFurnitureData
};
//fetchFurnitureData();
