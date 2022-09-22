import React from 'react'
import { Link } from "react-router-dom";
import azgsApi from '../container/AzgsApi';

export default function SearchResults({ results, updateSearchUrl }) {

    const isEmptyResults = results.data?.length === 0;
    const collectionBasePath = azgsApi.getUri() + '/metadata?collection_id=';

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
                            <div className='row justify-content-between'>
                                <div className='col-11 font-weight-bold'><Link className="text-truncate" to={"/collection/" + result.collection_id}>{result.metadata.title}</Link></div>
                                <div className='col-1 text-right'><a target="_blank" rel="noopener noreferrer" href={collectionBasePath + result.collection_id} className="badge badge-link badge-pill badge-blue">json</a></div>
                            </div>
                        </div>
                        <div className="card-body p-1">

                            <ul className="list-inline mb-0">
                                {result.metadata.year && <li className="list-inline-item"><strong>Year: </strong>{result.metadata.year}</li>}
                                {result.metadata.series && <li className="list-inline-item"><strong>Series: </strong>{result.metadata.series}</li>}
                                {result.metadata.collection_group.name && <li className="list-inline-item"><strong>Collection Group: </strong>{result.metadata.collection_group.name}</li>}
                            </ul>

                            {/* <ul className="list-inline mb-0">
                                <li className="list-inline-item"><strong>Author: </strong></li>
                                {result.metadata.authors.map(author =>
                                    <li key={result.collection_id + author.person} className="list-inline-item">{author.person}</li>
                                )
                                }
                            </ul> */}

                            {result.metadata.abstract && <div className="card-text text-truncate"><strong>Abstract:</strong> {result.metadata.abstract}</div>}

                            {/* <ul className="list-inline mb-0">
                                <li className="list-inline-item"><strong>Links: </strong></li>
                                {result.links.map(link =>
                                    <li key={link.rel} className="list-inline-item"><a href={link.href} className="card-link">{link.rel}</a></li>
                                )
                                }
                            </ul> */}

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