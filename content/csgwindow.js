var csgHtml = `

<div class='toggle-form-area'>
		<input type="button" value="New Cube" id="new-cube" class="button-toggle-form">
		<form id="cube-form" class='new-primitive-form' action="#">
			<label>X: <input type="text" name="x" size="4" value="0"></label> |
			<label>Y: <input type="text" name="y" size="4" value="0"></label> |
			<label>Z: <input type="text" name="z" size="4" value="0"></label>
			<br>
			<label>Edge: <input type="text" name="edge" size="4" value="2"></label><br>
			<input type="submit" value="Create">
		</form>
	</div>
			
	<div class='toggle-form-area'>
		<input type="button" value="New Sphere" id="new-sphere" class="button-toggle-form">
		<form id="sphere-form" class='new-primitive-form' action="#">
			<label>X: <input type="text" name="x" size="4" value="0"></label> |
			<label>Y: <input type="text" name="y" size="4" value="0"></label> |
			<label>Z: <input type="text" name="z" size="4" value="0"></label>
			<br>
			<label>Radius: <input type="text" name="radius" size="4" value="1"></label><br>
			<input type="submit" value="Create">
		</form>
	</div>

	<div class='toggle-form-area'>
		<input type="button" value="New Cone" id="new-cone" class="button-toggle-form">
		<form id="cone-form" class='new-primitive-form' action="#">
			<label>X: <input type="text" name="x" size="4" value="0"></label> |
			<label>Y: <input type="text" name="y" size="4" value="0"></label> |
			<label>Z: <input type="text" name="z" size="4" value="0"></label>
			<br>
			<label>Radius: <input type="text" name="radius" size="4" value="1"></label><br>
			<label>Height: <input type="text" name="height" size="4" value="1"></label><br>
			<input type="submit" value="Create">
		</form>
	</div>
		
	<div class='toggle-form-area'>
		<input type="button" value="New Cylinder" id="new-cylinder" class="button-toggle-form">
		<form id="cylinder-form" class='new-primitive-form' action="#">
			<label>X: <input type="text" name="x" size="4" value="0"></label> |
			<label>Y: <input type="text" name="y" size="4" value="0"></label> |
			<label>Z: <input type="text" name="z" size="4" value="0"></label>
			<br>
			<label>Radius: <input type="text" name="radius" size="4" value="1"></label><br>
			<label>Height: <input type="text" name="height" size="4" value="1"></label><br>
			<input type="submit" value="Create">
		</form>
	</div>

	<div class='toggle-form-area'>
		<input type="button" value="New Torus" id="new-torus" class="button-toggle-form">
		<form id="torus-form" class='new-primitive-form' action="#">
			<label>X: <input type="text" name="x" size="4" value="0"></label> |
			<label>Y: <input type="text" name="y" size="4" value="0"></label> |
			<label>Z: <input type="text" name="z" size="4" value="0"></label>
			<br>
			<label>Radius: <input type="text" name="radius" size="4" value="1"></label><br>
			<label>Tube Radius: <input type="text" name="tubeRadius" size="4" value="1"></label><br>
			<input type="submit" value="Create">
		</form>
	</div>
	<hr>

	
	<input type="button" value="Export" id="export">

	<div class='toggle-form-area'>
		<input type="button" value="Import" id="import" class="button-toggle-form">
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
	</div>

	<hr>
	<input type="button" value="Duplicate Solid" id="duplicate">
	<input type="button" value="Delete Solid" id="delete">

	<form id="translate-form" class="transform-form" action="#">
		<label>X: <input type="text" name="x" size="4" value="0"></label> |
		<label>Y: <input type="text" name="y" size="4" value="0"></label> |
		<label>Z: <input type="text" name="z" size="4" value="0"></label>
		<input type="submit" value="Translate">
	</form>
	
	<form id="scale-form" class="transform-form" action="#">
		<label>X: <input type="text" name="x" size="4" value="1"></label> |
		<label>Y: <input type="text" name="y" size="4" value="1"></label> |
		<label>Z: <input type="text" name="z" size="4" value="1"></label>
		<input type="submit" value="Scale">
	</form>
	
	<form id="rotate-form" class="transform-form" action="#">
		<label>X: <input type="text" name="x" size="4" value="0"></label> |
		<label>Y: <input type="text" name="y" size="4" value="0"></label> |
		<label>Z: <input type="text" name="z" size="4" value="0"></label>
		<input type="submit" value="Rotate">
	</form>
	
	<form id="boolean-form" action="#">
		<label>Obj1: <input type="text" name="a" size="4" value="1"></label> -
		<label>Obj2: <input type="text" name="b" size="4" value="2"></label><br>
		<input class="submit-button" type="button" value="Union">
		<input class="submit-button" type="button" value="Intersection">
		<input class="submit-button" type="button" value="Difference"><br>
		Destroy original solids:<br> 
		<label>First <input type="checkbox" name="destroy-first"> </label><br>
		<label>Second <input type="checkbox" name="destroy-second"> </label><br>
	</form>
	

	<label><input id="show-grid" type="checkbox" name="show-grid" checked=""> Show Grid</label><br>
`;