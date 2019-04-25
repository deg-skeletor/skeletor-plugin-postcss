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

    const promises = config.files.map(fileConfig => processFile(fileConfig, config.plugins, logger));

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

const processFile = (fileConfig, plugins, logger) => {
    const destinationArray = [];
    const srcFilepath = path.resolve(process.cwd(), fileConfig.src);
	handleDestinations(fileConfig, destinationArray);

    const promises = destinationArray.map(dest => {
        const destFilepath = path.resolve(process.cwd(), dest);
        return fs.readFile(srcFilepath)
            .then(contents =>
                postcss(plugins).process(contents, {
                    from: srcFilepath,
                    to: destFilepath
                })
            )
            .then(result => {
                displayWarnings(result, logger);
                return fs.ensureDir(path.dirname(destFilepath))
                    .then(() => fs.writeFile(destFilepath, result.css));
			});
		});

		return Promise.all(promises);
};


const handleDestinations = (fileConfig, destinationArray) => {
    if(Array.isArray(fileConfig.dest)) {
        fileConfig.dest.map(dest => destinationArray.push(dest));
    } else {
        destinationArray.push(fileConfig.dest);
    }
};


const displayWarnings = (result, logger) => {
    const warnings = result.warnings();
    warnings.forEach(warning => logger.warn(`${warning.type}: ${warning.text}`));
};


module.exports = skeletorPluginPostCss = () => (
    {
        run
    }
);