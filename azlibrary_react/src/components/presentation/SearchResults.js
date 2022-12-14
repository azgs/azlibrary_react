import { Link } from "react-router-dom";

export default function SearchResults({ results, setHighlightBox }) {

    return (
        <div>

            {
                results?.data?.map(result =>

                    <div key={result.collection_id} className="card mb-1" onMouseOver={() => setHighlightBox({ id: result.collection_id, title: result.metadata.title, bbox: result.metadata.bounding_box })}>
                        <div className="card-header">
                            <Link className="stretched-link" title={result.metadata.title} to={"/item/" + result.collection_id}>{result.metadata.title}</Link>
                        </div>
                        {/* <div className="card-body p-1 d-none d-sm-block">

                            <ul className="list-inline mb-0">
                                {result.metadata.year && <li className="list-inline-item"><strong>Year: </strong>{result.metadata.year}</li>}
                                {result.metadata.series && <li className="list-inline-item"><strong>Series: </strong>{result.metadata.series}</li>}
                                {result.metadata.collection_group.name && <li className="list-inline-item"><strong>Collection Group: </strong>{result.metadata.collection_group.name}</li>}
                            </ul>

                        </div> */}
                    </div>
                )
            }

        </div>
    )
}