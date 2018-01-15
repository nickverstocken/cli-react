#!/usr/bin/env node
let program = require('commander');
let shell = require('shelljs');
let colors = require('colors');
let fs = require('fs-extra');
const replace = require('replace');
const template = require('./component_template/template');
let appName;
let appDirectory;
let newCompPath;
let nofolder;
let functional;
let observable;
let stylesheet;
program
    .version('2.0.7')
    .command('init <dir>')
    .option('-T , --typscript', 'Install with typescript')
    .action(createReact);
program
    .command('gc <component>')
    .option('-n, --nofolder', 'Do not wrap component in folder')
    .option('-o, --observable', 'Make observable')
    .option('-s, --style', 'With stylesheet')
    .option('-f, --functional', 'Create functional component')
    .action(createComponent);
program.parse(process.argv)
async function createReact(dir) {
    appName = dir;
    appDirectory = `${process.cwd()}/${appName}`;
    if(fs.existsSync(appDirectory)) {
        console.log('Directory already exists choose antother name...'.red);
        process.exit(1);
    }
    let success = await createReactApp();
    if (!success) {
        console.log('Something went wrong while trying to create a new React app using create-react-app'.red);
        process.exit(1);
    }else{
        await installPackages();
        await updatePackage_json();
        await generateBoilerplate();
        console.log("All done");
    }

}
function createReactApp() {
    return new Promise(resolve => {
        if (appName) {
            console.log("\nCreating react app...".cyan);
            try{
                shell.exec(`${require('path').dirname(require.main.filename)}/node_modules/create-react-app/index.js ${appName}`, (e, stdout, stderr) => {
                    if(stderr){
                        if(e == 127){
                            console.log(`create-react-app not installed \n install create-react-app first globally use :`.red);
                            console.log(`npm install -g create-react-app`.white);
                            resolve(false);
                            process.exit(1);
                        }else{
                            resolve(false);
                            process.exit(1);
                        }
                    }else{
                        console.log("Finished creating react app".green);
                        resolve(true);
                    }
                });
            }catch(e){
                console.log('create-react-app not installed'.red);
                console.log("\nInstalling create react app...".cyan);
                shell.exec(`npm install -g create-react-app`, (e, stdout, stderr) => {
                    console.log("Finished installing creating react app".green);
                    createReactApp();
                });
                resolve(false);
                process.exit(1);
            }

        } else {
            console.log("\nNo app name was provided.".red);
            console.log("\nProvide an app name in the following format: ");
            console.log("\ncreate-nick-react ", "app-name\n".cyan);
            resolve(false);
            process.exit(1);
        }
    })
}
function installPackages() {
    return new Promise(resolve => {
        console.log("\nInstalling react-router, react-router-dom, react-lazy-route, axios, sass and mobx...".cyan);
        shell.exec(`npm install --save react-router react-router-dom react-lazy-route axios mobx mobx-react node-sass-chokidar npm-run-all`, {cwd: appDirectory}, (e) => {
            console.log("\nFinished installing packages\n".green);
            resolve()
        });
    });
}
function updatePackage_json() {
    let scripts = {
        "build-css": "node-sass-chokidar src/ -o src/",
        "watch-css": "npm run build-css && node-sass-chokidar src/ -o src/ --watch --recursive",
        "start-js": "react-scripts start",
        "start": "npm-run-all -p watch-css start-js",
        "build-js": "react-scripts build",
        "build": "npm-run-all build-css build-js",
        "test": "react-scripts test --env=jsdom",
        "eject": "react-scripts eject"
    };
    return new Promise(resolve => {
        console.log("\nUpdating package.json....".cyan);
        shell.exec(`${require('path').dirname(require.main.filename)}/node_modules/json/lib/json.js -I -f package.json -e 'this.scripts=` + JSON.stringify(scripts) + "'", {cwd: appDirectory}, () => {
            resolve();
        });
    })
}
function generateBoilerplate() {
    console.log();
    console.log("\nGenerating boilerplate...".cyan);
    return new Promise(resolve=>{
        fs.unlinkSync(`${appDirectory}/src/App.css`);
        fs.unlinkSync(`${appDirectory}/src/App.js`);
        fs.unlinkSync(`${appDirectory}/src/App.test.js`);
        fs.unlinkSync(`${appDirectory}/src/index.css`);
        fs.unlinkSync(`${appDirectory}/src/logo.svg`);
        fs.copySync(`${require('path').dirname(require.main.filename)}/templates`, `${appDirectory}/src`);
        resolve();
    })
}
async function createComponent(component, cmd){
    newCompPath = component;
    cmd.nofolder ? nofolder = true : nofolder = false;
    cmd.functional ? functional = true : functional = false;
    cmd.observable ? observable = true : observable = false;
    cmd.style ? stylesheet = true : stylesheet = false;
   if(fs.existsSync('./src/components')){
       newCompPath = `./src/components/${component}`;
   }
    let template = await buildTemplate();
    writeFile(template, component)
}
function buildTemplate(){
        let imports = [template.imports.react, template.imports.propTypes];
        if(observable){
            imports.push(template.imports.observable)
        }
        if(stylesheet){
            imports.push(template.imports.stylesheet);
        }
        let body = functional ? [template.functional] : [template.main].join('\n');
        let exported = observable ? [template.exported.observable] : [template.exported.default];
        return imports.join('\n') + '\n' + body + '\n' + exported;
}
function capitalize(comp){
   return comp[0].toUpperCase() + comp.substring(1, comp.length);
}
function writeFile(template, component){
    let path = newCompPath;
    if(nofolder){
        strArr = newCompPath.split('/');
        strArr.splice(strArr.length - 1, 1);
        path = strArr.join('/');
        console.log(path);
    }
    let comp = component.split('/');
    comp = comp[comp.length -1 ];
    if(path){
        path = path + '/' + capitalize(comp);
    }else{
        path = capitalize(comp);
    }
    if(stylesheet){
        if(!fs.existsSync(`${path}.scss`)){
            console.log('creating syles');
            fs.outputFileSync(`${path}.scss`, '');
            console.log(`Stylesheet ${comp} created at ${path}.scss`.cyan)
        }else{
            console.log(`Stylesheet ${comp} allready exists at ${path}.scss, choose another name if you want to create a new stylesheet`.red)
        }
    }
    if(!fs.existsSync(`${path}.js`)){
        fs.outputFile(`${path}.js`, template, (err) => {
            if (err) throw err;
            replace({
                regex: ":className",
                replacement: capitalize(comp),
                paths: [`${path}.js`],
                recursive: false,
                silent: true,
            });
            console.log(`Component ${comp} created at ${path}.js`.cyan)
        });
    }else{
        console.log(`Component ${comp} allready exists at ${path}.js, choose another name if you want to create a new component`.red)
    }


}

