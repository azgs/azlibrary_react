export default function Paging({ links, limit, setOffset }) {

    // Changed http links to https
    links = links?.map(link => {
        link.href = link.href.replace("http://", "https://");
        return link;
    });

    // The API's default limit is 10
    limit = limit ? limit : 10;

    const self = links?.find((link) => link.rel === 'self');
    const first = links?.find((link) => link.rel === 'first');
    const previous = links?.find((link) => link.rel === 'previous');
    const next = links?.find((link) => link.rel === 'next');
    const last = links?.find((link) => link.rel === 'last');

    const isFirst = self?.href === first?.href;
    const isLast = self?.href === last?.href;

    const handleClick = (url) => {

        const params = new URLSearchParams(url)
        const offset = params.get("offset");

        setOffset(offset);
    }

    return (
        <nav aria-label="Page navigation example">

            <ul className="pagination justify-content-end">

                {!isFirst &&
                    <li className="page-item">
                        <button className="page-link" onClick={() => handleClick(first?.href)}>First</button>
                    </li>
                }

                {previous && <li className="page-item">
                    <button className="page-link" onClick={() => handleClick(previous?.href)}>Previous</button>
                </li>
                }

                {/* <li className="page-item"><button className="page-link">1</button></li>
                <li className="page-item"><button className="page-link">2</button></li>
                <li className="page-item"><button className="page-link">3</button></li> */}

                {next && <li className="page-item">
                    <button className="page-link" onClick={() => handleClick(next?.href)}>Next</button>
                </li>
                }

                {!isLast &&
                    <li className="page-item">
                        <button className="page-link" onClick={() => handleClick(last?.href)}>Last</button>
                    </li>
                }

            </ul>
        </nav>
    )
}