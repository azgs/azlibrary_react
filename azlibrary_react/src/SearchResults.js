import React from 'react';

export default class SearchResults extends React.Component {

    render() {
        return (
            <div className="container">
                <div id="Results" className="mt-5">
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
                                this.props.results
                                    .map(result =>
                                        <tr key={result.collection_id}>
                                            <td>{result.metadata.year}</td>
                                            <td>{result.collection_id}</td>
                                            <td>{result.metadata.title}</td>
                                        </tr>
                                    )
                            }
                        </tbody>

                    </table>
                </div>
            </div>
        )
    }
}