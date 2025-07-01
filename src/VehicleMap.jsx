
// import React, { useEffect, useState, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
// import axios from 'axios';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Icons
// const vehicleIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/296/296216.png',
//   iconSize: [40, 40],
//   iconAnchor: [20, 20],
// });

// const startIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
//   iconSize: [30, 30],
//   iconAnchor: [15, 30],
// });

// const endIcon = new L.Icon({
//   iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190406.png',
//   iconSize: [30, 30],
//   iconAnchor: [15, 30],
// });

// const VehicleMap = () => {
//   const [fullRoute, setFullRoute] = useState([]);
//   const [filteredRoute, setFilteredRoute] = useState([]);
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [animatedPosition, setAnimatedPosition] = useState(null);

//   const indexRef = useRef(0);
//   const animationRef = useRef();

//   useEffect(() => {
//     axios.get('https://vehicle-backend-nph0.onrender.com/api/vehicle')
//       .then(res => {
//         setFullRoute(res.data);
//       })
//       .catch(err => console.error('Error fetching route:', err));
//   }, []);

// const handleDaySelection = (day) => {
//   const filtered = fullRoute.filter(point => point.day === day);
//   setFilteredRoute(filtered);
//   setSelectedDay(day);
//   indexRef.current = 0;

//   if (filtered.length > 1) {
//     animateVehicle(filtered);
//   } else if (filtered.length === 1) {
    
//     setAnimatedPosition({ lat: filtered[0].latitude, lng: filtered[0].longitude });
//   }
// };


//   const animateVehicle = (route) => {
//     if (route.length < 2) return;

//     const duration = 2000; 
//     let start = null;

//     const step = (timestamp) => {
//       if (!start) start = timestamp;

//       const progress = timestamp - start;
//       const t = Math.min(progress / duration, 1);

//       const from = route[indexRef.current];
//       const to = route[indexRef.current + 1];

//       const lat = from.latitude + (to.latitude - from.latitude) * t;
//       const lng = from.longitude + (to.longitude - from.longitude) * t;

//       setAnimatedPosition({ lat, lng });

//       if (t < 1) {
//         animationRef.current = requestAnimationFrame(step);
//       } else {
//         indexRef.current++;
//         if (indexRef.current < route.length - 1) {
//           start = null;
//           animationRef.current = requestAnimationFrame(step);
//         }
//       }
//     };

//     cancelAnimationFrame(animationRef.current);
//     animationRef.current = requestAnimationFrame(step);
//   };

//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       background: '#f0f0f0'
//     }}>
//       <MapContainer
//         center={[17.385044, 78.486671]}
//         zoom={14}
//         style={{
//           height: "600px",
//           width: "80%",
//           maxWidth: "900px",
//           border: "2px solid #ccc",
//           borderRadius: "12px",
//           boxShadow: "0 0 12px rgba(0,0,0,0.2)"
//         }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {!selectedDay && (
//           <Marker position={[17.385044, 78.486671]} icon={vehicleIcon}>
//             <Popup>
//               <div>
//                 <p><strong>Select Time Range:</strong></p>
//                 <button onClick={() => handleDaySelection("today")}>Today</button><br />
//                 <button onClick={() => handleDaySelection("tomorrow")}>Tomorrow</button><br />
//                 <button onClick={() => handleDaySelection("week")}>This Week</button>
//               </div>
//             </Popup>
//           </Marker>
//         )}

//         {selectedDay && animatedPosition && (
//           <Marker position={[animatedPosition.lat, animatedPosition.lng]} icon={vehicleIcon} />
//         )}

//         {filteredRoute.length > 0 && (
//           <>
//             <Polyline
//               positions={filteredRoute.map(p => [p.latitude, p.longitude])}
//               color="blue"
//             />
//             <Marker position={[filteredRoute[0].latitude, filteredRoute[0].longitude]} icon={startIcon} />
//             <Marker position={[filteredRoute[filteredRoute.length - 1].latitude, filteredRoute[filteredRoute.length - 1].longitude]} icon={endIcon} />
//           </>
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default VehicleMap;





