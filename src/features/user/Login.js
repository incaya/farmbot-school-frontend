import React, { useReducer, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  login,
  selectLoading,
  selectErrorMessage,
  tokenValid,
} from "./userSlice";
import styles from "./Login.css";

import { Grid, Button, TextField, makeStyles } from "@material-ui/core";

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
  password: "",
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

export function Login() {
  const classes = useStyles();
  const userLoading = useSelector(selectLoading);
  const errorMessage = useSelector(selectErrorMessage);
  const isTokenValid = useSelector(tokenValid);
  const dispatch = useDispatch();
  const [state, valueDispatch] = useReducer(reducer, initialState);
  const { email, password } = state;
  let history = useHistory();

  useEffect(() => {
    if (isTokenValid) {
      history.push("/");
    }
  }, [isTokenValid]);

  const submit = async (e) => {
    e.preventDefault();
    const { email, password } = state;
    await dispatch(login({ email, password }));
  };

  const onChange = (e) => {
    valueDispatch({ field: e.target.name, value: e.target.value });
  };

  return (
    <div className="page-block-center">
      <h2>Authentification</h2>
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
                name="password"
                className={classes.textField}
                label="Password"
                type="password"
                onChange={onChange}
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
        <p>{userLoading === "pending" ? "Loading..." : ""}</p>
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}
      </div>
    </div>
  );
}
