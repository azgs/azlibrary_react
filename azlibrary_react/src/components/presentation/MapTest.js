import { useState, useCallback, useEffect, useMemo } from "react";
import { MapContainer, TileLayer } from 'react-leaflet'

export default function MapTest() {

  function getWKTPoly(map) {
    const bounds = map.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const northWest = bounds.getNorthWest();
    const southEast = bounds.getSouthEast();

    const poly = `POLYGON((${northWest.lng.toFixed(3)} ${northWest.lat.toFixed(3)},${southWest.lng.toFixed(3)} ${southWest.lat.toFixed(3)},${southEast.lng.toFixed(3)} ${southEast.lat.toFixed(3)},${northEast.lng.toFixed(3)} ${northEast.lat.toFixed(3)},${northWest.lng.toFixed(3)} ${northWest.lat.toFixed(3)}))`;

    return poly;
  }

  function DisplayPosition({ map }) {
    const [polygon, setPolygon] = useState(() => getWKTPoly(map))

    const onMove = useCallback(() => {
      setPolygon(getWKTPoly(map))
    }, [map])

    useEffect(() => {
      map.on('move', onMove)
      return () => {
        map.off('move', onMove)
      }
    }, [map, onMove])

    return (
      <p>
        WKT: {polygon}
      </p>
    )
  }

  function ExternalStateExample() {
    const [map, setMap] = useState(null)

    const displayMap = useMemo(
      () => (
        <MapContainer
          center={[34.16, -111.62]}
          zoom={6}
          scrollWheelZoom={false}
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
        {map ? <DisplayPosition map={map} /> : null}
        {displayMap}
      </div>
    )
  }

  return (
    <ExternalStateExample />
  )
}