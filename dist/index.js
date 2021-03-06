var pointLight,
  sun1,
  sun,
  moon,
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  pluto,
  earthOrbit,
  ring,
  desk,
  controls,
  scene,
  camera,
  renderer,
  scene;
var planetSegments = 48;
var mercuryData = constructPlanetData(
  2000 / 47.87,
  0.004,
  35,
  "mercury",
  "img/mercury.jpg",
  2.44,
  planetSegments
);
var venusData = constructPlanetData(
  2000 / 35.02,
  0.002,
  67,
  "venus",
  "img/venus.jpg",
  6.052,
  planetSegments
);
var earthData = constructPlanetData(
  2000 / 29.78,
  0.02,
  93,
  "earth",
  "img/earth.jpg",
  6.371,
  planetSegments
);
var marsData = constructPlanetData(
  2000 / 24.077,
  0.018,
  142,
  "mars",
  "img/mars.jpg",
  3.39,
  planetSegments
);
var jupiterData = constructPlanetData(
  2000 / 13.07,
  0.04,
  484,
  "jupiter",
  "img/jupiter.jpg",
  19.911,
  planetSegments
);
var saturnData = constructPlanetData(
  2000 / 9.69,
  0.038,
  689,
  "saturn",
  "img/saturn.jpg",
  18.232,
  planetSegments
);
var uranusData = constructPlanetData(
  2000 / 6.81,
  0.03,
  1290,
  "uranus",
  "img/uranus.jpg",
  15.362,
  planetSegments
);
var neptuneData = constructPlanetData(
  2000 / 5.43,
  0.032,
  1490,
  "neptune",
  "img/neptune.jpg",
  12.622,
  planetSegments
);
var plutoData = constructPlanetData(
  2000 / 4.74,
  0.008,
  1600,
  "pluto",
  "img/pluto.jpg",
  2.8,
  planetSegments
);

var moonData = constructPlanetData(
  29.5,
  0.01,
  10.1,
  "moon",
  "img/moon.jpg",
  1.5,
  planetSegments
);
var orbitData = { value: 200, runOrbit: true, runRotation: true };
var clock = new THREE.Clock();

/**
 * This eliminates the redundance of having to type property names for a planet object.
 * @param {type} myOrbitRate decimal
 * @param {type} myRotationRate decimal
 * @param {type} myDistanceFromAxis decimal
 * @param {type} myName string
 * @param {type} myTexture image file path
 * @param {type} mySize decimal
 * @param {type} mySegments integer
 * @returns {constructPlanetData.mainAnonym$0}
 */
function constructPlanetData(
  myOrbitRate,
  myRotationRate,
  myDistanceFromAxis,
  myName,
  myTexture,
  mySize,
  mySegments
) {
  return {
    orbitRate: myOrbitRate,
    rotationRate: myRotationRate,
    distanceFromAxis: myDistanceFromAxis,
    name: myName,
    texture: myTexture,
    size: mySize,
    segments: mySegments,
  };
}

/**
 * create a visible ring and add it to the scene.
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function getRing(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
  var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
  var ring1Material = new THREE.MeshBasicMaterial({
    color: myColor,
    side: THREE.DoubleSide,
  });
  var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
  myRing.name = name;
  myRing.position.set(distanceFromAxis, 0, 0);
  myRing.rotation.x = Math.PI / 2;
  scene.add(myRing);
  return myRing;
}

/**
 * Used to create a three dimensional ring. This takes more processing power to
 * run that getRing(). So use this sparingly, such as for the outermost ring of
 * Saturn.
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function getTube(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
  var ringGeometry = new THREE.TorusGeometry(
    size,
    innerDiameter,
    facets,
    facets
  );
  var ringMaterial = new THREE.MeshBasicMaterial({
    color: myColor,
    side: THREE.DoubleSide,
  });
  myRing = new THREE.Mesh(ringGeometry, ringMaterial);
  myRing.name = name;
  myRing.position.set(distanceFromAxis, 0, 0);
  myRing.rotation.x = Math.PI / 2;
  scene.add(myRing);
  return myRing;
}

/**
 * Simplifies the creation of materials used for visible objects.
 * @param {type} type
 * @param {type} color
 * @param {type} myTexture
 * @returns {THREE.MeshStandardMaterial|THREE.MeshLambertMaterial|THREE.MeshPhongMaterial|THREE.MeshBasicMaterial}
 */
function getMaterial(type, color, myTexture) {
  var materialOptions = {
    color: color === undefined ? "rgb(255, 255, 255)" : color,
    map: myTexture === undefined ? null : myTexture,
  };

  switch (type) {
    case "basic":
      return new THREE.MeshBasicMaterial(materialOptions);
    case "lambert":
      return new THREE.MeshLambertMaterial(materialOptions);
    case "phong":
      return new THREE.MeshPhongMaterial(materialOptions);
    case "standard":
      return new THREE.MeshStandardMaterial(materialOptions);
    default:
      return new THREE.MeshBasicMaterial(materialOptions);
  }
}

