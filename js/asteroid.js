function Asteroid(position, lives, startRadius, startVelocity) { 
	var radius = startRadius,
		rotation =
			new THREE.Vector3(
				(Math.random()-0.5) * 3,
				(Math.random()-0.5) * 3,
				(Math.random()-0.5) * 3),
		// use the short-circuit evaluation, since startvelocity might be null
		velocity = startVelocity ||
			new THREE.Vector3(
				(Math.random()-0.5) * 3,
				0,
				(Math.random()-0.5) * 3),

		sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xdddddd, wireframe: true } ),
		sphereGeometry = new THREE.SphereGeometry(radius, 6, 6),
		sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

	// sphere.useQuaternion = true;
	sphere.position.set(position.x, 0, position.z);

	// draw bounding circle
	// var resolution = 100;
	// var amplitude = radius;
	// var size = 360 / resolution;
	// var geometry = new THREE.Geometry();
	// var material = new THREE.LineBasicMaterial( { color: 0xff, opacity: 1.0} );
	// for(var i = 0; i <= resolution; i++) {
	// 	var segment = ( i * size ) * Math.PI / 180;
	// 	geometry.vertices.push( new THREE.Vector3( sphere.position.x + Math.cos( segment ) * amplitude, 0, sphere.position.z + Math.sin( segment ) * amplitude ) );
	// }
	// var line = new THREE.Line( geometry, material );
	// scene.add(line);

	var update = function(delta) {
		sphere.position.x += velocity.x * delta;
		sphere.position.z += velocity.z * delta;

		// line.position.x += velocity.x * delta;
		// line.position.z += velocity.z * delta;

		sphere.rotation.x += rotation.x * delta;
		sphere.rotation.y += rotation.y * delta;
		// sphere.rotation.z += rotation.z * delta;
	};

	var explode = function(scene, asteroids) {
		lives--;

		if(lives > 0) {
			a1 = new Asteroid(sphere.position, lives-1, radius/2.0);
			a2 = new Asteroid(sphere.position, lives-1, radius/2.0);

			scene.add(a1.model);
			scene.add(a2.model);

			asteroids.push(a1);
			asteroids.push(a2);
		}
	};

	return {
		model: sphere,
		radius: radius,

		update: update,
		explode: explode
	};

}
