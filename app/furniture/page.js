const { fetchFurnitureData } = require('../_api/furnitureApi')

export default async function furnitureHome() {

    const data = await fetchFurnitureData();
    const convertedData = JSON.stringify(data);
    //<pre>{convertedData}</pre>
    return (
      <div>
        <h1>Skeleton Furniture Home Page</h1>
        <p>Skeleton Furniture Home Page for Simulate Room</p>
        
        <div className="furniture-grid">
          {data.map(furniture => (
            <div key={furniture.id} className="furniture-card">
              <h2>{furniture.type}</h2>
              <p>Length: {furniture.length}, Width: {furniture.width}, Height: {furniture.height}</p>
              <p>Location: x:{furniture.x_position}, y:{furniture.y_position}, z:{furniture.z_position}</p>
              <p>Rotation: x: {furniture.rotation_x} y: {furniture.rotation_y} z: {furniture.rotation_z}</p>
            </div>
          ))}
        </div>
        
        
      </div>
    );
};