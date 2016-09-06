var HUD = (function() {

	var canvas, camera, scene;

	var create = function(width, height) {
		canvas = document.createElement('canvas');

		canvas.width = width;
		canvas.height = height;

		camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30);

		scene = new THREE.Scene();


		var hudBitmap = canvas.getContext('2d');
		hudBitmap.font = 'Normal 40px Arial';
		hudBitmap.textAlign = 'center';
		hudBitmap.fillStyle = 'rgba(245,245,245,0.75)';
		hudBitmap.fillText('Initializing...', width/2, height/2);

		var hudTexture = new THREE.Texture(canvas);
		hudTexture.needsUpdate = true;

		var material = new THREE.MeshBasicMaterial({map: hudTexture});
		material.transparent = true;

		var planeGeometry = new THREE.PlaneGeometry(width, height);
		var plane = new THREE.Mesh(planeGeometry, material);
		scene.add(plane);


	}


	/****** 
	 * Window 
	 **/

	var FloatingWindow = function(title, x, y, color) {
		var material = new THREE.MeshBasicMaterial({color: color});
		var planeGeometry = new THREE.PlaneGeometry(x, y)

		this.mesh = new THREE.Mesh(planeGeometry, material);

		this.title = title || 'New Panel'
		this.x = x || 50;
		this.y = y || 50;
	};

	FloatingWindow.prototype.show = function() {
		// alert(this.x);
		scene.add(this.mesh);
		console.log()
	}


	return {
		// setters and getters
		getScene: function() { return scene; },
		getCamera: function() { return camera; },

		create: create,

		// "subclasses"
		FloatingWindow: FloatingWindow,

	}

})();