import { useState, useEffect } from "react";
import SelectCollectionGroup from './SelectCollectionGroup'

export default function Search({ metadataUrl, searchUrl, setSearchUrl, setLimit, setOffset, offset }) {

    const emptyForm = { year: "", title: "", author: "", text: "", keyword: "", series: "", collection_id: "", limit: "", latest: true, geom: "", geom_method: "", offset: "" };
    const [inputs, setInputs] = useState(emptyForm);

    const [advancedToggle, setAdvancedToggle] = useState(false);
    const [urlToggle, setUrlToggle] = useState(false);

    function filterInput(input) {

        // Trim
        var str = input.toString().trim();

        // Only letters and numbers
        str = str.replace(/[^a-zA-Z0-9 ’½./-;"=–]/g, '');

        return str;
    }

    // Update searchUrl when input changes
    useEffect(() => {
        const buildQueryString = () => {

            let url = metadataUrl;
            let params = new URLSearchParams();

            // Add parameters
            Object.keys(inputs).forEach(key => {

                const value = inputs[key];

                if (value) {
                    params.append(key, filterInput(value));
                }
            })

            if (Array.from(params).length > 0) {
                url += '?' + params.toString();
            }

            setSearchUrl(url);
        }

        buildQueryString();

    }, [inputs, metadataUrl, setSearchUrl]);

    useEffect(() => {
        setLimit(inputs["limit"])
    }, [inputs, setLimit]);

    // Update inputs when offset changes
    useEffect(() => {
        setInputs(values => ({ ...values, "offset": offset }))
    }, [offset]);

    // Handle form input changes
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setOffset();
        setInputs(values => ({ ...values, [name]: value }))
    }

    // Reset form to empty
    const reset = () => {
        setOffset();
        setInputs(emptyForm);
    }

    return (
        <div>
            <div className=" bg-cool-gray rounded mb-4 p-3 shadow">

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

                        {/* <div className="form-row">
                            <label htmlFor="limit">Results Per Page</label>
                            <select type="text" className="form-control form-control-sm" id="limit" name="limit" value={inputs.limit} onChange={handleChange} >
                                <option value="">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div> */}

                        <div className="form-row form-check mt-2">
                            <input type="checkbox" className="form-check-input form-control-s" id="latest" name="latest" value={inputs.latest} onChange={handleChange} checked={inputs.latest} />
                            <label className="form-check-label" htmlFor="latest">Latest collection in the lineage</label>
                        </div>

                        <hr />

                        <div className="form-row">
                            <label htmlFor="year">Filter by Collection ID</label>
                            <input type="text" className="form-control form-control-sm" id="collection_id" name="collection_id" value={inputs.collection_id} onChange={handleChange} />
                        </div>

                    </div>

                    <div>
                        <button className="btn btn-link my-2" type="button" data-toggle="collapse" data-target="#advancedSearch" aria-expanded="false" aria-controls="advancedSearch" onClick={() => setAdvancedToggle(!advancedToggle)} >
                            {advancedToggle ? "Basic" : "Advanced"} Search
                        </button>
                    </div>

                    <div>
                        <button type="button" title="Show API Url" className="btn btn-sm btn-blue" data-toggle="collapse" data-target="#apiUrl" aria-expanded="false" aria-controls="apiUrl" onClick={() => setUrlToggle(!urlToggle)}>
                            {urlToggle ? "Hide" : "Show"} URL
                        </button>

                        <button type="reset" title="Clear search options" className="btn btn-red btn-sm" onClick={() => reset()}>Clear</button>
                    </div>

                    <div className="collapse" id="apiUrl">
                        <code><a className="searchUrl" href={searchUrl} target="_blank" rel="noopener noreferrer">{searchUrl}</a></code>
                    </div>

                </form>
            </div>
        </div>
    )
}

