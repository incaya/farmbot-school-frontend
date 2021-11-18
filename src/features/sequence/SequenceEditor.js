import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import {
  updateActive,
  selectActiveSequence,
  selectSequenceLoading,
  selectSequenceUserName,
  updateActionParam,
} from "./sequenceSlice";
import Simulator from "./Simulator";
import AddComment from "./AddComment";
import CommentList from "./CommentList";
import { selectChallengeFocus } from "../challenge/challengeSlice";
import { selectUserRole } from "../user/userSlice";
import { availableActions } from "./actions";

import DeleteIcon from "@material-ui/icons/Delete";
import HomeIcon from "@material-ui/icons/Home";
import MoveIcon from "@material-ui/icons/ArrowForward";
import MoveRelativeIcon from "@material-ui/icons/SettingsEthernet";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import SaveIcon from "@material-ui/icons/Save";
import SendIcon from "@material-ui/icons/Send";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import GrainIcon from "@material-ui/icons/Grain";
import AirplayIcon from "@material-ui/icons/Airplay";
import InvertColorsIcon from "@material-ui/icons/InvertColors";

import { Button, Paper } from "@material-ui/core";

import "./SequenceEditor.css";

const commandIcons = {
  home: HomeIcon,
  move: MoveIcon,
  moveRelative: MoveRelativeIcon,
  photo: PhotoCameraIcon,
  wait: HourglassEmptyIcon,
  waterOn: GrainIcon,
  vacuumOn: AirplayIcon,
  humidity: InvertColorsIcon,
};

// This method is needed for rendering clones of draggables
const getRenderItem = (items, className) => (provided, snapshot, rubric) => {
  const item = items[rubric.source.index];
  return (
    <React.Fragment>
      <li
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        key={provided}
        style={{
          ...provided.draggableProps.style,
          listStyleType: "none",
          backgroundColor: "lightgray",
        }}
        className={snapshot.isDragging ? "dragging" : ""}
      >
        {item.label}
      </li>
    </React.Fragment>
  );
};

