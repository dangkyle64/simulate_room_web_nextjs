export async function fetchRoomData() {
    try {
        const response = await fetch('https://simulate-room-nodejs.onrender.com/api/room/');
        //const response = await fetch('http://localhost:5000/api/room/');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        };

        const data = await response.json();
        console.log(data);
        return data;

    } catch(error) {
        console.log('There was an error getting the data: ', error);
    };
};

