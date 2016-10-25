# Author: Flavio Freitas de Sousa, 2016/Aug/26
# Undergraduating in Computer Science
# Universidade Federal do Ceara (UFC), Brazil
#
# Converts OBJ models to JSON.
# Usage example:
#	line command:
#		$ python obj2json.py model.obj test
#	output:
#		test.js containing a javascript object: var MDL_test = {...};
#
# Code available under MIT License (This header cannot be separated from the code)


import sys
## Calculates face offset
def offset_calc():
	rv = 80000000;
	with open(str(sys.argv[1]), 'r') as inF:
		for line in inF:
			aline = line.split();
			if (aline[0] == 'f'):
				rv = min(rv, int(aline[1]), int(aline[2]), int(aline[3]));
	return rv;


def main():
	print(sys.argv);
	print(sys.argv[1]);
	print(sys.argv[2]);

	if (len(sys.argv) <= 0):
		print("No filepath provided. Run: obj2json.py <filepath> <output>");
		return;

	# Defining offset
	offset = offset_calc();

	# Calculating Vertex and Face lists
	vlist = "";
	flist = "";
	with open(str(sys.argv[1]), 'r') as inF:
		for line in inF:
			aline = line.split();
			if (aline[0] == 'v'):
				newVertex = "\t\t[" + aline[1] + ", " + aline[2] + ", " + aline[3] + "],\n";
				vlist += newVertex;
			elif (aline[0] == 'f'):
				newFace = "\t\t[" + str(int(aline[1]) - offset) + ", " + str(int(aline[2]) - offset) + ", " + str(int(aline[3]) - offset) + "],\n";
				flist += newFace;


	# Ready to write output
	outF = open(str(sys.argv[2]) + ".js", 'w');

	# Header
	outF.write('var MDL_' + sys.argv[2] + ' =\n');
	outF.write('{\n');
	outF.write('\t"material":\n');
	outF.write('\t{\n');
	outF.write('\t\tcolor: 0xAAAAFF,\n');
	outF.write('\t\tspecular: 0xDDDDFF,\n');
	outF.write('\t\tshininess: 30,\n');
	outF.write('\t\tshading: THREE.FlatShading\n');
	outF.write('\t},\n\n');
	outF.write('\t"vertices":\n');
	outF.write('\t[\n');

	# Vertex list
	outF.write(vlist);
	outF.write('\t],\n\n');
	outF.write('\t"faces":\n');
	outF.write('\t[\n');

	# Face list
	outF.write(flist);
	outF.write('\t]\n');
	outF.write('};');

main();