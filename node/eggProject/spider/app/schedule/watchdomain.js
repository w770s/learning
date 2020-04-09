const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">Hello world</h2>'); // 加载要解析的内容
$('h2.title').html(); // 获取要匹配的内容

module.exports = app => {
  return {
    schedule: {
      interval: '5s',
      type: 'all',
    },
    async task(ctx) {
      const res = await ctx.service.sprider.requestUrl('https://news.baidu.com/');
      const data = res.data;
      const $ = cheerio.load(data.toString(), {
        decodeEntities: false, // unicode 转中文
      }); // 加载要解析的内容
      // 监测网站标题是否被篡改，是否挂掉
      // cheerio 用jquery 语法获取 web数据
      // const title = $('title').html();
      // if (title === '百度新闻——海量中文资讯平台') {
      //   console.log('网站正常');
      // } else {
      //   console.log('网站挂了');
      // }
      // console.log($('.hotwords  a').each(function() {
      //   console.log($(this).html());
      // }));
    },
  };
};
