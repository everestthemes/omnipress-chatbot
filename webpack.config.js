const defaultConfigs = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );


module.exports = {
	...defaultConfigs,
    resolve:{
        ...defaultConfigs.resolve,
        alias: {
            ...defaultConfigs.resolve.alias,
            '@': path.resolve(__dirname, '.'),
        },
    }

}
