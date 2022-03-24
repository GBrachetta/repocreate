import welcome from 'cli-welcome';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./../package.json');

import unhandled from 'cli-handle-unhandled';

const init = ({ clear = true }) => {
	unhandled();
	welcome({
		title: `Repocreate`,
		tagLine: `by Guillermo Brachetta`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};

export default init;
