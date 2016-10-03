$(document).ready(function() {
	init();
	animate();

	$('div').draggable({handle: '.draggable'});
	$('.resizable').resizable();

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
				<label><input type='checkbox' name='render-inside' /> Render inside?<label><br />
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
				<label><input type='checkbox' name='render-inside' /> Render inside?</label><br />
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
				<label><input type='checkbox' name='render-inside' /> Render inside?<label><br />
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
				var index = solids.push(new Primitives.SolidSphere(pos, e/2, true)) - 1;
				solids[index].calcOctree(1);
				// console.log(solids[index].octree);
				var model = solids[index].model();
				if (model) addToScene(model);
				else console.log("Empty model!!");	

				this_elem.remove()

				loading.endTimer().hide(5000);
			}, 10);
	});

	$(document).on('submit', 'form', function() {
		var pos, r, h, precision, renderInside, boolAddColored = false;

		var this_id = $(this).attr('id'),
			this_elem = $(this);
		
		if (this_id == 'cone-form' || this_id == 'cylinder-form') {
			h = parseFloat($(this).find('input[name=height]').val());
		}

		if (this_id == 'sphere-form'
			|| this_id == 'cone-form'
			|| this_id == 'cylinder-form') {

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

				var index;
				if (this_id == 'sphere-form')
					index = solids.push(new Primitives.SolidSphere(pos, r, renderInside)) - 1;
				else if (this_id == 'cone-form')
					index = solids.push(new Primitives.SolidCone(pos, r, h, renderInside)) - 1;
				if (this_id == 'cylinder-form')
					index = solids.push(new Primitives.SolidCylinder(pos, r, h, renderInside)) - 1;
					
				solids[index].calcOctree(precision);
				// console.log(solid.octree);
				if (boolAddColored)
					solids[index].addToSceneColored(scene, precision, 0)
				else {
					var model = solids[index].model();
					if (model) addToScene(model);
					else console.log("Empty model!!");	
				}

				this_elem.remove()

				loading.endTimer().hide(5000);
			}, 50);
		}

		return false;
	});
	

	/***
	**** SOLID SELECTION
	*/
	$(document).on('click', '#solid-deselection', function() {
		$('.solid-selection:disabled').prop('disabled', false)
	})
	$(document).on('click', '.solid-selection', function() {
		$('.solid-selection:disabled').prop('disabled', false)
		$(this).prop('disabled', true)

		var index = parseInt($(this).data('index'))
	})

	/***
	**** EXPORT AND IMPORT
	*/

	// gets index (int) of a selected solid, then solids[index].toString()
	$(document).on('click', '#export', function() {
		try {
			console.log(
				solids[
					parseInt($('.solid-selection:disabled').data('index'))
				].toString());
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
				<input type='submit' value='import solid' />
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

			var index = solids.push(new Primitives.Solid(pos)) - 1;
			solids[index].fromString(code, bBoxEdge);
			if (boolAddColored)
				solids[index].addToSceneColored(scene, 0, 0)
			else {
				var model = solids[index].model();
				if (model) addToScene(model);
				else console.log("Empty model!!");	
			}

			this_elem.remove()

			loading.endTimer().hide(5000);
		}, 50);

	});


});