function Copyable(props) {
  return (
    <Droppable
      renderClone={getRenderItem(props.items, props.className)}
      droppableId={props.droppableId}
      isDropDisabled={true}
    >
      {(provided, snapshot) => (
        <ul ref={provided.innerRef} className={props.className}>
          {props.items.map((item, index) => {
            const CommandIcon = commandIcons[item.icon];
            const shouldRenderClone = item.id === snapshot.draggingFromThisWith;
            return (
              <React.Fragment key={item.id}>
                {shouldRenderClone ? (
                  <li className="react-beautiful-dnd-copy">{item.label}</li>
                ) : (
                  <Draggable draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <React.Fragment>
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "dragging" : ""}
                        >
                          <CommandIcon /> <span>{item.label}</span>
                        </li>
                      </React.Fragment>
                    )}
                  </Draggable>
                )}
              </React.Fragment>
            );
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
}

function Toolbox(props) {
  return (
    <Copyable droppableId="TOOLBOX" className="tools" items={props.items} />
  );
}

function Sequence(props) {
  const { simulatedAction } = props;
  const dispatch = useDispatch();
  return (
    <Droppable droppableId="SEQUENCE">
      {(provided, snapshot) => (
        <ul ref={provided.innerRef} className="sequence">
          {props.items.map((item, index) => {
            return (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                    className={simulatedAction === index ? "simulated-action" : null}
                  >
                    <div className="command-actions">
                      <span className="command-actions-icons">
                        <DeleteIcon
                          onClick={() => props.onRemoveCommand(index)}
                        />
                      </span>
                    </div>
                    <h4>{item.label}</h4>
                    {item.params.length > 0 &&
                      item.params.map((p, id) => {
                        let block = [];
                        if (p.display === "inline") {
                          block.push(
                            <label
                              htmlFor={`param_${item.id}_${id}`}
                              className="short-label"
                              key={`${item.id}_${id}_label`}
                            >
                              {p.label}
                            </label>
                          );
                          block.push(
                            <span key={`${item.id}_${id}_fields`}>
                              {p.fields.map((f, id2) => (
                                <span key={id2}>
                                  <label
                                    htmlFor={`${item.id}_param_${f.name}_${id2}`}
                                    className="sublabel"
                                  >
                                    {f.label}
                                  </label>
                                  <input
                                    id={`${item.id}_param_${f.name}_${id2}`}
                                    type="text"
                                    defaultValue={f.value}
                                    className="short-input"
                                    onChange={(e) =>
                                      dispatch(
                                        updateActionParam({
                                          itemId: item.id,
                                          paramName: f.name,
                                          paramValue: e.target.value,
                                        })
                                      )
                                    }
                                  />
                                </span>
                              ))}
                            </span>
                          );
                        } else if (p.display === "single") {
                          let f = p.fields[0];
                          block.push(
                            <p key={id}>
                              <label
                                htmlFor={`param_${item.id}_${f.name}`}
                                className="long-label"
                              >
                                {f.label}
                              </label>
                              <input
                                id={`param_${item.id}_${f.name}`}
                                type="text"
                                defaultValue={f.value}
                                onChange={(e) => {
                                  dispatch(
                                    updateActionParam({
                                      itemId: item.id,
                                      paramName: f.name,
                                      paramValue: e.target.value,
                                    })
                                  );
                                }}
                              />
                            </p>
                          );
                        } else if (p.display === "inline-options") {
                          let f = p.fields[0];
                          block.push(
                            <p key={`${id}_${item.id}_${f.name}_fields`}>
                              <label
                                className="short-label"
                                key={`${item.id}_${id}_label`}
                              >
                                {p.label}
                              </label>

                              {f.values.map((v, id2) => (
                                <React.Fragment key={id2}>
                                  <input
                                    type="radio"
                                    id={`param_${item.id}_${id2}`}
                                    name={`${item.id}_${f.name}`}
                                    checked={f.value === v.value}
                                    onChange={(e) => {
                                      dispatch(
                                        updateActionParam({
                                          itemId: item.id,
                                          paramName: f.name,
                                          paramValue: v.value,
                                        })
                                      );
                                    }}
                                  />
                                  <label htmlFor={`param_${item.id}_${id2}`}>
                                    {v.label}
                                  </label>
                                </React.Fragment>
                              ))}
                            </p>
                          );
                        }
                        return (
                          <div
                            key={`${item.id}_${id}_block`}
                            className={
                              "inputs-block" + (p.hidden ? "-hidden" : "")
                            }
                          >
                            {block}
                          </div>
                        );
                      })}
                  </li>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
}

const COMMANDS = availableActions.map((a) => {
  a.id = uuid();
  return a;
});

const reorder = (list, startIndex, endIndex) => {
  list = Object.assign([], list);
  const [removed] = list.splice(startIndex, 1);
  list.splice(endIndex, 0, removed);
  return list;
};

const removeItem = (list, itemIndex) => {
  list = Object.assign([], list);
  list.splice(itemIndex, 1);
  return list;
};

const copy = (source, destination, droppableSource, droppableDestination) => {
  const item = source[droppableSource.index];
  destination = Object.assign([], destination);
  destination.splice(droppableDestination.index, 0, { ...item, id: uuid() });
  return destination;
};

function SequenceEditor({
  challengeId,
  sequenceId,
  onSave,
  onSendToTeacher,
  onSendToUser,
  onSendToFarmbot,
}) {
  const [sequenceItems, setSequenceItems] = React.useState([]);
  const [simulatedAction, setSimulatedAction] = React.useState(null);
  const dispatch = useDispatch();
  const activeSequence = useSelector(selectActiveSequence);
  const challengeFocus = useSelector(selectChallengeFocus);
  const loadingStatus = useSelector(selectSequenceLoading);
  const currentUserRole = useSelector(selectUserRole);
  const currentSequenceUserName = useSelector(selectSequenceUserName);
  useEffect(() => {
    const updateStateActions = async () => {
      await setSequenceItems(activeSequence.actions);
    };
    updateStateActions();
  }, [activeSequence]);

  const onRemoveCommand = async (itemIndex) => {
    const newSequenceItems = removeItem(sequenceItems, itemIndex);
    await dispatch(updateActive({ sequence: [...newSequenceItems] }));
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    var newSequenceItems;
    switch (source.droppableId) {
      case destination.droppableId:
        newSequenceItems = reorder(
          sequenceItems,
          source.index,
          destination.index
        );
        await dispatch(updateActive({ sequence: [...newSequenceItems] }));
        break;
      case "TOOLBOX":
        newSequenceItems = copy(COMMANDS, sequenceItems, source, destination);
        await dispatch(updateActive({ sequence: [...newSequenceItems] }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="column-wrapper">
      <Paper className="challenge-infos" component="aside">
        <h2>Défi : "{challengeFocus.title}"</h2>
        <p>{challengeFocus.description}</p>
        {(currentUserRole === "Administrateur" ||
          currentUserRole === "Enseignant") &&
          activeSequence.id &&
          activeSequence.status && (
            <p>
              Réponse de{" "}
              <span className="sequence-answerby">
                {currentSequenceUserName}
              </span>{" "}
            </p>
          )}
      </Paper>

      <div id="sequence-editor">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="toolbox">
            <h3>Commandes</h3>
            <Toolbox items={COMMANDS} />
          </div>
          <div className="sequence">
            <h3>Séquence</h3>
            {loadingStatus === "idle" && (
              <Sequence
                items={activeSequence.actions}
                onRemoveCommand={onRemoveCommand}
                simulatedAction={simulatedAction}
              />
            )}
            {loadingStatus === "pending" && <p>Chargement...</p>}
          </div>
        </DragDropContext>
        <Simulator setSimulatedAction={setSimulatedAction} />
        <div className="toolbox">
          {(!activeSequence.status ||
            (activeSequence.status && activeSequence.status.code === "WIP") ||
            currentUserRole === "Administrateur") && (
            <p>
              <Button
                variant="contained"
                color={activeSequence.saved === "saved" ? "default" : "primary"}
                size="small"
                startIcon={<SaveIcon />}
                onClick={onSave}
                className="sequence-action"
              >
                {activeSequence.saved === "saved"
                  ? "Enregistré"
                  : "Enregistrer *"}
              </Button>
            </p>
          )}
          {currentUserRole !== "Administrateur" &&
            activeSequence.id &&
            activeSequence.status &&
            activeSequence.status.code !== "WIP" && (
              <p>
                Séquence en cours de validation
                <br />
                par l'enseignant.
              </p>
            )}
          {currentUserRole !== "Administrateur" &&
            activeSequence.id &&
            activeSequence.status &&
            activeSequence.status.code === "WIP" && (
              <p>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<SendIcon />}
                  onClick={onSendToTeacher}
                  className="sequence-action"
                >
                  Envoyer à l'enseignant
                </Button>
              </p>
            )}
          {activeSequence.id &&
            activeSequence.status &&
            activeSequence.status.code === "TO_PROCESS" &&
            (currentUserRole === "Administrateur" ||
              currentUserRole === "Enseignant") && (
              <p>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<SendIcon />}
                  onClick={onSendToUser}
                  className="sequence-action"
                >
                  Redonner la main à l'apprenant
                </Button>
              </p>
            )}
          {activeSequence.id &&
            activeSequence.status &&
            (activeSequence.status.code === "PROCESS_WIP" ||
              activeSequence.status.code === "TO_PROCESS") &&
            (currentUserRole === "Administrateur" ||
              currentUserRole === "Enseignant") && (
              <p>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<SendIcon />}
                  onClick={onSendToFarmbot}
                  className="sequence-action"
                >
                  Envoyer au Farmbot
                </Button>
              </p>
            )}
          {activeSequence.id && activeSequence.status && (
            <>
              <AddComment sequenceId={activeSequence.id} />
              <CommentList comments={activeSequence.comments} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SequenceEditor;
