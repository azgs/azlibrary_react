import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'
import azgsApi from '../components/container/AzgsApi';
import Breadcrumb from "../components/presentation/Breadcrumb";
import Keywords from "../components/presentation/Keywords"
import Downloads from "../components/presentation/Downloads"

export default function Item() {

  const { collectionId } = useParams()
  const [collection, setCollection] = useState();
  const [error, setError] = useState();
  const [bounds, setBounds] = useState();
  const [uaLibraryLink, setUaLibraryLink] = useState();

  useEffect(() => {

    const getCollection = async () => {
      try {
        const res = await azgsApi.get('/metadata/' + collectionId);
        const json = res.data.data;

        setCollection(json);

        const boundBox = [[json.metadata.bounding_box.north, json.metadata.bounding_box.east], [json.metadata.bounding_box.south, json.metadata.bounding_box.west]];
        setBounds(boundBox);

        setUaLibraryLink(json.metadata.links.find(x => x.name === 'UA Library'));

      } catch (error) {
        setError(error);
      }
    };

    getCollection();

  }, [collectionId]);

  return (

    <div className="container">

      <Breadcrumb isItem={true} />

      {error && <div className="alert alert-danger text-center font-weight-bold" role="alert">
        🐟 Collection not found. 🐟
      </div>}

      {collection && <div>

        <h3 className="text-center mt-0">{collection.metadata.title} {collection.metadata.private && <span className="badge badge-warning">Private</span>}</h3>

        <div className="">
          <MapContainer bounds={bounds} boundsOptions={{ padding: [100, 100] }} >
            <TileLayer
              attribution='<a href="https://usgs.gov/">U.S. Geological Survey</a>' url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}"
            />
            <Rectangle bounds={bounds} pathOptions={{ color: 'blue' }} />
          </MapContainer>
        </div>

        <hr />

        <dl className="row">

          {collection.metadata.informal_name && <>
            <dt className="col-sm-2">Informal Name</dt>
            <dd className="col-sm-10">{collection.metadata.informal_name}</dd>
          </>}

          <dt className="col-sm-2">Year</dt>
          <dd className="col-sm-10">{collection.metadata.year}</dd>

          <dt className="col-sm-2">Collection Group</dt>
          <dd className="col-sm-10">{collection.metadata.collection_group.name}</dd>


          {collection.metadata.series && <>
            <dt className="col-sm-2">Series</dt>
            <dd className="col-sm-10">{collection.metadata.series}</dd>
          </>}

          {collection.metadata.identifiers.supersedes && <>
            <dt className="col-sm-2">Supersedes</dt>
            <dd className="col-sm-10"><Link className="" title={collection.metadata.identifiers.supersedes} to={"/item/" + collection.metadata.identifiers.supersedes}>{collection.metadata.identifiers.supersedes}</Link></dd>
          </>}

          {collection.metadata.identifiers.superseded_by && <>
            <dt className="col-sm-2">Superseded By</dt>
            <dd className="col-sm-10"><Link className="" title={collection.metadata.identifiers.superseded_by} to={"/item/" + collection.metadata.identifiers.superseded_by}>{collection.metadata.identifiers.superseded_by}</Link></dd>
          </>}

          <dt className="col-sm-2">Author{collection.metadata.authors.length === 1 ? "" : "s"}</dt>
          <dd className="col-sm-10">
            {collection.metadata.authors.map(author =>
              <div key={author.person}>{author.person}</div>
            )}
          </dd>

          <dt className="col-sm-2">Abstract</dt>
          <dd className="col-sm-10">{collection.metadata.abstract}</dd>

          {collection.metadata.license.url && collection.metadata.license.type && <>
            <dt className="col-sm-2">License</dt>
            <dd className="col-sm-10"><a href={collection.metadata.license.url} target="_blank" rel="noopener noreferrer">{collection.metadata.license.type}</a></dd>
          </>
          }

          <dt className="col-sm-2">Language</dt>
          <dd className="col-sm-10">{collection.metadata.language}</dd>

          <Keywords keywords={collection.metadata.keywords} />

          {uaLibraryLink && <>
            <dt className="col-sm-2">Permalink</dt>
            <dd className="col-sm-10"><a href={uaLibraryLink.url} target="_blank" rel="noopener noreferrer">{uaLibraryLink.name}</a></dd>
          </>
          }

          <dt className="col-sm-2">File{collection.metadata.files.length === 1 ? "" : "s"}</dt>
          <dd className="col-sm-10">
            {collection.metadata.files.map(file =>
              <div key={file.name}>{file.name} ({file.type})</div>
            )}
          </dd>
        </dl>

        <Downloads collectionId={collectionId} />

        {/* <code>{JSON.stringify(collection.metadata)}</code> */}

      </div>
      }
    </div>
  )
}