import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const vehicleIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/296/296216.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const startIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const endIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190406.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const VehicleMap = () => {
  const [fullRoute, setFullRoute] = useState([]);
  const [filteredRoute, setFilteredRoute] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [animatedPosition, setAnimatedPosition] = useState(null);
  const [noData, setNoData] = useState(false);

  const indexRef = useRef(0);
  const animationRef = useRef();

  useEffect(() => {
    axios.get('https://vehicle-proj-backend.onrender.com/api/vehicle')
      .then(res => setFullRoute(res.data))
      .catch(err => console.error('Error fetching route:', err));
  }, []);

  const handleDaySelection = (day) => {
    const filtered = fullRoute.filter(point => point.day === day);
    setFilteredRoute(filtered);
    setSelectedDay(day);
    setNoData(filtered.length === 0);
    indexRef.current = 0;

    if (filtered.length > 1) {
      animateVehicle(filtered);
    } else if (filtered.length === 1) {
      setAnimatedPosition({ lat: filtered[0].latitude, lng: filtered[0].longitude });
    } else {
      setAnimatedPosition(null);
    }
  };

  const animateVehicle = (route) => {
    if (route.length < 2) return;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const t = Math.min(progress / 2000, 1);

      const from = route[indexRef.current];
      const to = route[indexRef.current + 1];

      const lat = from.latitude + (to.latitude - from.latitude) * t;
      const lng = from.longitude + (to.longitude - from.longitude) * t;
      setAnimatedPosition({ lat, lng });

      if (t < 1) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        indexRef.current++;
        if (indexRef.current < route.length - 1) {
          start = null;
          animationRef.current = requestAnimationFrame(step);
        }
      }
    };

    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(step);
  };

  const resetSelection = () => {
    setSelectedDay(null);
    setFilteredRoute([]);
    setAnimatedPosition(null);
    setNoData(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', background: '#f0f0f0' }}>
      <MapContainer
        center={[17.385044, 78.486671]}
        zoom={14}
        style={{ height: '600px', width: '80%', maxWidth: '900px', border: '2px solid #ccc', borderRadius: '12px', boxShadow: '0 0 12px rgba(0,0,0,0.2)' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Show selection popup even if a day is already selected */}
        {!selectedDay && (
          <Marker position={[17.385044, 78.486671]} icon={vehicleIcon}>
            <Popup>
              <div>
                <p><strong>Select Time Range:</strong></p>
                <button onClick={() => handleDaySelection("today")}>Today</button><br />
                <button onClick={() => handleDaySelection("tomorrow")}>Tomorrow</button><br />
                <button onClick={() => handleDaySelection("week")}>This Week</button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Show car if selectedDay and animatedPosition available */}
        {selectedDay && animatedPosition && (
          <Marker position={[animatedPosition.lat, animatedPosition.lng]} icon={vehicleIcon}>
            <Popup>
              <div>
                <p><strong>{selectedDay.toUpperCase()}</strong></p>
                <button onClick={resetSelection}>Reset</button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Polyline and markers for route */}
        {filteredRoute.length > 0 && (
          <>
            <Polyline
              positions={filteredRoute.map(p => [p.latitude, p.longitude])}
              color="blue"
            />
            <Marker position={[filteredRoute[0].latitude, filteredRoute[0].longitude]} icon={startIcon} />
            <Marker position={[filteredRoute[filteredRoute.length - 1].latitude, filteredRoute[filteredRoute.length - 1].longitude]} icon={endIcon} />
          </>
        )}

        {/* No data available */}
        {selectedDay && noData && (
          <Marker position={[17.385044, 78.486671]} icon={vehicleIcon}>
            <Popup>
              <div>
                <p><strong>No route data for "{selectedDay}"</strong></p>
                <button onClick={resetSelection}>Back</button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default VehicleMap;










