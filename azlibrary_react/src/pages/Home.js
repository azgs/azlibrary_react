import { useState } from "react";
import Search from '../components/container/Search'
import SearchResults from '../components/container/SearchResults'
import Breadcrumb from "../components/presentation/Breadcrumb";
import azgsApi from "../components/container/AzgsApi";
import MapTest from "../components/presentation/MapTest"

export default function Home() {

    const metadataUrl = azgsApi.getUri() + '/metadata';

    // API request url with query parameters
    const [searchUrl, setSearchUrl] = useState(metadataUrl);

    return (

        <div className="container">

            <MapTest />

            <Breadcrumb />

            <div className="row">

                <div className="col-12">
                    <Search metadataUrl={metadataUrl} searchUrl={searchUrl} setSearchUrl={setSearchUrl} />
                </div>

                <div className="col-12">
                    <SearchResults searchUrl={searchUrl} setSearchUrl={setSearchUrl} />
                </div>

            </div>

        </div>
    )
}