import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'
import azgsApi from '../components/container/AzgsApi';
import Breadcrumb from "../components/presentation/Breadcrumb";

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

        const boundBox = [[json.metadata.bounding_box.north, json.metadata.bounding_box.east], [json.metadata.bounding_box.south, json.metadata.bounding_box.west]];
        setBounds(boundBox);
      } catch (error) {
        setError(error);
      }
    };

    getCollection();

  }, [collectionId]);

  return (

    <div className="container-fluid">

      <Breadcrumb isCollection={true} />

      {error && <div className="alert alert-danger text-center font-weight-bold" role="alert">
        🐟collection not found🐟
      </div>}

      {collection && <div className="row">

        <div className="col-xl-3 col-lg-4">
          <MapContainer bounds={bounds} boundsOptions={{ padding: [100, 100] }} >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Rectangle bounds={bounds} pathOptions={{ color: 'blue' }} />
          </MapContainer>
        </div>

        <div className="col-xl-9 col-lg-8">

          <dl>
            <dt>Title</dt>
            <dd>{collection.metadata.title}</dd>
            <dt>Year</dt>
            <dd>{collection.metadata.year}</dd>
            <dt>Series</dt>
            <dd>{collection.metadata.series}</dd>
            <dt>Author{collection.metadata.authors.length === 1 ? "" : "s"}</dt>
            <dd>
              {collection.metadata.authors.map(author =>
                <div key={author.person}>{author.person}</div>
              )}
            </dd>



          </dl>

          <code>{JSON.stringify(collection.metadata)}</code>
        </div>

      </div>

      }

    </div>

  )
}