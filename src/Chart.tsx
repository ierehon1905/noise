import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";

export let sketch = (p: p5) => {
  let x = 100;
  let y = 100;

  let parent: p5.Element;

  p.setup = function () {
    parent = p.createCanvas(700, 410).parent();
    p.background(255);
  };

  p.windowResized = (event) => {
    const element = parent as unknown as HTMLDivElement;
    console.log(element.clientWidth);

    p.resizeCanvas(element.clientWidth, element.clientHeight);
  };

  const vals = Array(100)
    .fill(true)
    .map((_, index) => p.noise(index / 100) * 100);

  p.draw = function () {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);

    p.stroke(255);
    p.noFill();
    p.beginShape();

    for (let i = 0; i < vals.length; i++) {
      const x = (i * p.width) / vals.length;
      const d = (p.noise(i, p.frameCount / 100) - 0.5) * 100;
      const y = vals[i] + d;
      p.vertex(x, y);
    }

    p.endShape();
  };
};

export const Chart: React.FC<{ title: string }> = ({ title }) => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [p5Instance, setP5Instance] = useState<p5>();

  useEffect(() => {
    if (!canvasWrapperRef.current) {
      return;
    }

    let myp5 = new p5(sketch, canvasWrapperRef.current);
    myp5.windowResized();
    setP5Instance(myp5);

    return () => {
      if (canvasWrapperRef.current) {
        canvasWrapperRef.current.innerHTML = "";
      }
    };
  }, [canvasWrapperRef]);

  return (
    <div className="card graph">
      <h2>{title}</h2>
      <div className="canvas-wrapper" ref={canvasWrapperRef}></div>
    </div>
  );
};
