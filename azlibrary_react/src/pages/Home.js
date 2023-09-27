import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Search from '../components/container/Search'
import Breadcrumb from "../components/presentation/Breadcrumb";
import SearchResults from "../components/presentation/SearchResults"
import Paging from '../components/container/Paging'
import azgsApi from "../components/container/AzgsApi";
import SearchMap from "../components/container/SearchMap"

export default function Home() {

  // Base api url
  const metadataUrl = azgsApi.getUri() + '/metadata';

  // API request-url with query parameters
  const [searchUrl, setSearchUrl] = useState(metadataUrl);

  // Get query-string search params
  const [queryStringValues] = useSearchParams();
  
  // Grab the query string entries 
  const queryString = Object.fromEntries([...queryStringValues]);
  
  // API Search Parameters. Prepopulate values from query string
  const [apiSearchParams, setApiSearchParams] = useState({ latest: false, collection_group: queryString.collection_group, year: queryString.year, author:queryString.author, title:queryString.title });

  // Leaflet map extent
  const [geom, setGeom] = useState();

  // Api response
  const [results, setResults] = useState([]);
  const [apiError, setApiError] = useState();
  const [boundingBoxes, setBoundingBoxes] = useState();
  const [links, setLinks] = useState();
  const [highlightBox, setHighlightBox] = useState();

  // Fire API call whenever searchUrl updates
  useEffect(() => {

    let lastRequest = true;

    // Get results
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

    // Set lastRequest to false if subsequent request has been made
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

  function filterInput(input) {

    // Trim leading/trailing whitespace
    var str = input.toString().trim();

    // Only letters, numbers, and some special chars
    str = str.replace(/[^a-zA-Z0-9 ’½.\-;"=–]/g, '');

    return str;
  }

  // Update searchUrl when input changes
  useEffect(() => {
    const buildQueryString = () => {

      let url = metadataUrl;
      let params = new URLSearchParams();

      // Add search parameters
      Object.keys(apiSearchParams).forEach(key => {

        const value = apiSearchParams[key];

        if (value) {
          params.append(key, filterInput(value));
        }
      })

      // Add map-filter geometry 
      if (geom) {
        params.append('geom', geom);
        params.append('geom_method', 'contains');
      }

      if (Array.from(params).length > 0) {
        url += '?' + params.toString();
      }

      setSearchUrl(url);
    }

    buildQueryString();

  }, [apiSearchParams, geom, metadataUrl, setSearchUrl]);

  return (

    <div className="container">

      <Breadcrumb />

      <div className="row">

        {/* Search */}
        <div className="col-12">
          <Search searchUrl={searchUrl} searchParams={apiSearchParams} setSearchParams={setApiSearchParams} />
        </div>

        {/* API Error */}
        <div className="col-12">
          {apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
            {/* {apiError} */}
            Something went wrong! Please contact azgs-info@arizona.edu for support.
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
          {links && results.data?.length !== 0 && <Paging links={links} searchParams={apiSearchParams} setSearchParams={setApiSearchParams} />}
        </div>

        {/* Results map */}
        <div className="col-sm-6 mb-2">
          <SearchMap boundingBoxes={boundingBoxes} highlightBox={highlightBox} setGeom={setGeom} setSearchParams={setApiSearchParams} />
        </div>

        {/* Results list */}
        <div className="col-sm-6">
          <SearchResults results={results} setHighlightBox={setHighlightBox} />
        </div>

        {/* Bottom Paging */}
        <div className="col-12">
          {links && results.data?.length !== 0 && <Paging links={links} searchParams={apiSearchParams} setSearchParams={setApiSearchParams} />}
        </div>

      </div>

    </div>
  )
}