import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

function SimpleSnackbar(props) {
  const { display, message, type } = props;
  const bgColor = type === "success" ? "#4caf50" : "#f44336";

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={display}
        autoHideDuration={6000}
        ContentProps={{
          "aria-describedby": "snackbar-message",
          style: { backgroundColor: bgColor },
        }}
        message={<span id="snackbar-message">{message}</span>}
      />
    </div>
  );
}

export default SimpleSnackbar;
