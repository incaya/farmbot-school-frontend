import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button, Chip } from "@material-ui/core";
import { AccountCircle as AccountCircleIcon } from "@material-ui/icons";
import { fetch, selectLearnerFocus } from "./learnerSlice";

import { selectUsergroupFocus } from "../usergroup/usergroupSlice";

import PersonIcon from "@material-ui/icons/Person";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  topBackLink: {
    fontSize: "0.7em",
    color: "#444444",
  },
}));

export default function LearnerView() {
  let routeParams = useParams();
  const learnerId = routeParams.learnerId;
  const learner = useSelector(selectLearnerFocus);
  const usergroup = useSelector(selectUsergroupFocus);
  const dispatch = useDispatch();
  const classes = useStyles();
  useEffect(() => {
    const fetchLearner = async () => {
      await dispatch(fetch(learnerId));
    };
    fetchLearner();
  }, []);
  return (
    <div className="page-block-center">
      <Link className={classes.topBackLink} to={`/usergroups/view/${usergroup.id}`}>
        &lt; {usergroup.name}
      </Link>
      <h2>
        <PersonIcon /> {learner.pseudo}
      </h2>
      <p>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/learners/edit/${learnerId}`}
        >
          Modifier le profil de cet apprenant
        </Button>
      </p>
      <Chip
        icon={<AccountCircleIcon />}
        label={learner.pseudo}
        color="secondary"
      />{" "}
      {learner.email}
    </div>
  );
}
