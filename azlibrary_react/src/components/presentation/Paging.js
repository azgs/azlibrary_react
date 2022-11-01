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

    // Dictionary from API links
    let apiLinks = Object.fromEntries(links.map(({ rel, href }) => ([rel, href])));

    const isFirst = apiLinks['self'] === apiLinks['first'];
    const isLast = apiLinks['self'] === apiLinks['last'];

    const maxOffset = getOffsetFromUrl(apiLinks['last']);

    const currentPage = ((offset % (maxOffset + limit)) / limit) + 1;

    function getOffsetFromUrl(url) {
        const params = new URLSearchParams(url)
        return params.get("offset");
    }

    const handleClick = (url) => {
        setOffset(getOffsetFromUrl(url));
    }

    return (
        <nav aria-label="Page navigation example">

            <div>Limit: {limit}</div>
            <div>CurrentOffset: {offset}</div>
            <div>MaxOffset: {maxOffset}</div>
            <div>CurrentPage: {currentPage}</div>

            <ul className="pagination justify-content-end">

                <li className={isFirst ? "page-item disabled" : "page-item"}>
                    <button className="page-link" onClick={() => handleClick(apiLinks['first'])}>First</button>
                </li>

                <li className={isFirst ? "page-item disabled" : "page-item"}>
                    <button className="page-link" onClick={() => handleClick(apiLinks['previous'])}>Previous</button>
                </li>

                <li className="page-item active"><button className="page-link">{currentPage}</button></li>

                {/* <li className="page-item"><button className="page-link">1</button></li>
                <li className="page-item"><button className="page-link">2</button></li>
                <li className="page-item"><button className="page-link">3</button></li> */}

                <li className={isLast ? "page-item disabled" : "page-item"}>
                    <button className="page-link" onClick={() => handleClick(apiLinks['next'])}>Next</button>
                </li>

                <li className={isLast ? "page-item disabled" : "page-item"}>
                    <button className="page-link" onClick={() => handleClick(apiLinks['last'])}>Last</button>
                </li>

            </ul>
        </nav>
    )
}