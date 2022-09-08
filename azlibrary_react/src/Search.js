import React from 'react';
import axios from 'axios';

export default class Search extends React.Component {
    state = {
        groups: []
    }

    componentDidMount() {
        axios.get(`https://devdata.azgs.arizona.edu/api/v1/dicts/collection_groups`)
            .then(res => {
                const groups = res.data.data;
                this.setState({ groups });
            })
    }

    GetResults() {
        alert('Hello!');
    }

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

            </div>
        )
    }
}