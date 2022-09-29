import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import azgsApi from '../container/AzgsApi';

export default function SearchResults({ searchUrl, setSearchUrl }) {

    const [results, setResults] = useState([]);
    const [apiError, setaApiError] = useState();

    // Fire API call whenever searchUrl updates
    useEffect(() => {

        let lastRequest = true;

        const fetchResults = async () => {
            try {
                const res = await azgsApi.get(searchUrl);
                if (lastRequest) {
                    setResults(res.data);
                    setaApiError();
                }
            } catch (error) {
                if (lastRequest) {
                    setResults([]);
                    setaApiError(error.toString(),);
                }
            }
        };

        fetchResults();

        return () => {
            lastRequest = false;
        };
    }, [searchUrl]);

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

            {
                results?.data?.map(result =>

                    <div key={result.collection_id} className="card mb-3">
                        <div className="card-header">
                            <Link className="stretched-link" title={result.metadata.title} to={"/collection/" + result.collection_id}>{result.metadata.title}</Link>
                        </div>
                        <div className="card-body p-1">

                            <ul className="list-inline mb-0">
                                {result.metadata.year && <li className="list-inline-item"><strong>Year: </strong>{result.metadata.year}</li>}
                                {result.metadata.series && <li className="list-inline-item"><strong>Series: </strong>{result.metadata.series}</li>}
                                {result.metadata.collection_group.name && <li className="list-inline-item"><strong>Collection Group: </strong>{result.metadata.collection_group.name}</li>}
                            </ul>

                        </div>
                    </div>
                )
            }

            {results.data?.length !== 0 && <div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                        {
                            results?.links?.map(link =>
                                <li key={link.rel} className="page-item">
                                    <button className="page-link" onClick={() => setSearchUrl(link.href)}>{link.rel}</button>
                                </li>
                            )
                        }
                    </ul>
                </nav>
            </div>
            }

        </div>
    )
}