# Skeletor PostCSS Plugin
![Run Tests](https://github.com/deg-skeletor/skeletor-plugin-postcss/workflows/Run%20Tests/badge.svg)


This plugin transforms CSS using [PostCSS](https://github.com/postcss/postcss) and is part of the Skeletor ecosystem. To learn more about Skeletor, [go here](https://github.com/deg-skeletor/skeletor-core).

## Installation
Install this plugin into your Skeletor-equipped project via the following terminal command:
```
    npm install --save-dev @deg-skeletor/plugin-postcss
```

## Configuration

### Example Configuration

```
{
	"files": [
		{
			"src": "source/css/styles.css",
			"dest": "dist/css/styles.css"
		}
	],
	"plugins": [
	    require('cssnext')
		require('cssnano')
	]
}
```
### Multiple Destinations

```
"src": "source/css/styles.css",
"dest": ["dist/css/styles.css", "dist/css/styles2.css"]
```

### Configuration Options

#### files
Type: `Array`
An array of one or more file objects, each containing `src` and `dest` properties. A file object represents a  source CSS file that will be transformed by PostCSS and written to the specified destination filepath.

#### plugins
Type: `Array`
An array of one or more PostCSS plugins. These plugins will be passed directly to PostCSS. _Note: you will need to install these PostCSS plugins into your project in order to use them._
