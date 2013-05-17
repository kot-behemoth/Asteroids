function Asteroid(position, lives, startRadius, startVelocity) {

	var radius = getRandomArbitary(startRadius-1.0, startRadius+1.0),
		rotation =
			new THREE.Vector3(
				getRandomArbitary(-1, 1),
				getRandomArbitary(-1, 1),
				getRandomArbitary(-1, 1)),
		// use the short-circuit evaluation, since startvelocity might be null
		velocity = startVelocity ||
			new THREE.Vector3(
				getRandomArbitary(-3, 3),
				0,
				getRandomArbitary(-3, 3)),

		material = new THREE.MeshBasicMaterial(
			{
				color: 0xdddddd,
				wireframe: true
			} ),
		// segmentsWidth — number of horizontal segments. Minimum value is 3, and the default is 8.
		//segmentsHeight — number of vertical segments. Minimum value is 2, and the default is 6.
		// geometry = new THREE.SphereGeometry(radius, 3+lives*2, 2+lives*2);
		// geometry = new THREE.IcosahedronGeometry(radius, 1);
		geometry = new THREE.OctahedronGeometry(radius, 1);
		geometry.dynamic = true;


		for ( var i = 0, il = geometry.vertices.length; i < il; i++ ) {
			geometry.vertices[i].x += getRandomArbitary(-radius * 0.2, radius * 0.2);
			geometry.vertices[i].y += getRandomArbitary(-radius * 0.2, radius * 0.2);
			geometry.vertices[i].z += getRandomArbitary(-radius * 0.2, radius * 0.2);
		}

		var sphere = new THREE.Mesh(geometry, material);

	sphere.position.set(position.x, 0, position.z);

	var update = function(delta) {
		sphere.position.x += velocity.x * delta;
		sphere.position.z += velocity.z * delta;

		sphere.rotation.x += rotation.x * delta;
		sphere.rotation.y += rotation.y * delta;
	};

	var explode = function(scene, asteroids) {
		if(lives > 0) {
			var v1 = new THREE.Vector3(
						getRandomArbitary(-8, 8),
						0,
						getRandomArbitary(-8, 8));
			var v2 = new THREE.Vector3(
						getRandomArbitary(-8, 8),
						0,
						getRandomArbitary(-8, 8));

			var a1 = new Asteroid(sphere.position, lives-1, radius/2.0, v1),
				a2 = new Asteroid(sphere.position, lives-1, radius/2.0, v2);

			scene.add(a1.model);
			scene.add(a2.model);

			asteroids.push(a1);
			asteroids.push(a2);

			lives--;
		}
	};

	return {
		model: sphere,
		radius: radius,

		update: update,
		explode: explode
	};

}
