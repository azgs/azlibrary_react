import azgsApi from '../container/AzgsApi';

function citation({collection}) {
    const article = 'TY - JOUR \n';
    const title = 'T1 - ' + collection.metadata.title + '\n';
    const authors = collection.metadata.authors.map(author => 'AU - ' + author.person).join('\n');
    //const authors = JSON.stringify(collection.metadata.authors,)
    const journal = 'J0 - ' + collection.metadata.collection_group.name + '\n';
    const series = 'VL - ' + collection.metadata.series + '\n';
    const year = 'Y1 - ' + collection.metadata.year + '\n';
    const provider = 'PB - Arizona Geological Survey';
    const fileData = `${article}${title}${authors}${journal}${series}${year}${provider}`;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "citation.ris";
    link.href = url
    link.click(url);
    }

export default function Metadata({ collectionId, collection }) {

    const iso19139 = azgsApi.getUri() + '/iso19139/' + collectionId;
    
    return (
        <div>
            <a className="btn btn-sm btn-blue" href={iso19139}>Download XML Metadata</a> <a className="btn btn-sm btn-blue" onClick={() => citation({collection})}>Download Citation</a> 
        </div>
    )
}
