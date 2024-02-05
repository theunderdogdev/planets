/**
 * @typedef {Object} Planet
 * @property {number} radius
 * @property {string} name
 * @property {number} distFromSun
 * @property {number} period
 * @property {string} texturePath
 */
import {
  Group,
  TextureLoader,
  Mesh,
  SphereGeometry,
  MeshStandardMaterial,
} from "three";

export class SolarSystem {
  #planets = [];
  #solarSystem = new Group();
  #reqKeys = ["name", "radius", "distFromSun", "period", "texturePath"];
  constructor() {
    console.log(
      "%cCreating solar system object",
      "background-color: lime; color: white;"
    );
    this.txtrLoader = new TextureLoader();
    const sunGeom = new SphereGeometry(4.5, 36, 36);
    const sun = new Mesh(
      sunGeom,
      new MeshStandardMaterial({
        map: this.txtrLoader.load("./assets/sun.jpg"),
        name: "sun",
      })
    );
    this.#solarSystem.add(sun);
  }
  getPlanets() {
    // console.log(this.#solarSystem)
    return this.#solarSystem;
  }
  /**
   *
   * @param {Planet} planet
   * Add a planet to the solar system group
   */
  addPlanet(planet) {
    if (this.#reqKeys.every((prop) => planet.hasOwnProperty(prop))) {
      this.#planets.push(planet);
      // Logic to add to solar system goes here
      const sphere = new SphereGeometry(2, 36, 36);
      const newPlanet = new Mesh(
        sphere,
        new MeshStandardMaterial({
          map: this.txtrLoader.load(planet.texturePath),
          name: planet.name,
        
        })
      );
      newPlanet.castShadow = true;

      sphere.computeBoundingBox();
      newPlanet.position.set(planet.distFromSun, 0, 0);
      this.#solarSystem.add(newPlanet);
    } else {
      console.error("Requires all planet properties to be set!");
    }
  }
}
