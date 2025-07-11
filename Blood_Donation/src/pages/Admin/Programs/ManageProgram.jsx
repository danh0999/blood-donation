import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import ProgramMapPanel from "./ProgramMapPanel"
import ProgramTablePanel from './ProgramTablePanel';
import { BsGripHorizontal } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrograms } from "../../../redux/features/programSlice";
import { fetchAddresses } from "../../../redux/features/addressSlice";

export default function ManageProgram() {
  const dispatch = useDispatch();
  const programs = useSelector(state => state.program.data);
  const programsLoading = useSelector(state => state.program.loading);
  const addresses = useSelector(state => state.address.data);
  const addressesLoading = useSelector(state => state.address.loading);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 10.773477807259052,
    lng: 106.6598671630604,
  });

  useEffect(() => {
    dispatch(fetchPrograms());
    dispatch(fetchAddresses());
  }, [dispatch]);

  // When the list of programs changes, check if the selected program still exists.
  // If not, it means it was deleted, so we clear the selection.
  useEffect(() => {
    if (selectedProgram && !programs.find(p => p.id === selectedProgram.id)) {
      setSelectedProgram(null);
    }
  }, [programs, selectedProgram]);

  // When a program is selected, update map center to its address
  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    const address = addresses.find(addr => addr.id === program.addressId);
    if (address && address.latitude && address.longitude) {
      setMapCenter({ lat: address.latitude, lng: address.longitude });
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <PanelGroup direction="vertical">
        <Panel defaultSize={70} minSize={10}>
          <div style={{ height: "100%", overflow: "auto" }}>
            <ProgramMapPanel
              selectedProgram={selectedProgram}
              setSelectedProgram={setSelectedProgram}
              mapCenter={mapCenter}
              programs={programs}
              programsLoading={programsLoading}
              addresses={addresses}
              addressesLoading={addressesLoading}
            />
          </div>
        </Panel>

        <PanelResizeHandle
          style={{
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <BsGripHorizontal style={{ fontSize: 22, color: '#888' }} />
        </PanelResizeHandle>

        <Panel defaultSize={30} minSize={10} maxSize={50}>
          <div style={{ height: "100%", overflow: "auto", padding: "10" }}>
            <ProgramTablePanel
              selectedProgram={selectedProgram}
              onSelectProgram={handleSelectProgram}
              programs={programs}
              programsLoading={programsLoading}
              addresses={addresses}
              addressesLoading={addressesLoading}
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}