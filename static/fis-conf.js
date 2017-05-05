fis.hook('amd', {
    baseUrl: "./js",
    paths: {
        'Handlebars': 'lib/handlebars.runtime-v3.0.3',
        'IScroll': "lib/iscroll",
        'jquery': 'lib/jquery-2.1.4',
        'jweixin': 'lib/jweixin-1.2.0.js',
        'jValidate': "lib/jquery.validate",
    },
    shim: {
        "Iscroll": {
            exports: "IScroll"
        }
    }
});
fis.match('*.{js,css}', {
    useHash: true
});

fis.match('*', {
    release: '/static/$0'
});

fis.match('*.html', {
    release: '/$0'
});

//npm install -g fis-parser-handlebars-3.x
fis.match('*.handlebars', {
    rExt: '.js', // from .handlebars to .js 虽然源文件不需要编译，但是还是要转换为 .js 后缀
    parser: fis.plugin('handlebars-3.x', {
        //fis-parser-handlebars-3.x option
    }),
    release: false // handlebars 源文件不需要编译
});

fis.match('::package', {
    postpackager: fis.plugin('loader', {
        // allInOne: true,
        sourceMap: true,
        useInlineMap: true
    })
});

fis.media("prod")
    .match('::package', {
        postpackager: fis.plugin('loader', {
            allInOne: {
                includeAsyncs: true
            }
        })
    })
    .match('/js/require.js', {
        packTo: '/pkg/common.js',
        packOrder: -100
    })
    .match('/js/lib/jquery-2.1.4.js', {
        packTo: '/pkg/common.js',
        packOrder: -90
    })
    .match('/js/app/config.js', {
        packTo: '/pkg/config.js'
    })
    .match('/js/module/**', {
        requires: ['/js/require.js']
    })
    .match('{/js/lib/*.js,/js/app/util/*.js,/js/app/module/loading/loading.js}', {
        requires: ['/js/require.js'],
        packTo: '/pkg/common.js'
    })
    .match("**.js", {
        optimizer: fis.plugin('uglify-js')
    })
    .match("**.css", {
        optimizer: fis.plugin('clean-css')
    })
    .match("/css/*.css", {
        packTo: '/pkg/common.css'
    })
    .match('**.png', {
        optimizer: fis.plugin('png-compressor')
    });