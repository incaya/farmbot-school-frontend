import axios from "axios";

export function usergroupAPI() {
  this.jwt = null;
  this.setJwt = function (token) {
    this.jwt = token;
  };
  this.fetchAll = () => {
    const instance = this;
    return axios
      .get(process.env.REACT_APP_API_URL + "usergroups", {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.fetch = (usergroupId) => {
    const instance = this;
    return axios
      .get(process.env.REACT_APP_API_URL + "usergroups/" + usergroupId, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.create = (payload) => {
    const instance = this;
    return axios
      .post(process.env.REACT_APP_API_URL + "usergroups", payload, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.update = (payload) => {
    const instance = this;
    const usergroupId = payload.usergroupId;
    return axios
      .put(
        process.env.REACT_APP_API_URL + "usergroups/" + usergroupId,
        payload,
        { headers: { Authorization: `Bearer ${instance.jwt}` } }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
}
