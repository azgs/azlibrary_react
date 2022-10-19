import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Paging from '../presentation/Paging'
import ResultsMap from '../presentation/ResultsMap'
import azgsApi from './AzgsApi';

export default function SearchResults({ searchUrl, setSearchUrl }) {

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
                    setApiError(error.toString(),);
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

        const boundingBoxes = results?.data?.map(item => ({ id: item.collection_id, title: item.metadata.title, bbox: item.metadata.bounding_box }));

        setBoundingBoxes(boundingBoxes);

    }, [results]);

    function changeBackground(bbox) {
        setHighlightBox(bbox)
    }

    return (
        <div className="container-fluid">

            {/* API Error */}
            {apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
                {apiError}
            </div>}

            {/* 0 Results */}
            {results.data?.length === 0 && <div className="alert alert-dark text-center font-weight-bold" role="alert">
                0 Results
            </div>}

            {results.data?.length !== 0 && <ResultsMap results={boundingBoxes} highlightBox={highlightBox} />}

            {
                results?.data?.map(result =>

                    <div key={result.collection_id} className="card mb-3" onMouseOver={() => changeBackground({ id: result.collection_id, title: result.metadata.title, bbox: result.metadata.bounding_box })}>
                        <div className="card-header">
                            <Link className="stretched-link" title={result.metadata.title} to={"/item/" + result.collection_id}>{result.metadata.title}</Link>
                        </div>
                        <div className="card-body p-1 d-none d-sm-block">

                            <ul className="list-inline mb-0">
                                {result.metadata.year && <li className="list-inline-item"><strong>Year: </strong>{result.metadata.year}</li>}
                                {result.metadata.series && <li className="list-inline-item"><strong>Series: </strong>{result.metadata.series}</li>}
                                {result.metadata.collection_group.name && <li className="list-inline-item"><strong>Collection Group: </strong>{result.metadata.collection_group.name}</li>}
                            </ul>

                        </div>
                    </div>
                )
            }

            {results.data?.length !== 0 && <Paging links={results?.links} setSearchUrl={setSearchUrl} />}

        </div>
    )
}