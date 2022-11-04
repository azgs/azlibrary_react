import { useState, useEffect, useMemo, useCallback } from "react";
import { MapContainer, TileLayer } from 'react-leaflet'

export default function SearchMap() {

    const [map, setMap] = useState(null);

    function WktPolygon({ map }) {

        // Probably need to move this home
        const [geom, setGeom] = useState();

        const [polygon, setPolygon] = useState(() => getWKTPoly(map));








        
        // Build a WKT Polygon from the map bounds
        function getWKTPoly(map) {
            const bounds = map.getBounds();
            const southWest = bounds.getSouthWest();
            const northEast = bounds.getNorthEast();
            const northWest = bounds.getNorthWest();
            const southEast = bounds.getSouthEast();

            const poly = `POLYGON((${northWest.lng.toFixed(3)} ${northWest.lat.toFixed(3)},${southWest.lng.toFixed(3)} ${southWest.lat.toFixed(3)},${southEast.lng.toFixed(3)} ${southEast.lat.toFixed(3)},${northEast.lng.toFixed(3)} ${northEast.lat.toFixed(3)},${northWest.lng.toFixed(3)} ${northWest.lat.toFixed(3)}))`;

            return poly;
        }

        // Set polygon after move
        const onMove = useCallback(() => {
            setPolygon(getWKTPoly(map));
        }, [map])

        // Call onMove when the map moves
        useEffect(() => {
            map.on('move', onMove);
            return () => {
                map.off('move', onMove);
            }
        }, [map, onMove])

        return (
            <div>
                <div>GEOM: {geom}</div>
                <div>{polygon}</div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="geom1" name="geom1" />
                    <label className="form-check-label font-weight-bold" htmlFor="geom1">Filter results to map extent</label>
                </div>
            </div>
        )
    }

    // Leaflet map
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
        <div>
            {resultsMap}
            {map ? <WktPolygon map={map} /> : null}
        </div>
    )
}