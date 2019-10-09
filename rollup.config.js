import pkg from './package.json'

export default {
	input: pkg.module,
	output: {
		file: pkg.main,
		format: 'umd',
		interop: false,
		name: pkg.name,
		banner: '/** AmbitJsX library - a neXt Ambit queries JavaScript library. Copyright © 2019, IDEAConsult Ltd. All rights reserved. @license MIT.*/',
		globals: { 
			"lodash" : "_",
			"as-sys": "a$",
			"commbase-jsx": "CommBase"
		}
	},
	external: [ "lodash", "as-sys", "commbase-jsx" ]
};
