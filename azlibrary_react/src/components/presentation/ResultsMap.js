import {
MapContainer,
TileLayer,
Tooltip,
Rectangle
} from 'react-leaflet'

export default function ResultsMap({ results, highlightBox }) {

    return (
        <div className="">
            <div className='mb-2'>
                {results && <MapContainer center={[34.16, -111.62]} zoom={6} >

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