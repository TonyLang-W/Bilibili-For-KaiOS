/*
* 这些代码我自己都快要看不懂了💤，我会整理的（
*/
/*  ■■■■■■■■■■■ 综合函数 ■■■■■■■■■■■  */

//添加视频项目
function appendV(title,author,image,tabIndex) {
  var titleN = title
  if(titleN.length > 20){
    titleN = titleN.substr(0,20) + '…';
  }
  $('.items').append("<div class='item v' tabIndex='" + tabIndex + "'><img class='cover' src='" + image + "'/><div class='title'>" + titleN + "</div><div class='imgUP'>UP</div><div class='author'>" + author + "</div></div>")
}

//添加UP主
function appendA(nick,sub,image,tabIndex) {
  $('.items').append("<div class='item' tabIndex='" + tabIndex + "'><img class='head' src='" + image + "'/><div class='title' style='left: 63px'>" + nick + "</div><div class='author' style='left: 63px'>粉丝：" + sub + "</div></div>")
}

//打开视频
function openV() {
  var currentIndex = document.activeElement.tabIndex;
  if(tab_location == 0) { //如果在搜索框
    currentIndex = currentIndex - 1
  }
  window.location.href = './player/index.html?aid=' + aid[currentIndex] + '&bvid=' + bvid[currentIndex] + '&title=' + title[currentIndex]
}


//设置导航栏标注
function softkey(left,center,right) {
  $('#softkey-left').text(left);
  $('#softkey-center').text(center);
  $('#softkey-right').text(right);
}



/*  ■■■■■■■■■■■ 联机信息获取函数 ■■■■■■■■■■■  */

//设置方法
typeHome = ['item.title','item.author','item.pic','item.aid','item.bvid'];
typeAuthor = ['item','result.nick[r]','result.sub[r]','result.pic[r]'];
typeAuthorV = ['item.title','item.author','item.pic','item.aid','item.bvid'];
typeHotV = ['item.title','item.author','item.pic','item.aid','item.bvid'];
typeSearch = ['item.title','item.author','item.pic','item.aid','item.bvid'];

//dict：方法（遍历时用于解析的列表：【标题，作者，配图，视频AV号，视频BV号】）（以item开头）
//each：遍历的位置（以result开头）

//获取视频列表
function getVList(dict,each,url,overload=false) {
  if(overload == true) { //增量加载不清空列表
    //pass
  }else if(tab_location == 0) { //在搜索页不清理搜索框
    $('.v').remove(); //清空已有的列表
    $('.items').append('<b>正在加载…</b>') //展示加载信息
  }else{
    $('.items').empty(); //清空已有列表
    $('.items').append('<b>正在加载…</b>') //展示加载信息
  }
  if(navigator.onLine == false) {
    $('.items').append('请连接互联网！');
    return;
  }
  
  //创建用于存储信息的函数
  title = [];
  author = [];
  image = [];
  aid = [];
  bvid = [];
  //从网络获取信息
  ajax = $.ajax({
    url: url,
    timeout: 30000,
    async: true,
    success: function(result) {
      $('b').remove()
      
      switch(tab_location){
        case 0||2: //搜索 或 关注列表
          // dictTitle = eval(dict[0]);
          // dictAuthor = eval(dict[1]);
          // dictImage = eval(dict[2]);
          // dictAID = eval(dict[3]);
          // dictBVID = eval(dict[4]);
          $.each(eval(each),function(r,item) {
            raw_title = eval(dict[0])
            raw_title = raw_title.replace('<em class=\"keyword\">',"")
            raw_title = raw_title.replace("</em>","")
          
            title.push(raw_title);
            author.push(eval(dict[1]));
            if(eval(dict[2]).substr(0,2) == '//') {
              image.push('https:' + eval(dict[2]));
            }else{
              image.push(eval(dict[2]));
            }
          
            aid.push(eval(dict[3]));
            bvid.push(eval(dict[4]));
          })
          //建立列表
          const list_lengh = $(".item").length
          $.each(title,function(r,i) {
            var tabIndex = r+list_lengh
            appendV(i,author[r],image[r],tabIndex + '');
          })
          //对焦
          if(overload == false) {
            document.querySelectorAll('.item')[0].focus();
          }
          //退出
          return;
      }
      
      //其它选项卡
      $('.items').empty() //清空列已有的列表
      // dictTitle = eval(dict[0]);
      // dictAuthor = eval(dict[1]);
      // dictImage = eval(dict[2]);
      // dictAID = eval(dict[3]);
      // dictBVID = eval(dict[4]);
      $.each(eval(each),function(r,item) {
        title.push(eval(dict[0]));
        author.push(eval(dict[1]));
        if(eval(dict[2]).substr(0,2) == '//') {
          image.push('https:' + eval(dict[2]));
        }else{
          image.push(eval(dict[2]));
        }
        
        aid.push(eval(dict[3]));
        bvid.push(eval(dict[4]));
      })
      //建立列表
      $.each(title,function(r,i) {
        appendV(i,author[r],image[r],r + '');
      })
      //对焦
      document.querySelectorAll('.item')[0].focus();
      //退出
      return;
    },
    error: function(result) {
      $('.items').empty();
      $('.items').append('加载失败');
      //退出
      console.log(result.status + ': ' + result.statusText)
      return;
    }
  });
};

