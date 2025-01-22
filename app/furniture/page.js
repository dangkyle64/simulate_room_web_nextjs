const { fetchFurnitureData } = require('../api/furnitureApi')

export default async function furnitureHome() {

  const data = await fetchFurnitureData();
    return (
      <div>
        <h1>Skeleton Furniture Home Page</h1>
        <p>Skeleton Furniture Home Page for Simulate Room</p>
        <p>{data}</p>
        
      </div>
    );
  }