const postCssPlugin = require('./index');

const srcFilepath1 = 'src/main1.css';
const destFilepath1 = 'dest/main1.css';
const cssContent1 = 'content1';

const srcFilepath2 = 'src/main2.css';
const destFilepath2 = 'dest/main2.css';
const cssContent2 = 'content2';

const plugin1 = { name: 'plugin1' };
const plugin2 = { name: 'plugin2' };

jest.mock('path');
jest.mock('postcss');

const postcss = require('postcss');
const fs = require('fs-extra');

const logger = {
	info: () => jest.fn(),
	warn: () => jest.fn(),
	error: () => jest.fn()
};

const options = {
	logger
};

beforeEach(() => {
	jest.clearAllMocks();
	postcss.__reset();

 	require('fs-extra').__setMockFiles({
		[srcFilepath1]: cssContent1,
		[srcFilepath2]: cssContent2
	});
});

test('run() returns an error status if no files configuration exists', () => {
	const expectedResponse = {
		status: 'error',
		message: 'Configuration does not contain a valid "files" property.'
	};

	expect.assertions(1);
	return postCssPlugin().run({}, options)
		.then(response => {
			expect(response).toEqual(expectedResponse);
		});
});

test('run() returns complete status when no files specified', () => {
	const expectedResponse = {
		status: 'complete',
		message: '0 stylesheet(s) processed.'
	};

	const config = {
		files: []
	};

	expect.assertions(1);
	return postCssPlugin().run(config, options)
		.then(response => {
			expect(response).toEqual(expectedResponse);
		});
});

test('run() returns complete status when 1 file specified', () => {
	const config = {
		files: [
			{
				src: srcFilepath1,
				dest: destFilepath1
			}
		]
	}

	const expectedResponse = {
		status: 'complete',
		message: '1 stylesheet(s) processed.'
	}

	expect.assertions(1);
	return postCssPlugin().run(config, options)
		.then(response => {
			expect(response).toEqual(expectedResponse);
		});
});

test('run() returns an error status when an error occurs', () => {
	postcss.__setThrowProcessError(true);

	const config = {
		files: [
			{
				src: srcFilepath1,
				dest: destFilepath1
			}
		]
	};

	const expectedResponse = {
		status: 'error',
		message: 'error'
	};

	expect.assertions(1);
	return postCssPlugin().run(config, options)
		.then(response => {
			expect(response).toEqual(expectedResponse);
		});
});

test('run() processes one file with expected PostCSS plugins', () => {
	const config = {
		files: [
			{
				src: srcFilepath1,
				dest: destFilepath1
			}
		],
		plugins: [
			plugin1,
			plugin2
		]
	}

	expect.assertions(1);
	return postCssPlugin().run(config, options)
		.then(response => {
			expect(postcss).toBeCalledWith([plugin1, plugin2]);
		});
});

test('run() processes one file with expected source CSS', () => {
	const postcssProcessSpy = jest.spyOn(postcss(), 'process')

	const config = {
		files: [
			{
				src: srcFilepath1,
				dest: destFilepath1
			}
		],
		plugins: []
	}

	expect.assertions(1);
	return postCssPlugin().run(config, options)
		.then(response => {
			expect(postcssProcessSpy).toBeCalledWith(cssContent1, {
				from: srcFilepath1,
				to: destFilepath1
			});
		});
});

test('run() writes one file to destination', () => {
	const fsEnsureDirSpy = jest.spyOn(fs, 'ensureDir');
	const fsWriteFileSpy = jest.spyOn(fs, 'writeFile');

	const config = {
		files: [
			{
				src: srcFilepath1,
				dest: destFilepath1
			}
		]
	}

	expect.assertions(2);
	return postCssPlugin().run(config, options)
		.then(response => {
			expect(fsEnsureDirSpy).toBeCalledWith('dest');
			expect(fsWriteFileSpy).toBeCalledWith(destFilepath1, cssContent1);
		});
});

test('run() writes multiple files to destinations', () => {
	const fsWriteFileSpy = jest.spyOn(fs, 'writeFile');

	const config = {
		files: [
			{
				src: srcFilepath1,
				dest: destFilepath1
			},
			{
				src: srcFilepath2,
				dest: destFilepath2
			}
		]
	}

	expect.assertions(3);
	return postCssPlugin().run(config, options)
		.then(response => {
			expect(fsWriteFileSpy.mock.calls.length).toBe(2);
			expect(fsWriteFileSpy.mock.calls[0]).toEqual([destFilepath1, cssContent1]);
			expect(fsWriteFileSpy.mock.calls[1]).toEqual([destFilepath2, cssContent2]);
		});
});



test('run() writes multiple destination files from one source', () => {
    const fsWriteFileSpy = jest.spyOn(fs, 'writeFile');


    const config = {
        files: [
            {
                src: srcFilepath1,
                dest: [destFilepath1, destFilepath2]
            }
        ]
    };


    expect.assertions(3);
    return postCssPlugin().run(config, options)
        .then(response => {
            expect(fsWriteFileSpy.mock.calls.length).toBe(2);
            expect(fsWriteFileSpy.mock.calls[0]).toEqual([destFilepath1, cssContent1]);
            expect(fsWriteFileSpy.mock.calls[1]).toEqual([destFilepath2, cssContent1]);
        });
});

test('run() displays warnings', async () => {
	loggerWarnSpy = jest.spyOn(logger, 'warn');

	const config = {
		files: [
			{
				src: srcFilepath1,
				dest: destFilepath1
			}
		]
	};

	postcss.__setWarnings([
		'warning 1',
		'warning 2'
	]);

	await postCssPlugin().run(config, options);

	const expectedWarning1 = 'warning: warning 1';
	const expectedWarning2 = 'warning: warning 2';

	expect(loggerWarnSpy).toHaveBeenCalledTimes(2);
	expect(loggerWarnSpy.mock.calls[0]).toEqual([expectedWarning1]);
	expect(loggerWarnSpy.mock.calls[1]).toEqual([expectedWarning2]);
});