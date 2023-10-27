import { useMapEvents } from 'react-leaflet'
export const MapZoomToggle = () => {
    const map = useMapEvents({
      click: () => {
        if (map.scrollWheelZoom.enabled()) {
          map.scrollWheelZoom.disable();
        } else {
          map.scrollWheelZoom.enable();
        }      },
    })
    return null
  }

