import { ButtonComponent } from "./components/Button";
import { LabelComponent } from "./components/Label";
import { LightComponent } from "./components/Light";
import { RowLabelComponent } from "./components/RowLabels";
import { SpinComponent } from "./components/Spin";

export { WebSocketService } from "./services/websocket";
export { eventManager } from "./services/events";
export { protoService } from "./services/proto_service";

var Components = {
  ButtonComponent,
  LabelComponent,
  RowLabelComponent,
  LightComponent,
  SpinComponent,
};

export { Components };
