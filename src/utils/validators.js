export const hasErrors = (validations) => {
    let errors = [];
    for (var i = 0; i < validations.length; i++) {
        var error = validations[i][2](validations[i][1], validations[i][0]);
        if ("undefined" !== typeof error) {
            errors.push(error);
        }
    }
    return (errors.length > 0) ? errors : undefined;
}

export const required = (value, field = '') =>
  value || typeof value === "number" ? undefined : `Le champ ${field} est obligatoire`;
export const maxNbCaracteres = (value) =>
  value.length > 40
    ? "Votre texte ne doit pas dépasser 40 caractères"
    : undefined;
export const requiredBool = (value) =>
  typeof value !== "undefined" ? undefined : "Ce champ est obligatoire";
export const requiredLength = (value) =>
  value.length === 0 ? "Ce champ est obligatoire" : undefined;
export const maxLength = (max) => (value) =>
  value && value.length > max ? `${max} car. maximum` : undefined;
export const minLength = (min) => (value) =>
  value && value.length < min ? `${min} car. minimum` : undefined;
export const number = (value) =>
  value && isNaN(Number(value)) ? "Must be a number" : undefined;
export const minValue = (min) => (value) =>
  value && value < min ? `Must be at least ${min}` : undefined;
// code postal (5 chiffres)
export const postalCode = (value, nullAccepted) => {
  if (nullAccepted && null === value) {
    return undefined;
  }
  return value.length === 5
    ? undefined
    : "Le code postal indiqué n'est pas au bon format";
};
// année de naissance (4 chiffres)
export const birthDate = (value, nullAccepted = false) => {
  if (nullAccepted && null === value) {
    return undefined;
  }
  return value.toString().length === 4
    ? undefined
    : "L'année de naissance indiquée n'est pas au bon format";
};
export const email = (value) =>
  value &&
  !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    value
  )
    ? "Invalid email address"
    : undefined;
export const tooYoung = (value) =>
  value && value < 13
    ? "You do not meet the minimum age requirement!"
    : undefined;
export const alphaNumeric = (value) =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? "Only alphanumeric characters"
    : undefined;
export const phoneNumber = (value) =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? "Invalid phone number, must be 10 digits"
    : undefined;
export const nbOfDays = (value) =>
  value && /[^1-7]/.test(value)
    ? "Number of days must be an integer between 1 and 7"
    : undefined;
export const yearOfBirth = (value) =>
  value && !/^([1|2][9|0][0-9]{2})$/i.test(value)
    ? "Année de naissance invalide"
    : undefined;
export const postalCodeFr = (value) =>
  value && !/^([0-9]{5})$/i.test(value) ? "Code postal invalide" : undefined;

export const irregularEmail = (value) =>
  !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
    value
  )
    ? "Le format de l'email est invalide"
    : undefined;
export const irregularUsername = (value) => {
  return "undefined" === typeof value ||
    !/^[A-Za-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ_-]{3,30}$/i.test(
      value
    )
    ? "Votre pseudo (nom d'utilisateur) doit comporter entre 3 et 30 caractères (lettres, chiffres et tirets)"
    : undefined;
};
export const noEmail = (value) =>
  !value ? "Veuillez indiquer un email" : undefined;

export const noPassword = (value) =>
  !value ? "Veuillez indiquer un mot de passe" : undefined;

export const lessThan6 = (value) =>
  typeof value !== "undefined" && value.length < 6
    ? "Votre mot de passe doit contenir au minimum 6 caractères"
    : undefined;

export const notEqual = (value, allValues) =>
  value !== allValues.password1
    ? "Les deux mots de passe ne sont pas identiques"
    : undefined;

export const rgpd = (value) =>
  !value ? "Vous devez accepter les CGU" : undefined;
