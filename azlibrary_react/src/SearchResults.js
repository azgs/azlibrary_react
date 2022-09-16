import React from 'react';

export default class SearchResults extends React.Component {

    render() {
        return (
            <div className="container-fluid">

                <h2 className="text-center">Results</h2>

                {this.props.apiError && <div className="alert alert-danger text-center font-weight-bold" role="alert">
                    {this.props.apiError}
                </div>}

                <table className="table">
                    <thead>
                        <tr>
                            <th>year</th>
                            <th>collection_id</th>
                            <th>title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.results?.data?.map(result =>
                                <tr key={result.collection_id}>
                                    <td>{result.metadata.year}</td>
                                    <td><a href={result.links[0].href}>{result.collection_id}</a></td>
                                    <td>{result.metadata.title}</td>
                                </tr>
                            )
                        }
                    </tbody>

                </table>

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