import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
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
        Collection not found
      </div>}

      {collection && <div className="text-center">
        <h1>{collection.metadata.title}</h1>

        <code>{JSON.stringify(collection.metadata)}</code>

      </div>

      }

    </div>

  )
}