// Generate global CSS from design tokens
// -> based heavily on Andy Picaccalilli's ideas in Gorko and Goron
// Gorko: https://github.com/andy-piccalilli/gorko
// Goron: https://github.com/hankchizljaw/goron
const fs = require('fs')
const path = require('path')

const modules = {
	borders: require('./borders.js'),
	breakpoints: require('./breakpoints.js'),
	color: require('./color.js'),
	contentWidth: require('./contentWidth.js'),
	reset: require('./reset.js'),
	scale: require('./scale.js'),
	spacing: require('./spacing.js'),
	specialEffects: require('./specialEffects.js'),
	type: require('./type.js'),
	visibility: require('./visibility.js')
}

function render (type) {
	return Object.values(modules).map((styles) => {
		if (styles[type]) {
			return `
				/* --- ${styles.name} --- */
				${Array.isArray(styles[type]) ? styles[type].join('') : styles[type]}
			`
		}
	}).join('\n')
}

const outputPath = '../../static/stylesheets'

if (!fs.existsSync(path.join(__dirname, outputPath))) {
	fs.mkdirSync(path.join(__dirname, outputPath))
}

fs.writeFileSync(
	path.join(__dirname, `${outputPath}/global.css`),
	`
		/* --- Global custom properties --- */
		:root {
			${render('customProperties')}
		}

		/* --- Base styles --- */
		${render('base')}

		/* --- Utility classes --- */
		${render('utilities')}
	`
)
