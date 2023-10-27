import { useState, useEffect, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Rectangle, Tooltip } from 'react-leaflet'
import { MapZoomToggle } from "../../MapZoomToggle";

export default function SearchMap({ boundingBoxes, highlightBox, setGeom, setSearchParams }) {

    const [map, setMap] = useState(null);

    const [isFiltered, setIsFiltered] = useState(false);

    function WktPolygon({ map }) {

        const [polygon, setPolygon] = useState(() => getWKTPoly(map));

        useEffect(() => {
            // Set geometry as wkt-poly when the checkbox is checked
            isFiltered ? setGeom(polygon) : setGeom();
        }, [polygon]);

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

        // Reset offset
        function resetOffset() {
            setSearchParams(values => ({ ...values, offset: "" }))
        }

        // Set polygon after move
        const onMove = useCallback(() => {
            setPolygon(getWKTPoly(map));

            if (isFiltered) {
                resetOffset();
            }

        }, [map])

        const handleCheckbox = (e) => {

            e.target.checked ? setIsFiltered(true) : setIsFiltered(false);

            // Reset offset when turning on filter
            if (e.target.checked) {
                resetOffset();
            }
        }

        // Call onMove when the map moves
        useEffect(() => {
            map.on('move', onMove);
            return () => {
                map.off('move', onMove);
            }
        }, [map, onMove])

        return (
            // Filter by map extent checkbox
            <div className="bg-light text-center py-2">
                <div className="custom-control custom-switch" style={{alignItems: "bottom"}}>
                    <input type="checkbox" className="custom-control-input" id="geom" name="geom" onChange={handleCheckbox} checked={isFiltered} />
                    <label className="custom-control-label font-weight-bold" htmlFor="geom">Filter results to map extent</label>
                    <small id="emailHelp" className="form-text text-muted">Toggling this option on will limit search results to the current extent of the map. Zooming or otherwise changing the map extent will update the search results in real-time.</small>
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
                ref={setMap}
                scrollWheelZoom={false}
            >
                <MapZoomToggle />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Highlight collection on the map when the user hovers the mouse over the title */}
                {highlightBox && <Rectangle key={highlightBox.id} eventHandlers={{ click: () => window.location.href = "item/" + highlightBox.id }} bounds={[[highlightBox.bbox.north, highlightBox.bbox.east], [highlightBox.bbox.south, highlightBox.bbox.west]]} pathOptions={{ color: "#ff0000" }}>
                    <Tooltip>{highlightBox.title}</Tooltip>
                </Rectangle>
                }

                {/* All of the bounding boxes for the map results */}
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
            {map ? <WktPolygon map={map} /> : null}
            {resultsMap}
        </div>
    )
}