/*******************************************************
	GAME VARIABLES
*/
var camera, scene, renderer, canvasWidth, canvasHeight,
	player, keys,
	bullets, asteroids,

	worldSize = new THREE.Vector3(50, 0, 50),

	STARTING_ASTEROIDS_NUM = 10;


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
	camera.position.y = 150;
	camera.position.z = 1;
	camera.lookAt( scene.position );
	scene.add(camera);

	// 3D axes for debugging
	// axes = new THREE.AxisHelper( 10 );
	// scene.add( axes );

	// Create the renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColor(0x342B29, 1);

	// create a point light
	var dirLight =
		new THREE.DirectionalLight(0xFFFFFF);
	// set its position
	dirLight.position = new THREE.Vector3( 0, 1, 0).normalize();
	// add to the scene
	scene.add(dirLight);

	// Add the canvas to the page
	document.body.appendChild( renderer.domElement );

	// Initialise keyboard controls
	keys = new Keys();

	// Initialise the player
	player = new Player(scene, worldSize);

	// Add borders
	createBorders(worldSize);

	// Create the bullets array
	bullets = [];

	// Create asteroids
	asteroids = [];
	createAsteroids(player);

	setEventHandlers();

	// Set up "hurt" flash
	$('body').append('<div id="hurt"></div>');
	$('#hurt').css( { width: canvasWidth, height: canvasHeight } );

	// Add the score HUD
	$('body').append('<div id="hud"><p>Score: <span id="score">0</span></p></div>');
}

function createAsteroids(player) {
	var spread = 100,
		defaultAsteroidRadius = 10;

	for (var i = 0; i < STARTING_ASTEROIDS_NUM; i++) {

		var randPos, ar, ap, pr, pp;

		do{
			randPos =
				new THREE.Vector3(
					getRandomArbitary(-worldSize.x, worldSize.x),
					0,
					getRandomArbitary(-worldSize.z, worldSize.z));

			ar = defaultAsteroidRadius , ap = randPos,
			pr = player.boundingRadius, pp = player.model.position;
		} while(boundingCircleCollisionCheck(ar, ap, pr, pp));

		var a = new Asteroid(randPos, 2, defaultAsteroidRadius, null);

		asteroids[i] = a;
		scene.add(a.model);
	}
}

function createBorders(box) {
	var bx = box.x,
		bz = box.z;

	var material = new THREE.LineBasicMaterial(
		{
			color: 0xF5F787
		});

	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-bx, 0, -bz));
	geometry.vertices.push(new THREE.Vector3(bx, 0, -bz));
	geometry.vertices.push(new THREE.Vector3(bx, 0, bz));
	geometry.vertices.push(new THREE.Vector3(-bx, 0, bz));
	geometry.vertices.push(new THREE.Vector3(-bx, 0, -bz));

	var line = new THREE.Line(geometry, material);

	scene.add(line);
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
	updateAsteroids(worldSize, delta);
	updateBullets(worldSize, delta);
	player.update(keys, bullets, delta);
	checkPlayerDeath(asteroids, player);
}

function draw() {
	renderer.render( scene, camera );
}

function checkPlayerDeath(asteroids, player) {
	ai = checkAsteroidCollision(asteroids, player);

	if(ai != -1) { // it's a hit!
		console.log("player hit!");
		player.die();

		// Explode the asteroid
		asteroids[ai].explode(scene, asteroids);
		scene.remove( asteroids[ai].model );
		asteroids.splice(ai, 1);
	}
}

/*
	Checks for collisions of any object against all of the present astroids.
	Returns the index of the colliding asteroid and -1 if there is no collision
*/
function checkAsteroidCollision(asteroids, object) {
	for (var i = asteroids.length - 1; i >= 0; i--) {
		var a = asteroids[i],
		ar = a.boundingRadius, ap = a.model.position,
		or = object.boundingRadius, op = object.model.position;

		if( boundingCircleCollisionCheck(ar, ap, or, op) ) {
			return i;
		}
	}

	return -1;
}

function updateBullets(worldSize, delta) {
	for (var i = bullets.length - 1; i >= 0; i--) {
		var b = bullets[i];

		b.update(worldSize, delta);

		ai = checkAsteroidCollision(asteroids, b);

		if(ai != -1) { // it's a hit!
			console.log("hit!");
			scene.remove( b.model );
			bullets.splice(i, 1);

			asteroids[ai].explode(scene, asteroids);
			scene.remove( asteroids[ai].model );
			// we're only ever going to remove one asteroid, so there is no need for indices cache
			asteroids.splice(ai, 1);

			player.shotSuccessful();
			// continue;
		}

		if( b.isDead() ) {
			scene.remove( b.model );
			bullets.splice(i, 1);
			// continue;
		}
	}
}

function updateAsteroids(worldSize, delta) {
	for (var i = asteroids.length - 1; i >= 0; i--) {
		var a = asteroids[i], p = a.model.position;

		a.update(worldSize, delta);
	}
}
