import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'
import azgsApi from '../components/container/AzgsApi';
import Breadcrumb from "../components/presentation/Breadcrumb";
import Keywords from "../components/presentation/Keywords"
import Files from "../components/presentation/Files"
import Downloads from "../components/presentation/Downloads"
import Metadata from "../components/presentation/Metadata"

export default function Item() {

  const { collectionId } = useParams()
  const [collection, setCollection] = useState();
  const [error, setError] = useState();
  const [bounds, setBounds] = useState();
  const [uaLibraryLink, setUaLibraryLink] = useState();

  useEffect(() => {

    // Scroll to top
    window.scrollTo(0, 0);

    // Get the collection from the API
    const getCollection = async () => {

      let json;

      try {
        const res = await azgsApi.get('/metadata/' + collectionId);
        json = res.data.data;

        setCollection(json);
      } catch (error) {
        console.log(error);
        setError(error);
      }

      if (json) {
        const boundBox = [[json.metadata.bounding_box.north, json.metadata.bounding_box.east], [json.metadata.bounding_box.south, json.metadata.bounding_box.west]];
        setBounds(boundBox);
  
        const uaLink = json.metadata?.links.find(x => x.name === 'UA Library')?.url.replace("http://", "https://");
        setUaLibraryLink(uaLink);
      }

    };

    getCollection();

  }, [collectionId]);
  console.log(collection);
  return (

    <div className="container">

      <Breadcrumb page={collectionId} />

      {error && <div className="alert alert-danger text-center font-weight-bold" role="alert">
        🐟 Collection not found. 🐟
      </div>}

      {collection && <div>

        <h3 className="text-center mt-0">{collection.metadata.title} {collection.metadata.private && <span className="badge badge-warning">Private</span>}</h3>
        
        {/* Leaflet Map */}
        <div className="">
          <MapContainer bounds={bounds} boundsOptions={{ padding: [100, 100] }} >
            <TileLayer
              attribution='<a href="https://usgs.gov/">U.S. Geological Survey</a>' url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}"
            />
            <Rectangle bounds={bounds} pathOptions={{ color: 'blue' }} />
          </MapContainer>
        </div>

        <hr />

       <br></br>
          <Downloads collectionId={collectionId} />
        <br></br>
        <hr></hr>

        {/* Collection Details */}
        <dl className="row">

          <dt className="col-sm-2">Title</dt>
          <dd className="col-sm-10">{collection.metadata.title}</dd>

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
              <div key={author.person}><Link title={author.person} to={"/?author=" + author.person} >{author.person}</Link></div>
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

          <Files files={collection.metadata.files} collectionID={collection.metadata.identifiers.perm_id}/>
          
          {uaLibraryLink && <>
            <dt className="col-sm-2">Permalink</dt>
            <dd className="col-sm-10"><a href={uaLibraryLink} target="_blank" rel="noopener noreferrer">{uaLibraryLink}</a></dd>
          </>
          }

          <Keywords keywords={collection.metadata.keywords} />

         </dl>
        <Metadata collectionId={collectionId} collection={collection}/>
        {/* <code>{JSON.stringify(collection.metadata)}</code> */}

      </div>
      }
    </div>
  )
}