'use strict';

const path = jest.genMockFromModule('path');

const resolve = (dir, filepath) => {
	return filepath;
}

const dirname = filePath => {
	return 'dest';
}

path.resolve = resolve;
path.dirname = dirname;

module.exports = path;