'use strict';

const path = jest.genMockFromModule('path');

const resolve = (dir, filepath) => {
	return filepath;
}

path.resolve = resolve;

module.exports = path;