import { useParams } from 'react-router-dom'

const Collection = () => {

  const { collectionId } = useParams()

  return <h1>Collection: {collectionId}</h1>;
};

export default Collection