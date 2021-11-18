import React, { useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  create,
  setErrorMessage,
  selectLoading,
  selectErrorMessage,
} from "./learnerSlice";
import styles from "./Learner.css";
import { selectUsergroupFocus } from "../usergroup/usergroupSlice";

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
  email: "",
  pseudo: "",
  name: "",
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

export default function LearnerCreate() {
  const classes = useStyles();
  const challengeLoading = useSelector(selectLoading);
  const errorMessage = useSelector(selectErrorMessage);
  const usergroup = useSelector(selectUsergroupFocus);
  const dispatch = useDispatch();
  const [state, valueDispatch] = useReducer(reducer, initialState);
  const { email, pseudo, name, password } = state;
  let history = useHistory();

  if (!usergroup.id) {
    history.push("/usergroups");
  }

  const submit = async (e) => {
    e.preventDefault();
    const { email, pseudo, name, password } = state;
    const usergroupId = usergroup.id;
    var errors = hasErrors([
      ["Nom", name, required],
      ["Pseudo", pseudo, required],
      ["Email", email, required],
      ["UsergroupId", usergroupId, required],
    ]);
    if (errors) {
      await dispatch(setErrorMessage({ message: errors[0] }));
    } else {
      await dispatch(
        create({
          email,
          pseudo,
          name,
          password,
          role: "USER",
          group_id: usergroupId,
        })
      );
      if (errorMessage === null) {
        history.push("/usergroups/view/" + usergroup.id);
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
      <h2>Ajouter un apprenant</h2>
      <p>
        dans le groupe <strong>{usergroup.name}</strong>
      </p>
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
                name="email"
                className={classes.textField}
                label="Email"
                onChange={onChange}
                value={email}
              />
            </Grid>
            <Grid item>
              <TextField
                name="pseudo"
                className={classes.textField}
                label="Pseudo"
                onChange={onChange}
                value={pseudo}
              />
            </Grid>
            <Grid item>
              <TextField
                name="name"
                className={classes.textField}
                label="Nom"
                onChange={onChange}
                value={name}
              />
            </Grid>
            <Grid item>
              <TextField
                name="password"
                className={classes.textField}
                label="Mot de passe"
                onChange={onChange}
                type="password"
                value={password}
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
