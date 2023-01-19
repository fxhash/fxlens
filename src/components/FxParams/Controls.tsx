import { createRef, useEffect, useContext } from "react";
import { consolidateParams } from "components/FxParams/utils";
import { ParameterController } from "./Controller/Param";
import { FxParamsContext } from "./Context";

interface ControlsProps {
  params: any;
}
export const Controls = ({ params }: ControlsProps) => {
  const ctx = useContext(FxParamsContext);

  const consolidatedParams = consolidateParams(params, ctx.data);

  const p: React.RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
    const ps: any = {};
    if (consolidatedParams) {
      consolidatedParams.forEach((p: any) => {
        ps[p.id] = p.value;
      });
      ctx.setData(ps);
    }
  }, [params]);
  
  const handleChangeParam = (id:string, value: any) => {
    ctx.setData({...ctx.data, [id]: value})
  }

  console.log('??', consolidatedParams, ctx.data)

  return (
    <div ref={p}>
      {consolidatedParams?.map((p: any) => {
        return (
          <ParameterController
            key={p.id}
            parameter={p}
            value={p.value}
            onChange={handleChangeParam}
          />
        );
        })
      }
    </div>
  );
};
