import React, { useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addComment,
  selectCommentLoading,
  selectCommentErrorMessage,
} from "./sequenceSlice";
import { Paper, Button, TextField, makeStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  commentBox: {
    backgroundColor: "#feffff",
    padding: "5px",
  },
  commentBoxTitle: {
    margin: "0",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
    paddingBottom: "20px",
  },
  error: {
    color: "red",
  },
}));

const initialState = {
  comment: "",
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

function AddComment(props) {
  const classes = useStyles();
  const commentLoading = useSelector(selectCommentLoading);
  const errorMessage = useSelector(selectCommentErrorMessage);
  const [state, valueDispatch] = useReducer(reducer, initialState);
  const dispatch = useDispatch();
  const { comment } = state;
  const { sequenceId } = props;

  const submit = async (e) => {
    e.preventDefault();
    await dispatch(addComment({ comment, sequenceId }));
    if (errorMessage === null) {
      valueDispatch({ field: "comment", value: "" });
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
    <>
      <Paper className={classes.commentBox}>
        <h4 className={classes.commentBoxTitle}>Nouveau commentaire</h4>

        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={submit}
        >
          <Grid container justify="center" direction="column">
            <Grid item>
              <TextField
                name="comment"
                className={classes.textField}
                label=""
                onChange={onChange}
                value={comment}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="default"
                size="small"
                className="sequence-action"
                type="submit"
              >
                Envoyer
              </Button>
            </Grid>
          </Grid>
        </form>
        <p>{commentLoading === "pending" ? "Loading..." : ""}</p>
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}
      </Paper>
    </>
  );
}

export default AddComment;
