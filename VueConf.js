/**
 * 类名：VueConf
 * 描述：TODO
 * 时间：2018/12/19 11:05
 * @author <a href="maojack185@163.com">jack mao</a>
 * @version 1.0
 */
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const Config = require("./Conf");
//
const resolve = (dir) => {
  return path.join(__dirname, dir);
};
// const Type = require('./Type').Type
let pages = {};
let entries;
let fileName = [];
let pagesEntries;
let pageName = [];
let addPageName = [];
let includeFile = Config.pages;
const excludeFile = Config.excludePages;
//  ['iframe', 'home', 'test', 'wiki'];//排除不需要设置的页面
// 创建html模板
const createHtml = function (path, name) {
  let htmlStr = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="icon" href="./favicon.ico">
    <title>${name}</title>
  </head>
  <body>
  <div id="app"></div>
  <!-- built files will be auto injected -->
  </body>
  
  </html>
  `;
  return fs.writeFileSync(path + "/" + name + ".html", htmlStr, "utf-8");
};
/* 复制文件 */
const copy = function (src, dst) {
  let paths = fs.readdirSync(src); //同步读取当前目录
  paths.forEach(function (path) {
    var _src = src + "/" + path;
    var _dst = dst + "/" + path;
    fs.stat(_src, function (err, stats) {
      //stats  该对象 包含文件属性
      if (err) throw err;
      if (stats.isFile()) {
        //如果是个文件则拷贝
        let readable = fs.createReadStream(_src); //创建读取流
        let writable = fs.createWriteStream(_dst); //创建写入流
        readable.pipe(writable);
      } else if (stats.isDirectory()) {
        //是目录则 递归
        checkDirectory(_src, _dst, copy);
      }
    });
  });
};
/* 匹配目录 */
const checkDirectory = function (src, dst, callback) {
  fs.access(dst, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(dst);
      callback(src, dst);
    } else {
      callback(src, dst);
    }
  });
};

try {
  // 全局获取文件
  entries = glob("public/*.html", { sync: true });
  // 获取多页面模块
  pagesEntries = fs.readdirSync("src/pages/", function (err) {
    if (err) {
      throw err;
    }
  });
  // 获取多页面html模板文件
  entries.forEach((file) => {
    let data = file.split("/");
    let dataStr = data[1];
    dataStr = dataStr.substring(0, dataStr.length - 5);
    fileName.push(dataStr);
  });
  // 获取多页面开发模板
  pagesEntries.forEach((file) => {
    var stat = fs.lstatSync("src/pages/" + file);
    if (stat.isDirectory()) {
      pageName.push(file);
    }
  });
  addPageName = includeFile.filter((file) => {
    return fileName.indexOf(file) < 0;
  });
  addPageName.map((e) => {
    createHtml("public", e);
  });
  // 判断模板是否存在不存在则创建
  for (let i = 0; i < includeFile.length; i++) {
    if (excludeFile.indexOf(includeFile[i]) < 0) {
      if (pageName.indexOf(includeFile[i]) < 0) {
        checkDirectory("template", "src/pages/" + includeFile[i], copy);
      }
      pages[includeFile[i]] = {
        entry: "src/pages/" + includeFile[i] + "/main.js",
        template: "public/" + includeFile[i] + ".html",
        fileName: includeFile[i] + ".html",
        title: includeFile[i],
        chunks: ["chunk-vendors", "chunk-common", includeFile[i]],
      };
    }
  }
} catch (err) {
  entries = [];
  throw err;
}
const Page = {};
Page.pages = pages;
module.exports = Page;
