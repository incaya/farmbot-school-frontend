import React, { useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { create, selectLoading, selectErrorMessage } from "./challengeSlice";
import { selectUsergroupFocus } from "../usergroup/usergroupSlice";
import styles from "./Challenge.css";

import {
  Switch,
  Button,
  TextField,
  makeStyles,
  Grid,
  FormControlLabel,
} from "@material-ui/core";

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
  error: {
    color: "red",
  },
}));

const initialState = {
  active: false,
  endDate: "",
  title: "",
  description: "",
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

export default function ChallengeCreate() {
  const classes = useStyles();
  const challengeLoading = useSelector(selectLoading);
  const errorMessage = useSelector(selectErrorMessage);
  const usergroup = useSelector(selectUsergroupFocus);
  const dispatch = useDispatch();
  const [state, valueDispatch] = useReducer(reducer, initialState);
  const { active, endDate, title, description } = state;
  let history = useHistory();

  if (!usergroup.id) {
    history.push("/usergroups");
  }

  const submit = async (e) => {
    e.preventDefault();
    const { active, endDate, title, description } = state;
    const usergroupId = usergroup.id;
    await dispatch(
      create({
        active,
        end_date: endDate,
        title,
        description,
        group_id: usergroupId,
      })
    );
    if (errorMessage === null) {
      history.push("/usergroups/view/" + usergroup.id);
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
      <h2>Créer un défi</h2>
      <p>
        pour le groupe <strong>{usergroup.name}</strong>
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
                name="title"
                className={classes.textField}
                label="Intitulé"
                onChange={onChange}
                value={title}
              />
            </Grid>
            <Grid item>
              <TextField
                name="endDate"
                className={classes.textField}
                label="Date de fin"
                onChange={onChange}
                value={endDate}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                name="description"
                className={classes.textField}
                label="Description"
                onChange={onChange}
                value={description}
                multiline
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    name="active"
                    className={classes.checkboxField}
                    onChange={onChange}
                    value={active}
                  />
                }
                label="Actif ?"
              />
            </Grid>
            <Grid item>
              <Button
                className={styles.asyncButton}
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
