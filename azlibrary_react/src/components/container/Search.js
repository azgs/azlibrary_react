import { useState } from "react";
import SelectCollectionGroup from './SelectCollectionGroup'
import SelectMineCollection from './SelectMineCollection'
import miningLogo from '../../assets/images/mining_red.svg'
import SelectFileType from "./SelectFileType";

export default function Search({ resultCount, searchUrl, searchParams, setSearchParams, onFormSubmit}) {

    const [advancedToggle, setAdvancedToggle] = useState(false);
    {/* const [urlToggle, setUrlToggle] = useState(false);*/}

    // Handle form input changes
    const handleChange = (e) => {
        const name = e.target.name;
        // q_mode is an enumerated API parameter, not a boolean: it takes
        // "metadata" or "deep" and the API rejects anything else, so a bare
        // e.target.checked would send q_mode=true and come back 400. Unchecked
        // becomes "" rather than "metadata" so that buildAndSubmitQuery drops
        // the parameter entirely, leaving the default request exactly what it
        // was before this control existed.
        const value = "q_mode" === name ?
            (e.target.checked ? "deep" : "") :
            e.target.type === "checkbox" ? e.target.checked : e.target.value;

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
            <div className={("ADMM" === process.env.REACT_APP_SITE ? "bg-warm-gray" : "bg-cool-gray") + " rounded mb-4 p-3 shadow"}>

                {"ADMM" === process.env.REACT_APP_SITE &&
                    <>
                    <img width='50' src={miningLogo} alt="AZGS mining logo" className="img-fluid mx-auto d-block" />
                    <div className="searchHeader text-center">
                        Filter Mine Collections
                    </div>
                    </>    
                }

                {"ADMM" !== process.env.REACT_APP_SITE &&
                <div className="searchHeader text-center">Filter Collections</div>
                }
                
                <div className={("ADMM" === process.env.REACT_APP_SITE ?"text-chili" : "text-azurite") + " text-center"}>
                    Total collections returned: {resultCount}
                </div>

                <form autoComplete="off">
              
                <div className="form-group">
                    <div className="form-row">
                            <label htmlFor="q">Search</label>
                            <input type="text" className="form-control form-control-sm" id="q" name="q" value={searchParams.q ?? ""} onChange={handleChange} />
                            <div id="Search" className="form-text text-muted">
                                <i>This search bar will simultaneously search the title, keyword, author, and abstract information of AZGS collections for the entered terms. Put terms in double quotes to match them as a phrase (e.g. "Grand Canyon"). More search options can be found by expanding the form for more filter options.</i>
                            </div>
                      </div>
                      {/* Styled as a switch, not a plain checkbox, to match the
                          map's "Filter results to map extent" control. The form
                          already draws that distinction: plain checkboxes are
                          filters on a field, a switch changes how the search
                          itself behaves, which is what this does. Underneath it
                          is the same input type, so nothing about the value
                          mapping changes. custom-switch is Bootstrap 4; the
                          pending az-bootstrap-5 migration renames it to
                          form-switch and will need to move this and the map's
                          toggle together. */}
                      <div className="form-row mt-2">
                            <div className="custom-control custom-switch">
                                <input type="checkbox" className="custom-control-input" id="q_mode" name="q_mode" onChange={handleChange} checked={"deep" === searchParams.q_mode} />
                                <label className="custom-control-label" htmlFor="q_mode">Include document text in this search</label>
                                {"deep" === searchParams.q_mode &&
                                <small id="q_mode_note" className="form-text text-muted">
                                    <i>Many older documents are scanned images, and their text cannot be searched.</i>
                                </small>
                                }
                            </div>
                      </div>
                 </div>

                <div className="form-group">
                    {"ADMM" !== process.env.REACT_APP_SITE &&
                    <SelectCollectionGroup id="collection_group" className="form-control form-control-sm" fieldValue={searchParams.collection_group ?? ""} onChange={handleChange} />
                    }

                    {"ADMM" == process.env.REACT_APP_SITE &&
                    <>
                        <div className="form-group">
                        <SelectMineCollection id="mine_collection" className="form-control form-control-sm" fieldValue={searchParams.mine_collection ?? ""} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <div className="form-row">
                                    <label htmlFor="mine_resource_id">Resource ID</label>
                                    <input type="text" className="form-control form-control-sm" id="mine_resource_id" name="mine_resource_id" value={searchParams.mine_resource_id ?? ""} onChange={handleChange} />
                                    <div id="Resource ID" className="form-text text-muted">
                                        <i>Search for a specific Resource ID. The Resource ID is a legacy identifier associated with some of the mining collections and is used in older publications. Newer publications should filter by Collection ID (in expanded filter options)</i>. 
                                    </div>
                            </div>
                        </div>
                    </>
                    }
       
                </div>
                    {/* <div className="form-row">
                            <label htmlFor="instructions">Search Instructions</label>
                            <input type="text" readonly className="form-control-plaintext" id="instructions" value="Search results will update at the bottom in real-time as you type"/>
                    </div> */}

                    <div className="collapse" id="advancedSearch">

                        <div className="form-row">
                            <label htmlFor="title">Title</label>
                            <input type="text" className="form-control form-control-sm" id="title" name="title" value={searchParams.title ?? ""} onChange={handleChange} />
                        </div>

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
                        <SelectFileType id="file_type" className="form-control form-control-sm" fieldValue={searchParams.file_type ?? ""} onChange={handleChange} />

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

