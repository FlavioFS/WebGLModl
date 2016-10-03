var HUD = (function() {

	var canvas, camera, scene;

	var create = function(width, height) {
		canvas = document.createElement('canvas');

		canvas.width = width;
		canvas.height = height;

		camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30);

		scene = new THREE.Scene();

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
	function Window(title, options) {

		this.elem = document.createElement('div');
		document.body.appendChild(this.elem);
		this.elem.className = 'window'

		if (options.resizable)
			this.elem.className += ' resizable';
		if (options.width)
			this.elem.style.width = options.width + 'px';
		if (options.height)
			this.elem.style.height = options.height + 'px';
		this.elem.style.top = options.top || '0px';
		this.elem.style.left = options.left ||'0px';


		// creates title
		this.append(new Label(title, 'draggable', {}))

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
	* Obj > Loading
	*/
	Loading.prototype = new Obj();
	Loading.prototype.constructor = Loading;
	function Loading(text = '') {
		this.start = new Date().getTime(),
		this.elapsed = '0.0';
		this.text = text;

		// creating element
		this.elem = document.createElement('div');
		this.elem.className = 'loading';
		this.elem.innerHTML = text;


		return this;
	};

	// end and calculate time difference
	Loading.prototype.endTimer = function() {
		this.elapsed = new Date().getTime() - this.start;
		this.elem.innerHTML = 'It took ' + this.elapsed + 'ms';
		return this;
	}

	Loading.prototype.getElapsedTime = function() {
		return this.elapsed;
		return this;
	}

	Loading.prototype.show = function() {
		document.body.appendChild(this.elem);

		return this;
	}

	Loading.prototype.hide = function(hideAfterMs = 0) {
		var elem = this.elem
		setTimeout(function() {
			elem.parentNode.removeChild(elem);
		},hideAfterMs);
		return this;
	}


	/***
	* Widget
	*/
	var Widget = function() {
		// this.group = new THREE.Object3D();
		// this.font = null;
		// this.texture = 'jonas';
	}

	/****
	* Widget > Label
	****/
	Button.prototype = new Widget();
	Button.prototype.constructor = Label;
	function Label(text, classE, style) {
		this.elem = document.createElement('div');
		this.elem.className = 'label'
		if (classE != null)
			this.elem.className += ' '+classE;
		this.elem.innerHTML = text;
	}

	/****
	* Widget > Button
	****/
	Button.prototype = new Widget();
	Button.prototype.constructor = Button;
	function Button(text, id, style) {

		this.elem = document.createElement('input');
		this.elem.setAttribute('type', 'button');
		this.elem.id = id;
		this.elem.value = text;
		
		// this.elem.style.color = '#FFFFFF';
		// this.elem.style.border = style.border || '0px solid white';
		// this.elem.style.display = style.display || 'block';
		// this.elem.style.padding = style.padding || '4px';
		// this.elem.style.margin = style.margin || '4px';
		// //this.elem.style.zIndex = 1;    // if you still don't see the label, try uncommenting this

		// this.elem.style.backgroundColor = style.backgroundColor || '#666666';
		// if (style.width)
		// 	this.elem.style.width = style.width + 'px';
		// if (style.height)
		// 	this.elem.style.height = style.height + 'px';
		// this.elem.style.top = style.top || '0px';
		// this.elem.style.left = style.left || '0px';
		
		
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

		Loading: Loading,
		
		Widget: Widget,
		Button: Button,
	}

})();