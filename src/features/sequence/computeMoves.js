let initialXYZValues = {
  x: parseInt(process.env.REACT_APP_SIM_DEF_X),
  y: parseInt(process.env.REACT_APP_SIM_DEF_Y),
  z: parseInt(process.env.REACT_APP_SIM_DEF_Z),
};
export default function computeMoves(step, from) {
  let x = from.x,
    y = from.y,
    z = from.z;
  if (step.type === "find_home") {
    if (step.param.value === "x") {
      x = initialXYZValues.x;
      y = from.y;
      z = from.z;
    } else if (step.param.value === "y") {
      x = from.x;
      y = initialXYZValues.y;
      z = from.z;
    } else if (step.param.value === "z") {
      x = from.x;
      y = from.y;
      z = initialXYZValues.z;
    } else if (step.param.value === "all") {
      x = initialXYZValues.x;
      y = initialXYZValues.y;
      z = initialXYZValues.z;
    }
  } else if (step.type === "move_relative") {
    x =
      parseInt(from.x) +
      parseInt(step.param["x_offset"] ? step.param["x_offset"] : 0);
    y =
      parseInt(from.y) +
      parseInt(step.param["y_offset"] ? step.param["y_offset"] : 0);
    z =
      parseInt(from.z) +
      parseInt(step.param["z_offset"] ? step.param["z_offset"] : 0);
  } else if (step.type === "move_absolute") {
    x = parseInt(
      step.param["x_value"] ? step.param["x_value"] : initialXYZValues.x
    );
    y = parseInt(
      step.param["y_value"] ? step.param["y_value"] : initialXYZValues.y
    );
    z = parseInt(
      step.param["z_value"] ? step.param["z_value"] : initialXYZValues.z
    );
  }
  return {
    xt: isNaN(x) ? initialXYZValues.x : x,
    yt: isNaN(y) ? initialXYZValues.y : y,
    zt: isNaN(z) ? initialXYZValues.z : z,
  };
}
