import { Link } from "react-router-dom";

export default function SearchResults({ results, updateSearchUrl }) {

    const isEmptyResults = results.data?.length === 0;

    return (
        <div className="container-fluid">

            {/* 0 Results */}
            {isEmptyResults && <div className="alert alert-dark text-center font-weight-bold" role="alert">
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

            {!isEmptyResults && <div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                        {
                            results?.links?.map(link =>
                                <li key={link.rel} className="page-item">
                                    <button className="page-link" onClick={() => updateSearchUrl(link.href)}>{link.rel}</button>
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