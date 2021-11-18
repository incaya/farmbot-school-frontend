import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import {
  update,
  fetch,
  setErrorMessage,
  selectLoading,
  selectErrorMessage,
  selectUsergroupFocus,
  changeFocusValue,
} from "./usergroupSlice";
import styles from "./Usergroup.css";

import {
  Button,
  TextField,
  makeStyles,
  Grid,
} from "@material-ui/core";

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

export default function UsergroupEdit() {
  let routeParams = useParams();
  const usergroupId = routeParams.usergroupId;
  const currentUsergroup = useSelector(selectUsergroupFocus);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUsergroup = async () => {
      await dispatch(fetch(usergroupId));
    };
    fetchUsergroup();
  }, []);

  const classes = useStyles();
  const usergroupLoading = useSelector(selectLoading);
  const errorMessage = useSelector(selectErrorMessage);
  const { name } = currentUsergroup;
  let history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    const { name } = currentUsergroup;
    var errors = hasErrors([
      ["Nom", name, required],
    ]);
    if (errors) {
      await dispatch(setErrorMessage({ message: errors[0] }));
    } else {
      await dispatch(
        update({
          name,
          usergroupId,
        })
      );
      if (errorMessage === null) {
        history.push("/usergroups");
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
      <h2>Modifier un groupe</h2>
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
        <p>{usergroupLoading === "pending" ? "Loading..." : ""}</p>
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}
      </div>
    </div>
  );
}
