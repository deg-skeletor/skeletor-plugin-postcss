const postcss = require('postcss');
const fs = require('fs-extra');
const path = require('path');

const run = (config, {logger}) => {

	if(!Array.isArray(config.files)) {
		return Promise.resolve({
			status: 'error',
			message: 'Configuration does not contain a valid "files" property.'
		});
	}

	const promises = config.files.map(fileConfig => processFile(fileConfig, config.plugins));

	return Promise.all(promises)
		.then(() => {
			const message = `${config.files.length} stylesheet(s) processed.`;
			logger.info(message);
			return {
				status: 'complete',
				message: message
			};
		})
		.catch(e => {
			logger.error(e);
			return {
				status: 'error',
				message: e.message
			};
		});

};

const processFile = (fileConfig, plugins) => {
	const srcFilepath = path.resolve(process.cwd(), fileConfig.src);
	const destFilepath = path.resolve(process.cwd(), fileConfig.dest);

	return fs.readFile(srcFilepath)
		.then(contents =>
			postcss(plugins).process(contents, {
				from: srcFilepath,
				to: destFilepath
			})
		)
		.then(result => fs.writeFile(destFilepath, result.css));
};

module.exports = skeletorPluginPostCss = () => (
	{
		run
	}
);