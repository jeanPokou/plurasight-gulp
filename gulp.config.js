module.exports = function () {
    var client = './src/client/';
    var clientApp = client + 'app/';
    var temp = './.tmp/';

    // all js to vet
    var config = {

        /**
  * All the files path
  **/

        temp: temp,
        alljs: [
            './src/**/*.js',
        './*.js'
        ],
        client: client,
        index: client + 'index.html',
        js: [clientApp + '**/*.module.js',
             clientApp + '**/*.js',
            !clientApp + '**/*.spec.js'
            ],

        less: client + 'styles/styles.less',
        css: temp + 'styles.css',
        bower: {
            json: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'

        }
    };

    config.getWiredepDefaultsOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;

};
