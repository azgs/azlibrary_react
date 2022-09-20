import React from 'react';

export default class SearchResults extends React.Component {

    render() {
        return (
            <div className="container-fluid">

                <h2 className="text-center">Results</h2>

                {this.props.apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
                    {this.props.apiError}
                </div>}

                {
                    this.props.results?.data?.map(result =>

                        <div key={result.collection_id} className="card mb-3">
                            <div className="card-header">
                                {result.metadata.title}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{result.collection_id}</h5>
                                <p className="card-text">{result.metadata.abstract}</p>
                                <a href={result.links[0].href} className="btn btn-red">Download</a>
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