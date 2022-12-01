export default function Keywords({ keywords }) {

    const keywordsByType = keywords.reduce((groups, value) => {

        // Capitalize type
        const type = value.type.charAt(0).toUpperCase() + value.type.slice(1);

        if (!groups[type]) {
            groups[type] = [];
        }

        groups[type].push(value.name);

        return groups;
    }, {});

    return (
        <>
            <dt className="col-sm-2">Keyword{keywords === 1 ? "" : "s"}</dt>
            <dd className="col-sm-10">
                {
                    Object.entries(keywordsByType).map(([key, value]) =>
                        <div>
                            <div className="font-weight-bold" key={key}>{key}</div>
                            <ul>
                                {value.map(keyword => <li key={keyword}>{keyword}</li>)}
                            </ul>
                        </div>
                    )
                }
            </dd>
        </>
    )
}