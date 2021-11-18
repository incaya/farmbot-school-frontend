import React from "react";
import { useSelector } from "react-redux";
import { Paper } from "@material-ui/core";
import farmbotNormandie from "./img/farmbot-normandie.png";

import { selectUserToken, selectUserRole } from "./features/user/userSlice";

export default function Home() {
  let loggedIn = useSelector(selectUserToken);
  let userRole = useSelector(selectUserRole);
  return (
    <>
      <Paper className="info-block">
        {loggedIn && userRole !== "Administrateur" && (
          <>
            <h3>Bienvenue !</h3>
            <p>Cliquez sur "Mes défis" pour créer les séquences demandées.</p>
            <p>
              Une fois le travail terminé, vous pourrez les envoyer à
              l'enseignant&middot;e.
            </p>
          </>
        )}
        {loggedIn && userRole === "Administrateur" && (
          <>
            <h3>Bienvenue !</h3>
            <p>
              Gérez vos défis et consultez les réponses des apprenants en
              cliquant sur "Défis".
            </p>
          </>
        )}
        {!loggedIn && (
          <>
            <h3>
              Bienvenue sur l'application
              <br />
              multi-utilisateurs
            </h3>
            <p>Cliquez sur "Connexion" pour accéder à votre compte.</p>
          </>
        )}
      </Paper>
      <div className="page-block-center">
        <div className="home-info">
          <h2>
            Un projet d'expérimentation
            <br /> de la communauté Farmbot Normandie
          </h2>
          <p>
            <img src={farmbotNormandie} alt="farmbot normandie" />
          </p>
          <p>
            FarmBot Normandie est un projet pédagogique soutenu par l'Europe
            (FEDER), la <a href="https://www.normandie.fr/">Région Normandie</a>{" "}
            et porté par la{" "}
            <a href="https://normandie.chambres-agriculture.fr/">
              Chambre régionale d'agriculture de Normandie
            </a>{" "}
            et <a href="http://www.ledome.info/">le Dôme</a>.
          </p>
          <p>
            N'hésitez pas à consulter{" "}
            <a href="https://www.farmbot-school.fr">
              la documentation du projet
            </a>{" "}
            !
          </p>
        </div>
      </div>
    </>
  );
}
