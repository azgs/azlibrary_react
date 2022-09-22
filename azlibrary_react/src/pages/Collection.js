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
    <h1>Collection: {collection?.collection_id} </h1>
  )
}