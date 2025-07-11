import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import markerImg from "../../../assets/program-marker.png";
import centerMarker from "../../../assets/headquarter.png";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// our facility location
const center = {
  lat: 10.773477807259052,
  lng: 106.6598671630604,
};

const mapOptions = {
  disableDefaultUI: true, // disables all default map UI buttons
};

const MapFullScreen = ({ selectedProgram, setSelectedProgram, mapCenter, programs, programsLoading, addresses, addressesLoading }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Remove fetching logic, use props

  if (!isLoaded) return <div>Loading map...</div>;
  if (programsLoading || addressesLoading) return <div>Loading data...</div>;

  // Helper function to get address name
  const getAddressName = (addressId) => {
    //search through array to find addr associated with the selected program
    const address = addresses.find(addr => addr.id === addressId);
    return address ? address.name : "Unknown location";
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={selectedProgram ? mapCenter : center}
      zoom={15}
      options={mapOptions}
    >
      <Marker
        position={{ lat: center.lat, lng: center.lng }}
        icon={{
          url: centerMarker,
          scaledSize: { width: 40, height: 50 },
        }}
      />
      {/* Add markers for each program's address */}
      {programs &&
        addresses &&
        programs.map((program) => {
          const address = addresses.find(
            (addr) => addr.id === program.addressId
          );
          if (address && address.latitude && address.longitude) {
            return (
              <Marker
                key={program.id}
                position={{ lat: address.latitude, lng: address.longitude }}
                title={program.proName}
                icon={{
                  url: markerImg,
                  scaledSize: { width: 60, height: 60 },
                }}
                onClick={() => setSelectedProgram(program)}
              />
            );
          }
          return null;
        })}

      {/* Info Window for selected program */}
      {selectedProgram && (
        <InfoWindow
          position={{
            lat: addresses.find(addr => addr.id === selectedProgram.addressId)?.latitude + 0.002,
            lng: addresses.find(addr => addr.id === selectedProgram.addressId)?.longitude
          }}
          onCloseClick={() => setSelectedProgram(null)}
        >
            <div style={{ flex: 1, minWidth: 0, maxWidth: 250 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{selectedProgram.proName}</h3>
              <p style={{ margin: '0 0 4px 0' }}>
                <strong>Location:</strong> {getAddressName(selectedProgram.addressId)}
              </p>
              <p style={{ margin: '0 0 4px 0' }}>
                <strong>Start Date:</strong> {selectedProgram.startDate}
              </p>
              <p style={{ margin: '0 0 0 0' }}>
                <strong>End Date:</strong> {selectedProgram.endDate}
              </p>
            </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapFullScreen;
