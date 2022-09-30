import azgsApi from '../container/AzgsApi';

export default function Downloads({ collectionId }) {

    const download = azgsApi.getUri() + '/collections/' + collectionId;
    const iso19139 = azgsApi.getUri() + '/iso19139/' + collectionId;

    return (
        <div>
            <a className="btn btn-sm btn-red" href={download}>Download Files</a> <a className="btn btn-sm btn-blue" href={iso19139}>Download iso19139</a>
        </div>
    )
}