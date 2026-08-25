import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const spots = [
  {
    id: 1,
    name: "日枝神社",
    lat: 35.6746,
    lng: 139.7395,
  },
  {
    id: 2,
    name: "赤坂Bizタワー",
    lat: 35.6721,
    lng: 139.7368,
  },
  {
    id: 3,
    name: "東京ミッドタウン",
    lat: 35.6655,
    lng: 139.7305,
  },
];
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function App() {
  const [stampCount, setStampCount] = useState(0);
  const [collected, setCollected] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  
useEffect(() => {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setCurrentPosition([lat, lng]);

      spots.forEach((spot) => {
        
        const distance = getDistance(
          lat,
          lng,
          spot.lat,
          spot.lng
        );

        if (distance < 50) {
          setCollected((prev) => {
            if (prev.includes(spot.id)) {
              return prev;
            }

            const updated = [...prev, spot.id];
            setStampCount(updated.length);

            alert(`🎉 ${spot.name} のスタンプ獲得！`);

            return updated;
          });
        }
      });
    },
    (error) => {
      console.error(error);
    }
  );
  return () => navigator.geolocation.clearWatch(watchId);
}, []);

  return (
    <>
      <h1>赤坂スタンプラリー</h1>
      <p>{stampCount} / {spots.length}</p>

      <MapContainer
        center={[35.6719, 139.7362]}
        zoom={15}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

       {spots.map((spot) => (
         <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          >
         <Popup>{spot.name}</Popup>
         </Marker>
        ))}

        {currentPosition && (
  <Marker position={currentPosition} icon={redIcon}>
    <Popup>📍現在地</Popup>
  </Marker>
)}

      </MapContainer>
      <h2>スタンプ状況</h2>

<ul>
  {spots.map((spot) => (
    <li key={spot.id}>
      {collected.includes(spot.id)
        ? "✅"
        : "❌"}{" "}
      {spot.name}
    </li>
  ))}
</ul>
    </>
  );
}

export default App;