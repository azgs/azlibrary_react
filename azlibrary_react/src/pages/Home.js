import { useState, useEffect, useContext } from "react";
import Search from '../components/container/Search'
import Breadcrumb from "../components/presentation/Breadcrumb";
import SearchResults from "../components/presentation/SearchResults"
import Paging from '../components/container/Paging'
import azgsApi from "../components/container/AzgsApi";
import SearchMap from "../components/container/SearchMap"
import { FormContext } from "../App";
import { useSearchParams } from 'react-router-dom'

export default function Home() {

  // Base api url
  const metadataUrl = azgsApi.getUri() + '/metadata';

  // API request-url with query parameters
  const [searchUrl, setSearchUrl] = useState(null); // Change from metadataUrl to null

  const [rrSearchParams, setrrSearchParams] = useSearchParams();
 
  const { apiSearchParams,  setApiSearchParams } = useContext(FormContext);

   // Leaflet map extent
  const [geom, setGeom] = useState();

  // Api response
  const [results, setResults] = useState([]);
  const [apiError, setApiError] = useState();
  const [boundingBoxes, setBoundingBoxes] = useState();
  const [links, setLinks] = useState();
  const [highlightBox, setHighlightBox] = useState();
  const [offset, setOffset] = useState(0);

  // Load all collections first time
  useEffect(() => {	
    const initialParams = { ...apiSearchParams };
    
	/*
    if (rrSearchParams.get("author")) {
      console.log("Setting author from rrSearchParams: " + rrSearchParams.get("author"))
      initialParams.author = rrSearchParams.get("author");
      setApiSearchParams(initialParams);
    }
	console.log("rrSearchParams = ")
	console.log(rrSearchParams)
	*/  
	
	console.log("Processing URL search params...")
	// Override initialParams with any URL search params
	rrSearchParams.forEach((value, key) => {
		console.log("Found rrSearchParam: " + key + " = " + rrSearchParams.get(key))
		//const value = rrSearchParams.get(key);
		console.log("value = " + value)
		if (value) {
			initialParams[key] = value;
		}
	})
	setApiSearchParams(initialParams);

	console.log("Initial search params: " + JSON.stringify(initialParams))
        
    // Build and submit with the updated params
    buildAndSubmitQuery(initialParams);
  }, []);

  const buildAndSubmitQuery = (params) => {
    let url = metadataUrl;
    let urlParams = new URLSearchParams();

    if ("ADMM" === process.env.REACT_APP_SITE) {
      urlParams.set("collection_group", "ADMM")
    } else {
      urlParams.set("collection_group", "!ADMM")
    }

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value) {
        urlParams.append(key, filterInput(value));
      }
    })

    if (geom) {
      urlParams.append('geom', geom);
      urlParams.append('geom_method', 'contains');
    }

    if (Array.from(urlParams).length > 0) {
      url += '?' + urlParams.toString();
    }

    console.log("url = " + url)
    setSearchUrl(url);
  };

  const onFormSubmit = async () => {
    console.log("form submit")
    setOffset(0)
    buildAndSubmitQuery(apiSearchParams);
  };

  // Fire API call whenever searchUrl updates
  useEffect(() => {
    
    if (!searchUrl) return; // Add this check

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
	str = str.replace(/[^a-zA-Z0-9 ’½.\-;"=–,:]/g, '');

	return str;
  }

  // Update searchUrl when offset changes
	useEffect(() => {
		if (!searchUrl) return; // Ensure searchUrl is defined
		const url = new URL(searchUrl);
		if ("ADMM" === process.env.REACT_APP_SITE) {
			url.searchParams.set("collection_group", "ADMM")
		} else {
			if (!url.searchParams.has("collection_group", "!ADMM")) {
				url.searchParams.append("collection_group", "!ADMM")
			}
		}
		url.searchParams.set("offset", offset)
		console.log("useEffect offset, url = " + url.href)
		setSearchUrl(url.href);
	}, [offset]);

  return (

	<div className="container">

	  <Breadcrumb />

	  <div className="row">

		{/* Search */}
		<div className="col-12">
		  <Search resultCount={results ? results.collectionCount : 0} searchUrl={searchUrl} searchParams={apiSearchParams} setSearchParams={setApiSearchParams} onFormSubmit={onFormSubmit} />
		</div>

		{/* API Error */}
		<div className="col-12">
		  {apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
			{/* {apiError} */}
			Something went wrong! Please contact azgs-info@arizona.edu for support.
		  </div>}
		</div>

		{/* 0 Results */}
		<div className="col-12" >
		  {results.data?.length === 0 && <div className="alert alert-dark text-center font-weight-bold" role="alert" style={{marginTop: "1em"}}>
			0 Results
		  </div>}
		</div>

		{/* Top Paging */}
		<div className="col-12">
		  {links && results.data?.length !== 0 && <Paging links={links} searchParams={apiSearchParams} setSearchParams={setApiSearchParams} offset={offset} setOffset={setOffset} />}
		</div>


		{/* Results map */}
        {"ADMM" !== process.env.REACT_APP_SITE &&
		<div className="col-sm-6 mb-2">
		  <SearchMap boundingBoxes={boundingBoxes} highlightBox={highlightBox} setGeom={setGeom} setSearchParams={setApiSearchParams} />
		</div>
		}

		{/* Results list */}
		<div className={"ADMM" === process.env.REACT_APP_SITE ? "col-sm" : "col-sm-6"}>
		  <SearchResults results={results} setHighlightBox={setHighlightBox} />
		</div>

		{/* Bottom Paging */}
		<div className="col-12">
		  {links && results.data?.length !== 0 && <Paging links={links} searchParams={apiSearchParams} setSearchParams={setApiSearchParams} offset={offset} setOffset={setOffset} />}
		</div>

	  </div>

	</div>
  )
}