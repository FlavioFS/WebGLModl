var HUD = (function() {

	var canvas, camera, scene;

	var create = function(width, height) {
		canvas = document.createElement('canvas');

		canvas.width = width;
		canvas.height = height;

		camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30);

		scene = new THREE.Scene();


		// var hudBitmap = canvas.getContext('2d');
		// hudBitmap.font = 'Normal 40px Arial';
		// hudBitmap.textAlign = 'center';
		// hudBitmap.fillStyle = 'rgba(245,245,245,0.75)';
		// hudBitmap.fillText('Initializing...', width/2, height/2);

		// var hudTexture = new THREE.Texture(canvas);
		// hudTexture.needsUpdate = true;
		// hudTexture.minFilter = THREE.LinearFilter;


		// var material = new THREE.MeshBasicMaterial({map: hudTexture});
		// material.transparent = true;

		// var planeGeometry = new THREE.PlaneGeometry(width, height);
		// var plane = new THREE.Mesh(planeGeometry, material);
		// scene.add(plane);


	}

	/*****
	* Object
	**/
	var Obj = function(width, height) {
		this.material = null;
		this.width = 100;
		this.height = height;
	}

	Obj.prototype.show = function() {
		console.log('show');
	}

	Obj.prototype.hide = function() {
		console.log('hide');
	}


	/****** 
	* Window 
	**/

	Window.prototype = new Obj();
	Window.prototype.constructor = Window;
	function Window(title, style) {

		this.elem = document.createElement('div');
		document.body.appendChild(this.elem);

		this.elem.style.backgroundColor = style.backgroundColor || "blue";
		if (style.width)
			this.elem.style.width = style.width + 'px';
		if (style.height)
			this.elem.style.height = style.height + 'px';
		this.elem.style.top = (style.top||0) + 'px';
		this.elem.style.left = (style.left||0) + 'px';

		this.elem.style.position = 'absolute';

		// creates title
		this.append(
			new Button(title, 
				{display: 'block', backgroundColor: '#000000', border: '1px solid white', margin: '0px'})
		);

	}
	Window.prototype.show = function() {
		console.log(this.title);
	}
	Window.prototype.hide = function() {
		console.log('hide')
	}
	Window.prototype.append = function(obj) {
		this.elem.appendChild(obj.elem);
	}


	var FloatingWindow = function(title, x, y, translateX, translateY, color) {
		var material = new THREE.MeshBasicMaterial({color: color});
		var planeGeometry = new THREE.PlaneGeometry(x, y)

		this.mesh = new THREE.Mesh(planeGeometry, material);
		this.mesh.translateX(translateX);
		this.mesh.translateX(translateY);

		this.title = title || 'New Panel'
		this.x = x || 50;
		this.y = y || 50;
	};

	FloatingWindow.prototype.show = function() {
		// alert(this.x);
		scene.add(this.mesh);
		console.log()
	}


	/***
	* Widget
	*/
	var Widget = function() {
		this.group = new THREE.Object3D();
		this.font = null;
		this.texture = 'jonas';
	}

	/****
	* Widget > Button
	****/
	Button.prototype = new Widget();
	Button.prototype.constructor = Button;
	function Button(text, style) {
		// var background = new THREE.Mesh(
		// 	new THREE.PlaneGeometry(width, height),
		// 	new THREE.MeshBasicMaterial({color: 0x00ffff}));
		// this.group.add(background);

		
		this.elem = document.createElement('div');
		
		this.elem.style.color = '#FFFFFF';
		this.elem.style.border = style.border || '0px solid white';
		this.elem.style.display = style.display || 'block';
		this.elem.style.padding = style.padding || '4px';
		this.elem.style.margin = style.margin || '4px';
		//this.elem.style.zIndex = 1;    // if you still don't see the label, try uncommenting this

		this.elem.style.backgroundColor = style.backgroundColor || '#666666';
		if (style.width)
			this.elem.style.width = style.width + 'px';
		if (style.height)
			this.elem.style.height = style.height + 'px';
		this.elem.style.top = style.top || '0px';
		this.elem.style.left = style.left || '0px';
		
		this.elem.innerHTML = text;
	}



	return {
		// setters and getters
		getScene: function() { return scene; },
		getCamera: function() { return camera; },

		create: create,

		// "subclasses"
		Obj: Obj,
		Window: Window,
		FloatingWindow: FloatingWindow,

		
		Widget: Widget,
		Button: Button,
	}

})();