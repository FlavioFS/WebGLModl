$(document).ready(function() {
	init();
	animate();

	$('div').draggable({handle: '.draggable'});
	$('.resizable').resizable();

	/** CUBE **/
	$('#new-cube').click(function() {
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
				<input type='checkbox' name='render-inside' /> Render inside?<br />
				<input type='checkbox' name='render-colored' /> Render colored?<br />
				<input type='submit' value='Create' />
			</form>
			`);
	})


	/** CONE **/
	$('#new-cone').click(function() {
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
				<input type='checkbox' name='render-inside' /> Render inside?<br />
				<input type='checkbox' name='render-colored' /> Render colored?<br />
				<input type='submit' value='Create' />
			</form>
			`);
	})

	/** Cylinder **/
	$('#new-cylinder').click(function() {
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
				<input type='checkbox' name='render-inside' /> Render inside?<br />
				<input type='checkbox' name='render-colored' /> Render colored?<br />
				<input type='submit' value='Create' />
			</form>
			`);
	})

	/** TORUS **/
	$('#new-torus').click(function() {
		$(this).after(`
			<form id='torus-form' action='#'>
				<label>X: <input type='text' name='x' size='4' value='0' /></label> |
				<label>Y: <input type='text' name='y' size='4' value='0' /></label> |
				<label>Z: <input type='text' name='z' size='4' value='0' /></label>
				<br />
				<label>Radius: <input type='text' name='radius' size='4' value='1' /></label><br />
				<label>Tube Radius: <input type='text' name='tubeRadius' size='4' value='1' /></label><br />
				<label for='precision'>Precision</label>
				<select name="precision" id="minbeds">
					<option>1</option>
					<option>2</option>
					<option selected>3</option>
					<option>4</option>
					<option>5</option>
				</select><br />
				<input type='checkbox' name='render-inside' /> Render inside?<br />
				<input type='checkbox' name='render-colored' /> Render colored?<br />
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
				solid = new Primitives.SolidSphere(pos, e/2, true)
				solid.calcOctree(1);
				// console.log(solid.octree);
				var model = solid.model();
				if (model) addToScene(model);
				else console.log("Empty model!!");	

				this_elem.remove()

				loading.endTimer().hide(5000);
			}, 10);
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

				if (this_id == 'sphere-form')
					solid = new Primitives.SolidSphere(pos, r, renderInside)
				else if (this_id == 'cone-form')
					solid = new Primitives.SolidCone(pos, r, h, renderInside)
				else if (this_id == 'cylinder-form')
					solid = new Primitives.SolidCylinder(pos, r, h, renderInside)
				else if (this_id == 'torus-form')
					solid = new Primitives.SolidTorus(pos, r, t, renderInside)
					
				solid.calcOctree(precision);
				// console.log(solid.octree);
				if (boolAddColored)
					solid.addToSceneColored(scene, precision, 0)
				else {
					var model = solid.model();
					if (model) addToScene(model);
					else console.log("Empty model!!");	
				}

				this_elem.remove()

				loading.endTimer().hide(5000);
			}, 50);
		}

		return false;
	});

});