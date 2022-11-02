export default function Paging({ links, limit, offset, setOffset }) {

    links = links ? links : [];

    // Changed http links to https
    links = links?.map(link => {
        link.href = link.href.replace("http://", "https://");
        return link;
    });

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

    // const navLinks = [];

    // const startOffset = Math.max(0, offset - (4 * limit));

    // const endOffset = Math.min(maxOffset, startOffset + (8 * limit));

    // for (let i = startOffset; i <= endOffset; i = i + limit) {
    //     navLinks.push({ pageNumber: calculatePageNumber(i, limit, maxOffset), offset: i, active: (i === offset) });
    // }

    const prevLinks = [];

    const startOffset = Math.max(0, offset - (4 * limit));

    for (let i = startOffset; i < offset; i = i + limit) {
        prevLinks.push({ pageNumber: calculatePageNumber(i, limit, maxOffset), offset: i });
    }

    const nextLinks = [];

    const endOffset = Math.min(maxOffset, offset + (4 * limit));

    for (let i = offset + limit; i <= endOffset; i = i + limit) {
        nextLinks.push({ pageNumber: calculatePageNumber(i, limit, maxOffset), offset: i });
    }

    // Calulate page number
    function calculatePageNumber(offset, limit, maxOffset) {
        return offset > maxOffset ? -1 : parseInt(offset / limit) + 1
    }

    // Returns the offset paramter from a link
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

                {prevLinks.map(link => <li key={link.pageNumber} className="page-item"><button className="page-link" onClick={() => setOffset(link.offset)} >{link.pageNumber}</button></li>)}

                <li className="page-item active"><button className="page-link">{calculatePageNumber(offset, limit, maxOffset)}</button></li>

                {nextLinks.map(link => <li key={link.pageNumber} className="page-item"><button className="page-link" onClick={() => setOffset(link.offset)} >{link.pageNumber}</button></li>)}

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