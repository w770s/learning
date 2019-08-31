// /******/ (function(modules) { // webpackBootstrap
// /******/ 	// The module cache
// /******/ 	var installedModules = {};
// /******/
// /******/ 	// The require function
// /******/ 	function __webpack_require__(moduleId) {
// /******/
// /******/ 		// Check if module is in cache
// /******/ 		if(installedModules[moduleId]) {
// /******/ 			return installedModules[moduleId].exports;
// /******/ 		}
// /******/ 		// Create a new module (and put it into the cache)
// /******/ 		var module = installedModules[moduleId] = {
// /******/ 			i: moduleId,
// /******/ 			l: false,
// /******/ 			exports: {}
// /******/ 		};
// /******/
// /******/ 		// Execute the module function
// /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
// /******/
// /******/ 		// Flag the module as loaded
// /******/ 		module.l = true;
// /******/
// /******/ 		// Return the exports of the module
// /******/ 		return module.exports;
// /******/ 	}
// /******/
// /******/
// /******/ 	// expose the modules object (__webpack_modules__)
// /******/ 	__webpack_require__.m = modules;
// /******/
// /******/ 	// expose the module cache
// /******/ 	__webpack_require__.c = installedModules;
// /******/
// /******/ 	// define getter function for harmony exports
// /******/ 	__webpack_require__.d = function(exports, name, getter) {
// /******/ 		if(!__webpack_require__.o(exports, name)) {
// /******/ 			Object.defineProperty(exports, name, {
// /******/ 				configurable: false,
// /******/ 				enumerable: true,
// /******/ 				get: getter
// /******/ 			});
// /******/ 		}
// /******/ 	};
// /******/
// /******/ 	// getDefaultExport function for compatibility with non-harmony modules
// /******/ 	__webpack_require__.n = function(module) {
// /******/ 		var getter = module && module.__esModule ?
// /******/ 			function getDefault() { return module['default']; } :
// /******/ 			function getModuleExports() { return module; };
// /******/ 		__webpack_require__.d(getter, 'a', getter);
// /******/ 		return getter;
// /******/ 	};
// /******/
// /******/ 	// Object.prototype.hasOwnProperty.call
// /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
// /******/
// /******/ 	// __webpack_public_path__
// /******/ 	__webpack_require__.p = "";
// /******/
// /******/ 	// Load entry module and return exports
// /******/ 	return __webpack_require__(__webpack_require__.s = 0);
// /******/ })
// /************************************************************************/
// /******/ ([
// /* 0 */
// /***/ (function(module, __webpack_exports__, __webpack_require__) {
//
// "use strict";
// Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
// /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header__ = __webpack_require__(1);
// /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__content__ = __webpack_require__(2);
// /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__footer__ = __webpack_require__(3);
// // ES MODUle 浏览器是无法识别的，webpack 就上场了，其实就相当于翻译了下面的话 npx webpack index.js
//
//
//
//
// new __WEBPACK_IMPORTED_MODULE_0__header__["a" /* default */]()
// new __WEBPACK_IMPORTED_MODULE_1__content__["a" /* default */]()
// new __WEBPACK_IMPORTED_MODULE_2__footer__["a" /* default */]()
//
//
// /***/ }),
// /* 1 */
// /***/ (function(module, __webpack_exports__, __webpack_require__) {
//
// "use strict";
//
// // 1.面向过程
// // var root = document.getElementById('root')
// // var header = document.createElement('div')
// // header.innerHTML='<div>我是页面头部</div>'
// // root.appendChild(header)
//
// function Header() {
//     var root = document.getElementById('root')
//     var header = document.createElement('div')
//     header.innerHTML='<div>我是页面头部</div>'
//     root.appendChild(header)
// }
//
// /* harmony default export */ __webpack_exports__["a"] = (Header); // webpack
//
//
// /***/ }),
// /* 2 */
// /***/ (function(module, __webpack_exports__, __webpack_require__) {
//
// "use strict";
// // 1.面向过程
// // var root = document.getElementById('root')
// // var content = document.createElement('div')
// // content.innerHTML='<div>我是页面主体内容</div>'
// // root.appendChild(content)
//
// // 2.面向对象
// function Content() {
//     var root = document.getElementById('root')
//     var header = document.createElement('div')
//     header.innerHTML='<div>我是页面头部</div>'
//     root.appendChild(header)
// }
//
// /* harmony default export */ __webpack_exports__["a"] = (Content);
//
//
// /***/ }),
// /* 3 */
// /***/ (function(module, __webpack_exports__, __webpack_require__) {
//
// "use strict";
// // 1.面向过程
// // var root = document.getElementById('root')
// // var footer = document.createElement('div')
// // footer.innerHTML='<div>我是页面底部</div>'
// // root.appendChild(footer)
//
// // 2.面向对象
// function Footer() {
//     var root = document.getElementById('root')
//     var footer = document.createElement('div')
//     footer.innerHTML='<div>我是页面底部</div>'
//     root.appendChild(footer)
// }
//
// /* harmony default export */ __webpack_exports__["a"] = (Footer);
//
//
//
// /***/ })
// /******/ ]);


// 正常情况下，浏览器识别不了 下面的写法，使用webpack 模块化打包（模块的规范都能是被 ES Modele CommonJs AMD CMD）

// ES Module
// import Header from './header'
// import Content from './content'
// import Footer from './footer'

// node CommonJS

// var Header = require('./header.js')
// var Content = require('./content.js')
// var Footer = require('./footer.js')
//
// new Header()
// new Content()
// new Footer()

// import './index.scss'// 直接这样导入相当于 全局的  最好还是局部映入

//
//
// import style from './index.scss'
//
// import Header from './header'
// import Content from './content'
// import Footer from './footer'
// import OtherImg from './img'
// import Banner from './banner.jpeg'
//
// new Header()
// new Content()
// new Footer()
//
// var root = document.getElementById('root')
//
// var Img = new Image()
//
// Img.src = Banner
//
// Img.classList.add(style.avator)
//
// root.appendChild(Img)
//
// OtherImg()
import './index.scss'

var root = document.getElementById('root')

// 字体文件
root.innerHTML = '<p class="iconfont icon-iconfontheart"></p>'
