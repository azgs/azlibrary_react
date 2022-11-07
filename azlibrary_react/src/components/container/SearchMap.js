import { useState, useEffect, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Rectangle, Tooltip } from 'react-leaflet'

export default function SearchMap({ boundingBoxes, highlightBox, setGeom }) {

    const [map, setMap] = useState(null);

    const [isChecked, setIsChecked] = useState(false);

    function WktPolygon({ map }) {

        const [polygon, setPolygon] = useState(() => getWKTPoly(map));

        useEffect(() => {
            // Set geometry as wkt-poly when the checkbox is checked
            isChecked ? setGeom(polygon) : setGeom();
        }, [polygon]);

        // Handle form input changes
        const handleChange = (e) => {
            e.target.checked ? setIsChecked(true) : setIsChecked(false);
        }

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
            <div className="form-check text-center">
                <input type="checkbox" className="form-check-input" id="geom1" name="geom1" onChange={handleChange} checked={isChecked} />
                <label className="form-check-label font-weight-bold" htmlFor="geom1">Filter results to map extent</label>
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

                {highlightBox && <Rectangle key={highlightBox.id} eventHandlers={{ click: () => window.location.href = "item/" + highlightBox.id }} bounds={[[highlightBox.bbox.north, highlightBox.bbox.east], [highlightBox.bbox.south, highlightBox.bbox.west]]} pathOptions={{ color: "#ff0000" }}>
                    <Tooltip>{highlightBox.title}</Tooltip>
                </Rectangle>
                }

                {boundingBoxes && boundingBoxes.map(result =>
                    <Rectangle key={result.id} eventHandlers={{ click: () => window.location.href = "item/" + result.id }} bounds={[[result.bbox.north, result.bbox.east], [result.bbox.south, result.bbox.west]]} pathOptions={{ color: "#1E5288" }}>
                        <Tooltip sticky>{result.title}</Tooltip>
                    </Rectangle>
                )
                }

            </MapContainer>
        ),
        [highlightBox, boundingBoxes],
    )

    return (
        <div>
            {resultsMap}
            {map ? <WktPolygon map={map} /> : null}
        </div>
    )
}