$(document).ready(function() {
	init();
	animate();

	$('div').draggable({handle: '.draggable'});
	$('.resizable').resizable();

	// avoid double clicking
	$("*").dblclick(function(e){
		e.preventDefault();
	});

	// It is possible to exist only one form for each 'new' button
	// if it exists already, it is deleted (like 'toggle')

	/** CUBE **/
	$('#new-cube').click(function() {
		if ($('#cube-form').length)
			return $('#cube-form').remove();

		$(this).after(`
			<form id='cube-form' action='#'>
				<label>X: <input type='text' name='x' size='4' value='0' /></label> |
				<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
				<label>Z: <input type='text' name='z' size='4' value='0' /></label>
				<br />
				<label>Edge: <input type='text' name='edge' size='4' value='2' /></label><br />
				<input type='submit' value='Create' />
			</form>
			`);
	})

	/** SPHERE **/
	$('#new-sphere').click(function() {
		if ($('#sphere-form').length)
			return $('#sphere-form').remove();

		$(this).after(`
			<form id='sphere-form' action='#'>
				<label>X: <input type='text' name='x' size='4' value='0' /></label> |
				<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
				<label>Z: <input type='text' name='z' size='4' value='0' /></label>
				<br />
				<label>Radius: <input type='text' name='radius' size='4' value='1' /></label><br />
				<label for='precision'>Precision</label>
				<select name="precision" id="minbeds">
					<option>1</option>
					<option>2</option>
					<option selected>3</option>
					<option>4</option>
					<option>5</option>
				</select><br />
				<label><input type='checkbox' name='render-inside' checked /> Render inside?<label><br />
				<label><input type='checkbox' name='render-colored' /> Render colored?</label><br />
				<input type='submit' value='Create' />
			</form>
			`);
	})


	/** CONE **/
	$('#new-cone').click(function() {
		if ($('#cone-form').length)
			return $('#cone-form').remove();

		$(this).after(`
			<form id='cone-form' action='#'>
				<label>X: <input type='text' name='x' size='4' value='0' /></label> |
				<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
				<label>Z: <input type='text' name='z' size='4' value='0' /></label>
				<br />
				<label>Radius: <input type='text' name='radius' size='4' value='1' /></label><br />
				<label>Height: <input type='text' name='height' size='4' value='1' /></label><br />
				<label for='precision'>Precision</label>
				<select name="precision" id="minbeds">
					<option>1</option>
					<option>2</option>
					<option selected>3</option>
					<option>4</option>
					<option>5</option>
				</select><br />
				<label><input type='checkbox' name='render-inside' checked /> Render inside?</label><br />
				<label><input type='checkbox' name='render-colored' /> Render colored?</label><br />
				<input type='submit' value='Create' />
			</form>
			`);
	})

	/** Cylinder **/
	$('#new-cylinder').click(function() {
		if ($('#cylinder-form').length)
			return $('#cylinder-form').remove();

		$(this).after(`
			<form id='cylinder-form' action='#'>
				<label>X: <input type='text' name='x' size='4' value='0' /></label> |
				<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
				<label>Z: <input type='text' name='z' size='4' value='0' /></label>
				<br />
				<label>Radius: <input type='text' name='radius' size='4' value='1' /></label><br />
				<label>Height: <input type='text' name='height' size='4' value='1' /></label><br />
				<label for='precision'>Precision</label>
				<select name="precision">
					<option>1</option>
					<option>2</option>
					<option selected>3</option>
					<option>4</option>
					<option>5</option>
				</select><br />
				<label><input type='checkbox' name='render-inside' checked /> Render inside?<label><br />
				<label><input type='checkbox' name='render-colored' /> Render colored?</label><br />
				<input type='submit' value='Create' />
			</form>
			`);
	})

	/** TORUS **/
	$('#new-torus').click(function() {
		if ($('#torus-form').length)
			return $('#torus-form').remove();

		$(this).after(`
			<form id='torus-form' action='#'>
				<label>X: <input type='text' name='x' size='4' value='0' /></label> |
				<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
				<label>Z: <input type='text' name='z' size='4' value='0' /></label>
				<br />
				<label>Radius: <input type='text' name='radius' size='4' value='1' /></label><br />
				<label>Height: <input type='text' name='tubeRadius' size='4' value='1' /></label><br />
				<label for='precision'>Precision</label>
				<select name="precision">
					<option>1</option>
					<option>2</option>
					<option selected>3</option>
					<option>4</option>
					<option>5</option>
				</select><br />
				<label><input type='checkbox' name='render-inside' checked /> Render inside?<label><br />
				<label><input type='checkbox' name='render-colored' /> Render colored?</label><br />
				<input type='submit' value='Create' />
			</form>
			`);
	})

	// #cube-form
	$(document).on('submit', 'form#cube-form', function() {
		var

			this_elem = $(this),

			pos = {
				x: parseFloat($(this).find('input[name=x]').val()),
				y: parseFloat($(this).find('input[name=y]').val()),
				z: parseFloat($(this).find('input[name=z]').val())
			},
			e = parseFloat($(this).find('input[name=edge]').val());

			// rendering
			var loading = new HUD.Loading('Creating cube...').show();


			// reason to use timeout: a solid would be calculated BEFORE showing a loading
			setTimeout(function() {
				var solid = new Primitives.SolidSphere(pos, e/2, true);
				solid.calcOctree(1);
				
				addSolid(solid);

				this_elem.remove()

				loading.endTimer().hide(5000);
			}, 15);
	});

	$(document).on('submit', 'form', function() {
		var pos, r, h, t, precision, renderInside, boolAddColored = false;

		var this_id = $(this).attr('id'),
			this_elem = $(this);
		
		if (this_id == 'cone-form' || this_id == 'cylinder-form') {
			h = parseFloat($(this).find('input[name=height]').val());
		}
		else if (this_id == 'torus-form') {
			t = parseFloat($(this).find('input[name=tubeRadius]').val());
		}

		if (this_id == 'sphere-form'
			|| this_id == 'cone-form'
			|| this_id == 'cylinder-form'
			|| this_id == 'torus-form') {

			pos = {
				x: parseFloat($(this).find('input[name=x]').val()),
				y: parseFloat($(this).find('input[name=y]').val()),
				z: parseFloat($(this).find('input[name=z]').val())
			};
			r = parseFloat($(this).find('input[name=radius]').val());
			precision = parseInt($(this).find('select[name=precision]').val());
			renderInside = $(this).find('input[name=render-inside]').prop('checked');

			boolAddColored = $(this).find('input[name=render-colored]').prop('checked')

			// rendering
			var loading = new HUD.Loading(
				'Creating '+this_id.substr(0, this_id.length-5)+'...')
				.show();

			// reason to use timeout: a solid would be calculated BEFORE showing a loading
			setTimeout(function() {

				if (boolAddColored)
					renderInside = true;

				var solid;

				if (this_id == 'sphere-form')
					solid = new Primitives.SolidSphere(pos, r, renderInside);
				else if (this_id == 'cone-form')
					solid = new Primitives.SolidCone(pos, r, h, renderInside);
				else if (this_id == 'cylinder-form')
					solid = new Primitives.SolidCylinder(pos, r, h, renderInside);
				else if (this_id == 'torus-form')
					solid = new Primitives.SolidTorus(pos, r, t, renderInside);
					

				solid.calcOctree(precision);
				console.log('Octree created in ' + loading.getTimer() + 'ms');
				
				if (boolAddColored)
					solid.addToSceneColored(scene, precision, 0)
				else {
					addSolid(solid);
				}

				this_elem.remove()

				loading.endTimer().hide(5000);
			}, 15);
		}

		return false;
	});
	

	/******** SOLIDS IN THE SCENE WINDOW *****/
	/***
	**** SOLID SELECTION
	*/
	function unhighlightSolid() {
		if ($('.solid-selection:disabled').length) {
			var material = scene.getObjectByName('wireframe-'+$('.solid-selection:disabled').data('index')).material;
			material.wireframeLinewidth = 1;
			material.color.set(
				scene.getObjectByName('solid-'+$('.solid-selection:disabled').data('index')).material.color
			);

			scene.getObjectByName('wireframe-'+$('.solid-selection:disabled').data('index')).material = material;
		}
	}
	$(document).on('click', '#solid-deselection', function() {
		unhighlightSolid();
		$('.solid-selection:disabled').prop('disabled', false)
	})
	$(document).on('click', '.solid-selection', function() {
		// un-highlight any previous highlighted
		unhighlightSolid();

		$('.solid-selection:disabled').prop('disabled', false)
		$(this).prop('disabled', true)

		
		// HIGHLIGHT
		// show wireframe if it is not showing already
		var wireframe = $('.show-wireframe[type=checkbox][value='+$(this).data('index')+']');
		if (!wireframe.is(':checked'))
			wireframe.click();

		var material = scene.getObjectByName('wireframe-'+$(this).data('index')).material;
		material.wireframeLinewidth = 3;
		material.color.set('#f4e542');
		scene.getObjectByName('wireframe-'+$(this).data('index')).material = material;
	})

	/***
	**** CHANGE SOLID COLOR
	*/
	$(document).on('change', 'input[type=color].solid-color', function() {
		scene.getObjectByName('solid-'+$(this).data('index')).material.color.set($(this).val());
		scene.getObjectByName('wireframe-'+$(this).data('index')).material.color.set($(this).val());
	});

	/***
	**** SHOWING/HIDING SOLID/WIREFRAME
	*/
	$(document).on('change', '.show-solid[type=checkbox]', function() {
		
		var obj = scene.getObjectByName('solid-'+$(this).val());
		var material = obj.material;

		if ($(this).is(':checked')) {
			material.visible = true;
		}
		else
		{
			material.visible = false;
		}

		obj.material = material;
	});

	$(document).on('change', '.show-wireframe[type=checkbox]', function() {
		
		var obj = scene.getObjectByName('wireframe-'+$(this).val());
		var material = obj.material;

		// obj.visible = true/false is not working for wireframes. It causes freezing

		// depthWrite false only when hiding to avoid showing wireframes lines
		if ($(this).is(':checked')) {
			
			material.transparent = false;
			material.opacity = 1;
			material.wireframe = true;
			material.depthWrite = true;
			obj.material = material;
		} else {
			material.transparent = true;
			material.opacity = 0;
			material.wireframe = false;
			material.depthWrite = false;
			obj.material = material;
		}
	});

	/***
	**** EXPORT AND IMPORT
	*/
	var getSelectedSolidIndex = function() {
		return parseInt($('.solid-selection:disabled').data('index'))
	}

	// gets index (int) of a selected solid, then solids[index].toString()
	$(document).on('click', '#export', function() {
		try {
			console.log(
				solids[getSelectedSolidIndex()].toString());
		} catch(e) {
			alert('Select a solid!');
		}
	});

	$(document).on('click', '#import', function() {
		if ($('#import-form').length)
			return $('#import-form').remove();

		$(this).after(`
			<form id='import-form' action='#'>
				<label>Bounding box edge: <input type='text' name='bBoxEdge' size='4' value='4' /></label><br />
				<label>X: <input type='text' name='x' size='4' value='0' /></label> |
				<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
				<label>Z: <input type='text' name='z' size='4' value='0' /></label>
				<br />
				<label for='code'>Code:</label>
				<textarea name="code" height='20' size='30'>(bw(bwwwwwwwwbwww</textarea><br />
				<label><input type='checkbox' name='render-colored' /> Render colored?</label><br />
				<input type='submit' value='Import solid' />
			</form>
		`);
	});

	$(document).on('submit', '#import-form', function() {
		var pos, bBoxEdge, boolAddColored = false;

		var this_id = $(this).attr('id'),
			this_elem = $(this);

		pos = {
			x: parseFloat($(this).find('input[name=x]').val()),
			y: parseFloat($(this).find('input[name=y]').val()),
			z: parseFloat($(this).find('input[name=z]').val())
		};
		bBoxEdge = parseFloat($(this).find('input[name=bBoxEdge]').val());
		code = $(this).find('textarea[name=code]').val()
		boolAddColored = $(this).find('input[name=render-colored]').prop('checked')

		// rendering
		var loading = new HUD.Loading(
			'Importing solid...')
			.show();

		// reason to use timeout: a solid would be calculated BEFORE showing a loading
		setTimeout(function() {

			var solid = new Primitives.Solid(pos);
			solid.fromString(code, bBoxEdge);

			if (boolAddColored)
				solid.addToSceneColored(scene, 0, 0)
			else {
				addSolid(solid);
			}

			this_elem.remove()

			loading.endTimer().hide(5000);
		}, 15);

	});

	/*******
	******** DUPLICATE AND DELETE
	*/
	// gets index (int) of a selected solid, then solids[index].toString()
	$(document).on('click', '#duplicate', function() {
		if(!isNaN(getSelectedSolidIndex())) {
			var original = [
				scene.getObjectByName('solid-'+getSelectedSolidIndex()),
				scene.getObjectByName('wireframe-'+getSelectedSolidIndex())
			]
			var newIndex = solids.push(solids[getSelectedSolidIndex()]) - 1;

			console.log(original)
			var duplicatedMesh = new THREE.Mesh(
				original[0].geometry,
				new THREE.MeshPhongMaterial({
					color: original[0].material.color,
					specular: 0xFFDDDD,
					shininess: 2,
					shading: THREE.FlatShading,
					wireframe: false,
					transparent: true,
					opacity: 1.0
				})
			);
			duplicatedMesh.name = 'solid-'+newIndex;

			scene.add(duplicatedMesh)

			var duplicatedWireframe = new THREE.Mesh(
				original[1].geometry,
				new THREE.MeshBasicMaterial ({
					color: duplicatedMesh.material.color,
					shading: THREE.FlatShading,
					side: THREE.DoubleSide,
					depthWrite: false,
					// depthTest: false,
					wireframe: true,
				})
			);
			duplicatedWireframe.name = 'wireframe-'+newIndex;
			scene.add(duplicatedWireframe)

			// console.log('#'+duplicatedMesh.material.color.getHex().toString(16))
			console.log($('input[type=color].solid-color'))
			console.log($('input[type=color][data-index="'+newIndex+'"].solid-color'))
			
			$('input[type=color][data-index="'+newIndex+'"].solid-color')[0]
				.value = '#'+duplicatedMesh.material.color.getHex().toString(16)
			
		} else {
			alert('Select a solid!');
		}
	});

	$(document).on('click', '#delete', function() {
		var index = getSelectedSolidIndex();

		if(!isNaN(index)) {
			if (confirm("Delete?")) {
				solids[getSelectedSolidIndex()] = null;

				scene.remove(scene.getObjectByName('solid-'+index));
				scene.remove(scene.getObjectByName('wireframe-'+index));

				$('#window-solids div[data-index="'+index+'"]').remove()

			}
		} else {
			alert('Select a solid!');
		}
	});

	/*****
	****** TRANSLATE AND SCALE
	*/
	$('#window1').append(`
		<form id='translate-form' class='transform-form' action='#'>
			<label>X: <input type='text' name='x' size='4' value='0' /></label> |
			<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
			<label>Z: <input type='text' name='z' size='4' value='0' /></label>
			<input type='submit' value='Translate' />
		</form>
	`);

	$('#window1').append(`
		<form id='scale-form' class='transform-form' action='#'>
			<label>Factor: <input type='text' name='factor' size='4' value='1' /></label>
			<input style='display: inline' type='button' class='scale-octree' value='Scale Octree' /><br /><br />
			<label>X: <input type='text' name='x' size='4' value='1' /></label> |
			<label>Y: <input type='text' name='y' size='4' value='1' /></label> |
			<label>Z: <input type='text' name='z' size='4' value='1' /></label>
			<input type='submit' value='Scale Mesh' />
		</form>
	`);

	$('#window1').append(`
		<form id='rotate-form' class='transform-form' action='#'>
			<label>X: <input type='text' name='x' size='4' value='0' /></label> |
			<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
			<label>Z: <input type='text' name='z' size='4' value='0' /></label>
			<input type='submit' value='Rotate Mesh' />
		</form>
	`);

	$(document).on('submit', '.transform-form', function() {
		var op;
		if ($(this).attr('id') == 'translate-form')
			op = 'Translating';
		else if ($(this).attr('id') == 'scale-form')
			op = 'Scaling';
		else if ($(this).attr('id') == 'rotate-form')
			op = 'Rotating';

		pos = {
			x: parseFloat($(this).find('input[name=x]').val()),
			y: parseFloat($(this).find('input[name=y]').val()),
			z: parseFloat($(this).find('input[name=z]').val())
		};

		var i = getSelectedSolidIndex();

		if (isNaN(i))
			return alert('Select a solid!')

		var loading = new HUD.Loading(
		op+'...')
		.show();

		setTimeout(function() {
			
			solids[i].translate(pos)

			// scene.getObjectByName('solid-'+i).translateX(pos.x).translateY(pos.y).translateZ(pos.z)
			// scene.getObjectByName('wireframe-'+i).translateX(pos.x).translateY(pos.y).translateZ(pos.z)
			var obj = scene.getObjectByName('solid-'+i);
			var wire = scene.getObjectByName('wireframe-'+i);

			if (op == 'Translating') {
				$(this).find('input:text').val(0);
				var model = solids[i].model();

				// UPDATES ON THREE.JS
				if (model) { 
					obj.geometry = generateMesh(model).geometry;
					wire.geometry = generateWireframeBBox(solids[i]).geometry;
				}
				else console.log("Empty model!!");
			}
			else if (op == 'Scaling')
			{
				$(this).find('input:text').val(1);
				obj.scale.set(pos.x, pos.y, pos.z);
				wire.scale.set(pos.x, pos.y, pos.z);
			}
			else if (op == 'Rotating')
			{
				$(this).find('input:text').val(0);
				obj.rotateX(pos.x/180 * Math.PI)
				obj.rotateY(pos.y/180 * Math.PI)
				obj.rotateZ(pos.z/180 * Math.PI)
				wire.rotateX(pos.x/180 * Math.PI)
				wire.rotateY(pos.y/180 * Math.PI)
				wire.rotateZ(pos.z/180 * Math.PI)
			}

			

			// $(this).find('input[name=x]').val(0)

			loading.endTimer().hide(5000);


		}, 15);
	});

	$(document).on('click', '.scale-octree', function() {
		var factor = parseFloat($(this).parent().find('input[name=factor]').val());

		var i = getSelectedSolidIndex();

		if (isNaN(i))
			return alert('Select a solid!')
		
		if (factor == 0)
			return alert('The factor can\'t be zero');

		solids[i].scale(factor)

		var obj = scene.getObjectByName('solid-'+i);
		var wire = scene.getObjectByName('wireframe-'+i);

		$(this).parent().find('input[name=factor]').val(1)

		var model = solids[i].model();

		// UPDATES ON THREE.JS
		if (model) { 
			obj.geometry = generateMesh(model).geometry;
			wire.geometry = generateWireframeBBox(solids[i]).geometry;
		}
		else console.log("Empty model!!");
	});

	/*****
	****** BOOLEAN OPERATIONS
	*/
	$('#window1').append(`
		<form id='boolean-form' action='#'>
			<label>Obj1: <input type='text' name='a' size='4' value='1' /></label> -
			<label>Obj2: <input type='text' name='b' size='4' value='2' /></label><br />
			<input class='submit-button' type='button' value='Union' />
			<input class='submit-button' type='button' value='Intersection' />
			<input class='submit-button' type='button' value='Difference' />
		</form>
	`);

	$(document).on('click', '#boolean-form .submit-button', function() {
		var
			a = parseInt($('body').find('#boolean-form input[name=a]').val()) - 1,
			b = parseInt($('body').find('#boolean-form input[name=b]').val()) - 1;

			

		// var loading = new HUD.Loading(
		// 	'Importing solid...')
		// 	.show();

		// reason to use timeout: a solid would be calculated BEFORE showing a loading
		// setTimeout(function() {

			solid = new Primitives.Solid({x:0,y:0,z:0});

			if ($(this).val() == 'Union')
				solid.union(solids[a], solids[b])
			else if ($(this).val() == 'Intersection')
				solid.intersection(solids[a], solids[b])
			else if ($(this).val() == 'Difference')
				solid.difference(solids[a], solids[b])

			addSolid(solid);

		// 	loading.endTimer().hide(5000);
		// }, 15);

	});

	
	////// MISC

	$('#window1').append(`
		<label><input id='show-grid' type='checkbox' name='show-grid' checked /> Show Grid<label><br />
	`)

	$('#show-grid').change(function() {
		if ($(this).is(':checked')) {
			// grid.visible = true;
			grid.material.transparent = false;
			grid.material.opacity = 1;
			grid.material.depthWrite = true;
		} else {
			// grid.visible = false;
			grid.material.transparent = true;
			grid.material.opacity = 0;
			grid.material.depthWrite = false;
		}
	})



});