/**
 *  Draws all of the orbits to be shown in the scene.
 * @returns {undefined}
 */
function createVisibleOrbits() {
  var orbitWidth = 0.01;
  earthOrbit = getRing(
    earthData.distanceFromAxis + orbitWidth,
    earthData.distanceFromAxis - orbitWidth,
    320,
    0xffffff,
    "earthOrbit",
    0
  );
}

/**
 * Simplifies the creation of a sphere.
 * @param {type} material THREE.SOME_TYPE_OF_CONSTRUCTED_MATERIAL
 * @param {type} size decimal
 * @param {type} segments integer
 * @returns {getSphere.obj|THREE.Mesh}
 */
function getSphere(material, size, segments) {
  var geometry = new THREE.SphereGeometry(size, segments, segments);
  var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;

  return obj;
}

/**
 * Creates a planet and adds it to the scene.
 * @param {type} myData data for a planet object
 * @param {type} x integer
 * @param {type} y integer
 * @param {type} z integer
 * @param {type} myMaterialType string that is passed to getMaterial()
 * @returns {getSphere.obj|THREE.Mesh|loadTexturedPlanet.myPlanet}
 */
function loadTexturedPlanet(myData, x, y, z, myMaterialType) {
  var myMaterial;
  var passThisTexture;

  if (myData.texture && myData.texture !== "") {
    passThisTexture = new THREE.ImageUtils.loadTexture(myData.texture);
  }
  if (myMaterialType) {
    myMaterial = getMaterial(
      myMaterialType,
      "rgb(255, 255, 255 )",
      passThisTexture
    );
  } else {
    myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
  }

  myMaterial.receiveShadow = true;
  myMaterial.castShadow = true;
  var myPlanet = getSphere(myMaterial, myData.size, myData.segments);
  myPlanet.receiveShadow = true;
  myPlanet.name = myData.name;
  scene.add(myPlanet);
  myPlanet.position.set(x, y, z);

  return myPlanet;
}

/**
 * Simplifies creating a light that disperses in all directions.
 * @param {type} intensity decimal
 * @param {type} color HTML color
 * @returns {THREE.PointLight|getPointLight.light}
 */
function getPointLight(intensity, color) {
  var light = new THREE.PointLight(color, intensity);
  light.castShadow = true;

  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  return light;
}

/**
 * Move the planet around its orbit, and rotate it.
 * @param {type} myPlanet
 * @param {type} myData
 * @param {type} myTime
 * @param {type} stopRotation optional set to true for rings
 * @returns {undefined}
 */
function movePlanet(myPlanet, myData, myTime, stopRotation) {
  if (orbitData.runRotation && !stopRotation) {
    myPlanet.rotation.y += myData.rotationRate;
  }
  if (orbitData.runOrbit) {
    myPlanet.position.x =
      Math.cos(myTime * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) *
      myData.distanceFromAxis;
    myPlanet.position.z =
      Math.sin(myTime * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) *
      myData.distanceFromAxis;
  }
}

/**
 * Move the moon around its orbit with the planet, and rotate it.
 * @param {type} myMoon
 * @param {type} myPlanet
 * @param {type} myData
 * @param {type} myTime
 * @returns {undefined}
 */
function moveMoon(myMoon, myPlanet, myData, myTime) {
  movePlanet(myMoon, myData, myTime);
  if (orbitData.runOrbit) {
    myMoon.position.x = myMoon.position.x + myPlanet.position.x;
    myMoon.position.z = myMoon.position.z + myPlanet.position.z;
  }
}

/**
 * This function is called in a loop to create animation.
 * @param {type} renderer
 * @param {type} scene
 * @param {type} camera
 * @param {type} controls
 * @returns {undefined}
 */
function update(renderer, scene, camera, controls) {
  pointLight.position.set(0, 3, 0);
  controls.update();

  var time = Date.now();

  movePlanet(mercury, mercuryData, time);
  movePlanet(venus, venusData, time);
  movePlanet(earth, earthData, time);
  movePlanet(mars, marsData, time);
  movePlanet(jupiter, jupiterData, time);
  movePlanet(saturn, saturnData, time);
  movePlanet(uranus, uranusData, time);
  movePlanet(neptune, neptuneData, time);
  movePlanet(pluto, plutoData, time);

  movePlanet(ring, saturnData, time, true);
  moveMoon(moon, earth, moonData, time);

  renderer.render(scene, camera);
  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls);
  });
}

/**
 * This is the function that starts everything.
 * @returns {THREE.Scene|scene}
 */
