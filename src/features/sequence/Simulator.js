import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveSequence,
  selectSimulationSequence,
  loadSimulation,
  clearSimulation,
} from "./sequenceSlice";
import computeMoves from "./computeMoves";
import { Button, createStyles, makeStyles } from "@material-ui/core";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import "./Simulator.css";

export const useStyles = makeStyles(() =>
  createStyles({
    rotateIcon: {
      animation: "spin 2s linear infinite",
    },
  })
);

let farmbotWidth = 300;

let farmbotLength = 600;

let simulatorBgColor = "#abb1a9";

let initialXYZValues = {
  x: parseInt(process.env.REACT_APP_SIM_DEF_X),
  y: parseInt(process.env.REACT_APP_SIM_DEF_Y),
  z: parseInt(process.env.REACT_APP_SIM_DEF_Z),
};

export default function Simulator(props) {
  const { setSimulatedAction } = props;
  const classes = useStyles();
  const [toReset, setToReset] = useState(false);
  const dispatch = useDispatch();
  const activeSequence = useSelector(selectActiveSequence);
  const simulationSequence = useSelector(selectSimulationSequence);

  const [x, setX] = useState(initialXYZValues.x);
  const [y, setY] = useState(initialXYZValues.y);
  const [z, setZ] = useState(initialXYZValues.z);

  const [xTarget, setXTarget] = useState(initialXYZValues.x);
  const [yTarget, setYTarget] = useState(initialXYZValues.y);
  const [zTarget, setZTarget] = useState(initialXYZValues.z);

  const [isWatering, setIsWatering] = useState(0);
  const [isAspiring, setIsAspiring] = useState(0);

  const [simulationStep, setSimulationStep] = useState(-1);

  const [simulationStopped, setSimulationStopped] = useState(true);
  const [simulationEnded, setSimulationEnded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSimulationStopped(false);
    }, 2000);
  }, [xTarget, yTarget, zTarget]);

  useEffect(() => {
    return () => {
      dispatch(clearSimulation());
    };
  }, []);
  const drawGantry = (p5) => {
    p5.stroke("#777777");
    p5.noFill();
    p5.strokeWeight(5);
    p5.line(0, y, farmbotWidth, y);
  };
  const drawCross = (p5) => {
    p5.strokeWeight(5);
    p5.fill(simulatorBgColor);
    p5.stroke(simulatorBgColor);
    p5.square(x, y, 72);
    p5.noFill();
    p5.stroke(250);
    p5.line(x, y - 30, x, y + 30);
    p5.line(x - 30, y, x + 30, y);
    p5.rectMode(p5.CENTER);
    p5.square(x, y, (z / 100) * 60);
  };
  const drawLandmarks = (p5) => {
    p5.strokeWeight(1);
    p5.stroke(200);
    for (let i = 0; i <= farmbotWidth; i += 50) {
      linedash(p5, i, 0, i, farmbotLength, 5);
    }
    for (let j = 0; j <= farmbotLength; j += 50) {
      linedash(p5, 0, j, farmbotWidth, j, 5);
    }
  };
  const drawWater = (p5) => {
    p5.strokeWeight(5);
    p5.stroke(30, 144, 255);
    p5.line(x + 10, y - 10, x + 20, y - 20);
    p5.line(x - 10, y - 10, x - 20, y - 20);
    p5.line(x + 10, y + 10, x + 20, y + 20);
    p5.line(x - 10, y + 10, x - 20, y + 20);
  };
  const drawVacuum = (p5) => {
    p5.strokeWeight(2);
    p5.stroke(220, 20, 60);
    p5.line(x - 5, y - 5, x - 15, y - 15);
    p5.line(x - 5, y - 5, x - 5, y - 15);
    p5.line(x - 5, y - 5, x - 15, y - 5);
    p5.line(x + 5, y + 5, x + 15, y + 15);
    p5.line(x + 5, y + 5, x + 5, y + 15);
    p5.line(x + 5, y + 5, x + 15, y + 5);
  };
  const linedash = (p5, x1, y1, x2, y2, delta, style = "-") => {
    // delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
    let distance = p5.dist(x1, y1, x2, y2);
    let dashNumber = distance / delta;
    let xDelta = (x2 - x1) / dashNumber;
    let yDelta = (y2 - y1) / dashNumber;

    for (let i = 0; i < dashNumber; i += 2) {
      let xi1 = i * xDelta + x1;
      let yi1 = i * yDelta + y1;
      let xi2 = (i + 1) * xDelta + x1;
      let yi2 = (i + 1) * yDelta + y1;

      if (style === "-") {
        p5.line(xi1, yi1, xi2, yi2);
      } else if (style === ".") {
        p5.point(xi1, yi1);
      } else if (style === "o") {
        p5.ellipse(xi1, yi1, delta / 2);
      }
    }
  };

  function setNextStep() {
    if (!simulationSequence[simulationStep + 1]) {
      setSimulationStopped(true);
      setSimulationEnded(true);
      setSimulatedAction(null);
    } else {
      const nextStepId = simulationStep + 1;
      setSimulationStep(nextStepId);
      const targets = computeMoves(simulationSequence[nextStepId], { x, y, z });
      if (simulationSequence[nextStepId].type === "water") {
        setIsWatering(parseInt(simulationSequence[nextStepId].param.value));
      }
      if (simulationSequence[nextStepId].type === "vacuum") {
        setIsAspiring(parseInt(simulationSequence[nextStepId].param.value));
      }
      setSimulatedAction(nextStepId);
      const { xt, yt, zt } = targets;
      if (xt === x && yt === y && zt === z) {
        setTimeout(() => {
          setSimulationStopped(false);
        }, 2000);
      } else {
        setXTarget(xt);
        setYTarget(yt);
        setZTarget(zt);
      }
    }
  }

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(farmbotWidth, farmbotLength).parent(canvasParentRef);
    p5.frameRate(10);
    p5.background(0);

    drawLandmarks(p5);
    drawGantry(p5);
    drawCross(p5);
  };

  const draw = (p5) => {
    if (!simulationStopped) {
      p5.background(simulatorBgColor);

      drawLandmarks(p5);
      drawGantry(p5);
      drawCross(p5);
      if (isWatering === 1) {
        drawWater(p5);
      }
      if (isAspiring === 1) {
        drawVacuum(p5);
      }
      if (x === xTarget && y === yTarget && z === zTarget) {
        setSimulationStopped(true);
        if (!toReset) {
          setNextStep();
        } else {
          setToReset(false);
        }
      } else {
        if (x !== xTarget) {
          const newX = x < xTarget ? x + 1 : x - 1;
          setX(newX);
        }
        if (y !== yTarget) {
          const newY = y < yTarget ? y + 1 : y - 1;
          setY(newY);
        }
        if (z !== zTarget) {
          const newZ = z < zTarget ? z + 1 : z - 1;
          setZ(newZ);
        }
      }
    }
  };

  return (
    <div className="simul-block">
      <div className="simul-buttons">
        <div className="simul-buttons-actions">
          <Button
            variant="outlined"
            color="primary"
            aria-label="simulate"
            size="small"
            onClick={async () => {
              await dispatch(
                loadSimulation({ actions: activeSequence.actions })
              );
              setSimulationStep(-1);
              setSimulationStopped(false);
              setSimulationEnded(false);
            }}
          >
            <DirectionsRunIcon /> Simuler
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            aria-label="home"
            size="small"
            onClick={async () => {
              setXTarget(initialXYZValues.x);
              setYTarget(initialXYZValues.y);
              setZTarget(initialXYZValues.z);
              setToReset(true);
            }}
          >
            Home
          </Button>
          <Button
            variant="outlined"
            disabled={simulationEnded}
            color="secondary"
            aria-label="stop"
            size="small"
            onClick={async () => {
              setSimulationStopped(!simulationStopped);
            }}
          >
            {simulationStopped && "Reprendre"}
            {!simulationStopped && "Stop"}
          </Button>
        </div>

        <span className="simul-status">
          {simulationStopped && !simulationEnded && <HourglassEmptyIcon />}
          {!simulationStopped && (
            <>
              <AutorenewIcon className={classes.rotateIcon} />
              <style>{`
            @keyframes spin {
                 0% { transform: rotate(0deg); }
                 100% { transform: rotate(360deg); }
            }
        `}</style>
            </>
          )}
        </span>
      </div>
      <p className="simul-coords">
        <span>
          x = {x} / {xTarget}
        </span>
        <span>
          y = {y} / {yTarget}
        </span>
        <span>
          z = {z} / {zTarget}
        </span>
      </p>

      <div style={{ padding: "50px", backgroundColor: "#444444" }}>
        <Sketch setup={setup} draw={draw} />
      </div>
    </div>
  );
}
