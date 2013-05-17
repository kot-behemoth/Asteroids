function Player(scene, worldSize) {
	var rotation = 0,
		speed = 0,
		rotationSpeed = 3,
		dSpeed = 0.75,
		MAX_SPEED = 30,

		boundingRadius = 3,

		lastShot = 0,

		geometry = new THREE.CubeGeometry( boundingRadius, boundingRadius, boundingRadius ),
		// geometry = new THREE.SphereGeometry(boundingRadius, 3, 2);
		material = new THREE.MeshLambertMaterial(
			{
				color: 0xF71E40,
				wireframe: false
			} ),
		mesh = new THREE.Mesh( geometry, material );

		// model

		// var loader = new THREE.OBJLoader();
		// loader.addEventListener( 'load', function ( event ) {
		// 	var object = event.content;
		// 	// object.traverse( function ( child ) {
		// 	// 	if ( child instanceof THREE.Mesh ) {
		// 	// 		child.material.map = texture;
		// 	// 	}
		// 	// } );

		// 	object.position = new THREE.Vector3(0,0,0);
		// 	scene.add( object );
		// });
		// // loader.load( 'assets/spaceship.obj' );
		// loader.load( 'http://raw.github.com/kot-behemoth/Asteroids/master/assets/spaceship.obj' );

	geometry.useQuaternion = true;
	scene.add( mesh );

	var reset = function() {
		mesh.position = new THREE.Vector3(0,0,0);
		lastShot = 0;
		rotation = 0;
		speed = 0;
	};

	var update = function(keys, bullets, delta) {
		if(keys.up) {
			speed += dSpeed;
		} else if (keys.down) {
			speed -= dSpeed;
		}

		if(keys.left) {
			rotation += rotationSpeed * delta;
		} else if (keys.right) {
			rotation -= rotationSpeed * delta;
		}

		if(keys.space && Date.now() > lastShot + 700) {
			shoot(bullets);
		}

		// Always slow down
		// speed -= dSpeed * 0.35;

		// Clamp speed
		if(speed > MAX_SPEED) {
			speed = MAX_SPEED;
		} else if(speed <= 0) {
			speed = 0;
		}

		// Rotate
		mesh.rotation.y = rotation;

		// Move
		mesh.translateX(speed * delta);

		// Wrap movement in x
		if(mesh.position.x > worldSize.x) {
			mesh.position.x = -worldSize.x;
		} else if(mesh.position.x < -worldSize.x) {
			mesh.position.x = worldSize.x;
		}

		// Wrap movement in z
		if(mesh.position.z > worldSize.z) {
			mesh.position.z = -worldSize.z;
		} else if(mesh.position.z < -worldSize.z) {
			mesh.position.z = worldSize.z;
		}
	};

	var die = function() {
		$('#hurt').fadeIn(75);
		reset();
		$('#hurt').fadeOut(350);
	};

	var shoot = function(bullets) {
		var bullet = new Bullet(mesh.position, mesh.rotation, scene);

		scene.add(bullet.model);
		bullets.push(bullet);

		lastShot = Date.now();
	};

	return {
		boundingRadius: boundingRadius,
		model: mesh,

		update: update,
		die: die,
		reset: reset,
		draw: draw,
		shoot: shoot
	};

}