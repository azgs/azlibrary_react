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
    const apiLinks = Object.fromEntries(links.map(({ rel, href }) => ([rel, getOffsetFromUrl(href)])));
    const isFirst = apiLinks['self'] === apiLinks['first'];
    const isLast = apiLinks['self'] === apiLinks['last'];
    const maxOffset = apiLinks['last'] ?? 0;

    const navLinks = [];

    const startOffset = Math.max(0, offset - (4 * limit));
    const endOffset = Math.min(maxOffset, offset + (4 * limit));

    for (let i = startOffset; i <= endOffset; i = i + limit) {
        navLinks.push({pageNumber: (((i % (maxOffset + limit)) / limit) + 1), offset: i, active: (i === offset)});
    }

    function getOffsetFromUrl(url) {
        const params = new URLSearchParams(url)

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