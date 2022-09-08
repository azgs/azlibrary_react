import React from 'react';
import axios from 'axios';

export default class SelectCollectionGroup extends React.Component {
    state = {
        groups: [],
    }

    componentDidMount() {
        axios.get(`https://devdata.azgs.arizona.edu/api/v1/dicts/collection_groups`)
            .then(res => {
                const groups = res.data.data;
                this.setState({ groups });
            })
    }

    render() {
        return (

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

        )
    }
}