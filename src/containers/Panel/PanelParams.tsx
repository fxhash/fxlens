import { PanelGroup } from "components/Panel/PanelGroup";
import {Pane} from "components/Params/Pane";

interface Props {}

export function PanelParams({
  
}: Props) {
  return (
    <PanelGroup
      title="Params"
      description="fx(params) can be defines in your code and are puilled in real time from the code running."
      >
      <Pane />  
    </PanelGroup>
  );
}
