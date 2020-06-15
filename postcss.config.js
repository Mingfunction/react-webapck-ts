module.exports = {
    plugins: [
        //require('autoprefixer')({ browsers: ['last 5 version', '>1%', 'ie >=8'] })
        //overrideBrowserslist 版本比较高 browsers换成overrideBrowserslist
        require('autoprefixer')({ overrideBrowserslist: ['last 5 version', '>1%', 'ie >=8'] })
    ]
};
