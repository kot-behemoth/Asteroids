function Bullet(startPosition, startRotation, scene) {
	var radius = 1,
		sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x333333 } ),
		sphereGeometry = new THREE.SphereGeometry(radius, 6, 6),
		sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

	var speed = 40,
		life = 100;

	sphere.position.set(startPosition.x, 0, startPosition.z);
	sphere.rotation.copy(startRotation);
	sphere.translateX(1);

	var update = function(worldSize, delta) {
		// Move
		sphere.translateX(speed * delta);

		// Wrap movement in x
		if(sphere.position.x > worldSize.x) {
			sphere.position.x = -worldSize.x;
		} else if(sphere.position.x < -worldSize.x) {
			sphere.position.x = worldSize.x;
		}

		// Wrap movement in z
		if(sphere.position.z > worldSize.z) {
			sphere.position.z = -worldSize.z;
		} else if(sphere.position.z < -worldSize.z) {
			sphere.position.z = worldSize.z;
		}

		// Shorten the lifespan
		life--;
	};

	var isDead = function() {
		return life <= 0;
	};

	return {
		model: sphere,
		radius: radius,
		boundingRadius: radius,

		update: update,
		isDead: isDead
	};
}
