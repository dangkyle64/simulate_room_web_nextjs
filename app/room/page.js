const { fetchRoomData } = require('../_api/roomApi')

export default async function furnitureHome() {

    const data = await fetchRoomData();
    const convertedData = JSON.stringify(data);
    return (
      <div>
        <h1>Skeleton Room Home Page</h1>
        <p>Skeleton Room Home Page for Simulate Room</p>
        <p>{convertedData}</p>
        
      </div>
    );
};