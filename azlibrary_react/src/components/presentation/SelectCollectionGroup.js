import { useState, useEffect } from "react";
import azgsApi from '../container/AzgsApi';

export default function SelectCollectionGroup({ id, className, handleInputChange }) {

    const [groups, setGroups] = useState([]);

    useEffect(() => {

        // This is firing twice on load. Can't figure out why.. 
        azgsApi.get('/dicts/collection_groups')
            .then(res => {
                const data = res.data.data.sort(sortByAbbreviation());
                setGroups(data);
            })

    }, []);

    const sortByAbbreviation = () => {
        return function (a, b) {
            if (a["abbrv"] > b["abbrv"])
                return 1;
            else if (a["abbrv"] < b["abbrv"])
                return -1;

            return 0;
        }
    }

    return (
        <div className="form-row">
            <label htmlFor={id}>Collection Group</label>
            <select id={id} className={className} name={id} onChange={handleInputChange}>
                <option value="">--All Collections--</option>
                {
                    groups?.map(group =>
                        <option key={group.id} value={group.abbrv}>{group.abbrv} - {group.name}</option>
                    )
                }
            </select>
        </div>
    )
}