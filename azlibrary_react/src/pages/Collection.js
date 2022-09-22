import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'
import azgsApi from '../components/container/AzgsApi';

export default function Collection() {

  const { collectionId } = useParams()
  const [collection, setCollection] = useState();
  const [error, setError] = useState();
  const [bounds, setBounds] = useState();

  useEffect(() => {

    const getCollection = async () => {
      try {
        const res = await azgsApi.get('/metadata/' + collectionId);
        const json = res.data.data;
        setCollection(json);

        const boundBox = [[json.metadata.bounding_box.south, json.metadata.bounding_box.west], [json.metadata.bounding_box.north, json.metadata.bounding_box.east]];
        setBounds(boundBox);
      } catch (error) {
        setError(error);
      }
    };

    getCollection();

  }, [collectionId]);

  return (

    <div className="container-fluid">

      {error && <div className="alert alert-danger text-center font-weight-bold" role="alert">
        🐟collection not found🐟
      </div>}

      {collection && <div className="text-center">

        <div className="d-flex justify-content-center">
          <MapContainer bounds={bounds} zoom={6} >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Rectangle bounds={bounds} pathOptions={{ color: 'purple' }} />
          </MapContainer>
        </div>

        <div><strong>{collection.metadata.title}</strong></div>

        <code>{JSON.stringify(collection.metadata)}</code>

      </div>

      }

    </div>

  )
}