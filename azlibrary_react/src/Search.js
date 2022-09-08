import React from 'react';
import axios from 'axios';
import SearchResults from './SearchResults'

export default class Search extends React.Component {
    state = {
        searchUrl: "https://devdata.azgs.arizona.edu/api/v1/metadata",
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
            .get(this.state.searchUrl)
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

                <div className="mt-5">
                    <a href="{this.state.searchUrl}">{this.state.searchUrl}</a>
                </div>

                <SearchResults results={this.state.results} />

            </div>
        )
    }
}