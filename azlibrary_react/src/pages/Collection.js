import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer } from 'react-leaflet'
import azgsApi from '../components/container/AzgsApi';

export default function Collection() {

  const { collectionId } = useParams()
  const [collection, setCollection] = useState();

  useEffect(() => {

    const getCollection = async () => {
      const res = await azgsApi.get('/metadata/' + collectionId);
      const data = res.data.data;
      console.log(data);
      setCollection(data);
    };

    getCollection();

  }, [collectionId]);

  return (

    <div className="container-fluid">

      {!collection && <div className="alert alert-danger text-center font-weight-bold" role="alert">
        🐟collection not found🐟
      </div>}

      {collection && <div className="text-center">

        <div className="d-flex justify-content-center">
          <MapContainer center={[34.16, -111.62]} zoom={6} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </div>

        <div><strong>{collection.metadata.title}</strong></div>

        <code>{JSON.stringify(collection.metadata)}</code>

      </div>

      }

    </div>

  )
}