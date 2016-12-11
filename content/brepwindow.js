var brepHtml = `
	<div class='toggle-form-area'>
		<input type="button" value="New Mesh" id="new-mesh">
		<!--<input type="button" value="MEV" id="">-->
		
	</div>
	<form id="mev" action="#">
		New vertex position:<br />
		<label>X: <input type="text" name="x" size="4" value="0"></label> |
		<label>Y: <input type="text" name="y" size="4" value="0"></label> |
		<label>Z: <input type="text" name="z" size="4" value="0"></label>
		<input type="submit" value="MEV">
	</form>
	<form id="mef" action="#">
		Select two edges<br />
		<input type="submit" value="MEF">
	</form>
	<label><input id="show-grid" type="checkbox" name="show-grid" checked=""> Show Grid</label><br><br />
`