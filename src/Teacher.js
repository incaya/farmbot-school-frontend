import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

export default function Teacher() {
  return (
    <>
      <h2>Enseignant.e</h2>
      <p>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/learners"
        >
          Apprenants
        </Button>
      </p>
      <p>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/challenges"
        >
          Défis
        </Button>
      </p>
    </>
  );
}
