import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import {
  update,
  fetch,
  setErrorMessage,
  selectLoading,
  selectErrorMessage,
  selectLearnerFocus,
  changeFocusValue,
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

export default function LearnerEdit() {
  let routeParams = useParams();
  const learnerId = routeParams.learnerId;
  const currentLearner = useSelector(selectLearnerFocus);
  const usergroup = useSelector(selectUsergroupFocus);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchLearner = async () => {
      await dispatch(fetch(learnerId));
    };
    fetchLearner();
  }, []);

  const classes = useStyles();
  const learnerLoading = useSelector(selectLoading);
  const errorMessage = useSelector(selectErrorMessage);
  const { email, pseudo, name } = currentLearner;
  let history = useHistory();

  if (!usergroup.id) {
    history.push("/usergroups");
  }

  const submit = async (e) => {
    e.preventDefault();
    const { email, pseudo, name } = currentLearner;
    const usergroupId = usergroup.id;
    var errors = hasErrors([
      ["Nom", name, required],
      ["Pseudo", pseudo, required],
      ["Email", email, required],
    ]);
    if (errors) {
      await dispatch(setErrorMessage({ message: errors[0] }));
    } else {
      await dispatch(
        update({
          email,
          pseudo,
          name,
          learnerId,
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
      dispatch(
        changeFocusValue({ field: e.target.name, value: e.target.checked })
      );
    } else {
      dispatch(
        changeFocusValue({ field: e.target.name, value: e.target.value })
      );
    }
  };

  return (
    <div className="page-block-center">
      <h2>Modifier un profil</h2>
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
        <p>{learnerLoading === "pending" ? "Loading..." : ""}</p>
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}
      </div>
    </div>
  );
}
