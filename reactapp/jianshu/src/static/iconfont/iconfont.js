import {createGlobalStyle} from 'styled-components';

export const Iconfont = createGlobalStyle `
@font-face {font-family: "iconfont";
  src: url('./iconfont.eot?t=1564901187057'); /* IE9 */
  src: url('./iconfont.eot?t=1564901187057#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('./iconfont.woff?t=1564901187057') format('woff'),
  url('./iconfont.ttf?t=1564901187057') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./iconfont.svg?t=1564901187057#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`


