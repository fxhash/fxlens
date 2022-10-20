import { createRef, useEffect, useContext, useState, useCallback } from "react";
import DatGui, {
  DatBoolean,
  DatColor,
  DatNumber,
  DatString,
  DatSelect,
} from "react-dat-gui";
import { MainContext } from "context/MainContext";
import "./datgui.css"
import { consolidateParams } from "utils/fxparams";
import throttle from "lodash.throttle"

const getDefByName = (params:any, name:string) => {
  if(params) {
    for(let i=0; i< params.length; i++) {
      if(params[i].name === name) return params[i];
    }
  }
}

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
        ps[p.name] = p.type == "number" ? Number(p.value) : p.value;
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
    ctx.setDatParams({ ...ctx.datParams, ...newData });
  };

  return (
    <div ref={p}>
      <DatGui data={ctx.datParams} onUpdate={handleUpdate}>
        {consolidatedParams?.map((p: any) => {
          switch (p.type) {
            case "number":
              return (
                <DatNumber
                  path={p.name}
                  label={p.name}
                  min={Number(p.options.min)}
                  max={Number(p.options.max)}
                  step={Number(p.options.step)}
                  key={p.name}
                />
              );
            case "color":
              return <DatColor path={p.name} label={p.name} key={p.name} />;
            case "boolean":
              return <DatBoolean path={p.name} label={p.name} key={p.name} />;
            case "select":
              return <DatSelect path={p.name} label={p.name} key={p.name} options={p.options} />;

            default:
              return <DatString path={p.name} label={p.name} key={p.name} />;
          }
        })}
      </DatGui>
    </div>
  );
};
