import { useState, useEffect, useContext } from "react";
import Search from '../components/container/Search'
import Breadcrumb from "../components/presentation/Breadcrumb";
import SearchResults from "../components/presentation/SearchResults"
import Paging from '../components/container/Paging'
import azgsApi from "../components/container/AzgsApi";
import SearchMap from "../components/container/SearchMap"
import { FormContext } from "../App";

export default function Home() {

  // Base api url
  const metadataUrl = azgsApi.getUri() + '/metadata';

  // API request-url with query parameters
  const [searchUrl, setSearchUrl] = useState(metadataUrl);

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

  //Load all collections first time
  useEffect(() => {
	onFormSubmit()
  }, []);

  
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
	str = str.replace(/[^a-zA-Z0-9 ’½.\-;"=–,]/g, '');

	return str;
  }

  // Update searchUrl when offset changes
	useEffect(() => {
		const url = new URL(searchUrl);
		if ("ADMM" === process.env.REACT_APP_SITE) {
			url.searchParams.set("collection_group", "ADMM")
		} else {
			url.searchParams.set("collection_group", "!ADMM")
		}
		url.searchParams.set("offset", offset)
		console.log("useEffect offset, url = " + url.href)
		setSearchUrl(url.href);
	}, [offset]);


	// Update searchUrl on submit
	const onFormSubmit = async () => {
	  console.log("form submit")
	  setOffset(0) //TODO: This causes an extra trip to API. Otherwise, I think it's ok. So leave it, I guess?

	  const buildQueryString = () => {
		console.log("buildQueryString")
		let url = metadataUrl;
		let params = new URLSearchParams();

		if ("ADMM" === process.env.REACT_APP_SITE) {
			params.set("collection_group", "ADMM")
		} else {
			params.set("collection_group", "!ADMM")
		}

		// Add search parameters
		Object.keys(apiSearchParams).forEach(key => {
		  console.log("Processing " + key)
		  const value = apiSearchParams[key];
		  console.log("value = " + value)
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
  
		console.log("url = " + url)
		setSearchUrl(url);
	  }
  
	  buildQueryString();
  
	};
  
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
		<div className="col-sm">
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