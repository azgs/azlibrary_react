import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'

export default function ResultsMap({ results }) {

    return (
        <div className='mb-2'>
            {results && <MapContainer center={[34.16, -111.62]} zoom={6} scrollWheelZoom={false} >

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {
                    results.map(result =>
                        <Rectangle key={result.id} bounds={[[result.bbox.north, result.bbox.east], [result.bbox.south, result.bbox.west]]} pathOptions={{ color: "#1E5288" }} />
                    )
                }

            </MapContainer>}
        </div>
    )
}