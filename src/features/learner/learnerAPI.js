import axios from "axios";

export function learnerAPI() {
  this.jwt = null;
  this.setJwt = function (token) {
    this.jwt = token;
  };
  this.fetchAll = () => {
    const instance = this;
    return axios
      .get(process.env.REACT_APP_API_URL + "users", {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.fetch = (learnerId) => {
    const instance = this;
    return axios
      .get(process.env.REACT_APP_API_URL + "users/" + learnerId, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.create = (payload) => {
    const instance = this;
    return axios
      .post(process.env.REACT_APP_API_URL + "users", payload, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.update = (payload) => {
    const instance = this;
    const learnerId = payload.learnerId;
    return axios
      .put(process.env.REACT_APP_API_URL + "users/" + learnerId, payload, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
}
