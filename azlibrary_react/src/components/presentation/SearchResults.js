import React from 'react';

export default class SearchResults extends React.Component {

    render() {
        return (
            <div className="container-fluid">

                {this.props.apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
                    {this.props.apiError}
                </div>}

                {
                    this.props.results?.data?.map(result =>

                        <div key={result.collection_id} className="card mb-3">
                            <div className="card-header">
                                <a className='searchUrl' target="_blank" rel="noopener noreferrer" href={"https://devdata.azgs.arizona.edu/api/v1/metadata?collection_id=" + result.collection_id}>{result.metadata.title}</a>
                            </div>
                            <div className="card-body">
                                <p>
                                    <strong>Author:</strong>
                                    {result.metadata.authors.map(author =>
                                        <div key={author.person}>{author.person}</div>
                                    )
                                    }
                                </p>

                                <p className="card-text"><strong>Abstract:</strong> {result.metadata.abstract}</p>

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
                                this.props.results?.links?.map(link =>
                                    <li key={link.rel} className="page-item">
                                        <button className="page-link" onClick={() => this.props.getResults(link.href)}>{link.rel}</button>
                                    </li>
                                )
                            }
                        </ul>
                    </nav>
                </div>

            </div>
        )
    }
}