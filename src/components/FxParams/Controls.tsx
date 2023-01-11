import { createRef, useEffect, useContext, useState, useCallback, ChangeEvent } from "react";
import { MainContext } from "context/MainContext";
import { consolidateParams } from "utils/fxparams";
import throttle from "lodash.throttle"
import {NumberController} from "./Controller/Number";
import {ColorController} from "./Controller/Color";
import {BooleanController} from "./Controller/Boolean";
import {SelectController} from "./Controller/Select";
import {StringController} from "./Controller/String";
import {ParameterController} from "./Controller/Param";



interface ControlsProps {
  params: any;
}
export const Controls = ({ params }: ControlsProps) => {
  const ctx = useContext(MainContext);

  const consolidatedParams = consolidateParams(params, ctx.datParams);

  const p: React.RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
    const ps: any = {};
    if (consolidatedParams) {
      consolidatedParams.forEach((p: any) => {
        ps[p.id] = p.type == "number" ? Number(p.value) : p.value;
      });
      ctx.setDatParams(ps);
    }
  }, [params]);
  
  const dbParamsUpdate = useCallback(
    throttle(
      () => {   
        console.log("ss");
        ctx.setDatParamsUpdate(Date.now);
      },
      1000
    ),
    []
  );

  const handleUpdate = (newData: any) => {
    dbParamsUpdate();
  };

  const handleUpdateParam = (id:string) => (event:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(id, event.target.value, event.target.checked) 
    ctx.setDatParams({ ...ctx.datParams, [id]: event.target.value });
  }


  console.log('??', consolidatedParams, ctx.datParams)

  return (
    <div ref={p}>
      {consolidatedParams?.map((p: any) => {
        return (
          <ParameterController
            key={p.id}
            parameter={p}
            value={p.value}
            onChange={handleUpdateParam(p.id)}
          />
        );
        })
      }
    </div>
  );
};
