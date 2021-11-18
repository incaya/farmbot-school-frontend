import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  Chip,
} from "@material-ui/core";
import {
  Person as UserIcon,
} from "@material-ui/icons";
import { fetch, selectChallengeFocus } from "./challengeSlice";
import { selectUsergroupFocus } from "../usergroup/usergroupSlice";

import BuildIcon from "@material-ui/icons/Build";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  topBackLink: {
    fontSize: "0.7em",
    color: "#444444",
  },
}));

export default function ChallengeView() {
  let routeParams = useParams();
  const challengeId = routeParams.challengeId;
  const challenge = useSelector(selectChallengeFocus);
  const usergroup = useSelector(selectUsergroupFocus);
  const dispatch = useDispatch();
  const classes = useStyles();
  useEffect(() => {
    const fetchChallenge = async () => {
      await dispatch(fetch(challengeId));
    };
    fetchChallenge();
  }, []);
  return (
    <div className="page-block-center">
      <Link className={classes.topBackLink} to={`/usergroups/view/${usergroup.id}`}>
        &lt; {usergroup.name}
      </Link>
      <h2>
        <BuildIcon /> {challenge.title}
      </h2>
      <p>{challenge.description}</p>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/challenges/edit/${challengeId}`}
      >
        Modifier ce défi
      </Button>
      <h3>Séquences associées</h3>
      <List
        component="nav"
        aria-label="primary"
        subheader={
          <ListSubheader component="h3" id="list-subheader">
            à valider
          </ListSubheader>
        }
      >
        {challenge.sequences &&
          challenge.sequences
            .filter((s) => s.status.code === "TO_PROCESS")
            .map((s) => (
              <ListItem
                button
                key={s.id}
                component={Link}
                to={`/sequences/edit/${s.id}`}
              >
                <ListItemText>
                  <Chip
                    icon={<UserIcon />}
                    label={s.user.name}
                    color="secondary"
                  />{" "}
                </ListItemText>
              </ListItem>
            ))}
      </List>
      <List
        component="nav"
        aria-label="primary"
        subheader={
          <ListSubheader component="h3" id="list-subheader">
            en cours de création
          </ListSubheader>
        }
      >
        {challenge.sequences &&
          challenge.sequences
            .filter((s) => s.status.code === "WIP")
            .map((s) => (
              <ListItem
                button
                key={s.id}
                component={Link}
                to={`/sequences/edit/${s.id}`}
              >
                <ListItemText>
                  <Chip
                    icon={<UserIcon />}
                    label={s.user.name}
                    color="secondary"
                  />{" "}
                </ListItemText>
              </ListItem>
            ))}
        {challenge.sequences && challenge.sequences.length === 0 && (
          <p>Aucune séquence</p>
        )}
      </List>
      <List
        component="nav"
        aria-label="primary"
        subheader={
          <ListSubheader component="h3" id="list-subheader">
            validées
          </ListSubheader>
        }
      >
        {challenge.sequences &&
          challenge.sequences
            .filter((s) => s.status.code === "PROCESS_WIP")
            .map((s) => (
              <ListItem
                button
                key={s.id}
                component={Link}
                to={`/sequences/edit/${s.id}`}
              >
                <ListItemText>
                  <Chip
                    icon={<UserIcon />}
                    label={s.user.name}
                    color="secondary"
                  />{" "}
                </ListItemText>
              </ListItem>
            ))}
        {challenge.sequences && challenge.sequences.length === 0 && (
          <p>Aucune séquence</p>
        )}
      </List>
    </div>
  );
}
