import { Fragment } from "react";
import { Link } from "react-router-dom";

export default function SearchResults({ results, setHighlightBox }) {

    // Where the two kinds of match meet. The API returns every collection
    // matched on its metadata before any collection matched only inside its
    // documents, so the two cannot interleave within a page: the boundary is
    // wherever the first "document" row falls. That one test puts the heading
    // mid-list on a mixed page and at the top of a page holding document
    // matches only -- no offset, no page arithmetic. -1 when there are none,
    // which no index matches, so no heading is drawn.
    //
    // When nothing matched the catalogue there is no boundary to mark, only a
    // list that is entirely document matches, and Home already says so above
    // the list. Drawing the heading too would say it twice on every page.
    const hasMetadataMatches = Number(results?.metadataMatchCount ?? 0) > 0;
    const firstDocumentMatch = hasMetadataMatches ?
        (results?.data?.findIndex(result => "document" === result.match) ?? -1) :
        -1;

    return (
        <div>

            {
                results?.data?.map((result, index) =>

                    <Fragment key={result.collection_id}>

                    {index === firstDocumentMatch &&
                    <div className="border-bottom mb-2 mt-3 pb-1 text-muted">
                        <small>Found inside documents, not in the collection record</small>
                    </div>
                    }

                    <div className="card mb-1" onMouseOver={() => setHighlightBox({ id: result.collection_id, title: result.metadata.title, bbox: result.metadata.bounding_box })}>
                        <div className="card-header text-truncate">
                            <Link target="_blank" className="stretched-link" title={result.metadata.title} to={"/item/" + result.collection_id}>{result.metadata.title}</Link>
                            <p className="card-text">{result.metadata.year} - {result.metadata.authors && result.metadata.authors.length > 0 ? 
                                result.metadata.authors.map(author => 
                                    author.person || "Author name not specified"
                                ).join(' ') :
                                "No authors listed"
                            }</p>
                        </div>
                    </div>

                    </Fragment>
                )
            }

        </div>
    )
}