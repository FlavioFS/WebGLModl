var MDL_basecube =
{
	"material":
	{
		color: 0x1DAFD4,
		specular: 0xBFF5EE,
		shininess: 30,
		shading: THREE.FlatShading
	},

	"vertices":
	[
	 		[ 1, 1, 1],
			[ 1,-1, 1],
			[-1,-1, 1],
			[-1, 1, 1],

			[ 1, 1,-1],
			[ 1,-1,-1],
			[-1,-1,-1],
			[-1, 1,-1]
	],

	"faces":
	[
			[0, 2, 1],
			[0, 3, 2],

			[0, 1, 4],
			[4, 1, 5],
			[0, 7, 3],
			[0, 4, 7],
			[3, 6, 2],
			[3, 7, 6],
			[1, 2, 6],
			[1, 6, 5],

			[4, 5, 6],
			[4, 6, 7]
	]
};