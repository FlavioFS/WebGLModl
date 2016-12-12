var brepHtml = `
	<div class='toggle-form-area'>
		<input type="button" value="Create Primitive " id="create-primitive">
		<input type="button" value="MVFS" id="mvfs">
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

	<!--<form id="kev" action="#">
		Select one edge which is not connected to any face<br />
		<input type="submit" value="KEV">
	</form>-->

	<form action="#">
		<p style="font-size: 12pt !important; text-align:center">Adjacency Operators</p>
		Select edge(s)<br />
		<input id="ev" type="button" value="EV"> <input id="ee" type="button" value="EE">
		<br /><br />
		Select face: <select id="select-face"></select><br />
		<input id="fe" type="button" value="FE">
	</form>

	<input id="calculate-brep-area" type="button" value="Calculate Area">

	<hr>
	<hr>
	<p style="font-size: 12pt !important;">
	<strong>Hotkeys</strong>:<br >
	<strong>[A]</strong> Deselect all vertices/edges<br />
	<strong>[F]</strong> MEF<br />
	</p>

	<label><input id="show-grid" type="checkbox" name="show-grid" checked=""> Show Grid</label><br><br />
	<br />
`