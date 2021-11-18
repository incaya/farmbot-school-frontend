import axios from "axios";

export function sequenceAPI() {
  this.jwt = null;
  this.setJwt = function (token) {
    this.jwt = token;
  };
  this.fetch = (sequenceId) => {
    const instance = this;
    return axios
      .get(process.env.REACT_APP_API_URL + "sequences/" + sequenceId, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.create = (payload) => {
    const instance = this;
    return axios
      .post(process.env.REACT_APP_API_URL + "sequences", payload, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.update = (payload) => {
    const instance = this;
    const sequenceId = payload.id;
    return axios
      .put(process.env.REACT_APP_API_URL + "sequences/" + sequenceId, payload, {
        headers: { Authorization: `Bearer ${instance.jwt}` },
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  this.sendToTeacher = (payload) => {
    const instance = this;
    const sequenceId = payload.id;
    return axios
      .put(
        process.env.REACT_APP_API_URL +
          "sequences/" +
          sequenceId +
          "/to_process",
        {},
        { headers: { Authorization: `Bearer ${instance.jwt}` } }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
  this.sendToUser = (payload) => {
    const instance = this;
    const sequenceId = payload.id;
    return axios
      .put(
        process.env.REACT_APP_API_URL + "/sequences/" + sequenceId + "/to_wip",
        {},
        { headers: { Authorization: `Bearer ${instance.jwt}` } }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
  this.sendToFarmbot = (payload) => {
    const instance = this;
    const sequenceId = payload.id;
    return axios
      .put(
        process.env.REACT_APP_API_URL +
          "sequences/" +
          sequenceId +
          "/send_to_farmbot",
        {},
        { headers: { Authorization: `Bearer ${instance.jwt}` } }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
  this.addComment = (payload) => {
    const instance = this;
    const { sequenceId, comment } = payload;
    return axios
      .post(
        process.env.REACT_APP_API_URL + "sequences/" + sequenceId + "/comments",
        { comment: comment },
        { headers: { Authorization: `Bearer ${instance.jwt}` } }
      )
      .catch(function (error) {
        console.log(error);
      });
  };
}