//获取作者列表
function getAList(dict,each) {
  $('.items').empty() //清空列已有的列表
  if(navigator.onLine == false) {
    $('.items').append('请连接互联网！');
    return;
  }
  $('.items').append('正在加载…') //展示加载信息
  //创建用于存储信息的函数
  uid = []
  var nick = [];
  var sub = [];
  var image = [];
  var result = localStorage.getItem('subscription') //从本地获取信息
  try {
    var result = JSON.parse(result)
  }catch(e){ //如果没有列表，那么就帮忙创建一个
    localStorage.setItem('subscription',"{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
    localStorage.setItem('studio',"{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
    getAList(dict,each)
  }
  $('.items').empty() //清空列已有的列表
  if(result.uid.length == 0){
    $('.items').append('您还没有添加过UP主哦<br>按“添加”添加试试')
    return
  }
  // dictNick = eval(dict[0]);
  // dictSub = eval(dict[1]);
  // dictImage = eval(dict[2]);
  $.each(eval(each),function(r,item) {
    uid.push(eval(dict[0]));
    nick.push(eval(dict[1]));
    sub.push(eval(dict[2]));
    image.push(eval(dict[3]));
    
  })
  //建立列表
  $.each(nick,function(r,i) {
    appendA(i,sub[r],image[r],r + '');
  })
  //对焦
  document.querySelectorAll('.item')[0].focus();
};

//检查更新
function check_update(pack_name, version) {
  if($.cookie('update_checked') == true) {
    return;
  }
  $.getJSON('http://tonylang.cn/api/update.py?name=' + pack_name, function(result) {
    var latest_version = result.latest_version;
    var update_time = result.update_time;
    var link = result.link;
    if(version < latest_version) {
      if(confirm('【检测到新版本】\n版本号：' + latest_version + '\n发布时间：' + update_time + '\n\n是否下载新版本？')) {
        window.open(link)
      }else{
        alert('已取消，本次使用不再提醒')
      }
    }
    $.cookie('update_checked', true)
  })
}



/*  ■■■■■■■■■■■ 导航键 ■■■■■■■■■■■  */

//设置按键绑定
function handleKeydown(e) {
  if(document.activeElement.id == 'searchInput') { //如果焦点在搜索框中
    if(e.key == 'Enter') {
      e.preventDefault();//阻止默认行为
    }else{
      return
    }
  }
  e.preventDefault();//阻止默认行为
  switch(e.key) {
    case 'ArrowUp':
      nav(-1);
      break;
    case 'ArrowDown':
      nav(1);
      break;
    case 'ArrowRight':
      tab(1);
      break;
    case 'ArrowLeft':
      tab(-1);
      break;
    case 'Enter':
      Enter();
      break;
    case 'Backspace':
      if(opened_VList) {
        load()
      }else if(tab_location == 0) {
        break; //阻止在搜索页面因为删除字符意外退出程序
      }else{
        window.close()
      }
      
      break;
    case 'SoftLeft':
      SoftLeft();
      break;
    case 'SoftRight':
      SoftRight()
      break;
    case '0':
      if(confirm('您真的要初始化吗？\n这会丢失你所有的数据！')) {
        localStorage.setItem('subscription',"{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
        localStorage.setItem('studio',"{\"uid\":[],\"pic\":[],\"nick\":[],\"sub\":[]}")
        alert('已完成！');
      }else{
        alert('已取消！');
      }
      break;
    case '#':
      alert('By：白羊座的一只狼\n使用说明：\n1.此界面按0初始化\n2.播放界面按2调整音量');
      break;
  }
}

//设置选项卡导航
var tab_location = 1;//设置默认选项卡
function tab(move) {
  const currentIndex = parseInt($('.focus').attr('tabIndex')); //获取目前带有focus的元素的tabIndex
  const next = currentIndex + move; //设置移动位置
  const items = document.querySelectorAll('li'); //遍历所有的li元素
  const targetElement = items[next]; //将位置与遍历结果对应
  if(targetElement == undefined){ //如果没有可供选择的目标
    return; //中止函数
  }
  $('.focus').attr("class",""); //清除原有效果
  targetElement.className = "focus"; //设置新效果
  tab_location = next;
  load()
}

//设置选项块导航
function nav(move) {
  const currentIndex = document.activeElement.tabIndex;
  const next = currentIndex + move;
  const items = document.querySelectorAll('.item');
  const targetElement = items[next];
  
  if(next == 0) {
    $('.items').scrollTop(0);
  }
  //如果到底，进行增量加载
  const list_lengh = $(".item").length
  if(list_lengh == next){
    overLoad()
  }
  targetElement.focus();
}


//左软键
function SoftLeft() {
  switch(tab_location) {
    case 0: //搜索
      document.querySelectorAll('#searchInput')[0].focus();
      break;
    case 1: //首页推荐
      load();
      break;
    case 2: //关注
      $.ajaxSettings.async = false; //临时设置为同步请求
      var data = localStorage.getItem('subscription'); //读取数据
      data = JSON.parse(data); //将字符串转换为JSON
      $.each(data.uid,function(r,item){ //给每一个uid更新数据
        $.getJSON('http://tonylang.cn/services/bilibili/uploader/info.py?uid=' + item, function(result) {
          data.pic[r] = result.data.face //头像
          data.nick[r] = result.data.name //昵称
        })
        $.getJSON('http://tonylang.cn/services/bilibili/uploader/stat.py?uid=' + item, function(result) {
          data.sub[r] = result.data.follower //粉丝数
        })
        localStorage.setItem('subscription', JSON.stringify(data)) //将数组转换后存储数据
      })
      $.ajaxSettings.async = true; //记得改回来
      break;
    case 3: //直播
      break;
  }
}

//回车键
function Enter() {
  switch(tab_location) {
    case 0: //搜索
      if(document.activeElement.id == 'searchInput') { //如果在搜索框中
        var key = document.getElementById('searchInput').value
        pn = 1
        getVList(typeSearch,'result.data.result.video','http://tonylang.cn/services/bilibili/search/search.py?key='+key+'&pn='+pn)
        break;
      }
      var currentIndex = document.activeElement.tabIndex; //如果在选项框中
      if(currentIndex == 0) {
        document.querySelectorAll('#searchInput')[0].focus();
      }else{
        openV()
      }
      break;
    case 1: //首页推荐
      openV();
      break;
    case 2: //关注
      if(opened_VList == false) {
        const currentIndex = document.activeElement.tabIndex;
        pn = 1
        getVList(typeAuthorV,'result.data.list.vlist','http://tonylang.cn/services/bilibili/vlist/authorV.py?uid=' + uid[currentIndex] + '&pn='+pn)
        softkey('刷新','播放','选项');
        opened_VList = true
      }else{
        openV()
      }
      break;
    case 3: //直播
      var currentIndex = document.activeElement.tabIndex;
      var link = './live/index.html?uid=' + uid[currentIndex]
      window.location.href = link;
      break;
  }
}

//右软键
function SoftRight() {
  switch(tab_location) {
    case 0: //搜索
      break;
    case 1: //首页推荐
      break;
    case 2: //关注
      add()
      break;
    case 3: //直播
      add()
      break;
  }
}

//设置触发器
document.activeElement.addEventListener('keydown', handleKeydown);



/*  ■■■■■■■■■■■ 导航键响应函数/脱机响应函数 ■■■■■■■■■■■  */

/*
* 注意！有一些响应函数直接写在“导航键绑定”里面
*/

//添加UP主
function add() {
  switch(tab_location) {
    case 2: //关注
      var id = prompt('输入UID：') //弹框请用户输入数据
      if(id.match(/[a-z]/i) != null || id.match(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/i) != null) { //正则验证输入的内容 确保只输入数字
        alert('请输入数字！')
        break;
      }
      var data = localStorage.getItem('subscription'); //读取数据
      data = JSON.parse(data); //将字符串转换为JSON
      data.uid.push(id); //将数据添加到JSON
      localStorage.setItem('subscription',JSON.stringify(data)) //将数组转换后存储数据
      break;
    case 3: //直播
      var id = prompt('输入直播间号：') //弹框请用户输入数据
      if(id.match(/[a-z]/i) != null || id.match(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/i) != null) { //正则验证输入的内容 确保只输入数字
        alert('请输入数字！')
        break;
      }
      var data = localStorage.getItem('studio'); //读取数据
      data = JSON.parse(data); //将字符串转换为JSON
      data.uid.push(id); //将数据添加到JSON
      localStorage.setItem('studio',JSON.stringify(data)) //将数组转换后存储数据
      break;
  }
  $('.items').empty() //展示加载信息
  $('.items').append('请等待…') //展示加载信息
  SoftLeft() //及时刷新数据
  load()
}

//在选项卡切换后加载响应页面
function load() {
  //关闭之前的ajax
  try{
    ajax.abort();
  }catch(e){}
  
  switch(tab_location) {
    case 0: //搜索
      loadSearch();
      softkey('搜索','播放','选项');
      break;
    case 1: //首页推荐
      getVList(typeHome,'result.data.list','http://tonylang.cn/services/bilibili/homepage/get_homepage.py')
      softkey('刷新','播放','选项');
      break;
    case 2: //关注
      getAList(typeAuthor,'result.uid')
      softkey('刷新','选择','添加');
      break;
    case 3: //直播
      softkey('刷新','观看','添加');
      break;
  }
  opened_VList = false //设置二级菜单状态
}

//加载搜索框
function loadSearch() {
  $('.items').empty();
  $('.items').append("<div class='item input' style='height: 73px' tabIndex='0'><div>请输入视频关键字</div><input id='searchInput' class='input' type='text' /></div>");
  //document.querySelectorAll('#searchInput')[0].focus();
  document.querySelectorAll('.item')[0].focus();
}

//增量加载
function overLoad() {
  switch(tab_location) {
    case 0: //搜索
      var key = document.getElementById('searchInput').value;
      pn = pn+1;
      getVList(typeSearch,'result.data.result.video','http://tonylang.cn/services/bilibili/search/search.py?key='+key+'&pn='+pn, true);
      break;
    case 2: //关注→视频列表
      if(opened_VList==false) {
        break;
      }else{
        pn = pn+1;
        getVList(typeAuthorV,'result.data.list.vlist','http://tonylang.cn/services/bilibili/vlist/authorV.py?uid='+uid[0]+'&pn='+pn, true);
        break;
      }
      break;
  }
}



/*  ■■■■■■■■■■■ 初始化应用程序 ■■■■■■■■■■■  */

//若第一次安装则初始化关注列表等信息
if(localStorage.getItem('subscription') == null || localStorage.getItem('studio') == null) {
  localStorage.setItem('subscription','')
  localStorage.setItem('studio','')
}

//检查更新
check_update('app://kai.baiyang.bilibili', 'v2.0')

//加载默认选项卡
load()
