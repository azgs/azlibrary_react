import React from 'react';
import azgsApi from './AzgsApi';
import SelectCollectionGroup from './SelectCollectionGroup'
import SearchResults from './SearchResults'

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
        }, () => this.getResults());
    }

    getResults = () => {
        const self = this;

        let url = azgsApi.getUri() + '/metadata'
        let params = new URLSearchParams();

        if (this.state.collection_group) {
            params.append('collection_group', this.state.collection_group);
        }
        if (this.state.year) {
            params.append('year', this.state.year);
        }
        if (this.state.title) {
            params.append('title', this.state.title);
        }
        if (this.state.author) {
            params.append('author', this.state.author);
        }
        if (Array.from(params).length > 0) {
            url += '?' + params.toString();
        }

        self.setState({searchUrl: url});

        azgsApi
            .get(url)
            .then(function (res) {
                self.setState({
                    results: res.data,
                });
            });
    };

    reset = () => {
        const self = this;
        self.setState(
            {
                collection_group: "",
                year: "",
                title: "",
                author: "",
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
                            <SelectCollectionGroup className="form-control form-control-sm" name="collection_group" handleInputChange={this.handleInputChange} />

                            <div className="form-group">
                                <label htmlFor="searchYears">Year(s)</label>
                                <input type="text" className="form-control form-control-sm" name="year" autoComplete="off" onChange={this.handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="searchTitle">Title</label>
                                <input type="text" className="form-control form-control-sm" name="title" autoComplete="off" onChange={this.handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="searchAuthor">Author(s)</label>
                                <input type="text" className="form-control form-control-sm" name="author" autoComplete="off" onChange={this.handleInputChange} />
                            </div>

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