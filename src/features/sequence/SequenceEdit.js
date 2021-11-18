import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SequenceEditor from "./SequenceEditor";
import {
  fetch,
  create,
  update,
  resetActive,
  selectActiveSequence,
  sendToTeacher,
  sendToUser,
  sendToFarmbot,
} from "./sequenceSlice";
import {
  fetch as fetchChallenge,
  selectChallengeFocus,
} from "../challenge/challengeSlice";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SequenceEdit() {
  let query = useQuery();
  const queryParams = useParams();
  const sequenceId = queryParams.sequenceId;
  const activeSequence = useSelector(selectActiveSequence);
  const challengeFocus = useSelector(selectChallengeFocus);
  const challengeId = query.get("challenge-id");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSequence = async () => {
      await dispatch(fetch({ sequenceId }));
    };
    const resetSequence = async () => {
      await dispatch(resetActive());
    };
    if (sequenceId) {
      fetchSequence();
      if (challengeId) {
        dispatch(fetchChallenge(challengeId));
      }
    } else {
      resetSequence();
      if (challengeId) {
        dispatch(fetchChallenge(challengeId));
      }
    }
  }, []);

  const onSave = async () => {
    const payload = {
      actions: [],
      challenge_id: challengeFocus.id,
    };
    for (var i = 0; i < activeSequence.actions.length; i++) {
      const params = activeSequence.actions[i].params;
      let param = {};
      for (var j = 0; j < params.length; j++) {
        for (var k = 0; k < params[j].fields.length; k++) {
          param[params[j].fields[k].name] =
            params[j].fields[k].type === "int"
              ? parseInt(params[j].fields[k].value, 10)
              : params[j].fields[k].value;
        }
      }
      payload.actions.push({
        param,
        position: i,
        type: activeSequence.actions[i].type,
      });
    }
    if (activeSequence.id) {
      await dispatch(
        update({
          ...payload,
          id: activeSequence.id,
          user_id: activeSequence.userId,
        })
      );
    } else {
      await dispatch(create(payload));
    }
  };

  const onSendToTeacher = async () => {
    if (activeSequence.id) {
      await dispatch(sendToTeacher({ id: activeSequence.id }));
    }
  };

  const onSendToUser = async () => {
    if (activeSequence.id) {
      await dispatch(sendToUser({ id: activeSequence.id }));
    }
  };

  const onSendToFarmbot = async () => {
    if (activeSequence.id) {
      await dispatch(sendToFarmbot({ id: activeSequence.id }));
    }
  };

  return (
    <SequenceEditor
      challengeId={challengeId}
      sequenceId={sequenceId}
      onSave={onSave}
      onSendToTeacher={onSendToTeacher}
      onSendToUser={onSendToUser}
      onSendToFarmbot={onSendToFarmbot}
    />
  );
}

export default SequenceEdit;
