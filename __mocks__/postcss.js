'use strict';

const postcss = jest.genMockFromModule('postcss');

let shouldThrowProcessError = false;

const process = (css, opts) => {
	if(shouldThrowProcessError) {
		throw new Error('error');
	}
	return Promise.resolve({
		css: css
	});
}

postcss.__setThrowProcessError = value => {
	shouldThrowProcessError = value;
};

postcss.mockReturnValue({
	process
});

module.exports = postcss;