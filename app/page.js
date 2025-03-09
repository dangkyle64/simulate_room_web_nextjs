import { fetchData } from './_api/getapi';
export default async function Home() {

  const data = await fetchData();
    return (
      <div>
        <h1>Skeleton Home Page</h1>
        <p>Skeleton Home Page for Simulate Room</p>
        <p>{data.message}</p>
        
      </div>
    );
}