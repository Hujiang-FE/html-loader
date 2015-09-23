
var fs = require("fs");
var path = require("path");
var replaceReg = /\{\{include\:(.*?)\}\}/g;
var conditionReg = /\{\{if\:\s*(.*?)\s*\}\}([\s\S]*?)\{\{\/if\s*\}\}/g;

function readFileContentByPath(path) {

    if(!fs.existsSync(path)) {
        console.warn('can\'t find path: ' + path);
        return path;
    }

    return fs.readFileSync(path).toString();
}

function handleInclude(content, dir) {
    content = content.replace(replaceReg, function(match, rpath){
        var actualPath;
        try{
            actualPath = path.resolve(dir, rpath);
        }
        catch(e){
            console.warn(e);
        }
        var childContent = readFileContentByPath(actualPath);

        return preprocessNestedHtml(childContent, actualPath);
    })  
    return content;
}

function handleCondition(content, query) { 
    content = content.replace(conditionReg, function(match, expr, markup){ 
        if(query[expr]) {
            return markup;
        }
        return '';
    });
    return content;
}

function preprocessNestedHtml(content, physicalPath, query){
    var dir = path.dirname(physicalPath);
    content = handleInclude(content, dir);
    content = handleCondition(content, query);
    return content;
}

module.exports = preprocessNestedHtml