import { Link } from "react-router-dom";

export default function SearchResults({ results, setHighlightBox }) {

    return (
        <div>

            {
                results?.data?.map(result =>

                    <div key={result.collection_id} className="card mb-1" onMouseOver={() => setHighlightBox({ id: result.collection_id, title: result.metadata.title, bbox: result.metadata.bounding_box })}>
                        <div className="card-header text-truncate">
                            <Link target="_blank" className="stretched-link" title={result.metadata.title} to={"/item/" + result.collection_id}>{result.metadata.title}</Link>
                            <p className="card-text">{result.metadata.year} - {result.metadata.authors.map(author => author.person).join(' ')}</p>
                        </div>
                    </div>
                )
            }

        </div>
    )
}