import axios from "axios";

export function challengeAPI() {
  this.jwt = null;
  this.setJwt = function (token) {
    this.jwt = token;
  };
  this.fetchAll = () => {
    const instance = this;
    return axios
      .get(process.env.REACT_APP_API_URL + "challenges", {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.fetch = (challengeId) => {
    const instance = this;
    return axios
      .get(process.env.REACT_APP_API_URL + "challenges/" + challengeId, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.create = (payload) => {
    const instance = this;
    return axios
      .post(process.env.REACT_APP_API_URL + "challenges", payload, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.update = (payload) => {
    const instance = this;
    const challengeId = payload.challengeId;
    return axios
      .put(
        process.env.REACT_APP_API_URL + "challenges/" + challengeId,
        payload,
        { headers: { Authorization: `Bearer ${instance.jwt}` } }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
}
