$(document).ready(function() {
	init();
	animate();


	// avoid double clicking
	$("*").dblclick(function(e){
		e.preventDefault();
	});

	$('body').after(`
	<div class="window" id="window1" style="width: 220px; height: 969px; top: 0px; left: 0px;">
		<div class="label draggable">
			<select id="modelType" style="font-size: 18pt; text-align: center;">
				<option value="0">Octree</option>
				<option value="1" selected>CSG</option>
			</select>
		</div>
		<div id='content'></div>
	</div>
	<div class="window" id="window-solids" style="width: 160px; height: 969px; top: 0px; left: 220px;"><div class="label draggable">Solids in the Scene</div><div class="label">Click to select:</div><input type="button" value="     Deselect     " id="solid-deselection"></div>
	`)

	$('#window1 div:first').html(`
		<select id="modelType" style='font-size: 18pt;'>
			<option value="0">Octree</option>
			<option value="1" selected>CSG</option>
	`)

	$('#modelType').change(function(){
		modelType = $(this).val();
		if (modelType == OCTREE_MODEL)
			$('#content').html(octreeHtml)
		else if (modelType == CSG_MODEL)
			$('#content').html(csgHtml)

		$('#content').find('.toggle-form-area form').hide(0); // initially
	})

	$('#modelType').val(CSG_MODEL).change();

	
	// HIDING AND SHOWING PRIMITIVE FORMS
	$(document).on('click', 'input.button-toggle-form', function() {
		$(this).next().toggle()
	})

	$('#content').find('.toggle-form-area form').hide(0); // initially

	/************************
	************************* OCTREE
	*/

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

				var solid;

				if (modelType == OCTREE_MODEL)
				{
					solid = new Primitives.SolidSphere(pos, e/2, true);
					solid.calcOctree(1);
					
					addSolid(solid);
				}
				else if (modelType == CSG_MODEL)
				{
					solid = new Primitives.SolidCube(pos, e);
					addCsgSolid(new CSG.NodeLeaf(solid));
				}

					this_elem.toggle();

					loading.endTimer().hide(3000);
			}, 15);

			return false;
	});

	$(document).on('submit', 'form.new-primitive-form', function() {
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

			boolAddColored = $(this).find('input[name=render-colored]').prop('checked');

			// rendering
			var loading = new HUD.Loading(
				'Creating '+this_id.substr(0, this_id.length-5)+'...')
				.show();

			// reason to use timeout: a solid would be calculated BEFORE showing a loading
			setTimeout(function() {
				var solid;
				if (modelType == OCTREE_MODEL)
				{
					if (boolAddColored)
						renderInside = true;

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
						solid.addToSceneColored(scene, precision, 0);
					else {
						addSolid(solid);
					}
				}
				else if (modelType == CSG_MODEL)
				{
					if (this_id == 'sphere-form')
						solid = new Primitives.SolidSphere(pos, r);
					else if (this_id == 'cone-form')
						solid = new Primitives.SolidCone(pos, r, h)
					else if (this_id == 'cylinder-form')
						solid = new Primitives.SolidCylinder(pos, r, h)
					else if (this_id == 'torus-form')
						solid = new Primitives.SolidTorus(pos, r, t)

					addCsgSolid(new CSG.NodeLeaf(solid));
				}

				this_elem.toggle();

				loading.endTimer().hide(3000);
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
			var solidPrefix = '';
			var bBoxPrefix = '';

			if ($('.solid-selection:disabled').data('model-type') == OCTREE_MODEL)
			{
				solidPrefix = 'solid-';
				bBoxPrefix = 'wireframe-';
			}
			else if ($('.solid-selection:disabled').data('model-type') == CSG_MODEL)
			{
				solidPrefix = 'csg-solid-';
				bBoxPrefix = 'csg-bbox-';
			}

			var material = scene.getObjectByName(bBoxPrefix+$('.solid-selection:disabled').data('index')).material;
			material.wireframeLinewidth = 1;
			material.color.set(
				scene.getObjectByName(solidPrefix+$('.solid-selection:disabled').data('index')).material.color
			);

			scene.getObjectByName(bBoxPrefix+$('.solid-selection:disabled').data('index')).material = material;
		}
	}

	function highlightCsgSolid(index) {
		var material = scene.getObjectByName('csg-bbox-'+index).material;
		material.wireframeLinewidth = 3;
		material.color.set('#f4e542');
		material.transparent = false;
		material.opacity = 1;
		material.wireframe = true;
		material.depthWrite = true;
		scene.getObjectByName('csg-bbox-'+index).material = material;
		$('.show-bbox[type=checkbox][value='+index+'][data-model-type='+CSG_MODEL+']').prop('checked', true);
	}

	$(document).on('click', '#solid-deselection', function() {
		unhighlightSolid();
		$('.solid-selection:disabled').prop('disabled', false)
	})
	$(document).on('click', '.solid-selection', function() {
		// un-highlight any previous highlighted
		unhighlightSolid();

		$('.solid-selection:disabled').prop('disabled', false);
		$(this).prop('disabled', true);

		
		// HIGHLIGHT
		// show wireframe if it is not showing already
		var prefix;
		if ($(this).data('model-type') == OCTREE_MODEL) {
			prefix = 'wireframe-';
		}
		else if  ($(this).data('model-type') == CSG_MODEL)
		{
			prefix = 'csg-bbox-';
		}

		var bbox = $('.show-bbox[type=checkbox][value='+$(this).data('index')+'][data-model-type='+$(this).data('model-type')+']');
		if (!bbox.is(':checked'))
			bbox.click();

		var material = scene.getObjectByName(prefix+$(this).data('index')).material;
		material.wireframeLinewidth = 3;
		material.color.set('#f4e542');
		scene.getObjectByName(prefix+$(this).data('index')).material = material;
	});


	/***
	**** CHANGE SOLID COLOR
	*/
	$(document).on('change', '.solid-color[data-model-type='+OCTREE_MODEL+']', function() {
		scene.getObjectByName('solid-'+$(this).data('index')).material.color.set($(this).val());
		scene.getObjectByName('wireframe-'+$(this).data('index')).material.color.set($(this).val());
	});

	$(document).on('change', '.solid-color[data-model-type='+CSG_MODEL+']', function() {
		scene.getObjectByName('csg-solid-'+$(this).data('index')).material.color.set($(this).val());
		scene.getObjectByName('csg-bbox-'+$(this).data('index')).material.color.set($(this).val());
	});

	/***
	**** SHOWING/HIDING SOLID/WIREFRAME
	*/
	$(document).on('change', '.show-solid[type=checkbox]', function() {
		
		var obj;
		if ($(this).data('model-type') == OCTREE_MODEL)
			obj = scene.getObjectByName('solid-'+$(this).val());
		else if ($(this).data('model-type') == CSG_MODEL)
			obj = scene.getObjectByName('csg-solid-'+$(this).val());

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

	$(document).on('change', '.show-bbox[type=checkbox]', function() {
		
		var obj;
		if ($(this).data('model-type') == OCTREE_MODEL)
			obj = scene.getObjectByName('wireframe-'+$(this).val());
		else if ($(this).data('model-type') == CSG_MODEL)
			obj = scene.getObjectByName('csg-bbox-'+$(this).val());

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
	**** SHOW/HIDE SET MEMBERSHIP RAYCAST
	*/
	$(document).on('change', '.show-smc[data-model-type='+CSG_MODEL+']', function() {
		if ($(this).is(':checked')) {
			scene.getObjectByName('csg-solid-'+$(this).val()).material.opacity = 0.3;

			setSmcRaycast(csg_solids[$(this).val()], $(this).val());
		} else {
			scene.getObjectByName('csg-solid-'+$(this).val()).material.opacity = 1;
			scene.remove(scene.getObjectByName('smc-raycast-'+$(this).val()));
		}
	});

	/***
	**** EXPORT AND IMPORT
	*/
	var getSelectedSolidIndex = function() {
		return parseInt($('.solid-selection:disabled').data('index'))
	};

	var getSelectedSolidModelType = function() {
		return parseInt($('.solid-selection:disabled').data('model-type'))
	};

	// export all solids
	$(document).on('click', '#export', function() {
		var output, i, color, obj;

		output = '';

		for (i = 0; i < solids.length; i++)
		{
			if (solids[i] != null) {
				color = scene.getObjectByName('solid-'+i).material.color;
				// console.log(color);
				output += '#c ' + [color.r, color.g, color.b].join(' ') + '\n';

				// minor vertex
				obj = [
					'O',
					// minor vertex
					solids[i].center.x - solids[i]._octree.boundingBox.edge/2,
					solids[i].center.y - solids[i]._octree.boundingBox.edge/2,
					solids[i].center.z - solids[i]._octree.boundingBox.edge/2,

					solids[i]._octree.boundingBox.edge,
					solids[i].toString()
				]
				output += obj.join(' ') + '\n';
			}
		}

		for (i = 0; i < csg_solids.length; i++)
		{
			if (csg_solids[i] != null)
			{
				color = scene.getObjectByName('csg-solid-'+i).material.color;
				// console.log(color);
				output += '#c ' + [color.r, color.g, color.b].join(' ') + '\n';
				output += exportCsg(csg_solids[i]) + '\n';
			}
		}

		console.log(output);

	});

	$(document).on('submit', '#import-form', function() {
		var pos, bBoxEdge, boolAddColored = false;

		var this_id = $(this).attr('id'),
			this_elem = $(this);

		var input = $(this).find('textarea[name=code]').val();
		input = input.split('\n');
		console.log(input);

		// rendering
		var loading = new HUD.Loading(
			'Importing solid(s)...')
			.show();

		var color;

		// reason to use timeout: a solid would be calculated BEFORE showing a loading
		setTimeout(function() {

			color = null;
			for (var i = 0; i < input.length; i++)
			{
				importOnlyOctreeFromString(input[i].trim());

			}

			this_elem.toggle();

			loading.endTimer().hide(3000);
		}, 15);

		return false;

	});

	$(document).on('submit', '#csg-import-form', function() {
		var input = $(this).find('textarea[name=code]').val();
		input = input.split('\n');

		// rendering
		var loading = new HUD.Loading(
			'Importing solid(s)...')
			.show();


		// reason to use timeout: a solid would be calculated BEFORE showing a loading
		setTimeout(function() {

			color = null;
			for (var i = 0; i < input.length; i++)
			{
				var output = importString(input[i].trim());

				if (output != null && output.type == 'Color')
					color = output.rgb;

				else if (output != null && output.type == 'Solids')
				{
					for (var j = 0; j < output.octree.length; j++)
						addSolid(output.octree[j], color);

					for (var j = 0; j < output.csg.length; j++)
						if (output.csg[j] != null)
							addCsgSolid(output.csg[j], color);

					color = null;
				}

				
			}

		loading.endTimer().hide(3000);
		}, 15);

		return false;
	});

	/*******
	******** DUPLICATE AND DELETE
	*/
	// gets index (int) of a selected solid, then solids[index].toString()
	$(document).on('click', '#duplicate', function() {
		if(!isNaN(getSelectedSolidIndex())) {
			if (getSelectedSolidModelType() == OCTREE_MODEL) {
			
				var original = [
					scene.getObjectByName('solid-'+getSelectedSolidIndex()),
					scene.getObjectByName('wireframe-'+getSelectedSolidIndex())
				];

				var oldSolid = solids[getSelectedSolidIndex()];
				var newSolid = new Primitives.Solid({
					x: oldSolid.center.x,
					y: oldSolid.center.y,
					z: oldSolid.center.z,
				});
				newSolid.duplicateFrom(oldSolid);

				solids.push(newSolid)
				var newIndex = solids.length - 1;

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

				scene.add(duplicatedMesh);

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
				scene.add(duplicatedWireframe);

				// pass the color from the duplicated solid

				addSelectionSolidButton(newIndex, OCTREE_MODEL,
					'#'+duplicatedMesh.material.color.getHex().toString(16)
				);
			}
			else if (getSelectedSolidModelType() == CSG_MODEL)
			{
				// pass the color from the duplicated solid
				color = scene.getObjectByName('csg-solid-'+getSelectedSolidIndex()).material.color;
				addCsgSolid(csg_solids[getSelectedSolidIndex()], color);
			}
		} else {
			alert('Select a solid!');
		}
	});

	function destroyOctreeSolid(index) {
		solids[index] = null;

		scene.remove(scene.getObjectByName('solid-'+index));
		scene.remove(scene.getObjectByName('wireframe-'+index));

		$('#window-solids div[data-index="'+index+'"][data-model-type="'+OCTREE_MODEL+'"]').remove()
	}

	function destroyCsgSolid(index) {
		csg_solids[index] = null;

		scene.remove(scene.getObjectByName('csg-solid-'+index));
		scene.remove(scene.getObjectByName('csg-bbox-'+index));

		$('#window-solids div[data-index="'+index+'"][data-model-type="'+CSG_MODEL+'"]').remove()
	}

	$(document).on('click', '#delete', function() {
		var index = getSelectedSolidIndex();

		if(!isNaN(index)) {
			if (confirm("Delete?")) {
				if (getSelectedSolidModelType() == OCTREE_MODEL)
					destroyOctreeSolid(index);
				else if (getSelectedSolidModelType() == CSG_MODEL)
					destroyCsgSolid(index)
			}
		} else {
			alert('Select a solid!');
		}
	});

	$(document).on('submit', '.transform-form', function() {
		var op, defaultValue;
		var this_elem = $(this);

		if ($(this).attr('id') == 'translate-form') {
			op = 'Translating';
			defaultValue = 0;
		}
		else if ($(this).attr('id') == 'scale-form') {
			op = 'Scaling';
			defaultValue = 1;
		}
		else if ($(this).attr('id') == 'rotate-form') {
			op = 'Rotating';
			defaultValue = 0;
		}

		pos = {
			x: $(this).find('input[name=x]').val() == '' ? defaultValue : parseFloat($(this).find('input[name=x]').val()),
			y: $(this).find('input[name=y]').val() == '' ? defaultValue : parseFloat($(this).find('input[name=y]').val()),
			z: $(this).find('input[name=z]').val() == '' ? defaultValue : parseFloat($(this).find('input[name=z]').val())
		};

		var i = getSelectedSolidIndex();
		var type = getSelectedSolidModelType();

		if (isNaN(i)) {
			alert('Select a solid!');
			return false;
		}

		if(modelType != type) {
			if (modelType == OCTREE_MODEL)
				alert('Change to CSG Window to be able to transform this solid');
			else if (modelType == CSG_MODEL)
				alert('Change to OCTREE Window to be able to transform this solid');

			return false;
		}

		var loading = new HUD.Loading(
		op+'...')
		.show();

		var obj, wire;

		setTimeout(function() {

			this_elem.find('input[type=text]').val(defaultValue) // reset
			
			if (type == OCTREE_MODEL) {
				obj = scene.getObjectByName('solid-'+i);
				wire = scene.getObjectByName('wireframe-'+i);


				if (op == 'Translating') {
					solids[i].translate(pos);

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
					obj.scale.set(pos.x, pos.y, pos.z);
					wire.scale.set(pos.x, pos.y, pos.z);
				}
				else if (op == 'Rotating')
				{
					obj.rotateX(pos.x/180 * Math.PI);
					obj.rotateY(pos.y/180 * Math.PI);
					obj.rotateZ(pos.z/180 * Math.PI);
					wire.rotateX(pos.x/180 * Math.PI);
					wire.rotateY(pos.y/180 * Math.PI);
					wire.rotateZ(pos.z/180 * Math.PI)
				}
			}
			else if (type == CSG_MODEL)
			{
				previousColor = scene.getObjectByName('csg-solid-'+i).material.color;

				scene.remove(scene.getObjectByName('csg-solid-'+i));
				scene.remove(scene.getObjectByName('csg-bbox-'+i));

				if (op == 'Translating')
					csg_solids[i] = new CSG.NodeTranslate(csg_solids[i], pos);
				else if (op == 'Scaling')
					csg_solids[i] = new CSG.NodeScale(csg_solids[i], pos);
				else if (op == 'Rotating')
					csg_solids[i] = new CSG.NodeRotate(csg_solids[i], pos);

				
				// setSmcRaycast(csg_solids[i], i); // update SMC Raycast

				addCsgSolidToScene(csg_solids[i].geometry(), i);

				updateColor(i, CSG_MODEL, previousColor);

				highlightCsgSolid(i);

				
			}

			// $(this).find('input[name=x]').val(0)

			loading.endTimer().hide(3000);


		}, 15);

		return false;
	});

	$(document).on('click', '.scale-octree', function() {
		var factor = parseFloat($(this).parent().find('input[name=factor]').val());

		var i = getSelectedSolidIndex();

		if (isNaN(i))
			return alert('Select a solid!');
		
		if (factor == 0)
			return alert('The factor can\'t be zero');

		solids[i].scale(factor);

		var obj = scene.getObjectByName('solid-'+i);
		var wire = scene.getObjectByName('wireframe-'+i);

		$(this).parent().find('input[name=factor]').val(1);

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
	$(document).on('click', '#boolean-form .submit-button', function() {
		var
			a = parseInt($(this).parent().find('input[name=a]').val()) - 1,
			b = parseInt($(this).parent().find('input[name=b]').val()) - 1;

			
		// var loading = new HUD.Loading(
		// 	'Importing solid...')
		// 	.show();

		// reason to use timeout: a solid would be calculated BEFORE showing a loading
		// setTimeout(function() {
		var solid;

		if (modelType == OCTREE_MODEL) {
			solid = new Primitives.Solid({x:0,y:0,z:0});

			if ($(this).val() == 'Union')
				solid.union(solids[a], solids[b]);
			else if ($(this).val() == 'Intersection')
				solid.intersection(solids[a], solids[b]);
			else if ($(this).val() == 'Difference')
				solid.difference(solids[a], solids[b]);

			addSolid(solid);

			if ($(this).parent().find('input[name=destroy-first]').is(':checked'))
				destroyOctreeSolid(a)

			if ($(this).parent().find('input[name=destroy-second]').is(':checked'))
				destroyOctreeSolid(b)
		}
		else if (modelType = CSG_MODEL)
		{
			if ($(this).val() == 'Union')
				solid = new CSG.NodeUnion(csg_solids[a], csg_solids[b]);
			else if ($(this).val() == 'Intersection')
				solid = new CSG.NodeIntersect(csg_solids[a], csg_solids[b]);
			else if ($(this).val() == 'Difference')
				solid = new CSG.NodeDifference(csg_solids[a], csg_solids[b]);

			addCsgSolid(solid);

			if ($(this).parent().find('input[name=destroy-first]').is(':checked'))
				destroyCsgSolid(a)

			if ($(this).parent().find('input[name=destroy-second]').is(':checked'))
				destroyCsgSolid(b)
		}

		// 	loading.endTimer().hide(3000);
		// }, 15);

	});

	
	////// MISC
	$(document).on('change', '#show-grid', function() {
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
	});

	// KEYBOARD EVENTS
	$(document).on('keypress', function(e) {
		// console.log('keypress: ' + e.which);
		if ((e.which == 88 || e.which == 120) || (e.key == 88 || e.key == 120))  // x or X
		{
			$('input#delete').click();
		}
		else if ((e.which == 100 || e.which == 68) || (e.key == 100 || e.key == 68)) // d or D
		{
			$('input#duplicate').click();
		}
		else if ((e.which == 97 || e.which == 65) || (e.key == 97 || e.key == 65)) // a or A
		{
			$('input#solid-deselection').click();
		}

	});



});