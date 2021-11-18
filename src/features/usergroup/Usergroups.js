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
  GroupAdd as GroupAddIcon,
  AccountCircle as AccountCircleIcon,
} from "@material-ui/icons";
import { fetchAll, selectUsergroupList } from "./usergroupSlice";

export default function Usergroups() {
  const usergroupsList = useSelector(selectUsergroupList);
  const usergroups = usergroupsList.slice().sort((a, b) => {
    return a.created_at > b.created_at ? -1 : 1;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAll());
  }, []);
  return (
    <div className="page-block-center">
      <h2>Groupes</h2>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/usergroups/create"
      >
        <GroupAddIcon />
      </Button>
      <List
        component="nav"
        aria-label="primary"
        subheader={
          <ListSubheader component="h3" id="list-subheader">
            Liste des groupes
          </ListSubheader>
        }
      >
        {usergroups.map((ug) => (
          <ListItem
            button
            key={ug.id}
            component={Link}
            to={`/usergroups/view/${ug.id}`}
          >
            <ListItemText>
              <Chip
                icon={<AccountCircleIcon />}
                label={ug.name}
                color="primary"
              />{" "}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
