import { useState } from "react";
import Search from '../components/container/Search'
import SearchResults from '../components/container/SearchResults'
import Breadcrumb from "../components/presentation/Breadcrumb";
import azgsApi from "../components/container/AzgsApi";

export default function Home() {

    const metadataUrl = azgsApi.getUri() + '/metadata';
    const [searchUrl, setSearchUrl] = useState(metadataUrl);

    return (
        <div className="container-fluid">

            <Breadcrumb />

            <div className="row">

                <div className="col-xl-3 col-lg-4">
                    <Search metadataUrl={metadataUrl} searchUrl={searchUrl} setSearchUrl={setSearchUrl} />
                </div>

                <div className="col-xl-9 col-lg-8">
                    <SearchResults searchUrl={searchUrl} setSearchUrl={setSearchUrl} />
                </div>

            </div>

        </div>)
}