import ButtonComponet from "./components/Button";
import { LabelComponent } from "./components/Label";
import { LightComponent } from "./components/Light";
import { SpinComponent } from "./components/Spin";

export { WebSocketService } from "./services/websocket";
export { eventManager } from "./services/events";
export { protoService } from "./services/proto_service";

var Components = {
  ButtonComponet,
  LabelComponent,
  LightComponent,
  SpinComponent,
};

export { Components };
