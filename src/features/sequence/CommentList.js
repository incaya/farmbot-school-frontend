import React from "react";
import { useSelector} from "react-redux";
import {
  selectCommentLoading,
  selectCommentErrorMessage,
} from "./sequenceSlice";
import { Paper, makeStyles } from "@material-ui/core";
import MessageIcon from "@material-ui/icons/Message";

const useStyles = makeStyles((theme) => ({
  commentList: {
    margin: "10px 0px 0px 0px",
  },
  commentCard: {
    padding: "5px",
    backgroundColor: "#dcecfc",
    marginBottom: "3px",
  },
  commentPseudo: {
    fontSize: "0.8em",
    padding: "0",
    margin: "0",
    fontWeight: "bold",
  },
  commentBody: {
    fontSize: "0.8em",
    padding: "0 0 0 15px;",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  error: {
    color: "red",
  },
}));

function CommentList(props) {
  const classes = useStyles();
  const { comments } = props;
  const commentLoading = useSelector(selectCommentLoading);
  const errorMessage = useSelector(selectCommentErrorMessage);

  return (
    <>
      {comments && comments.length > 0 && (
        <div className={classes.commentList}>
          {[...comments].reverse().map((c, id) => {
            return (
              <Paper className={classes.commentCard} key={id}>
                <p className={classes.commentPseudo}>
                <MessageIcon fontSize="small" /> {c.user.pseudo} 
                </p>
                <p className={classes.commentBody}>{c.comment}</p>
              </Paper>
            );
          })}

          <p>{commentLoading === "pending" ? "Loading..." : ""}</p>
          {errorMessage && <p className={classes.error}>{errorMessage}</p>}
        </div>
      )}
    </>
  );
}

export default CommentList;
