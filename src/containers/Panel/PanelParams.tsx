import { useContext, useRef } from "react"
import { MainContext } from "context/MainContext"
import { useParams } from "context/Params";
import { Controls } from "components/Controls/Controls";
import { PanelGroup } from "components/Panel/PanelGroup";

interface Props {}

export function PanelParams({
  
}: Props) {
  const ctx = useContext(MainContext);

  return (
    <PanelGroup
      title="Params"
      description="fx(params) can be defines in your code and are puilled in real time from the code running."
      >
      <Controls params={ctx.params} />
    </PanelGroup>
  );
}
