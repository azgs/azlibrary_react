import { Link } from "react-router-dom";

export default function Breadcrumb({page}) {

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item-home"><Link to="/">Home</Link></li>

                {page && <li className="breadcrumb-item active" aria-current="page">{page}</li>}
            </ol>
        </nav>
    )
}