import { useState } from "react";
import Search from '../components/presentation/Search'
import SearchResults from '../components/presentation/SearchResults'
import Breadcrumb from "../components/presentation/Breadcrumb";

export default function Home() {

    const [searchUrl, setSearchUrl] = useState();

    // Update the searchUrl (used for paging)
    const updateSearchUrl = (url) => {
        setSearchUrl(url);
    }

    return (
        <div className="container-fluid">

            <Breadcrumb />

            <div className="row">

                <div className="col-xl-3 col-lg-4">
                    <Search searchUrl={searchUrl} updateSearchUrl={updateSearchUrl} />
                </div>

                <div className="col-xl-9 col-lg-8">
                    <SearchResults searchUrl={searchUrl} updateSearchUrl={updateSearchUrl} />
                </div>

            </div>

        </div>)
}