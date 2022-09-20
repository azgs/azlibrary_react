import React from 'react'

export default function SearchResults({ results, getResults, apiError }) {
    return (
        <div className="container-fluid">

            {apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
                {apiError}
            </div>}

            {
                results?.data?.map(result =>

                    <div key={result.collection_id} className="card mb-3">
                        <div className="card-header">
                            <a target="_blank" rel="noopener noreferrer" href={"https://devdata.azgs.arizona.edu/api/v1/metadata?collection_id=" + result.collection_id}>{result.metadata.title}</a>
                        </div>
                        <div className="card-body">

                            <div>
                                <strong>Year:</strong> {result.metadata.year}
                            </div>

                            {/* <div>
                                <strong>Author:</strong>
                                {result.metadata.authors.map(author =>
                                    <div key={author.person}>{author.person}</div>
                                )
                                }
                            </div> */}

                            <div className="card-text"><strong>Abstract:</strong> {result.metadata.abstract}</div>

                            <strong>Links:</strong>
                            <ul className='ul-triangles'>
                                {result.links.map(link =>
                                    <li key={link.rel}><a href={link.href} className="card-link">{link.rel}</a></li>
                                )
                                }
                            </ul>
                        </div>
                    </div>
                )
            }

            <div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                        {
                            results?.links?.map(link =>
                                <li key={link.rel} className="page-item">
                                    <button className="page-link" onClick={() => getResults(link.href)}>{link.rel}</button>
                                </li>
                            )
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
}