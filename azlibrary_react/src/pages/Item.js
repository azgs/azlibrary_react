import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'
import azgsApi from '../components/container/AzgsApi';
import Breadcrumb from "../components/presentation/Breadcrumb";

export default function Item() {

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

      <Breadcrumb isItem={true} />

      {error && <div className="alert alert-danger text-center font-weight-bold" role="alert">
        🐟collection not found🐟
      </div>}

      {collection && <div className="row">

        <div className="col-xl-3 col-lg-4 mb-2">
          <MapContainer bounds={bounds} boundsOptions={{ padding: [100, 100] }} >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Rectangle bounds={bounds} pathOptions={{ color: 'blue' }} />
          </MapContainer>
        </div>

        <div className="col-xl-9 col-lg-8">

          <h3 className="text-center mt-0">{collection.metadata.title} {collection.metadata.private && <span className="badge badge-warning">Private</span>}</h3>

          <hr />

          <dl className="row">

            {collection.metadata.informal_name && <>
              <dt className="col-sm-2 text-md-right">Informal Name</dt>
              <dd className="col-sm-10">{collection.metadata.informal_name}</dd>
            </>}

            <dt className="col-sm-2 text-md-right">Year</dt>
            <dd className="col-sm-10">{collection.metadata.year}</dd>

            <dt className="col-sm-2 text-md-right">Collection Group</dt>
            <dd className="col-sm-10">{collection.metadata.collection_group.name}</dd>


            {collection.metadata.series && <>
              <dt className="col-sm-2 text-md-right">Series</dt>
            <dd className="col-sm-10">{collection.metadata.series}</dd>
            </>}

            <dt className="col-sm-2 text-md-right">Author{collection.metadata.authors.length === 1 ? "" : "s"}</dt>
            <dd className="col-sm-10">
              {collection.metadata.authors.map(author =>
                <div key={author.person}>{author.person}</div>
              )}
            </dd>

            <dt className="col-sm-2 text-md-right">Abstract</dt>
            <dd className="col-sm-10">{collection.metadata.abstract}</dd>

            {collection.metadata.license.url && collection.metadata.license.type && <>
              <dt className="col-sm-2 text-md-right">License</dt>
              <dd className="col-sm-10"><a href={collection.metadata.license.url} target="_blank" rel="noopener noreferrer">{collection.metadata.license.type}</a></dd>
            </>
            }

            <dt className="col-sm-2 text-md-right">Language</dt>
            <dd className="col-sm-10">{collection.metadata.language}</dd>

            <dt className="col-sm-2 text-md-right">Keyword{collection.metadata.keywords.length === 1 ? "" : "s"}</dt>
            <dd className="col-sm-10 split-sm-3-col">
              {collection.metadata.keywords.map(keyword =>
                <div key={keyword.name}>{keyword.name} ({keyword.type})</div>
              )}
            </dd>

            <dt className="col-sm-2 text-md-right">File{collection.metadata.files.length === 1 ? "" : "s"}</dt>
            <dd className="col-sm-10">
              {collection.metadata.files.map(file =>
                <div key={file.name}>{file.name} ({file.type})</div>
              )}

              {collection.links.map(link =>
                <div key={link.rel}><a className="btn btn-blue btn-sm" title={link.rel === "describes" ? "Download" : link.rel} href={link.href.replace("http://","https://")}>{link.rel === "describes" ? "Download" : link.rel}</a></div>
              )}
            </dd>



          </dl>

          {/* <div>
            {collection.links.map(link =>
              <div key={link.rel}><a className="btn btn-blue btn-sm" title={link.rel === "describes" ? "Download" : link.rel} href={link.href}>{link.rel === "describes" ? "Download" : link.rel}</a></div>
            )}
          </div> */}

          {/* <code>{JSON.stringify(collection.metadata)}</code> */}

        </div>

      </div>

      }

    </div>

  )
}