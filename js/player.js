function Player(startX, startZ, scene) { 
	var x = startX,
		z = startZ,
		rotation = 0,
		speed = 0,
		rotationSpeed = 3,
		dSpeed = 0.75,
		MAX_SPEED = 30,

		lastShot = 0,

		geometry = new THREE.CubeGeometry( 3, 3, 3 ),
		material = new THREE.MeshLambertMaterial(
			{
				color: 0xff00ff,
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

		// 	// object.position.y = - 80;
		// 	scene.add( object );
		// });
		// loader.load( 'assets/spaceship.obj' );

	geometry.useQuaternion = true;
	scene.add( mesh );

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
	};

	var shoot = function(bullets) {
		var bullet = new Bullet(mesh.position, mesh.rotation, scene);

		scene.add(bullet.model);
		bullets.push(bullet);

		lastShot = Date.now();
	};

	return {
		update: update,
		draw: draw,
		shoot: shoot
	};

}