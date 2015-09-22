
var fs = require("fs");
var path = require("path");
var replaceReg = /\{\{\include\:(.*?)}\}/;

function readFileContentByPath(path) {

    if(!fs.existsSync(path)) {
        console.warn('can\'t find path: ' + path);
        return path;
    }

    return fs.readFileSync(path).toString();
}

module.exports = function preprocessNestedHtml(content, physicalPath){
    var dir = path.dirname(physicalPath);
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