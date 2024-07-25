const propertiesUser = {
  sprintSpeed: "",
  acceleration: "",
  finishing: "",
  positioning: "",
  shotPower: "",
  longShots: "",
  penalties: "",
  volleys: "",
  vision: "",
  crossing: "",
  freeKick: "",
  longPassing: "",
  shortPassing: "",
  curve: "",
  agility: "",
  balance: "",
  reactions: "",
  composure: "",
  ballControl: "",
  dribbling: "",
  interceptions: "",
  heading: "",
  marking: "",
  standingTackle: "",
  slidingTackle: "",
  jumping: "",
  stamina: "",
  strength: "",
  aggression: "",
};

const addProperties = (numbersProperties) => {
  numbersProperties.forEach((number, index) => {
    const property = Object.keys(propertiesUser)[index];
    propertiesUser[property] = number;
  });
  return propertiesUser;
};

module.exports = addProperties;
