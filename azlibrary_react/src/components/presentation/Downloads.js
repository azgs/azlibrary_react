import azgsApi from '../container/AzgsApi';

export default function Downloads({ collectionId }) {

    const download = azgsApi.getUri() + '/collections/' + collectionId;

    return (
        <div>
            <a className="btn btn-lg btn-red" href={download}>Download All Files</a>
        </div>
    )
}