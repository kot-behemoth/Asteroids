var Player = function(startX, startZ, scene) {
	var x = startX,
		z = startZ,
		rotation = 0,
		speed = 0,
		rotationSpeed = 2,
		dSpeed = 0.5,
		MAX_SPEED = 15;

		geometry = new THREE.CubeGeometry( 2, 2, 2 ),
		material = new THREE.MeshLambertMaterial( { color: 0xff00ff, wireframe: false } ),
		mesh = new THREE.Mesh( geometry, material );

	geometry.useQuaternion = true;
	scene.add( mesh );

	var update = function(keys, delta) {
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

		// Clamp speed
		if(speed > MAX_SPEED) {
			speed = MAX_SPEED;
		} else if(speed < -MAX_SPEED) {
			speed = -MAX_SPEED;
		}

		// Rotate
		mesh.rotation.y = rotation;

		// Move
		mesh.translateX(speed * delta);
	};

	return {
		update: update,
		draw: draw
	};

};