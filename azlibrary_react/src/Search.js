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

        const collection_group = this.state.collection_group;
        const collection_id = this.state.collection_id;
        const year = this.state.year;
        const title = this.state.title;
        const author = this.state.author;
        const keyword = this.state.keyword;
        const series = this.state.series;

        if (collection_group) {
            params.append('collection_group', collection_group);
        }
        if (collection_id){
            params.append('collection_id', collection_id);
        }
        if (year) {
            params.append('year', year);
        }
        if (title) {
            params.append('title', title);
        }
        if (author) {
            params.append('author', author);
        }       
        if (keyword) {
            params.append('keyword', keyword);
        }
        if (series) {
            params.append('series', series);
        }

        if (Array.from(params).length > 0) {
            url += '?' + params.toString();
        }

        self.setState({ searchUrl: url });

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
                collection_id: "",
                year: "",
                title: "",
                author: "",
                keyword: "",
                series: "",
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
                    <div className="col-lg-3">
                        <div className=" bg-cool-gray border p-3">

                            <h1 className="text-center">Search</h1>

                            <form>
                                <SelectCollectionGroup className="form-control form-control-sm" name="collection_group" handleInputChange={this.handleInputChange} />

                                <div className="form-group">
                                    <label htmlFor="year">ID</label>
                                    <input type="text" className="form-control form-control-sm" name="collection_id" autoComplete="off" onChange={this.handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="year">Year</label>
                                    <input type="text" className="form-control form-control-sm" name="year" autoComplete="off" onChange={this.handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" className="form-control form-control-sm" name="title" autoComplete="off" onChange={this.handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="author">Author</label>
                                    <input type="text" className="form-control form-control-sm" name="author" autoComplete="off" onChange={this.handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="keyword">Keyword</label>
                                    <input type="text" className="form-control form-control-sm" name="keyword" autoComplete="off" onChange={this.handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="keyword">Series</label>
                                    <input type="text" className="form-control form-control-sm" name="series" autoComplete="off" onChange={this.handleInputChange} />
                                </div>

                                <div className="col-12 text-right">
                                    <button type="reset" className="btn btn-red" onClick={this.reset}>Clear</button>
                                </div>

                            </form>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <SearchResults results={this.state.results} />
                    </div>


                </div>

            </div>
        )
    }
}