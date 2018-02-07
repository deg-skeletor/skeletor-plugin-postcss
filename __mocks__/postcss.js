'use strict';

const postcss = jest.genMockFromModule('postcss');

const process = (css, opts) => {
	return Promise.resolve({
		css: css
	});
}

postcss.mockReturnValue({
	process
});

module.exports = postcss;