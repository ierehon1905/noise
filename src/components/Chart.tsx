import React, { useEffect, useRef, useState } from "react";
import { useAppState } from "../state";
import { getASCII } from "../utils";
import Signal from "./graphs/Signal";
import { BaseSketch } from "./graphs/Base";
import { Fourier } from "./graphs/Fourier";
import Received from "./graphs/Received";

const colors = ["red", "green", "blue"];

type ChartType = "signal" | "fourier" | "received";

const chartTypeMap: Record<ChartType, typeof BaseSketch> = {
  signal: Signal,
  fourier: Fourier,
  received: Received,
};

export const Chart: React.FC<{ title: string; chartType: ChartType }> = ({
  title,
  chartType,
}) => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [p5Instance, setP5Instance] = useState<BaseSketch>();
  const { state, dispatch } = useAppState();

  // console.log(
  //   "state",
  //   state.message,
  //   state.errorCount,
  //   state.encodedMessage?.[0],
  //   state.receivedMessage?.[0],
  //   state.decodedMessage
  // );

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

    p5Instance.update(state, dispatch);
  }, [p5Instance, state]);

  return (
    <div className="card graph">
      <h2>{title}</h2>
      <div className="canvas-wrapper" ref={canvasWrapperRef}></div>
    </div>
  );
};
