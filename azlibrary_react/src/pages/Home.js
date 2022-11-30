import { useState, useEffect } from "react";
import Search from '../components/container/Search'
import Breadcrumb from "../components/presentation/Breadcrumb";
import SearchResults from "../components/container/SearchResults"
import Paging from '../components/presentation/Paging'
import azgsApi from "../components/container/AzgsApi";
import SearchMap from "../components/container/SearchMap"

export default function Home() {

  // Base api url
  const metadataUrl = azgsApi.getUri() + '/metadata';

  // API request-url with query parameters
  const [searchUrl, setSearchUrl] = useState(metadataUrl);

  // Leaflet map extent
  const [geom, setGeom] = useState();

  // Paging offset and limit
  const [offset, setOffset] = useState();
  const [limit, setLimit] = useState();

  // Api response
  const [results, setResults] = useState([]);
  const [apiError, setApiError] = useState();
  const [boundingBoxes, setBoundingBoxes] = useState();
  const [links, setLinks] = useState();
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

  // Grab bounding boxes and links from results
  useEffect(() => {

    setLinks(results?.links);

    const boxes = results?.data?.map(item => ({ id: item.collection_id, title: item.metadata.title, bbox: item.metadata.bounding_box }));

    setBoundingBoxes(boxes);

    // Clear highlight
    setHighlightBox();

  }, [results]);

  // Update searchUrl when map extent changes
  useEffect(() => {

    const queryString = searchUrl.includes('?') ? searchUrl.slice(searchUrl.indexOf("?")) : '';

    let params = new URLSearchParams(queryString);

    // Add the map-filter geometry if it is set
    if (geom) {
      params.set('geom', geom);
      params.set('geom_method', 'contains');
    } else {
      params.delete('geom');
      params.delete('geom_method');
    }

    if (Array.from(params).length > 0) {
      setSearchUrl(metadataUrl + '?' + params.toString());
    } else {
      setSearchUrl(metadataUrl);
    }

  }, [metadataUrl, geom, searchUrl]);

  return (

    <div className="container">

      <Breadcrumb />

      <div className="row">

        {/* Search */}
        <div className="col-12">
          <Search metadataUrl={metadataUrl} searchUrl={searchUrl} setSearchUrl={setSearchUrl} setOffset={setOffset} setLimit={setLimit} offset={offset} />
        </div>

        {/* API Error */}
        <div className="col-12">
          {apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
            {/* {apiError} */}
            Something went wrong! Please contact AZGS for support.
          </div>}
        </div>

        {/* 0 Results */}
        <div className="col-12">
          {results.data?.length === 0 && <div className="alert alert-dark text-center font-weight-bold" role="alert">
            0 Results
          </div>}
        </div>

        {/* Top Paging */}
        <div className="col-12">
          {links && results.data?.length !== 0 && <Paging links={links} limit={limit} offset={offset} setOffset={setOffset} />}
        </div>

        {/* Results map */}
        <div className="col-sm-6 mb-2">
          <SearchMap boundingBoxes={boundingBoxes} highlightBox={highlightBox} setGeom={setGeom} />
        </div>

        {/* Results list */}
        <div className="col-sm-6">
          <SearchResults results={results} setHighlightBox={setHighlightBox} />
        </div>

        {/* Bottom Paging */}
        <div className="col-12">
          {links && results.data?.length !== 0 && <Paging links={links} limit={limit} offset={offset} setOffset={setOffset} />}
        </div>

      </div>

    </div>
  )
}