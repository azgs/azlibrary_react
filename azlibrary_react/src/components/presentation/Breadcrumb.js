import { Link } from "react-router-dom";

export default function Breadcrumb({isCollection}) {

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item-home"><Link to="/">Home</Link></li>

                {isCollection && <li className="breadcrumb-item active" aria-current="page">Collection</li>}
            </ol>
        </nav>
    )
}