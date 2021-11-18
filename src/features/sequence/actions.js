import { v4 as uuid } from "uuid";

export const availableActions = [
  {
    type: "find_home",
    label: "Retourner à la maison",
    icon: "home",
    params: [
      {
        display: "inline-options",
        label: "",
        fields: [
          {
            name: "value",
            default: "all",
            values: [
              { label: "X", value: "x" },
              { label: "Y", value: "y" },
              { label: "Z", value: "z" },
              { label: "Tous les axes", value: "all" },
            ],
          },
        ],
      },
    ],
    param: {},
  },
  {
    type: "take_photo",
    label: "Prendre une photo",
    icon: "photo",
    params: [],
    param: {},
  },
  {
    type: "move_relative",
    label: "Mouvement relatif",
    icon: "move",
    params: [
      {
        display: "inline",
        label: "Offset (mm)",
        fields: [
          { name: "x_offset", label: "X", value: "0", type: "int"},
          { name: "y_offset", label: "Y", value: "0", type: "int" },
          { name: "z_offset", label: "Z", value: "0", type: "int" },
        ],
      },
      {
        display: "inline",
        label: "Variance",
        fields: [
          { name: "x_variance", label: "X", value: "0", type: "int" },
          { name: "y_variance", label: "Y", value: "0", type: "int" },
          { name: "z_variance", label: "Z", value: "0", type: "int" },
        ],
      },
      {
        display: "inline",
        label: "Vitesse",
        fields: [
          { name: "x_speed", label: "X", value: "100", type: "int" },
          { name: "y_speed", label: "Y", value: "100", type: "int" },
          { name: "z_speed", label: "Z", value: "100", type: "int" },
        ],
      },
    ],
    param: {},
  },
  // {
  //   type: "move_absolute",
  //   label: "Mouvement absolu",
  //   icon: "moveRelative",
  //   params: [
  //     {
  //       display: "single",
  //       fields: [{ name: "x_value", label: "déplacement en X", value: "0" }],
  //     },
  //     {
  //       display: "single",
  //       fields: [{ name: "y_value", label: "déplacement en Y", value: "0" }],
  //     },
  //     {
  //       display: "single",
  //       fields: [{ name: "z_value", label: "déplacement en Z", value: "0" }],
  //     },
  //   ],
  //   param: {},
  // },
  {
    type: "move_absolute",
    label: "Mouvement absolu",
    icon: "moveRelative",
    params: [
      {
        display: "inline",
        label: "Déplacement (mm)",
        fields: [
          { name: "x_value", label: "X", value: "0", type: "int" },
          { name: "y_value", label: "Y", value: "0", type: "int" },
          { name: "z_value", label: "Z", value: process.env.REACT_APP_SIM_DEF_Z, type: "int" },
        ],
      },
      {
        display: "inline",
        label: "Offset",
        fields: [
          { name: "x_offset", label: "X", value: "0", type: "int" },
          { name: "y_offset", label: "Y", value: "0", type: "int" },
          { name: "z_offset", label: "Z", value: "0", type: "int" },
        ],
      },
      {
        display: "inline",
        label: "Variance",
        fields: [
          { name: "x_variance", label: "X", value: "0", type: "int" },
          { name: "y_variance", label: "Y", value: "0", type: "int" },
          { name: "z_variance", label: "Z", value: "0", type: "int" },
        ],
      },
      {
        display: "inline",
        label: "Vitesse",
        fields: [
          { name: "x_speed", label: "X", value: "100", type: "int" },
          { name: "y_speed", label: "Y", value: "100", type: "int" },
          { name: "z_speed", label: "Z", value: "100", type: "int" },
        ],
      },
    ],
    param: {},
  },
  {
    type: "wait",
    label: "Attendre",
    icon: "wait",
    params: [
      {
        display: "single",
        fields: [{ name: "milliseconds", label: "Millisecondes", value: "0", type: "int" }],
      },
    ],
    param: {},
  },
  {
    type: "water",
    label: "Arrosage",
    icon: "waterOn",
    params: [
      {
        display: "single",
        hidden: true,
        fields: [{ name: "type", label: "", value: "write"}],
      },
      {
        display: "inline-options",
        label: "",
        fields: [
          {
            name: "value",
            default: "",
            values: [
              { label: "Démarrer", value: "1", type: "int" },
              { label: "Arrêter", value: "0", type: "int" },
            ],
          },
        ],
      },
    ],
    param: {},
  },
  {
    type: "vacuum",
    label: "Aspiration",
    icon: "vacuumOn",
    params: [
      {
        display: "single",
        hidden: true,
        fields: [{ name: "type", label: "", value: "write"}],
      },
      {
        display: "inline-options",
        label: "",
        fields: [
          {
            name: "value",
            default: "",
            values: [
              { label: "Démarrer", value: "1", type: "int" },
              { label: "Arrêter", value: "0", type: "int" },
            ],
          },
        ],
      },
    ],
    param: {},
  },
  {
    type: "humidity",
    label: "Mesurer humidité",
    icon: "humidity",
    params: [
      {
        display: "single",
        hidden: true,
        fields: [{ name: "type", label: "", value: "read"}],
      },
      {
        display: "single",
        hidden: true,
        fields: [{ name: "value", label: "", value: "1", type: "int"}],
      }
    ],
    param: {},
  },
];

export const formatActionsToDisplay = (serverActions) => {
  if (serverActions === null || serverActions.length === 0) {
    return [];
  }
  let actions = serverActions.map((a) => {
    a.id = uuid();
    const actionParams = getActionParams(a);
    a.label = actionParams.label;
    a.params = actionParams.params;
    delete a.position;
    return a;
  });
  return actions;
};

const getActionParams = (action) => {
  let actions = availableActions.filter((a) => a.type === action.type);
  if (actions.length === 1) {
    var newAction = JSON.parse(JSON.stringify(actions[0]));
    for (var i = 0; i < newAction.params.length; i++) {
      for (var j = 0; j < newAction.params[i].fields.length; j++) {
        newAction.params[i].fields[j].value =
          action.param[newAction.params[i].fields[j].name];
      }
    }
    return newAction;
  } else {
    throw new Error("type d'action inconnu ou redondant : " + action.type);
  }
};
