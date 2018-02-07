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

beforeEach(() => {
 	require('fs-extra').__setMockFiles({ 
		[srcFilepath1]: cssContent1,
		[srcFilepath2]: cssContent2
	});
});

test('run() processes one file with expected PostCSS plugins', () => {
	const postcss = require('postcss');
	
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
	return postCssPlugin().run(config)
		.then(response => {
			expect(postcss).toBeCalledWith([plugin1, plugin2]);
		});
});

test('run() processes one file with expected source CSS', () => {
	const postcss = require('postcss')();
	const postcssProcessSpy = jest.spyOn(postcss, 'process')
	
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
	return postCssPlugin().run(config)
		.then(response => {
			expect(postcssProcessSpy).toBeCalledWith(cssContent1, {
				from: srcFilepath1,
				to: destFilepath1
			});
		});
});

test('run() writes one file to destination', () => {
	const fs = require('fs-extra');
	const fsWriteFileSpy = jest.spyOn(fs, 'writeFile');
	
	const config = {
		files: [
			{
				src: srcFilepath1,
				dest: destFilepath1
			}
		]
	}

	expect.assertions(1);
	return postCssPlugin().run(config)
		.then(response => {
			expect(fsWriteFileSpy).toBeCalledWith(destFilepath1, cssContent1);
			fsWriteFileSpy.mockReset();
  			fsWriteFileSpy.mockRestore();
		});
});

test('run() writes multiple files to destinations', () => {
	const fs = require('fs-extra');
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
	return postCssPlugin().run(config)
		.then(response => {
			expect(fsWriteFileSpy.mock.calls.length).toBe(2);
			expect(fsWriteFileSpy.mock.calls[0]).toEqual([destFilepath1, cssContent1]);
			expect(fsWriteFileSpy.mock.calls[1]).toEqual([destFilepath2, cssContent2]);
			fsWriteFileSpy.mockReset();
  			fsWriteFileSpy.mockRestore();
		});
});