import { createRef, useEffect, useContext, useState, useCallback, useRef } from "react";
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
import {Pane} from "components/Params/Pane";

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
      // ctx.setDatParams(ps);
    }
  }, [params]);
  
  const dbParamsUpdate = useCallback(
    throttle(
      () => {   
        console.log("ss");
        // ctx.setDatParamsUpdate(Date.now);
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
    <>

    <Pane  />
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
                  key={p.id}
                />
              );
            case "color":
              return <DatColor path={p.name} label={p.name} key={p.id} />;
            case "boolean":
              return <DatBoolean path={p.name} label={p.name} key={p.id} />;
            case "select":
              return <DatSelect path={p.name} label={p.name} key={p.id} options={p.options.options} />;

            default:
              return <DatString path={p.name} label={p.name} key={p.id} />;
          }
        })}
      </DatGui>
    </div>
    </>
  );
};
