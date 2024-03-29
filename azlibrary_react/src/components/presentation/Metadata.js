import azgsApi from '../container/AzgsApi';

function refman({collection}) {
    const article = 'TY - JOUR \n';
    const title = 'TI - ' + collection.metadata.title + '\n';
    const authors = collection.metadata.authors.map(author => 'AU - ' + author.person).join('\n');
    const journal = 'JO - ' + collection.metadata.collection_group.name + '\n';
    const series = 'VL - ' + collection.metadata.series + '\n';
    const year = 'PY - ' + collection.metadata.year + '\n';
    const provider = 'PB - Arizona Geological Survey';
    // Not to future self, the template literals are VERY literal so don't mess with the spacing on the next line without good cause
    const fileData = `${article}${title}${authors}
${journal}${series}${year}${provider}
ER - `;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "refman.ris";
    link.href = url
    link.click(url);
    }

function endnote({collection}) {
    const article = '%0 Journal Article \n';
    const title = '%T ' + collection.metadata.title + '\n';
    const authors = collection.metadata.authors.map(author => '%A ' + author.person).join('\n');
    const journal = '%J ' + collection.metadata.collection_group.name + '\n';
    const series = '%V ' + collection.metadata.series + '\n';
    const year = '%D ' + collection.metadata.year + '\n';
    const provider = '%I Arizona Geological Survey';
    // Not to future self, the template literals are VERY literal so don't mess with the spacing on the next line without good cause
    const fileData = `${article}${title}${authors}
${journal}${series}${year}${provider}`;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "endnote.enw";
    link.href = url
    link.click(url);
    }

export default function Metadata({ collectionId, collection }) {

    const iso19139 = azgsApi.getUri() + '/iso19139/' + collectionId;
    
    return (
        <div>
            <a className="btn btn-sm btn-blue" href={iso19139}>Download XML Metadata</a> <a className="btn btn-sm btn-blue" onClick={() => endnote({collection})}>Download EndNote Citation</a> <a className="btn btn-sm btn-blue" onClick={() => refman({collection})}>Download RefMan Citation</a> 
        </div>
    )
}
