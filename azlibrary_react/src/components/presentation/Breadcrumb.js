import { Link } from "react-router-dom";

export default function Breadcrumb({isItem}) {

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item breadcrumb-item-home"><Link to="/">Home</Link></li>

                {isItem && <li className="breadcrumb-item active" aria-current="page">Item</li>}
            </ol>
        </nav>
    )
}