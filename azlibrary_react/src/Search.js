import React from 'react';
import axios from './Axios';
import SelectCollectionGroup from './SelectCollectionGroup'
import SearchResults from './SearchResults'

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.baseUrl = props.baseUrl;
        this.metadataUrl = props.baseUrl + "/metadata";

        this.state = {
            searchGroup: "",
            searchYears: "",
            searchTitle: "",
            searchAuthor: "",
            searchUrl: this.metadataUrl,
            results: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.getResults();
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

        if (this.state.searchYears) {
            params.append('year', this.state.searchYears);
        }

        if (this.state.searchTitle) {
            params.append('title', this.state.searchTitle);
        }
        
        if (this.state.searchAuthor) {
            params.append('author', this.state.searchAuthor);
        }

        if (Array.from(params).length > 0) {
            url = this.metadataUrl + "?" + params.toString();
        }

        this.setState({ 'searchUrl': url }, () => this.getResults());
    }

    getResults = () => {
        const self = this;
        axios
            .get(this.state.searchUrl)
            .then(function (response) {
                self.setState({
                    results: response.data,
                });
            });
    };

    reset = () => {
        const self = this;
        self.setState(
            {
                searchGroup: "",
                searchYears: "",
                searchTitle: "",
                searchAuthor: "",
                searchUrl: this.metadataUrl,
            }, () => this.getResults()
        );
    };

    render() {
        return (

            <div className="container-fluid">

                <div>
                    <a href={this.state.searchUrl} target="_blank" rel="noopener noreferrer">{this.state.searchUrl}</a>
                </div>

                <div className="row">
                    <div className="col-lg-4 border p-3">

                        <h1 className="text-center">Search</h1>

                        <form>
                            <SelectCollectionGroup handleInputChange={this.handleInputChange} />

                            <div className="form-group">
                                <label htmlFor="searchYears">Year(s)</label>
                                <input type="number" className="form-control" name="searchYears" autoComplete="off" onChange={this.handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="searchTitle">Title</label>
                                <input type="text" className="form-control" name="searchTitle" autoComplete="off" onChange={this.handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="searchAuthor">Author(s)</label>
                                <input type="text" className="form-control" name="searchAuthor" autoComplete="off" onChange={this.handleInputChange} />
                            </div>

                            {/* <button type="button" className="btn btn-primary float-right" onClick={this.getResults}>Search</button> */}

                            <button type="reset" className="btn btn-red float-right mr-2" onClick={this.reset}>Clear</button>

                        </form>
                    </div>
                    <div className="col-lg-8">
                        <SearchResults results={this.state.results} />
                    </div>
                </div>

            </div>
        )
    }
}