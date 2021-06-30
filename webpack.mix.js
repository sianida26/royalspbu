const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.js('resources/js/app.js', 'public/js')

mix.webpackConfig({
    module:{
        rules: [
            {
                test: /.*wasm\.bin$/,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            }
        ]
    }
})
    
mix.postCss('resources/css/app.css', 'public/css', [
    require('tailwindcss'),
]);

// output untuk app
mix.ts("resources/js/RoyalSPBU/index.tsx","public/js/e86691c3").react()