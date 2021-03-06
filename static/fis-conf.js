fis.hook('amd', {
    baseUrl: "./js",
    paths: {
        'Handlebars': 'lib/handlebars.runtime-v3.0.3',
        'IScroll': "lib/iscroll/iscroll",
        'jweixin': 'lib/jweixin-1.0.0',
        'jValidate': "lib/jquery.validate",
        'jquery': "lib/jquery-2.1.4"
    },
    shim: {
        "IScroll": {
            exports: "IScroll"
        },
        "iScroll": {
            exports: "iScroll"
        }
    }
});
fis.match('*', {
    release: '/static/$0',
    //useMap: true
});
fis.match('*.html', {
    release: '/$0'
});
fis.match('*.{js,css}', {
    useHash: true
}).match('config.js', {
    useHash: false
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
    .match('{/js/app/util/ajax.js,/js/app/util/cookie.js,/js/app/util/dialog.js,/js/app/module/loading/loading.js}', {
        requires: ['/js/require.js', '/js/lib/jquery-2.1.4.js'],
        packTo: '/pkg/common.js'
    })
    .match("**.js", {
        optimizer: fis.plugin('uglify-js')
    })
    .match("**.css", {
        optimizer: fis.plugin('clean-css')
    })
    .match('/js/app/config.js', {
        optimizer: null,
        packTo: '/config/config.js',
        useHash: false
    })
    .match('**.png', {
        optimizer: fis.plugin('png-compressor')
    });
