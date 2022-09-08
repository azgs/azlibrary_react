import React from 'react';
import axios from 'axios';
import SelectCollectionGroup from './SelectCollectionGroup'
import SearchResults from './SearchResults'

export default class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchUrl: "https://devdata.azgs.arizona.edu/api/v1/metadata",
            results: []
        };
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

                    <SelectCollectionGroup />

                    <div className="form-group">
                        <label htmlFor="FormSearch">Search</label>
                        <input type="text" className="form-control" id="FormSearch" />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={this.GetResults}>Search</button>
                </form>

                <div className="mt-5">
                    <a href={this.state.searchUrl}>{this.state.searchUrl}</a>
                </div>

                <SearchResults results={this.state.results} />

            </div>
        )
    }
}