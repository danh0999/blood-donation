import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import MapFullScreen from '../../../components/GoogleMapsAPI/MapFullScreen';
import ProgramTable from './ProgramTable';

export default function ManageProgram() {
  return (
    <div style={{ height: "100vh", width: "100%"}}>
      <PanelGroup direction="vertical">
        <Panel defaultSize={70} minSize={10}>
          <div style={{ height: "100%", overflow: "auto" }}>
            <MapFullScreen />
          </div>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={20} minSize={10} maxSize={50}>
          <div style={{ height: "100%", overflow: "auto" }}>
            <ProgramTable />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}