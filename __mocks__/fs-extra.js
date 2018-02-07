'use strict';

const fsExtra = jest.genMockFromModule('fs-extra');

let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
	mockFiles = {...newMockFiles};
}

const readFile = filepath => {
	return mockFiles[filepath] ? 
		Promise.resolve(mockFiles[filepath]) : 
		Promise.reject(`File "${filepath}" not found`);
}

const writeFile = (filepath, contents) => {
	return Promise.resolve(true);
}

fsExtra.__setMockFiles = __setMockFiles;
fsExtra.readFile = readFile;
fsExtra.writeFile = writeFile;

module.exports = fsExtra;