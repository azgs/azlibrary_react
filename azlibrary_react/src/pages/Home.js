import { useState, useMemo } from "react";
import Search from '../components/container/Search'
import { MapContainer, TileLayer } from 'react-leaflet'
import Breadcrumb from "../components/presentation/Breadcrumb";
import azgsApi from "../components/container/AzgsApi";

export default function Home() {

    const metadataUrl = azgsApi.getUri() + '/metadata';

    // API request url with query parameters
    const [searchUrl, setSearchUrl] = useState(metadataUrl);

    const [map, setMap] = useState(null)

    const resultsMap = useMemo(
        () => (
          <MapContainer
            center={[34.16, -111.62]}
            zoom={6}
            ref={setMap}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        ),
        [],
      )

    return (

        <div className="container">

            <Breadcrumb />

            <div className="row">

                <div className="col-12">
                    {map ? <Search metadataUrl={metadataUrl} searchUrl={searchUrl} setSearchUrl={setSearchUrl} map={map} /> : null}
                </div>

                <div className="col-12">

                    {resultsMap}

                </div>

            </div>

        </div>
    )
}