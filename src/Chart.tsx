import React, { useEffect, useRef, useState } from "react";
import { useAppState } from "./state";
import { getASCII } from "./utils";
import SignalNRZ from "./graphs/SignalNRZ";
import { BaseSketch } from "./graphs/Base";
import { Fourier } from "./graphs/Fourier";

const colors = ["red", "green", "blue"];

type ChartType = "signal" | "fourier" | "received";

const chartTypeMap: Record<ChartType, typeof BaseSketch> = {
  signal: SignalNRZ,
  fourier: Fourier,
  received: SignalNRZ,
};

export const Chart: React.FC<{ title: string; chartType: ChartType }> = ({
  title,
  chartType,
}) => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [p5Instance, setP5Instance] = useState<BaseSketch>();
  const { state } = useAppState();

  useEffect(() => {
    if (!canvasWrapperRef.current) {
      return;
    }

    const ctor = chartTypeMap[chartType];

    const mySketch = new ctor(canvasWrapperRef.current);

    setP5Instance(mySketch);

    return () => {
      mySketch.destroy();
    };
  }, [canvasWrapperRef, chartType]);

  useEffect(() => {
    if (!p5Instance) {
      return;
    }

    p5Instance.update(state);
  }, [p5Instance, state]);

  return (
    <div className="card graph">
      <h2>{title}</h2>
      <div className="canvas-wrapper" ref={canvasWrapperRef}></div>
    </div>
  );
};
