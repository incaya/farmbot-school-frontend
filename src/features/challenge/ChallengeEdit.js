import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import {
  update,
  fetch,
  selectLoading,
  selectErrorMessage,
  selectChallengeFocus,
  changeFocusValue,
} from "./challengeSlice";
import styles from "./Challenge.css";
import { selectUsergroupFocus } from "../usergroup/usergroupSlice";

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

export default function ChallengeEdit() {
  let routeParams = useParams();
  const challengeId = routeParams.challengeId;
  const currentChallenge = useSelector(selectChallengeFocus);
  const usergroup = useSelector(selectUsergroupFocus);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchChallenge = async () => {
      await dispatch(fetch(challengeId));
    };
    fetchChallenge();
  }, []);

  const classes = useStyles();
  const challengeLoading = useSelector(selectLoading);
  const errorMessage = useSelector(selectErrorMessage);
  const { active, end_date, title, description } = currentChallenge;
  let history = useHistory();

  if (!usergroup.id) {
    history.push("/usergroups");
  }

  const submit = async (e) => {
    e.preventDefault();
    const { active, end_date, title, description } = currentChallenge;
    const usergroupId = usergroup.id;
    await dispatch(
      update({
        active,
        end_date,
        title,
        description: description === null ? "" : description,
        challengeId,
        group_id: usergroupId,
      })
    );
    if (errorMessage === null) {
      history.push("/usergroups/view/" + usergroup.id);
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
      <h2>Modifier un défi</h2>
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
                type="date"
                value={end_date}
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
                    checked={active}
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
