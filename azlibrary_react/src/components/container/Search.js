import { useState } from "react";
import SelectCollectionGroup from './SelectCollectionGroup'

export default function Search({ resultCount, searchUrl, searchParams, setSearchParams, onFormSubmit}) {

    const [advancedToggle, setAdvancedToggle] = useState(false);
    {/* const [urlToggle, setUrlToggle] = useState(false);*/}

    // Handle form input changes
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

        // Reset offset and add search parameter
        setSearchParams(values => ({ ...values, [name]: value }))
    }

    // Reset form to empty
    const reset = () => {
        // setSearchParams({ latest: true });

        // Just reload the page wihtout any query params
        window.location = window.location.pathname;
    }

    return (
        <div>
            <div className=" bg-cool-gray rounded mb-4 p-3 shadow">

                {"ADMM" === process.env.REACT_APP_SITE &&
                    <div className="searchHeader text-center">Filter Mine Collections</div>
                }

                {"ADMM" !== process.env.REACT_APP_SITE &&
                <div className="searchHeader text-center">Filter Collections</div>
                }
                
                <div className="text-azurite text-center">
                    Total collections returned: {resultCount}
                </div>

                <form autoComplete="off">
              
                <div className="form-group">
                    <div className="form-row">
                            <label htmlFor="title">Title</label>
                            <input type="text" className="form-control form-control-sm" id="title" name="title" value={searchParams.title ?? ""} onChange={handleChange} />
                            <div id="Title or Keyword" className="form-text text-muted">
                                <i>The most effective search method is to type a <b>partial</b> title that matches your query (e.g. 'Grand Canyon' for publications related to the Grand Canyon)</i>. 
                            </div>
                      </div>
                 </div>
                    
                <div className="form-group">
                    {"ADMM" !== process.env.REACT_APP_SITE &&
                    <SelectCollectionGroup id="collection_group" className="form-control form-control-sm" fieldValue={searchParams.collection_group ?? ""} onChange={handleChange} />
                    }
                    
                    <div className="form-row">
                            <label htmlFor="text">Full-Text Search</label>
                            <input type="text" className="form-control form-control-sm" id="text" name="text" value={searchParams.text ?? ""} onChange={handleChange} />
                            <div id="Full-Text Search" className="form-text text-muted">
                                <i>This will search every individual text in our reports and maps for a particular word or phrase. This casts the widest possible net and is appropriate when exploring.</i> 
                            </div>
                    </div>
                </div>
                    {/* <div className="form-row">
                            <label htmlFor="instructions">Search Instructions</label>
                            <input type="text" readonly className="form-control-plaintext" id="instructions" value="Search results will update at the bottom in real-time as you type"/>
                    </div> */}

                    <div className="collapse" id="advancedSearch">
                        
                        <div className="form-row">
                            <label htmlFor="year">Year</label>
                        </div>

                        <div className="form-row">
                            <div className="col p-0">
                                <input type="text" className="form-control form-control-sm" id="year" name="year" min='0' value={searchParams.year ?? ""} onChange={handleChange} />
                            </div>
                            <div className="text-center">
                                -
                            </div>
                            <div className="col p-0">
                                <input type="text" className="form-control form-control-sm" id="endYear" name="endYear" disabled />
                            </div>
                        </div>

                        <div className="form-row">
                            <label htmlFor="author">Author</label>
                            <input type="text" className="form-control form-control-sm" id="author" name="author" value={searchParams.author ?? ""} onChange={handleChange} />
                        </div>
                        
                        <div className="form-row">
                            <label htmlFor="keyword">Keyword</label>
                            <input type="text" className="form-control form-control-sm" id="keyword" name="keyword" value={searchParams.keyword ?? ""} onChange={handleChange} />
                        </div>

                        <div className="form-row">
                            <label htmlFor="series">Series</label>
                            <input type="text" className="form-control form-control-sm" id="series" name="series" value={searchParams.series ?? ""} onChange={handleChange} />
                        </div>                                                                   

                        <div className="form-row form-check mt-2">
                            <input type="checkbox" className="form-check-input form-control-s" id="latest" name="latest" value={searchParams.latest ?? ""} onChange={handleChange} checked={searchParams?.latest} />
                            <label className="form-check-label" htmlFor="latest">Only show most recent version of items</label>
                        </div>

                        <hr />

                        <div className="form-row">
                            <label htmlFor="year">Filter by Collection ID</label>
                            <input type="text" className="form-control form-control-sm" id="collection_id" name="collection_id" value={searchParams.collection_id ?? ""} onChange={handleChange} />
                        </div>

                    </div>
                </form>
            </div>
            <div>
                <button className="btn btn-light btn-sm" type="button" data-toggle="collapse" data-target="#advancedSearch" aria-expanded="false" aria-controls="advancedSearch" onClick={() => setAdvancedToggle(!advancedToggle)} >
                {advancedToggle ? "Minimize Form" : "Expand Form For More Filter Options"}</button> 
            </div>
            <div style={{marginTop:"1.5em"}}>
                <button className="btn btn-blue btn-sm" type="button"  onClick={() => onFormSubmit()} >
                    Apply filters</button>
                <button type="reset" title="Clear Search Options" className="btn btn-red btn-sm" style={{marginLeft:"1em"}} onClick={() => reset()}>
                    Clear filters
                </button>
            </div>
        </div>
    )
}

