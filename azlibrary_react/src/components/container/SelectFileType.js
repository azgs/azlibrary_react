import { useState, useEffect } from "react";
import azgsApi from './AzgsApi';

export default function SelectFileType({ id, className, fieldValue, onChange }) {

    //Don't really need to use state here, since we aren't hitting api to get these.But we might someday.
    const [fileTypes, setFileTypes] = useState([
        "documents",
        "images",
        "notes",
        "metadata",
        "gisdata:legacy",
        "gisdata:layers",
        "gisdata:raster",
        "gisdata:gems2",
        "gisdata:ncgmp09",
    ]);

    return (
        <div className="form-row">
            <label htmlFor={id}>File type</label>
            <select className={className} id={id} name={id} onChange={onChange} value={fieldValue}>
                <option value="">--All File Types--</option>
                {
                    fileTypes?.map((fileType, idx) =>
                        <option key={idx} value={fileType}>{fileType}</option>
                    )
                }
            </select>
            <div id="File type" className="form-text text-muted">
                <i>Search for collection by contained file types</i>. 
            </div>
        </div>
    )
}