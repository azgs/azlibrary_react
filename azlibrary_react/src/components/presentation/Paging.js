export default function Paging({ links, limit, offset, setOffset }) {

    links = links ? links : [];

    // Changed http links to https
    links = links?.map(link => {
        link.href = link.href.replace("http://", "https://");
        return link;
    });

    // offset or default
    offset = offset ? offset : 0;

    // limit or default
    limit = limit ? limit : 10;

    let linksDict = Object.fromEntries(links?.map(({ rel, href }) => ([rel, href])));

    const maxOffset = getOffsetFromUrl(linksDict['last']);

    const currentPage = ((offset % (maxOffset + limit)) / limit) + 1;

    const isFirst = linksDict['self'] === linksDict['first'];
    const isLast = linksDict['self'] === linksDict['last'];

    function getOffsetFromUrl(url) {
        const params = new URLSearchParams(url)
        return params.get("offset");
    }

    const handleClick = (url) => {
        setOffset(getOffsetFromUrl(url));
    }

    return (
        <nav aria-label="Page navigation example">

            {/* <div>Limit: {limit}</div>
            <div>CurrentOffset: {offset}</div>
            <div>MaxOffset: {maxOffset}</div>
            <div>CurrentPage: {currentPage}</div> */}

            <ul className="pagination justify-content-end">

                {!isFirst &&
                    <li className="page-item">
                        <button className="page-link" onClick={() => handleClick(linksDict['first'])}>First</button>
                    </li>
                }

                {linksDict['previous'] && <li className="page-item">
                    <button className="page-link" onClick={() => handleClick(linksDict['previous'])}>Previous</button>
                </li>
                }

                <li className="page-item active"><button className="page-link">{currentPage}</button></li>

                {/* <li className="page-item"><button className="page-link">1</button></li>
                <li className="page-item"><button className="page-link">2</button></li>
                <li className="page-item"><button className="page-link">3</button></li> */}

                {linksDict['next'] && <li className="page-item">
                    <button className="page-link" onClick={() => handleClick(linksDict['next'])}>Next</button>
                </li>
                }

                {!isLast &&
                    <li className="page-item">
                        <button className="page-link" onClick={() => handleClick(linksDict['last'])}>Last</button>
                    </li>
                }

            </ul>
        </nav>
    )
}