import { useState, useEffect, useMemo } from "react";
import Search from '../components/container/Search'
import { MapContainer, TileLayer, Rectangle, Tooltip } from 'react-leaflet'
import Breadcrumb from "../components/presentation/Breadcrumb";
import SearchResults from "../components/container/SearchResults"
import Paging from '../components/presentation/Paging'
import azgsApi from "../components/container/AzgsApi";

export default function Home() {

  // Base api url
  const metadataUrl = azgsApi.getUri() + '/metadata';

  // API request-url with query parameters
  const [searchUrl, setSearchUrl] = useState(metadataUrl);

  // Leaflet map
  const [map, setMap] = useState(null)

  // Paging offset
  const [offset, setOffset] = useState()

  // Api response
  const [results, setResults] = useState([]);
  const [apiError, setApiError] = useState();
  const [boundingBoxes, setBoundingBoxes] = useState();
  const [highlightBox, setHighlightBox] = useState();

  // Fire API call whenever searchUrl updates
  useEffect(() => {

    let lastRequest = true;

    const fetchResults = async () => {
      try {
        const res = await azgsApi.get(searchUrl);
        if (lastRequest) {
          setResults(res.data);
          setApiError();
        }
      } catch (error) {
        if (lastRequest) {
          setResults([]);
          setApiError(error.toString());
        }
      }
    };

    fetchResults();

    return () => {
      lastRequest = false;
    };
  }, [searchUrl]);

  // Grab bounding boxes from results
  useEffect(() => {

    const boxes = results?.data?.map(item => ({ id: item.collection_id, title: item.metadata.title, bbox: item.metadata.bounding_box }));

    setBoundingBoxes(boxes);

    // Clear highlight
    setHighlightBox();

  }, [results]);

  // Leaflet map
  const resultsMap = useMemo(
    () => (
      <MapContainer
        center={[34.16, -111.62]}
        zoom={6}
        ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {highlightBox && <Rectangle key={highlightBox.id} eventHandlers={{ click: () => window.location.href = "item/" + highlightBox.id }} bounds={[[highlightBox.bbox.north, highlightBox.bbox.east], [highlightBox.bbox.south, highlightBox.bbox.west]]} pathOptions={{ color: "#ff0000" }}>
          <Tooltip>{highlightBox.title}</Tooltip>
        </Rectangle>
        }

        {boundingBoxes && boundingBoxes.map(result =>
          <Rectangle key={result.id} eventHandlers={{ click: () => window.location.href = "item/" + result.id }} bounds={[[result.bbox.north, result.bbox.east], [result.bbox.south, result.bbox.west]]} pathOptions={{ color: "#1E5288" }}>
            <Tooltip sticky>{result.title}</Tooltip>
          </Rectangle>
        )
        }

      </MapContainer>
    ),
    [highlightBox, boundingBoxes],
  )

  return (

    <div className="container">

      <Breadcrumb />

      <div className="row">

        {/* Search */}
        <div className="col-12">
          {map ? <Search metadataUrl={metadataUrl} searchUrl={searchUrl} setSearchUrl={setSearchUrl} setOffset={setOffset} offset={offset} map={map} /> : null}
        </div>

        {/* API Error */}
        <div className="col-12">
          {apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
            {apiError}
          </div>}
        </div>

        {/* 0 Results */}
        <div className="col-12">
          {results.data?.length === 0 && <div className="alert alert-dark text-center font-weight-bold" role="alert">
            0 Results
          </div>}
        </div>

        {/* Paging */}
        <div className="col-12">
          {results.data?.length !== 0 && <Paging links={results?.links} setOffset={setOffset} />}
        </div>

        {/* Results map */}
        <div className="col-sm-6 mb-2">
          {resultsMap}
        </div>

        {/* Results list */}
        <div className="col-sm-6">
          <SearchResults results={results} setHighlightBox={setHighlightBox} />
        </div>

        {/* Paging */}
        <div className="col-12">
          {results.data?.length !== 0 && <Paging links={results?.links} setOffset={setOffset} />}
        </div>

      </div>

    </div>
  )
}