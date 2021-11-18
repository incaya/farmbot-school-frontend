import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  Divider,
  Chip,
  Paper,
} from "@material-ui/core";
import { CalendarToday as CalendarIcon } from "@material-ui/icons";
import { fetchAll, selectChallengeList } from "./challengeSlice";

export default function Challenges() {
  const challengesList = useSelector(selectChallengeList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAll());
  }, []);
  return (
    <>
      <Paper className="info-block">
      <h3>Gestion des défis</h3>
            <p>
              Créez ou modifiez des défis proposés aux apprenants.
            </p>
      </Paper>
      <div className="page-block-center">
        <h2>Défis</h2>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/challenges/create"
        >
          Créer un défi
        </Button>
        <List
          component="nav"
          aria-label="primary"
          style={{ backgroundColor: "#ffffff" }}
          subheader={
            <ListSubheader component="h3" id="list-subheader">
              Défis actifs
            </ListSubheader>
          }
        >
          {challengesList
            .filter((c) => c.active)
            .map((c) => (
              <ListItem
                button
                key={c.id}
                component={Link}
                to={`/challenges/view/${c.id}`}
              >
                <ListItemText>
                  <Chip
                    icon={<CalendarIcon />}
                    label={c.end_date}
                    color="secondary"
                  />{" "}
                  {c.title}{" "}
                </ListItemText>
              </ListItem>
            ))}
        </List>
        <Divider />
        <List
          component="nav"
          aria-label="secondary"
          subheader={
            <ListSubheader component="h3" id="list-subheader">
              Défis inactifs
            </ListSubheader>
          }
        >
          {challengesList
            .filter((c) => !c.active)
            .map((c) => (
              <ListItem button key={c.id}>
                <ListItemText>
                  <Chip icon={<CalendarIcon />} label={c.end_date} /> {c.title}
                </ListItemText>
              </ListItem>
            ))}
        </List>
      </div>
    </>
  );
}
