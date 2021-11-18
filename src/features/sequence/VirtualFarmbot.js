import React, { useState, useRef, useEffect } from "react";

const getPixelRatio = (context) => {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  return (window.devicePixelRatio || 1) / backingStore;
};

const mockActions = [
  { type: "A" },
  { type: "B" },
  { type: "C" },
  { type: "D" },
  // {
  //   param: {
  //     x: "20",
  //     y: "20",
  //   },
  //   type: "move_absolute",
  //   id: "8a268241-c5c4-488d-87d0-81a8c2871868",
  //   label: "Mouvement absolu",
  //   params: [
  //     {
  //       name: "x",
  //       label: "déplacement en X",
  //       value: "20",
  //     },
  //     {
  //       name: "y",
  //       label: "déplacement en Y",
  //       value: "20",
  //     },
  //   ],
  // },
  // {
  //   param: {
  //     x: "120",
  //     y: "120",
  //   },
  //   type: "move_relative",
  //   id: "8a268241-c5c4-488d-87d0-81a8c2871868",
  //   label: "Mouvement absolu",
  //   params: [
  //     {
  //       name: "x",
  //       label: "déplacement en X",
  //       value: "120",
  //     },
  //     {
  //       name: "y",
  //       label: "déplacement en Y",
  //       value: "120",
  //     },
  //   ],
  // },
];

function simulate() {
  var i = 0;
  const intervalId = setInterval(function () {
    console.log(mockActions[i]);
    i++;
  }, 1000);

  if (i >= mockActions.length) {
    clearInterval(intervalId);
  }
}

// const HOOK_SVG =
//   "m129.03125 63.3125c0-34.914062-28.941406-63.3125-64.519531-63.3125-35.574219 0-64.511719 28.398438-64.511719 63.3125 0 29.488281 20.671875 54.246094 48.511719 61.261719v162.898437c0 53.222656 44.222656 96.527344 98.585937 96.527344h10.316406c54.363282 0 98.585938-43.304688 98.585938-96.527344v-95.640625c0-7.070312-4.640625-13.304687-11.414062-15.328125-6.769532-2.015625-14.082032.625-17.960938 6.535156l-42.328125 64.425782c-4.847656 7.390625-2.800781 17.3125 4.582031 22.167968 7.386719 4.832032 17.304688 2.792969 22.160156-4.585937l12.960938-19.71875v42.144531c0 35.582032-29.863281 64.527344-66.585938 64.527344h-10.316406c-36.714844 0-66.585937-28.945312-66.585937-64.527344v-162.898437c27.847656-7.015625 48.519531-31.773438 48.519531-61.261719zm-97.03125 0c0-17.265625 14.585938-31.3125 32.511719-31.3125 17.929687 0 32.511719 14.046875 32.511719 31.3125 0 17.261719-14.582032 31.3125-32.511719 31.3125-17.925781 0-32.511719-14.050781-32.511719-31.3125zm0 0";
// const HOOK_PATH = new Path2D(HOOK_SVG);
// const SCALE = 0.3;
// const OFFSET = 80;
function draw(ctx, location) {
  console.log(location);
  // ctx.fillStyle = "deepskyblue";
  // ctx.shadowColor = "dodgerblue";
  // ctx.shadowBlur = 20;
  // ctx.save();
  // ctx.scale(SCALE, SCALE);
  // ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
  // ctx.fill(HOOK_PATH);
  ctx.fillStyle = "green";
  ctx.save();
  ctx.fillRect(10, 10, 100, 100);
  ctx.save();
  ctx.restore();
}

export default function VirtualFarmbot() {
  // http://www.petecorey.com/blog/2019/08/19/animating-a-canvas-with-react-hooks/
  const [locations, setLocations] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    let canvas = canvasRef.current;
    let context = canvas.getContext("2d");
    let ratio = getPixelRatio(context);
    let width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    let height = getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    let requestId,
      i = 0;
    const render = () => {
      context.beginPath();
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        (canvas.width / 2) * Math.abs(Math.cos(i)),
        0,
        2 * Math.PI
      );
      context.fill();
      i += 0.05;
      requestId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return <canvas ref={canvasRef} style={{ width: "100px", height: "100px" }} />;
}
