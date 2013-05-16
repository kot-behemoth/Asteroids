var Player = function(startX, startY, scene) {
	var x = startX,
		y = startY;
		moveAmount = 2,

		geometry = new THREE.CubeGeometry( 2, 2, 2 ),
		material = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: false } ),
		mesh = new THREE.Mesh( geometry, material );

	scene.add( mesh );

	var update = function(keys, delta) {
		if(keys.up) {
			mesh.position.z -= moveAmount * delta;
		} else if (keys.down) {
			mesh.position.z += moveAmount * delta;
		}

		if(keys.left) {
			mesh.position.x -= moveAmount * delta;
		} else if (keys.right) {
			mesh.position.x += moveAmount * delta;
		}

		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.02;
	};

	return {
		update: update,
		draw: draw
	};

};