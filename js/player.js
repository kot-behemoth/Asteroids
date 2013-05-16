var Player = function(startX, startZ, scene) { 
	var x = startX,
		z = startZ,
		rotation = 0,
		speed = 0,
		rotationSpeed = 3,
		dSpeed = 0.75,
		MAX_SPEED = 15,

		lastShot = 0,

		geometry = new THREE.CubeGeometry( 2, 2, 2 ),
		material = new THREE.MeshLambertMaterial( { color: 0xff00ff, wireframe: false } ),
		mesh = new THREE.Mesh( geometry, material );

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
			lastShot = Date.now();
		}

		// Always slow down
		speed -= dSpeed * 0.35;

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

	var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x333333 } );
	var sphereGeometry = new THREE.SphereGeometry(0.2, 6, 6);

	var shoot = function(bullets) {
		var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(mesh.position.x, 0, mesh.position.z);
		sphere.rotation.copy(mesh.rotation);
		sphere.translateX(1);
		sphere.life = 100;
		scene.add(sphere);
		bullets.push(sphere);
	}

	return {
		update: update,
		draw: draw,
		shoot: shoot
	};

};