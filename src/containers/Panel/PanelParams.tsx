import {Controls} from "components/FxParams/Controls";
import { PanelGroup } from "components/Panel/PanelGroup";
import { useContext } from "react"
import {FxParamsContext} from "components/FxParams/Context";

interface Props {}

export function PanelParams({
  
}: Props) {
    const ctx = useContext(FxParamsContext);

  return (
    <PanelGroup
      title="Params"
      description="fx(params) can be defines in your code and are puilled in real time from the code running."
      >
      <Controls params={ctx.params} />
    </PanelGroup>
  );
}
