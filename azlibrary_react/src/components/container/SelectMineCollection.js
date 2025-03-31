import { useState, useEffect } from "react";
import azgsApi from './AzgsApi';

export default function SelectMineCollection({ id, className, fieldValue, onChange }) {

    const [mineCollections, setMineCollections] = useState([]);

    useEffect(() => {

        // Get all the options for Mine Collections
        const getMineCollectionOptions = async () => {
            const res = await azgsApi.get('/dicts/mine_collections');
           let sortedMineCollections = res.data.data.mine_collections.sort(sortByName());
            setMineCollections(sortedMineCollections);
        };

        getMineCollectionOptions();

    }, []);

    // Sort by the collection group's abbreviation 
    const sortByName = () => {
        return function (a, b) {
            if (a["name"] > b["name"])
                return 1;
            else if (a["name"] < b["name"])
                return -1;
            return 0;
        }
    }

    return (
        <div className="form-row">
            <label htmlFor={id}>Mine Collection</label>
            <select className={className} id={id} name={id} onChange={onChange} value={fieldValue}>
                <option value="">--All Collections--</option>
                {
                    mineCollections?.map(collection =>
                        <option key={collection.id} value={collection.name}>{collection.name}</option>
                    )
                }
            </select>
            <div id="Mine collection" className="form-text text-muted">
                <i>Search for members of a collection</i>. 
            </div>
        </div>
    )
}