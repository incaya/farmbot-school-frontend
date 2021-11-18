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
import {
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import { fetchAll, selectChallengeList } from "./challengeSlice";
import { selectUserRole } from "../user/userSlice";

export default function LearnerChallengesDashboard() {
  const challengesList = useSelector(selectChallengeList);
  const userRole = useSelector(selectUserRole);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAll());
  }, []);
  return (
    <>
      <Paper className="info-block">
        {userRole !== "Administrateur" && (
          <>
            <h3>Au travail !</h3>
            <p>
              Cliquez sur un défi actif pour commencer à créer la séquence
              correspondante.
            </p>
            <p>
              Une fois terminée, vous pourrez l'envoyer à l'enseignant&middot;e.
            </p>
          </>
        )}
        {userRole === "Administrateur" && (
          <>
            <h3>Bac à sable</h3>
            <p>Cette zone est plutôt réservée aux apprenants, mais en tant qu'enseignant vous pouvez l'utiliser pour tester vos propres séquences.</p>
          </>
        )}
      </Paper>
      <div className="page-block-center">
        <h2>Défis</h2>
        <List
          component="nav"
          aria-label="primary"
          subheader={
            <ListSubheader component="h3" id="list-subheader">
              Défis en cours
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
                to={`/sequences/edit/${
                  c.user_seq ? c.user_seq + "/" : ""
                }?challenge-id=${c.id}`}
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
              Défis terminés
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
