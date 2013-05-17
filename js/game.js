/*******************************************************
	GAME VARIABLES
*/
var camera, scene, renderer, canvasWidth, canvasHeight,
	player, keys,
	bullets, asteroids;


/*******************************************************
	GAME INITIALISATION
*/
function init() {
	var canvasWidth = window.innerWidth,
		canvasHeight = window.innerHeight;

	// Create the clock for deltaTime
	clock = new THREE.Clock();

	// Create the scene
	scene = new THREE.Scene();

	// Create the camera
	camera = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 1, 10000 );
	camera.position.y = 100;
	camera.position.z = 0.1;
	camera.lookAt( scene.position );
	scene.add(camera);

	axes = new THREE.AxisHelper( 10 );
	scene.add( axes );

	// Create the renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColor(0xffffff, 1);

	// create a point light
	var pointLight =
		new THREE.PointLight(0xFFFFFF);
	// set its position
	pointLight.position.x = 5;
	pointLight.position.y = 50;
	pointLight.position.z = 1;
	// add to the scene
	scene.add(pointLight);

	// Create the bullets array
	bullets = [];

	// Create asteroids
	asteroids = [];
	createAsteroids();

	// Add the canvas to the page
	document.body.appendChild( renderer.domElement );

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the player
	// [-5, 5]
	var startX = Math.round( (Math.random()-0.5) * (10) ),
		startZ = Math.round( (Math.random()-0.5) * (10) );

	// Initialise the player
	player = new Player(startX, startZ, scene);

	setEventHandlers();
}

function createAsteroids() {
	var spread = 100;

	for (var i = 0; i < 10; i++) {
		var randPos = new THREE.Vector3( (Math.random()-0.5) * (100), 0, (Math.random()-0.5) * (100));
		var a = new Asteroid(randPos, 3, scene);

		asteroids[i] = a;
		scene.add(a.model);
	};
}

/*******************************************************
	GAME EVENT HANDLERS
*/

var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
};

// Key down
function onKeydown(event) {
	if(player) {
		keys.onKeyDown(event);
	}
}

// Key up
function onKeyup(event) {
	if(player) {
		keys.onKeyUp(event);
	}
}

// Browser window resize
function onResize(event) {
	// Maximise the canvas
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	// Update the renderer size
	renderer.setSize( canvasWidth, canvasHeight );

	// Update camera's aspect ratio
	camera.aspect = canvasWidth / canvasHeight;
	camera.updateProjectionMatrix();
}

/*******************************************************
	GAME LOOP FUNCTIONS
*/

function animate() {

	update( clock.getDelta() );
	draw();

	// three.js includes requestAnimationFrame shim
	requestAnimationFrame( animate );
}

function update(delta) {
	updateAsteroids(delta);
	updateBullets(delta);
	player.update(keys, bullets, delta);
}

function draw() {
	renderer.render( scene, camera );
}

function checkBulletAsteroidCollision(asteroids, bullet) {
	for (var i = asteroids.length - 1; i >= 0; i--) {
		var a = asteroids[i],
		ar = a.radius, ap = a.model.position,
		br = bullet.radius, bp = bullet.model.position;

		var rsum = ar + br,
			dx = ap.x - bp.x,
			dz = ap.z - bp.z;

		// if( rsum * rsum > (dx * dx + dy * dy) ) {
		if( rsum * rsum > bp.distanceToSquared(ap) ) {
			return i;
		}
	}

	return -1;
}

function updateBullets(delta) {
	for (var i = bullets.length - 1; i >= 0; i--) {
		var b = bullets[i];

		b.update(delta);

		ai = checkBulletAsteroidCollision(asteroids, b);

		if(ai != -1) { // it's a hit!
			console.log("hit!");
			scene.remove( b.model );
			bullets.splice(i, 1);

			// TODO explode asteroid
			// asteroids[asteroidIndex].explode();
			scene.remove( asteroids[ai].model );
			// we're only ever going to remove one asteroid, so there is no need for indices cache
			asteroids.splice(ai, 1);

			// continue;
		}

		if( b.isDead() ) {
			scene.remove( b.model );
			bullets.splice(i, 1);
			// continue;
		}
	}
}

function updateAsteroids(delta) {
	for (var i = asteroids.length - 1; i >= 0; i--) {
		var a = asteroids[i], p = a.model.position;

		a.update(delta);
	}
}
