export default function Paging({ links, limit, offset, setOffset }) {
    
    // Dictionary from API links
    const apiLinks = Object.fromEntries(links.map(({ rel, href }) => ([rel, getOffsetFromUrl(href)])));

    // offset or default
    offset = offset ? offset : 0;

    // limit or default
    limit = limit ? limit : 10;

    // last offset or default
    const maxOffset = apiLinks['last'] ?? 0;

    const isFirst = apiLinks['self'] === apiLinks['first'];
    const isLast = apiLinks['self'] === apiLinks['last'];

    const navLinks = [];

    // Starting offset is either 0 or between 4-8 pages prior to current
    const startOffset = Math.max(0, offset - (Math.max(4, 8 - (maxOffset - offset)/limit) * limit));

    // Ending offset is either the maxOffset or 8 pages after current
    const endOffset = Math.min(maxOffset, startOffset + (8 * limit));

    for (let i = startOffset; i <= endOffset; i = i + limit) {
        navLinks.push({ pageNumber: calculatePageNumber(i, limit), offset: i, active: (i === offset) });
    }

    // Calulate page number
    function calculatePageNumber(offset, limit) {
        return Math.ceil(offset / limit) + 1;
    }

    // Returns the offset paramter from a link
    function getOffsetFromUrl(url) {

        const queryString = url.slice(url.indexOf("?"));

        const params = new URLSearchParams(queryString)

        const offset = params.get("offset") ?? 0;

        return parseInt(offset);
    }

    return (
        <nav aria-label="Page navigation example">
            
            <ul className="pagination justify-content-end">

                <li className={isFirst ? "page-item disabled" : "page-item"}>
                    <button className="page-link" onClick={() => setOffset(apiLinks['first'])}>First</button>
                </li>

                <li className={isFirst ? "page-item disabled" : "page-item"}>
                    <button className="page-link" onClick={() => setOffset(apiLinks['previous'])}>Previous</button>
                </li>

                {navLinks.map(link => <li key={link.pageNumber} className={link.active ? "page-item active" : "page-item"}><button className="page-link" onClick={() => setOffset(link.offset)} >{link.pageNumber}</button></li>)}

                <li className={isLast ? "page-item disabled" : "page-item"}>
                    <button className="page-link" onClick={() => setOffset(apiLinks['next'])}>Next</button>
                </li>

                <li className={isLast ? "page-item disabled" : "page-item"}>
                    <button className="page-link" onClick={() => setOffset(apiLinks['last'])}>Last</button>
                </li>

            </ul>
        </nav>
    )
}