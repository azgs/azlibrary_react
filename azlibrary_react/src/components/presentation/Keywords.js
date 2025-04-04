export default function Keywords({ keywords }) {

    if (!keywords) {
        return 
    }

    // Group keywords by type
    const keywordsByType = keywords.reduce((groups, value) => {

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
            <dt className="col-sm-2">Keyword{keywords === 1 ? "" : "s"}</dt>
            <dd className="col-sm-10">
                <div className="row row-cols-1 row-cols-md-3">
                    {
                        Object.entries(keywordsByType).map(([key, value]) =>
                            <div key={key} className="col">
                                {/* Type */}
                                <div className="font-weight-bold">{key}</div>
                                <ul>
                                    {/* Keywords */}
                                    {value.map(keyword => <li key={keyword}>{keyword}</li>)}
                                </ul>
                            </div>
                        )
                    }
                </div>
            </dd>
        </>
    )
}