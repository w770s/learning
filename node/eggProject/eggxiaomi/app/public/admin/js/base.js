$(function() {

  app.init();
});


var app = {

  init() {
    this.toggleAside();
    this.deleteConfirm();
    // this.resizeIframe();
  },

  deleteConfirm() {
    $('.delete').click(function() {
      const flag = confirm('删除完后无法恢复，您确定删除吗？');
      return flag;
    });
  },

  resizeIframe() { // iframe 窗口高度， window 视窗变化时和 初始化时 都要初始化
    const height = document.documentElement.clientHeight - 100;
    document.getElementById('rightMain').height = height;
  },

  toggleAside() {
    $('.aside li:nth-child(1) ul,.aside li:nth-child(2) ul,.aside li:nth-child(3) ul').hide()

    $('.aside h4').click(function() {
      if ($(this).find('span').hasClass('nav_close')) {
        $(this).find('span')
          .removeClass('nav_close')
          .addClass('nav_open');
      } else {
        $(this).find('span')
          .removeClass('nav_open')
          .addClass('nav_close');
      }
      $(this).siblings('ul').slideToggle();
    });
  },

  changeStatus(el, model, attr, id) {
    $.get('/admin/changeStatus', { model, attr, id }, function(data) {
      if (data.success) {
        if (el.src.indexOf('yes') !== -1) {
          el.src = '/public/admin/images/no.gif';
        } else {
          el.src = '/public/admin/images/yes.gif';
        }
      }
    });
  },

  editNum(el, model, attr, id) {
    const val = $(el).html();
    const input = $("<input value='' />"); // 创建一个input
    $(el).html(input);

    // input自动获取焦点
    $(input).trigger('focus');// 让焦点在文字最后面，input 先不赋值，聚焦了，在赋值，（和赋值一样的效果）

    $(input).val(val);

    // input 阻止冒泡
    $(input).click(function() {
      return false;
    });

    // input 失去焦点
    $(input).blur(function() {
      const num = $(input).val();

      $(el).html(num);

      $.get('/admin/editNum', { model, attr, id, num }, function(data) {
        if (data.success) {
          console.log(model, attr, id, num);
        }
      });
    });
  },
};

