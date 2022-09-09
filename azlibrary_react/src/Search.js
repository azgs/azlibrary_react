import React from 'react';
import axios from 'axios';
import SelectCollectionGroup from './SelectCollectionGroup'
import SearchResults from './SearchResults'

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.baseUrl = props.baseUrl;
        this.metadataUrl = props.baseUrl + "/metadata";

        this.state = {
            searchGroup: "",
            searchTitle: "",
            searchUrl: this.metadataUrl,
            results: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => this.buildQueryString());
    }

    buildQueryString() {
        let url = this.metadataUrl;
        let params = new URLSearchParams();

        if (this.state.searchGroup) {
            params.append('collection_group', this.state.searchGroup);
        }

        if (this.state.searchTitle) {
            params.append('title', this.state.searchTitle);
        }

        if (Array.from(params).length > 0) {
            url = this.metadataUrl + "?" + params.toString();
        }

        this.setState({ 'searchUrl': url });
    }

    getResults = () => {
        const self = this;
        axios
            .get(this.state.searchUrl)
            .then(function (response) {
                self.setState({
                    results: response.data.data,
                });
            });
    };

    reset = () => {
        const self = this;
        self.setState(
            {
                searchUrl: this.metadataUrl,
                results: []
            }
        );
    };

    render() {
        return (

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 border">

                        <h1 className="text-center">Search</h1>

                        <form>
                            <SelectCollectionGroup baseUrl={this.baseUrl} handleInputChange={this.handleInputChange} />

                            <div className="form-group">
                                <label htmlFor="searchTitle">Title</label>
                                <input type="text" className="form-control" id="searchTitle" name="searchTitle" autoComplete="off" onChange={this.handleInputChange} />
                            </div>

                            <button type="button" className="btn btn-primary float-right" onClick={this.getResults}>Search</button>

                            <button type="reset" className="btn btn-red float-right mr-2" onClick={this.reset}>Reset</button>

                            <div className="mt-5" >
                                <a className="" href={this.state.searchUrl}>{this.state.searchUrl}</a>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-8">
                        <SearchResults results={this.state.results} />
                    </div>
                </div>

            </div>
        )
    }
}