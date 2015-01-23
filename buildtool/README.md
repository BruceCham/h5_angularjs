### An web front end uniform solution based on seajs
- first run `npm install` in package.json folder.
- below is the structure description for web multiple pages automatically build/deploy based on seajs module loader.

```
   the build/depoly engine structure diagram
   	seajs_web_solution
	├── biz_modules  (designed to wirte our business logics sea plugins)
	│	├── payment  --the empty plugin demo
	│	├── product  --the initialized plugin demo (`1.$ cd product/, 2. $: spm init`)
	│	│	├── dist  --store built result files.
	│	│	├── examples  --some test example for this plugin
	│	│	├── src  --the plugin source code
	│	│	├── tests --some test files 
	│	│	├── build.sh  --the build batch for mac linux,  deploy this plugin lib into /sea-modules/..
	│	│	├── build.bat  --the build batch for window,  deploy this plugin lib into /sea-modules/..
	│	│ └── package.json --the spm configurations for this plugin
	│ └── README.md
	├── mode_modules  --store all depends node modules, it config in /package.json, use `npm install` 
	│   ├── clean-css
	│   ├── commander
	│   ├── fs-extra
	│   ├── ... -other node module specified in /package.json
	│   └── ansicolors
	├── sea-libs  --the third-part spm modules based on seajs.
	│	├── jquery  --exec `spm init`, step by step ..., it is the same with /modules(biz logics)
	│	├── other....
	│	└── README.md
	├── sea-modules  --the directory used to store all sea-modules(`/modules/..`,`/sea-libs/..`)
	│	├── jquery   --the third-part sea-js module plugin
	│	├── product  --our business logics sea-modules ref `/biz_modules/..`
	│	├── seajs    --spm install seajs from spm repository 
	│	├── slideshow --our customized commonly used sea-plugin ref `/ui_modules/..`
	│	├── ... --others
	│	└── README.md
	├── tools --designed to store internal build/deploy engine
	├── deploy-project.sh --now only support mac, deploy the whole project into `dest/deploy/...` 
	├── enyo.js  comes from another project, serve to build/deploy engine.
	├── package.json  --the pre-depends node modules here, can use `npm install1` to auto install it
	└── README.md

```
- BTW, in genneral we need to put this project as git `submodule` in your own project,
- you can reference `o2o_web` here to see [o2o_web](https://github.com/tianyingchun/o2o_web), it an demo for this [`seajs_web_solution`](https://github.com/tianyingchun/seajs_web_solution)

- BTW, for spm seajs module build we need to manuanly install spm build plugin as below
- http://docs.spmjs.org/cli/init

- http://docs.spmjs.org/doc/
- $ npm install spm -g          (version 3.0.1, $ spm -V)
- $ npm install spm-init -g     (version 0.5.2, $ spm-init -V)   --or npm update spm-init -g
- $ npm install spm-build -g    (version 0.3.15, $ spm-build -V)   --or npm update spm-build -g
- $ npm install spm-deploy -g   (version 0.2.4, $ spm-deploy -V) or  spm plugin install deploy 

- spm install jquery@1.10.2   (install jquery with version 1.10.2 using spm)

###

deploy.json  usage:

```
{
    "name": "built home root",
    "target": "./",
    "ignoreMinify":false,
    "assets": ["./index.html", "favicon.ico"],
    "output":{ 
    	"assets":"./",
    	"css":"app/app.css",
    	"js":"app/app.js"
    }
}

```

```
{
	"name":"build `/app/styles/`",
	"target":"app/",
	"output":""app
}
```


