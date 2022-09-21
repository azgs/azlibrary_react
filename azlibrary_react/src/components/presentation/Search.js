import { useState, useEffect } from "react";
import azgsApi from '../container/AzgsApi';
import SelectCollectionGroup from './SelectCollectionGroup'
import SearchResults from './SearchResults'

export default function Search() {

    const emptyForm = { year: "", title: "", author: "", text: "", keyword: "", series: "", collection_id: "", latest: "" };
    const metadataUrl = azgsApi.getUri() + '/metadata';

    const [inputs, setInputs] = useState(emptyForm);
    const [results, setResults] = useState([]);
    const [searchUrl, setSearchUrl] = useState(metadataUrl);
    const [apiError, setaApiError] = useState();
    const [advancedToggle, setAdvancedToggle] = useState(false);

    // Update searchUrl when input changes
    useEffect(() => {
        const buildQueryString = () => {

            let url = metadataUrl;
            let params = new URLSearchParams();

            // Add parameters
            Object.keys(inputs).forEach(key => {

                const value = inputs[key]

                if (inputs[key]) {
                    params.append(key, value);
                }
            })

            if (Array.from(params).length > 0) {
                url += '?' + params.toString();
            }

            setSearchUrl(url);
        }

        buildQueryString();

    }, [inputs, metadataUrl]);

    // Fire API call whenever searchUrl updates
    useEffect(() => {
        const fetchResults = () => {

            azgsApi
                .get(searchUrl)
                .then(function (res) {
                    setResults(res.data);
                    setaApiError();
                })
                .catch(function (error) {
                    setResults([]);
                    setaApiError(error.toString(),);
                });
        }

        fetchResults();

    }, [searchUrl]);

    // Handle form input changes
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    // Reset form to empty
    const reset = () => {
        setInputs(emptyForm);
    }

    // Update the searchUrl (used for paging)
    const updateSearchUrl = (url) => {
        setSearchUrl(url);
    }

    return (
        <div className="container-fluid">

            <div className="row">
                <div className="col-lg-3">
                    <div className=" bg-cool-gray rounded p-3 shadow">

                        <div className="searchHeader text-center">Search Collections</div>

                        <form autoComplete="off">

                            <SelectCollectionGroup id="collection_group" className="form-control form-control-sm" fieldValue={inputs.collection_group} onChange={handleChange} />

                            <div className="form-row">
                                <label htmlFor="year">Year</label>
                            </div>

                            <div className="form-row">
                                <div className="col p-0">
                                    <input type="text" className="form-control form-control-sm" id="year" name="year" min='0' value={inputs.year} onChange={handleChange} />
                                </div>
                                <div className="text-center">
                                    -
                                </div>
                                <div className="col p-0">
                                    <input type="text" className="form-control form-control-sm" id="endEear" name="endYear" disabled />
                                </div>
                            </div>

                            <div className="form-row">
                                <label htmlFor="title">Title</label>
                                <input type="text" className="form-control form-control-sm" id="title" name="title" value={inputs.title} onChange={handleChange} />
                            </div>

                            <div className="form-row">
                                <label htmlFor="author">Author</label>
                                <input type="text" className="form-control form-control-sm" id="author" name="author" value={inputs.author} onChange={handleChange} />
                            </div>

                            <div className="collapse" id="advancedSearch">

                                <div className="form-row">
                                    <label htmlFor="text">Full-Text Search</label>
                                    <input type="text" className="form-control form-control-sm" id="text" name="text" value={inputs.text} onChange={handleChange} />
                                </div>

                                <div className="form-row">
                                    <label htmlFor="keyword">Keyword</label>
                                    <input type="text" className="form-control form-control-sm" id="keyword" name="keyword" value={inputs.keyword} onChange={handleChange} />
                                </div>

                                <div className="form-row">
                                    <label htmlFor="keyword">Series</label>
                                    <input type="text" className="form-control form-control-sm" id="series" name="series" value={inputs.series} onChange={handleChange} />
                                </div>

                                <hr />

                                <div className="form-row">
                                    <label htmlFor="year">Collection ID</label>
                                    <input type="text" className="form-control form-control-sm" id="collection_id" name="collection_id" value={inputs.collection_id} onChange={handleChange} />
                                </div>

                                <div className="form-row form-check my-2">
                                    <input type="checkbox" className="form-check-input form-control-s" id="latest" name="latest" value={inputs.latest} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="latest">Latest collection in the lineage</label>
                                </div>

                            </div>

                            <div>
                                <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#advancedSearch" aria-expanded="false" aria-controls="advancedSearch" onClick={() => setAdvancedToggle(!advancedToggle)} >
                                    {advancedToggle ? "Basic" : "Advanced"} Search
                                </button>
                            </div>

                            <div className="col-12 text-right">
                                <button type="reset" className="btn btn-red btn-sm mt-2" onClick={() => reset()}>Clear</button>
                            </div>

                            <div className="col-12">
                                <code>API:<a className="searchUrl" href={searchUrl} target="_blank" rel="noopener noreferrer">{searchUrl}</a></code>
                            </div>

                        </form>
                    </div>
                </div>

                <div className="col-lg-9">

                    {/* API Error */}
                    {apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
                        {apiError}
                    </div>}

                    <SearchResults results={results} updateSearchUrl={updateSearchUrl} />
                </div>

            </div>

        </div>)
}
