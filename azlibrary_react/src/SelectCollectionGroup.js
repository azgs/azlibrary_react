import React from 'react';
import azgsApi from './AzgsApi';

export default class SelectCollectionGroup extends React.Component {

    constructor(props) {
        super(props);
        
        this.id = props.id;
        this.className = props.className;

        this.handleInputChange = props.handleInputChange;
        this.state = { groups: [] };
    }

    sortByAbbreviation() {
        return function (a, b) {
            if (a["abbrv"] > b["abbrv"])
                return 1;
            else if (a["abbrv"] < b["abbrv"])
                return -1;

            return 0;
        }
    }

    componentDidMount() {
        azgsApi.get('/dicts/collection_groups')
            .then(res => {
                const groups = res.data.data.sort(this.sortByAbbreviation());
                this.setState({ groups });
            })
    }

    render() {
        return (

            <div className="form-row">
                <label htmlFor={this.className}>Collection Group</label>
                <select className={this.className} id={this.id} name={this.id} onChange={this.handleInputChange}>
                    <option value="">--All Collections--</option>
                    {
                        this.state.groups
                            .map(group =>
                                <option key={group.id} value={group.abbrv}>{group.abbrv} - {group.name}</option>
                            )
                    }
                </select>
            </div>

        )
    }
}