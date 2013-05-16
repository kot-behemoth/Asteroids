function Bullet(startPosition, startRotation, scene) { 
	var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x333333 } ),
		sphereGeometry = new THREE.SphereGeometry(0.2, 6, 6),
		sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	// this.model = sphere;

	var speed = 20,
		life = 100;

	sphere.position.set(startPosition.x, 0, startPosition.z);
	sphere.rotation.copy(startRotation);
	sphere.translateX(1);

	var update = function(delta) {
		// update position
		sphere.translateX(speed * delta);

		life--;
	}

	var isDead = function() {
		return life <= 0;
	}

	return {
		model: sphere,
		update: update,
		isDead: isDead
	};
}
