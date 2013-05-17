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

	var update = function(delta) {
		// update position
		sphere.translateX(speed * delta);

		life--;
	};

	var isDead = function() {
		return life <= 0;
	};

	return {
		model: sphere,
		radius: radius,

		update: update,
		isDead: isDead
	};
}
