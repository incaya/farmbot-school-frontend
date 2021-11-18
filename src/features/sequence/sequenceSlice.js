import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { sequenceAPI } from "./sequenceAPI";
import { formatActionsToDisplay } from "./actions";

export const fetch = createAsyncThunk(
  "sequence/fetch",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new sequenceAPI();
    api.setJwt(jwt);
    const response = await api.fetch(payload.sequenceId);
    return response.data;
  }
);

export const create = createAsyncThunk(
  "sequence/create",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new sequenceAPI();
    api.setJwt(jwt);
    const response = await api.create(payload);
    return response.data;
  }
);

export const update = createAsyncThunk(
  "sequence/update",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new sequenceAPI();
    api.setJwt(jwt);
    const response = await api.update(payload);
    return response.data;
  }
);

export const sendToTeacher = createAsyncThunk(
  "sequence/sendToTeacher",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new sequenceAPI();
    api.setJwt(jwt);
    const response = await api.sendToTeacher(payload);
    return response.data;
  }
);
export const sendToUser = createAsyncThunk(
  "sequence/sendToUser",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new sequenceAPI();
    api.setJwt(jwt);
    const response = await api.sendToUser(payload);
    return response.data;
  }
);
export const addComment = createAsyncThunk(
  "sequence/addComment",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new sequenceAPI();
    api.setJwt(jwt);
    const response = await api.addComment(payload);
    return response.data;
  }
);
export const sendToFarmbot = createAsyncThunk(
  "sequence/sendToFarmbot",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const jwt = state.user.token;
    let api = new sequenceAPI();
    api.setJwt(jwt);
    const response = await api.sendToFarmbot(payload);
    return response.data;
  }
);

const initialActiveState = {
  id: null,
  userId: null,
  userName: null,
  challengeId: null,
  saved: "modified",
  status: null,
  actions: [],
  simulate: [],
};

export const sequenceSlice = createSlice({
  name: "sequence",
  initialState: {
    loading: "idle",
    errorMessage: null,
    commentErrorMessage: null,
    commentLoading: "idle",
    commentsLoading: "idle",
    toSnack: null,
    active: initialActiveState,
  },
  reducers: {
    resetActive: (state, action) => {
      state.active = initialActiveState;
    },
    resetActions: (state, action) => {
      state.active.actions = [];
    },
    updateActive: (state, action) => {
      state.active.actions = action.payload.sequence;
      state.active.saved = "modified";
    },
    updateActionParam: (state, action) => {
      const currentState = current(state).active;
      const { itemId, paramName, paramValue } = action.payload;
      for (var i = 0; i < currentState.actions.length; i++) {
        if (currentState.actions[i].id === itemId) {
          for (var j = 0; j < currentState.actions[i].params.length; j++) {
            for (
              var k = 0;
              k < currentState.actions[i].params[j].fields.length;
              k++
            ) {
              if (
                currentState.actions[i].params[j].fields[k].name === paramName
              ) {
                state.active.actions[i].params[j].fields[k].value = paramValue;
                state.active.actions[i].param[paramName] = paramValue;
                state.active.saved = "modified";
                break;
              }
            }
          }
        }
      }
    },
    clearSnack: (state, action) => {
      state.toSnack = null;
    },
    loadSimulation: (state, action) => {
      const { actions } = action.payload;
      state.active.simulate = actions;
    },
    clearSimulation: (state, action) => {
       state.active.simulate = [];
    },
  },
  extraReducers: {
    [fetch.pending]: (state, action) => {
      state.loading = "pending";
    },
    [fetch.fulfilled]: (state, action) => {
      state.active.actions = formatActionsToDisplay(action.payload.actions);
      state.active.id = action.payload.id;
      state.active.userId = action.payload["user_id"];
      state.active.userName = action.payload["user"].name;
      state.active.challengeId = action.payload.challenge.id;
      state.active.challengeTitle = action.payload.challenge.title;
      state.active.challengeDescription = action.payload.challenge.description;
      state.loading = "idle";
      state.active.saved = "modified";
      state.active.status = action.payload.status;
      state.active.comments = action.payload.comments;
    },
    [create.pending]: (state, action) => {
      state.loading = "pending";
    },
    [create.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = null;
      state.active.id = action.payload.id;
      state.active.userId = action.payload["user_id"];
      state.active.challengeId = action.payload["challenge_id"];
      state.active.saved = "saved";
      state.active.status = action.payload.status;
      state.toSnack = { message: "Séquence créée", type: "success" };
    },
    [create.rejected]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = "Impossible de créer cette séquence";
    },
    [update.pending]: (state, action) => {
      state.loading = "pending";
    },
    [update.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = null;
      state.active.saved = "saved";
      state.toSnack = { message: "Séquence sauvegardée", type: "success" };
    },
    [update.rejected]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = "Impossible de modifier cette séquence";
    },
    [sendToTeacher.pending]: (state, action) => {
      state.loading = "pending";
    },
    [sendToTeacher.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = null;
      state.active.status = action.payload.status;
      state.toSnack = {
        message: "Séquence envoyée à l'enseignant.e",
        type: "success",
      };
    },
    [sendToTeacher.rejected]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = "Impossible d'envoyer cette séquence à l'enseignant";
    },
    [sendToUser.pending]: (state, action) => {
      state.loading = "pending";
    },
    [sendToUser.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = null;
      state.active.status = action.payload.status;
      state.toSnack = {
        message: "Séquence renvoyée à l'apprenant.e",
        type: "success",
      };
    },
    [sendToUser.rejected]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = "Impossible de redonner la main à l'utilisateur";
    },
    [sendToFarmbot.pending]: (state, action) => {
      state.loading = "pending";
    },
    [sendToFarmbot.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = null;
      state.toSnack = {
        message: "Séquence envoyée au Farmbot",
        type: "success",
      };
    },
    [sendToFarmbot.rejected]: (state, action) => {
      state.loading = "idle";
      state.errorMessage = "Impossible d'envoyer cette séquence au Farmbot";
      state.toSnack = {
        message: "Impossible d'envoyer cette séquence au Farmbot",
        type: "error",
      };
    },
    [addComment.pending]: (state, action) => {
      state.commentLoading = "pending";
    },
    [addComment.fulfilled]: (state, action) => {
      state.commentLoading = "idle";
      state.errorMessage = null;
      state.toSnack = { message: "Commentaire ajouté", type: "success" };
      state.active.comments = action.payload;
    },
    [addComment.rejected]: (state, action) => {
      state.commentLoading = "idle";
      state.errorMessage = "Impossible d'ajouter ce commentaire";
      state.toSnack = {
        message: "Impossible d'ajouter ce commentaire",
        type: "error",
      };
    },
  },
});

export const {
  resetActive,
  resetActions,
  updateActive,
  updateActionParam,
  clearSnack,
  loadSimulation,
  clearSimulation
} = sequenceSlice.actions;

// Selectors
export const selectActiveSequence = (state) => state.sequence.active;
export const selectSimulationSequence = (state) => state.sequence.active.simulate;
export const selectSequenceLoading = (state) => state.sequence.loading;
export const selectSequenceUserName = (state) => state.sequence.active.userName;
export const selectToSnack = (state) => state.sequence.toSnack;
export const selectCommentLoading = (state) => state.sequence.commentLoading;
export const selectCommentsLoading = (state) => state.sequence.commentsLoading;
export const selectCommentErrorMessage = (state) =>
  state.sequence.commentErrorMessage;

export default sequenceSlice.reducer;
