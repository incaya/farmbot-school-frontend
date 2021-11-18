import axios from "axios";

export const userAPI = {
  jwt: null,
  setJwt: function (token) {
    this.jwt = token;
  },
  login: (userEmail, userPassword) => {
    return axios
      .post(process.env.REACT_APP_API_URL + "login", {
        email: userEmail,
        password: userPassword,
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
