const { fetchFurnitureData } = require('../api/furnitureApi')

export default async function furnitureHome() {

    const data = await fetchFurnitureData();
    const convertedData = JSON.stringify(data);
    return (
      <div>
        <h1>Skeleton Furniture Home Page</h1>
        <p>Skeleton Furniture Home Page for Simulate Room</p>
        <p>{convertedData}</p>
        
      </div>
    );
};