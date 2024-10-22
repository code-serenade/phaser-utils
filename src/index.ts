import { ButtonComponent } from "./components/Button";
import { LabelComponent } from "./components/Label";
import { LightComponent } from "./components/Light";
import { RowLabelComponent } from "./components/RowLabels";
import { SpinComponent } from "./components/Spin";

import { WebSocketService } from "./services/websocket";
import { eventManager } from "./services/events";
import { protoService } from "./services/proto_service";

var Components = {
  ButtonComponent,
  LabelComponent,
  RowLabelComponent,
  LightComponent,
  SpinComponent,
};

var Service = {
  WebSocketService,
  eventManager,
  protoService,
};

export { Components, Service };
