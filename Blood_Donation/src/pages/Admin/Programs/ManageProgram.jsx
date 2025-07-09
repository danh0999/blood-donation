import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import MapFullScreen from '../../../components/GoogleMapsAPI/MapFullScreen';
import ProgramTablePanel from './ProgramTablePanel';
import { BsGripHorizontal } from "react-icons/bs";

export default function ManageProgram() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <PanelGroup direction="vertical">
        <Panel defaultSize={70} minSize={10}>
          <div style={{ height: "100%", overflow: "auto" }}>
            <MapFullScreen />
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
            <ProgramTablePanel />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}