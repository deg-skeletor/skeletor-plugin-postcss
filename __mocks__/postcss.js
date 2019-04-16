'use strict';

const postcss = jest.genMockFromModule('postcss');
let warningsArr = [];
let shouldThrowProcessError = false;

const warnings = () => warningsArr;

const process = (css, opts) => {
	if(shouldThrowProcessError) {
		throw new Error('error');
	}
	return Promise.resolve({
		css,
		warnings
	});
}

postcss.__setThrowProcessError = value => {
	shouldThrowProcessError = value;
};

postcss.__setWarnings = messages => {
	warningsArr = messages.map(message => ({
		type: 'warning',
		text: message
	}));
}

postcss.__reset = () => {
	shouldThrowProcessError = false;
	warningsArr = [];
}

postcss.mockReturnValue({
	process
});

module.exports = postcss;