/*******************************************************
    GAME VARIABLES
*/
var camera, scene, renderer, canvasWidth, canvasHeight;
var geometry, material, mesh;


/*******************************************************
    GAME INITIALISATION
*/
function init() {
    var canvasWidth = window.innerWidth,
        canvasHeight = window.innerHeight;

    // Create the camera
    camera = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 1, 10000 );
    camera.position.z = 1000;

    // Create the scene
    scene = new THREE.Scene();

    // Create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( canvasWidth, canvasHeight );

    // Add the canvas to the page
    document.body.appendChild( renderer.domElement );

    // Initialise keyboard controls
    keys = new Keys();

    // Calculate a random start position for the player
    var startX = Math.round(Math.random()*(canvas.width-5)),
        startY = Math.round(Math.random()*(canvas.height-5));


    // Initialise the player
    player = new Player(startX, startY);

    setEventHandlers();

    // geometry = new THREE.CubeGeometry( 200, 200, 200 );
    // material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    // mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );
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
}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}

