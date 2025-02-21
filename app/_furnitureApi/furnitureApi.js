/**
 * Fetches all the furniture data from the API.
 * 
 * This function sends a GET request to the API to retrieve all furniture records.
 * It will return the data if the request is successful, or an empty array if there is an error.
 * 
 * @async
 * @function fetchFurnitureData
 * @returns {Promise<Object[]>} A promise that resolves to an array of furniture objects, or an empty array if there was an error.
 */

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

/**
 * Fetches a specific piece of furniture data by its ID.
 * 
 * This function sends a GET request to the API to retrieve a specific furniture record by its ID.
 * It will return the data if the request is successful, or `undefined` if there is an error.
 * 
 * @async
 * @function fetchSpecificFurnitureData
 * @param {string} id - The unique identifier of the furniture item.
 * @returns {Promise<Object|undefined>} A promise that resolves to the furniture object if successful, or `undefined` if there was an error.
 */
async function fetchSpecificFurnitureData(id) {
    try {
        //const response = await fetch('https://simulate-room-nodejs.onrender.com/api/furniture/');
        const response = await fetch(`http://localhost:5000/api/furniture/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch data, response was not okay.');
        };

        const data = await response.json();
        //console.log(data);
        return data;

    } catch(error) {
        console.log('There was an error getting the data: ', error);
        return;
    };
};

/**
 * Creates a new piece of furniture data in the system.
 * 
 * This function sends a POST request to the API to create a new furniture record.
 * It will return the newly created furniture data if the request is successful, or `undefined` if there is an error.
 * 
 * @async
 * @function createFurnitureData
 * @param {Object} newFurniture - The furniture data to be created.
 * @param {string} newFurniture.type - The type of the furniture (e.g., chair, table).
 * @param {string} newFurniture.modelUrl - The URL for the 3D model of the furniture.
 * @param {number} newFurniture.length - The length of the furniture.
 * @param {number} newFurniture.width - The width of the furniture.
 * @param {number} newFurniture.height - The height of the furniture.
 * @param {number} newFurniture.x_position - The X position of the furniture in the room.
 * @param {number} newFurniture.y_position - The Y position of the furniture in the room.
 * @param {number} newFurniture.z_position - The Z position of the furniture in the room.
 * @param {number} newFurniture.rotation_x - The rotation around the X-axis.
 * @param {number} newFurniture.rotation_y - The rotation around the Y-axis.
 * @param {number} newFurniture.rotation_z - The rotation around the Z-axis.
 * @returns {Promise<Object|undefined>} A promise that resolves to the created furniture object, or `undefined` if there was an error.
 */
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

/**
 * Updates an existing piece of furniture data in the system.
 * 
 * This function sends a PUT request to the API to update an existing furniture record by its ID.
 * It will return the updated furniture data if the request is successful, or `undefined` if there is an error.
 * 
 * @async
 * @function updateFurnitureData
 * @param {string} id - The unique identifier of the furniture to be updated.
 * @param {Object} updateFurniture - The updated furniture data.
 * @param {string} updateFurniture.type - The type of the furniture.
 * @param {string} updateFurniture.modelUrl - The URL for the 3D model of the furniture.
 * @param {number} updateFurniture.length - The length of the furniture.
 * @param {number} updateFurniture.width - The width of the furniture.
 * @param {number} updateFurniture.height - The height of the furniture.
 * @param {number} updateFurniture.x_position - The X position of the furniture in the room.
 * @param {number} updateFurniture.y_position - The Y position of the furniture in the room.
 * @param {number} updateFurniture.z_position - The Z position of the furniture in the room.
 * @param {number} updateFurniture.rotation_x - The rotation around the X-axis.
 * @param {number} updateFurniture.rotation_y - The rotation around the Y-axis.
 * @param {number} updateFurniture.rotation_z - The rotation around the Z-axis.
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated furniture object, or `undefined` if there was an error.
 */
async function updateFurnitureData(id, updateFurniture) {
    try {
        
        //const url = `http://localhost:5000/api/furniture/${id}`;
        //console.log('Sending PUT request to URL:', url);  // Double-check the URL

        //const response = await fetch(`https://simulate-room-nodejs.onrender.com/api/furniture/${id}`, {method: 'PUT'});
        const response = await fetch(`http://localhost:5000/api/furniture/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateFurniture),
        });

        //console.log("----------------------------------HERE-------------------------------",response)
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

/**
 * Deletes a specific piece of furniture data from the system.
 * 
 * This function sends a DELETE request to the API to delete a furniture record by its ID.
 * If the request is successful, no data is returned.
 * 
 * @async
 * @function deleteFurnitureData
 * @param {string} id - The unique identifier of the furniture to be deleted.
 * @returns {Promise<void>} A promise that resolves to `undefined` when the data is deleted.
 */
async function deleteFurnitureData(id) {
    try {
        //const response = await fetch(`https://simulate-room-nodejs.onrender.com/api/furniture/${id}`, {method: 'DELETE'});
        const response = await fetch(`http://localhost:5000/api/furniture/${id}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json', 
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update data, response was not okay.');
        };
        
    } catch(error) {
        console.log('There was an error deleting the furniture data: ', error);
        return;
    };
};

module.exports = { 
    fetchFurnitureData,
    fetchSpecificFurnitureData,
    createFurnitureData,
    updateFurnitureData,
    deleteFurnitureData
};
//fetchFurnitureData();
