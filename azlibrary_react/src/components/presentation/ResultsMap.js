import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'

export default function ResultsMap({ boundingBoxes }) {

    return (
        <div className='mb-2'>
            {boundingBoxes && <MapContainer center={[34.16, -111.62]} zoom={6} scrollWheelZoom={false} >

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {
                    boundingBoxes.map(box =>
                        <Rectangle bounds={[[box.north, box.east], [box.south, box.west]]} pathOptions={{ color: "#1E5288" }} />
                    )
                }

            </MapContainer>}
        </div>
    )
}