import { createRef, useEffect, useContext, useState, useCallback, ChangeEvent } from "react";
import { MainContext } from "context/MainContext";
import { consolidateParams } from "utils/fxparams";
import {ParameterController} from "./Controller/Param";



interface ControlsProps {
  params: any;
}
export const Controls = ({ params }: ControlsProps) => {
  const ctx = useContext(MainContext);

  const consolidatedParams = consolidateParams(params, ctx.data);

  const p: React.RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
    const ps: any = {};
    if (consolidatedParams) {
      consolidatedParams.forEach((p: any) => {
        ps[p.id] = p.type == "number" ? Number(p.value) : p.value;
      });
      ctx.setData(ps);
    }
  }, [params]);
  
  const handleChangeParam = (id:string, value: any) => {
    console.log(id, value)
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
