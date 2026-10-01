// GB GAMER BROS™ — Meet the Team™ character registry
//
// Routes: #character/<id>  (optional /sporty or /streetwear selects the look)
// Every image is a single view isolated from the approved character multi-view masters
// (CHARACTER_PRODUCTION_V1 / APPROVED_CHARACTER_MASTERS) and built with tools/gbmedia.py.
// The full master sheets are never published.
//
// Sporty and Streetwear are two separate approved looks. They are never mixed, and they are
// not described as unlockable skins or in-game outfit switching.
// No bios, ages, abilities or personality facts: names, team colours and art only.

(() => {
const C = "assets/characters/";
const V = { pose: "Pose", front: "Front", threeq: "¾ view", side: "Side", back: "Back" };
const looks = (id, sporty, street) => ({
  sporty: { label: "Sporty look", views: sporty.map((v) => ({ src: `${C}${id}/sporty-${v}`, label: V[v] })) },
  streetwear: { label: "Streetwear look", views: street.map((v) => ({ src: `${C}${id}/street-${v}`, label: V[v] })) },
});

window.GB_CHARACTERS = {
  blue: {
    name: "Gamer Bro Blue™", colour: "Blue", hex: "#1f6fff", deep: "#0a2f8f",
    card: C + "blue/sporty-pose",
    looks: looks("blue", ["pose", "front", "side", "back"], ["front", "threeq", "side"]),
  },
  red: {
    name: "Gamer Bro Red™", colour: "Red", hex: "#e3262f", deep: "#7d0d14",
    card: C + "red/sporty-pose",
    looks: looks("red", ["pose", "front", "side", "back"], ["pose", "front", "side", "back"]),
  },
  purple: {
    name: "Gamer Girl Purple™", colour: "Purple", hex: "#8a2be2", deep: "#3f0f73",
    card: C + "purple/sporty-pose",
    looks: looks("purple", ["pose", "front", "side", "back"], ["pose", "front", "side", "back"]),
  },
  yellow: {
    name: "Gamer Girl Yellow™", colour: "Yellow", hex: "#f5b800", deep: "#7a5600",
    card: C + "yellow/sporty-pose",
    looks: looks("yellow", ["pose", "front", "side", "back"], ["pose", "front", "side", "back"]),
  },
};
window.GB_TEAM = ["blue", "red", "purple", "yellow"];
})();
