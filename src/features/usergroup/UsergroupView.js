import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Chip,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
} from "@material-ui/core";
import {
  AccountCircle as AccountCircleIcon,
  PersonAdd as PersonAddIcon,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  fetch,
  selectUsergroupFocus,
  selectUsergroupLearners,
  selectUsergroupChallenges,
  selectLoading,
} from "./usergroupSlice";

import GroupIcon from "@material-ui/icons/Group";
import { CalendarToday as CalendarIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  topBackLink: {
    fontSize: "0.7em",
    color: "#444444"
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function LearnerView() {
  let routeParams = useParams();
  const usergroupId = routeParams.usergroupId;
  const usergroup = useSelector(selectUsergroupFocus);
  const usergroupLearners = useSelector(selectUsergroupLearners);
  const usergroupChallenges = useSelector(selectUsergroupChallenges);
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = React.useState(0);
  const classes = useStyles();
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    const fetchUsergroup = async () => {
      await dispatch(fetch(usergroupId));
    };
    fetchUsergroup();
  }, []);

  return (
    <div className="page-block-center">
      <Link className={classes.topBackLink} to="/usergroups">
        &lt; Retour aux groupes
      </Link>
      <h2>
        <GroupIcon /> {usergroup.name}
      </h2>
      <p>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/usergroups/edit/${usergroupId}`}
        >
          Renommer ce groupe
        </Button>
      </p>
      <Paper className={classes.root}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Apprenants"></Tab>
          <Tab label="Défis" />
        </Tabs>
        <TabPanel value={tabValue} index={0} dir={theme.direction}>
          <p>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/learners/create"
            >
              <PersonAddIcon /> Ajouter un apprenant
            </Button>
          </p>
          <List
            component="nav"
            aria-label="primary"
            subheader={
              <ListSubheader component="h3" id="list-subheader">
                Liste des apprenants
              </ListSubheader>
            }
          >
            {isLoading &&
              usergroupLearners &&
              usergroupLearners.map((l) => (
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
                      color={
                        l.role === "Administrateur" ? "secondary" : "primary"
                      }
                    />{" "}
                    {l.name} ({l.email})
                  </ListItemText>
                </ListItem>
              ))}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1} dir={theme.direction}>
          <Button
            variant="contained"
            color="secondary"
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
            {isLoading &&
              usergroupChallenges &&
              usergroupChallenges
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
            {isLoading &&
              usergroupChallenges &&
              usergroupChallenges
                .filter((c) => !c.active)
                .map((c) => (
                  <ListItem
                    button
                    key={c.id}
                    component={Link}
                    to={`/challenges/view/${c.id}`}
                  >
                    <ListItemText>
                      <Chip icon={<CalendarIcon />} label={c.end_date} />{" "}
                      {c.title}
                    </ListItemText>
                  </ListItem>
                ))}
          </List>
        </TabPanel>
      </Paper>
    </div>
  );
}
