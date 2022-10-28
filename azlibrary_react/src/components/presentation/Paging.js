export default function Paging({ links, limit, offset, setOffset }) {

    // Changed http links to https
    links = links?.map(link => {
        link.href = link.href.replace("http://", "https://");
        return link;
    });

    // Initial offset is 0
    offset = offset ? offset : 0;

    // The API's default limit is 10
    limit = limit ? limit : 10;

    const self = links?.find((link) => link.rel === 'self')?.href;
    const first = links?.find((link) => link.rel === 'first')?.href;
    const previous = links?.find((link) => link.rel === 'previous')?.href;
    const next = links?.find((link) => link.rel === 'next')?.href;
    const last = links?.find((link) => link.rel === 'last')?.href;

    const maxOffset = getOffsetFromUrl(last);

    const currentPage = ((offset % (maxOffset + limit) ) / limit) + 1;

    const isFirst = self === first;
    const isLast = self === last;

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

                {!isFirst &&
                    <li className="page-item">
                        <button className="page-link" onClick={() => handleClick(first)}>First</button>
                    </li>
                }

                {previous && <li className="page-item">
                    <button className="page-link" onClick={() => handleClick(previous)}>Previous</button>
                </li>
                }

                <li className="page-item active"><button className="page-link">{currentPage}</button></li>

                {/* <li className="page-item"><button className="page-link">1</button></li>
                <li className="page-item"><button className="page-link">2</button></li>
                <li className="page-item"><button className="page-link">3</button></li> */}

                {next && <li className="page-item">
                    <button className="page-link" onClick={() => handleClick(next)}>Next</button>
                </li>
                }

                {!isLast &&
                    <li className="page-item">
                        <button className="page-link" onClick={() => handleClick(last)}>Last</button>
                    </li>
                }

            </ul>
        </nav>
    )
}