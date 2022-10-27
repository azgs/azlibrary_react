import { useState } from "react";
import Search from '../components/container/Search'
import { useMap, useMapEvent, MapContainer, TileLayer } from 'react-leaflet'
import Breadcrumb from "../components/presentation/Breadcrumb";
import azgsApi from "../components/container/AzgsApi";

export default function Home() {

    const metadataUrl = azgsApi.getUri() + '/metadata';

    // API request url with query parameters
    const [searchUrl, setSearchUrl] = useState(metadataUrl);

    const [mapExtent, setMapExtent] = useState();

    function getWKTPoly(map) {

        if (!map) {
            return "";
        }

        const bounds = map.getBounds();
        const southWest = bounds.getSouthWest();
        const northEast = bounds.getNorthEast();
        const northWest = bounds.getNorthWest();
        const southEast = bounds.getSouthEast();

        const poly = `POLYGON((${northWest.lng.toFixed(3)} ${northWest.lat.toFixed(3)},${southWest.lng.toFixed(3)} ${southWest.lat.toFixed(3)},${southEast.lng.toFixed(3)} ${southEast.lat.toFixed(3)},${northEast.lng.toFixed(3)} ${northEast.lat.toFixed(3)},${northWest.lng.toFixed(3)} ${northWest.lat.toFixed(3)}))`;

        return poly;
    }

    function InitializeMapExtent() {
        const map = useMap();
        const poly = getWKTPoly(map);
        setMapExtent(poly);
        return null
    }

    function UpdateMapExtent() {
        const map = useMapEvent({
            move: () => {
                const poly = getWKTPoly(map);
                setMapExtent(poly);
            }
        })
        return null
    }

    return (

        <div className="container">

            <Breadcrumb />

            <div className="row">

                <div className="col-12">
                    <Search metadataUrl={metadataUrl} searchUrl={searchUrl} setSearchUrl={setSearchUrl} />
                </div>

                <div className="col-12">

                    <h5>{mapExtent}</h5>

                    <MapContainer center={[34.16, -111.62]} zoom={6}>

                        <InitializeMapExtent />

                        <UpdateMapExtent />

                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                    </MapContainer>
                </div>

            </div>

        </div>
    )
}