import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  Chip,
} from "@material-ui/core";
import {
  PersonAdd as PersonAddIcon,
  AccountCircle as AccountCircleIcon,
} from "@material-ui/icons";
import { fetchAll, selectLearnerList } from "./learnerSlice";

export default function Learners() {
  const learnersList = useSelector(selectLearnerList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAll());
  }, []);
  return (
    <div className="page-block-center">
      <h2>Apprenants</h2>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/learners/create"
      >
        <PersonAddIcon />
      </Button>
      <List
        component="nav"
        aria-label="primary"
        subheader={
          <ListSubheader component="h3" id="list-subheader">
            Liste des apprenants
          </ListSubheader>
        }
      >
        {learnersList.map((l) => (
          <ListItem
            button
            key={l.id}
            component={Link}
            to={`/learners/view/${l.id}`}
          >
            <ListItemText>
              <Chip
                icon={<AccountCircleIcon />}
                label={l.pseudo}
                color={l.role === "Administrateur" ? "secondary" : "primary"}
              />{" "}
              {l.name} ({l.email})
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
