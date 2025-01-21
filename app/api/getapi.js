async function fetchData() {
    try {
        const response = await fetch('http://localhost:5000/api/hello');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        };

        const data = await response.json();
        console.log(data.message);
        return data;

    } catch(error) {
        console.log('There was an error getting the data: ', error);
    };
};

module.exports = { fetchData };
fetchData();