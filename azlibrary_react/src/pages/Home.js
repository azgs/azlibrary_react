import { useState } from "react";
import Search from '../components/container/Search'
import SearchResults from '../components/container/SearchResults'
import Breadcrumb from "../components/presentation/Breadcrumb";
import azgsApi from "../components/container/AzgsApi";

export default function Home() {

    const metadataUrl = azgsApi.getUri() + '/metadata';
    
    // API request url with query parameters
    const [searchUrl, setSearchUrl] = useState(metadataUrl);

    // Current bounds of the results map used for filtering results
    const [mapGeometry, setMapGeometry] = useState("POLYGON((-114.71166981775775 36.989263255310355,-109.06469716150775 36.989263255310355,-109.06469716150775 31.26432899146182,-114.71166981775775 31.26432899146182,-114.71166981775775 36.989263255310355))");

    return (
        <div className="container-fluid">

            <Breadcrumb />

            <div className="row">

                <div className="col-xl-3 col-lg-4">
                    <Search metadataUrl={metadataUrl} searchUrl={searchUrl} setSearchUrl={setSearchUrl} mapGeometry={mapGeometry} />
                </div>

                <div className="col-xl-9 col-lg-8">
                    <SearchResults searchUrl={searchUrl} setSearchUrl={setSearchUrl} setMapGeometry={setMapGeometry} />
                </div>

            </div>

        </div>)
}