function init() {
  // Create the camera that allows us to view into the scene.
  camera = new THREE.PerspectiveCamera(
    75, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping plane
    10000 // far clipping plane
  );
  camera.position.set(0, 5, 14);

  // Create the scene that holds all of the visible objects.
  scene = new THREE.Scene();

  // Create the renderer that controls animation.
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Attach the renderer to the div element.
  document.getElementById("webgl").appendChild(renderer.domElement);

  // Create controls that allows a user to move the scene with a mouse.
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Load the images used in the background.
  var path = "cubemap/";
  var format = ".png";
  var urls = [
    path + "space_bk" + format,
    path + "space_dn" + format,
    path + "space_lf" + format,
    path + "space_ft" + format,
    path + "space_up" + format,
    path + "space_rt" + format,
  ];
  var reflectionCube = new THREE.CubeTextureLoader().load(urls);
  reflectionCube.format = THREE.RGBFormat;

  // Attach the background cube to the scene.
  scene.background = reflectionCube;

  // Create light from the sun.
  pointLight = getPointLight(0.5, "rgb(255, 220, 180)");
  scene.add(pointLight);

  // Create light that is viewable from all directions.
  var ambientLight = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambientLight);

  //direct light
  var light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(4, 2, 18);
  //scene.add(light);
  // Create the sun.
  const textureLoader = new THREE.TextureLoader();

  const sunGeo1 = new THREE.SphereGeometry(0.69, 90, 90);
  const sunMat1 = new THREE.MeshBasicMaterial({
    map: textureLoader.load("img/sun.jpg"),
  });
  const sun1 = new THREE.Mesh(sunGeo1, sunMat1);
  scene.add(sun1);
  sun1.position.setY(2.45);

  var sunMat = getMaterial("basic", "rgb(255, 255, 255)");
  sun = getSphere(sunMat, 16, 48);
  //scene.add(sun);

  // Create the glow of the sun.
  var spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.ImageUtils.loadTexture("img/glow.png"),
    useScreenCoordinates: false,
    color: 0xfcc41c,
    transparent: false,
    blending: THREE.AdditiveBlending,
  });
  var sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(2, 2, 1.0);
  //sun1.add(sprite); // This centers the glow at the sun.

  //create planet

  const geometry = new THREE.PlaneGeometry(15, 15);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(17, 17),
    new THREE.MeshBasicMaterial({
      map: new THREE.ImageUtils.loadTexture("img/glass.jpg"),
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      //visible: false
    })
  );

  plane.position.set(0, 0, 0);
  plane.rotateX(-Math.PI / 2);
  scene.add(plane);
  //plane.rotateZ(-0.6);
  const grid = new THREE.GridHelper(17, 17);
  //scene.add(grid);

  //create Desk
  let loader = new THREE.GLTFLoader();
  loader.load("./desk/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.position.set(5, -0.6, -2);
    //gltf.scene.rotateY(-Math.PI / 6);
  });

  let loader1 = new THREE.GLTFLoader();
  loader1.load("./pedestal/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.set(3.5, 2.4, 3.5);
  });
  let loader2 = new THREE.GLTFLoader();
  loader2.load("./sun/scene.gltf", function (sun3) {
    //scene.add(sun3.scene);
    sun3.scene.scale.set(0.1, 0.1, 0.1);
    sun3.scene.position.set(0, 3, 0);

    function animate() {
      requestAnimationFrame(animate);

      sun1.rotation.y += 0.004;

      renderer.render(scene, camera);
    }
    animate();
  });

  // Create the Earth, the Moon, and a ring around the earth.
  mercury = loadTexturedPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
  venus = loadTexturedPlanet(venusData, venusData.distanceFromAxis, 0, 0);
  earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
  mars = loadTexturedPlanet(marsData, marsData.distanceFromAxis, 0, 0);
  jupiter = loadTexturedPlanet(jupiterData, jupiterData.distanceFromAxis, 0, 0);
  saturn = loadTexturedPlanet(saturnData, saturnData.distanceFromAxis, 0, 0);
  uranus = loadTexturedPlanet(uranusData, uranusData.distanceFromAxis, 0, 0);
  neptune = loadTexturedPlanet(neptuneData, neptuneData.distanceFromAxis, 0, 0);
  pluto = loadTexturedPlanet(plutoData, plutoData.distanceFromAxis, 0, 0);

  moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);

  ring = getTube(
    22.5232,
    0.55,
    480,
    0x757064,
    "ring",
    saturnData.distanceFromAxis
  );

  // Create the visible orbit that the Earth uses.
  //createVisibleOrbits();

  // Create the GUI that displays controls.
  // Createvar gui = new dat.GUI();
  //var folder1 = gui.addFolder('light');
  //folder1.add(pointLight, 'intensity', 0, 10);
  //var folder2 = gui.addFolder('speed');
  //folder2.add(orbitData, 'value', 0, 500);
  //folder2.add(orbitData, 'runOrbit', 0, 1);
  //folder2.add(orbitData, 'runRotation', 0, 1);

  // Start the animation.
  update(renderer, scene, camera, controls);
}

// Start everything.
init();
