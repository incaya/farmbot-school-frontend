import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  Redirect,
} from "react-router-dom";
import { Login } from "./features/user/Login";
import Home from "./Home";
import Account from "./Account";
import Teacher from "./Teacher";
import Challenges from "./features/challenge/Challenges";
import LearnerChallengesDashboard from "./features/challenge/LearnerChallengesDashboard";
import ChallengeCreate from "./features/challenge/ChallengeCreate";
import ChallengeEdit from "./features/challenge/ChallengeEdit";
import ChallengeView from "./features/challenge/ChallengeView";
import Learners from "./features/learner/Learners";
import LearnersCreate from "./features/learner/LearnerCreate";
import LearnersEdit from "./features/learner/LearnerEdit";
import LearnersView from "./features/learner/LearnerView";
import Usergroups from "./features/usergroup/Usergroups";
import UsergroupsCreate from "./features/usergroup/UsergroupCreate";
import UsergroupsEdit from "./features/usergroup/UsergroupEdit";
import UsergroupsView from "./features/usergroup/UsergroupView";
import SequenceEdit from "./features/sequence/SequenceEdit";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import {
  logout,
  tokenValid,
  selectUserRole,
  selectUserName,
} from "./features/user/userSlice";
import {
  selectToSnack as selectSequenceToSnack,
  clearSnack as clearSequenceSnack,
} from "./features/sequence/sequenceSlice";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SimpleSnackbar from "./SimpleSnackbar";

function App() {
  const [displaySnackbar, setDisplaySnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  let userHasValidToken = useSelector(tokenValid);
  let currentUserRole = useSelector(selectUserRole);
  let currentUserName = useSelector(selectUserName);
  let messagesToSnack = useSelector(selectSequenceToSnack);
  const dispatch = useDispatch();

  useEffect(() => {
    if (messagesToSnack) {
      setDisplaySnackbar(true);
      setSnackbarMessage(messagesToSnack.message);
      setSnackbarType(messagesToSnack.type);
      clearSnackbar();
    } else {
      setDisplaySnackbar(false);
      setSnackbarMessage("");
      setSnackbarType("");
    }
  }, [messagesToSnack]);

  const clearSnackbar = async () => {
    await new Promise((res) => setTimeout(res, 5000));
    dispatch(clearSequenceSnack());
  };
  const onLogout = async () => {
    await dispatch(logout());
  };

  return (
    <Router>
      <div className="App">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <header>
            <div id="top-icons">
              {userHasValidToken && (
                <>
                  <span className="visible-username">{currentUserName}</span> [{" "}
                  <span className="visible-userrole">
                    {currentUserRole === "Administrateur" ? (
                      <abbr title="Enseignant&middot;e">E</abbr>
                    ) : (
                      <abbr title="Apprenant&middot;e">A</abbr>
                    )}
                  </span>{" "}
                  ]{" "}
                  <ExitToAppIcon
                    onClick={onLogout}
                    alt="déconnexion"
                    className="logout-icon"
                  />
                </>
              )}
            </div>
            <div>
              <h1>
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "#403b33" }}
                >
                  Farmbot 🥕 <span style={{ color: "#d3643b" }}>School</span>
                </Link>
              </h1>
              <nav>
                {!userHasValidToken && (
                  <ul>
                    <li>
                      <NavLink to="/login" activeClassName="menu-selected">
                        Connexion
                      </NavLink>
                    </li>
                  </ul>
                )}
                <ul>
                  {userHasValidToken && (
                    <li>
                      <NavLink
                        to="/learner-dashboard"
                        activeClassName="menu-selected"
                      >
                        Mes défis
                      </NavLink>
                    </li>
                  )}
                  {userHasValidToken && currentUserRole === "Administrateur" && (
                    <>
                      <li>
                        <NavLink
                          to="/usergroups"
                          activeClassName="menu-selected"
                        >
                          Groupes
                        </NavLink>
                      </li>
                    </>
                  )}
                  {userHasValidToken && (
                    <li>
                      <NavLink to="/account" activeClassName="menu-selected">
                        Mon compte
                      </NavLink>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </header>
          <main>
            {/* <aside style={{ width: "25%" }}>Aside 1</aside> */}

            <div id="main-content">
              <Switch>
                <PrivateRoute path="/account">
                  <Account />
                </PrivateRoute>
                <PrivateRoute exact path="/learner-dashboard">
                  <LearnerChallengesDashboard />
                </PrivateRoute>
                <PrivateRoute path="/sequences/edit/:sequenceId?">
                  <SequenceEdit />
                </PrivateRoute>
                <PrivateRoute path="/teacher">
                  <Teacher />
                </PrivateRoute>
                <PrivateTeacherRoute exact path="/challenges">
                  <Challenges />
                </PrivateTeacherRoute>
                <PrivateRoute path="/challenges/create">
                  <ChallengeCreate />
                </PrivateRoute>
                <PrivateRoute path="/challenges/view/:challengeId">
                  <ChallengeView />
                </PrivateRoute>
                <PrivateRoute path="/challenges/edit/:challengeId">
                  <ChallengeEdit />
                </PrivateRoute>
                <PrivateRoute exact path="/learners">
                  <Learners />
                </PrivateRoute>
                <PrivateRoute path="/learners/create">
                  <LearnersCreate />
                </PrivateRoute>
                <PrivateRoute path="/learners/view/:learnerId">
                  <LearnersView />
                </PrivateRoute>
                <PrivateRoute path="/learners/edit/:learnerId">
                  <LearnersEdit />
                </PrivateRoute>
                <PrivateRoute exact path="/usergroups">
                  <Usergroups />
                </PrivateRoute>
                <PrivateRoute path="/usergroups/create">
                  <UsergroupsCreate />
                </PrivateRoute>
                <PrivateRoute path="/usergroups/view/:usergroupId">
                  <UsergroupsView />
                </PrivateRoute>
                <PrivateRoute path="/usergroups/edit/:usergroupId">
                  <UsergroupsEdit />
                </PrivateRoute>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/login">
                  <LoginPage />
                </Route>
                <Route path="*">
                  <NoMatch />
                </Route>
              </Switch>
            </div>
          </main>
          <SimpleSnackbar
            display={displaySnackbar}
            message={snackbarMessage}
            type={snackbarType}
          />
          <footer>
            <p>Un projet Farmbot Normandie 🤖 🌱</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;

function LoginPage() {
  return <Login />;
}
function NoMatch() {
  return <h2>Cette page n'existe pas</h2>;
}

function PrivateRoute({ children, ...rest }) {
  let userHasValidToken = useSelector(tokenValid);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        userHasValidToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function PrivateTeacherRoute({ children, ...rest }) {
  let userHasValidToken = useSelector(tokenValid);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        userHasValidToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
