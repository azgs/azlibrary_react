import {
// useMap,
useMapEvent,
MapContainer,
TileLayer,
Tooltip,
Rectangle
} from 'react-leaflet'

export default function ResultsMap({ results, highlightBox, setMapGeometry }) {

    function getWKTPoly(map) {
        const bounds = map.getBounds();
        const southWest = bounds.getSouthWest();
        const northEast = bounds.getNorthEast();
        const northWest = bounds.getNorthWest();
        const southEast = bounds.getSouthEast();

        const poly = `POLYGON((${northWest.lng} ${northWest.lat}, ${southWest.lng} ${southWest.lat}, ${southEast.lng} ${southEast.lat}, ${northEast.lng} ${northEast.lat}, ${northWest.lng} ${northWest.lat}))`;

        console.log(poly);

        return poly;
    }

    function InitializeGeom() {
        // BUG: Still need to figure out how to set geom from init. 
        // Warning: Cannot update a component (`Home`) while rendering a different component

        // const map = useMap();
        // const poly = getWKTPoly(map);
        // setMapGeometry(poly);
    }

    function UpdateGeom() {
        const map = useMapEvent('moveend', () => {
            const poly = getWKTPoly(map);
            setMapGeometry(poly);
        })
        return null;
    }

    return (
        <div className="">
            <div className='mb-2'>
                {results && <MapContainer center={[34.16, -111.62]} zoom={6} >

                    <InitializeGeom />

                    <UpdateGeom />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {highlightBox && <Rectangle key={highlightBox.id} eventHandlers={{ click: () => window.location.href = "item/" + highlightBox.id }} bounds={[[highlightBox.bbox.north, highlightBox.bbox.east], [highlightBox.bbox.south, highlightBox.bbox.west]]} pathOptions={{ color: "#ff0000" }}>
                        <Tooltip>{highlightBox.title}</Tooltip>
                    </Rectangle>
                    }

                    {results.map(result =>
                        <Rectangle key={result.id} eventHandlers={{ click: () => window.location.href = "item/" + result.id }} bounds={[[result.bbox.north, result.bbox.east], [result.bbox.south, result.bbox.west]]} pathOptions={{ color: "#1E5288" }}>
                            <Tooltip>{result.title}</Tooltip>
                        </Rectangle>
                    )
                    }

                </MapContainer>}
            </div>
        </div>
    )
}