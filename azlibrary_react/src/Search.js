import React from 'react';
import axios from 'axios';

export default class Search extends React.Component {
    state = {
        groups: [],
        results: []
    }

    componentDidMount() {
        axios.get(`https://devdata.azgs.arizona.edu/api/v1/dicts/collection_groups`)
            .then(res => {
                const groups = res.data.data;
                this.setState({ groups });
            })
    }

    GetResults = () => {
        const self = this;
        axios
            .get(`https://devdata.azgs.arizona.edu/api/v1/metadata`)
            .then(function (response) {
                self.setState({
                    results: response.data.data,
                });
            });
    };

    render() {
        return (

            <div className="container">

                <form>
                    <div className="form-group">
                        <label htmlFor="FormCollectionGroup">Collection Group</label>
                        <select className="form-control" id="FormCollectionGroup">
                            {
                                this.state.groups
                                    .map(group =>
                                        <option key={group.id} value={group.abbrv}>{group.name} ({group.abbrv})</option>
                                    )
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="FormSearch">Search</label>
                        <input type="text" className="form-control" id="FormSearch" />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={this.GetResults}>Search</button>
                </form>

                <div id="Results" className="mt-5">
                    <table className="table">
                        <tr>
                            <th>year</th>
                            <th>collection_id</th>
                            <th>title</th>
                        </tr>
                        {
                            this.state.results
                                .map(result =>
                                    <tr key={result.collection_id}>
                                        <td>{result.metadata.year}</td>
                                        <td>{result.collection_id}</td>
                                        <td>{result.metadata.title}</td>
                                    </tr>
                                )
                        }
                    </table>

                </div>

            </div>
        )
    }
}