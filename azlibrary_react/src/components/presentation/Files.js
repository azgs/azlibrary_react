export default function Files({ files }) {

    // Group files by type
    const filesByType = files.reduce((groups, value) => {

        // Capitalize type
        const type = value.type.charAt(0).toUpperCase() + value.type.slice(1);

        // Create array for each type
        if (!groups[type]) {
            groups[type] = [];
        }

        // Push the keyword to the type array
        groups[type].push(value.name);

        return groups;
    }, {});

    return (
        <>
            <dt className="col-sm-2">File{files === 1 ? "" : "s"}</dt>
            <dd className="col-sm-10">
                <div className="row row-cols-1 row-cols-md-3">
                    {
                        Object.entries(filesByType).map(([key, value]) =>
                            <div key={key} className="col">
                                {/* Type */}
                                <div className="font-weight-bold">{key}</div>
                                <ul>
                                    {/* Files */}
                                    {value.map(file => <li key={file}>{file}</li>)}
                                </ul>
                            </div>
                        )
                    }
                </div>
            </dd>
        </>
    )
}