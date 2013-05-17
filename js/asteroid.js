function Asteroid(startPosition, startSize, scene) { 
	var radius = 10,
		rotation =
			new THREE.Vector3(
				(Math.random()-0.5) * 3,
				(Math.random()-0.5) * 3,
				(Math.random()-0.5) * 3),
		velocity = { x: (Math.random()-0.5) * 3, z: (Math.random()-0.5) * 3 },

		sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xdddddd, wireframe: true } ),
		sphereGeometry = new THREE.SphereGeometry(radius, 6, 6),
		sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

	// sphere.useQuaternion = true;
	sphere.position.set(startPosition.x, 0, startPosition.z);

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

	return {
		model: sphere,
		radius: radius,

		update: update
	};

}
