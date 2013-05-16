/*******************************************************
	GAME VARIABLES
*/
var camera, scene, renderer, canvasWidth, canvasHeight,
	player, keys;


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
	camera.position.y = 50;
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
	player.update(keys, delta);
}

function draw() {
	renderer.render( scene, camera );
}