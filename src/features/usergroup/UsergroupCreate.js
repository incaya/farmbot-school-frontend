import React, { useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  create,
  setErrorMessage,
  selectLoading,
  selectErrorMessage,
} from "./usergroupSlice";
import styles from "./Usergroup.css";

import { Button, TextField, makeStyles, Grid } from "@material-ui/core";

import { required, hasErrors } from "../../utils/validators";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  asyncButton: {
    marginTop: "15px",
  },
  error: {
    color: "red",
  },
}));

const initialState = {
  groupName: "",
  generateLearners: 0,
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

export default function UsergroupCreate() {
  const classes = useStyles();
  const challengeLoading = useSelector(selectLoading);
  const errorMessage = useSelector(selectErrorMessage);
  const dispatch = useDispatch();
  const [state, valueDispatch] = useReducer(reducer, initialState);
  let history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    const { groupName, generateLearners } = state;
    var errors = hasErrors([["Nom", groupName, required]]);
    if (errors) {
      await dispatch(setErrorMessage({ message: errors[0] }));
    } else {
      await dispatch(create({ name: groupName, generate_learners: generateLearners }));
      if (errorMessage === null) {
        history.push("/usergroups");
      }
    }
  };

  const onChange = (e) => {
    if (e.target.type === "checkbox") {
      valueDispatch({ field: e.target.name, value: e.target.checked });
    } else {
      valueDispatch({ field: e.target.name, value: e.target.value });
    }
  };

  return (
    <div className="page-block-center">
      <h2>Ajouter un groupe</h2>
      <div className={styles.row}>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={submit}
        >
          <Grid container justify="center" direction="column">
            <Grid item>
              <TextField
                name="groupName"
                className={classes.textField}
                label="Nom"
                onChange={onChange}
                value={state.groupName}
              />
            </Grid>
            <Grid item>
              <TextField
                name="generateLearners"
                className={classes.textField}
                label="Apprenants à générer"
                onChange={onChange}
                value={state.generateLearners}
                type="number"
              />
            </Grid>
            <Grid item>
              <Button
                className={classes.asyncButton}
                type="submit"
                variant="contained"
              >
                Valider
              </Button>
            </Grid>
          </Grid>
        </form>
        <p>{challengeLoading === "pending" ? "Loading..." : ""}</p>
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}
      </div>
    </div>
  );
}
