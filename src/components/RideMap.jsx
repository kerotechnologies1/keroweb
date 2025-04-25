import React, { useEffect, useState } from 'react';
import { 
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

const RideMap = ({ startLocation, endLocation }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Convert coordinates
  const startPos = startLocation?.coordinates 
    ? { lat: startLocation.coordinates[1], lng: startLocation.coordinates[0] }
    : null;
  
  const endPos = endLocation?.coordinates 
    ? { lat: endLocation.coordinates[1], lng: endLocation.coordinates[0] }
    : null;

  if (!apiKey) {
    return <div className="text-red-500 p-4">Google Maps API key is missing</div>;
  }

  if (!startPos || !endPos) {
    return <div className="p-4 text-red-500">Invalid location data</div>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['routes']}>
      <div className="relative h-[500px] w-full">
        <Map
          defaultCenter={startPos}
          defaultZoom={13}
          gestureHandling={'greedy'}
          fullscreenControl={false}
        >
          {/* <AdvancedMarker position={startPos}>
            <Pin background={'green'} borderColor={'green'} />
          </AdvancedMarker>
          
          <AdvancedMarker position={endPos}>
            <Pin background={'red'} borderColor={'red'} />
          </AdvancedMarker> */}

          <Directions startPos={startPos} endPos={endPos} />
        </Map>
      </div>
    </APIProvider>
  );
};

const Directions = ({ startPos, endPos }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [routeIndex, setRouteIndex] = useState(0);
  
    // Initialize directions service and renderer
    useEffect(() => {
      if (!routesLibrary || !map) return;
      
      setDirectionsService(new routesLibrary.DirectionsService());
      setDirectionsRenderer(
        new routesLibrary.DirectionsRenderer({
          map,
          suppressMarkers: false, // We're using our own markers
          polylineOptions: {
            strokeColor: '#bb9348', // Change to golden brown
            strokeOpacity: 1.0,
            strokeWeight: 5
          }
        })
      );
    }, [routesLibrary, map]);
  
    // Update directions when start/end positions change
    useEffect(() => {
      if (!directionsService || !directionsRenderer || !startPos || !endPos) return;
  
      directionsService.route({
        origin: startPos,
        destination: endPos,
        travelMode: 'DRIVING',
        provideRouteAlternatives: false
      })
      .then(response => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      })
      .catch(console.error);
  
      return () => directionsRenderer.setMap(null);
    }, [directionsService, directionsRenderer, startPos, endPos]);
  
    return null;
  };

export default RideMap;