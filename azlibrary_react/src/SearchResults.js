import React from 'react';

export default class SearchResults extends React.Component {

    render() {
        return (
            <div className="container-fluid">

                <h2 className="text-center">Results</h2>

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
            </div>
        )
    }
}