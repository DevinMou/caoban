/**
 * Created by devin on 2019/1/28.
 */
(function(window,document){

    if(!window._Steak){
        var name_url=document.getElementById('nav_user');
        if(name_url&&name_url.children.length&&name_url.children[0].href){
            name_url=name_url.children[0].href;
        }else{
            alert('请先登录花瓣')
        }
        window._Steak={
            init:false,
            statue:'init',
            origin:location.origin,
            pic_origin:'http://img.hb.meiwu.co/',
            name_url:name_url,
            _style:'#caoban{color:#fff;font-size:12px;position:fixed;overflow:hidden;top:20px;right:50px;z-index:100000;box-sizing: border-box;width: 210px;border-radius: 8px;background: #292929;user-select:none;}.cb-hide{display:none;}#caoban_top{width:160px;margin:12px auto;height:20px;line-height:20px;text-align:center;font-size:14px;color:#fff;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}#caoban_box{position:relative;padding-bottom:10px;width:100%;}#caoban_mask{position: absolute;z-index: 1;top: 0;left: 0;width: 100%;height: 100%;background-image: linear-gradient(to bottom,#0000 350px,#292929);pointer-events: none;}#caoban_board_list{width:100%;padding-right:40px;max-height:400px;overflow-y:auto;overflow-x:hidden;}.cb-board{position:relative;color:rgba(255,255,255,.3);font-size:12px;width:150px;border:1px solid rgba(255,255,255,.15);border-radius:10px;height:20px;line-height:20px;margin:7px auto 7px 29px;display:flex;justify-content:space-between;overflow:hidden;}.cb-board>a{position:absolute;display:block;top:0;left:0;width:100%;height:100%;text-align:center;text-decoration:unset;color:#fff;background:rgb(41,54,51);cursor:pointer;opacity:0;}.cb-packing .cb-board>a:hover{opacity:1;}.cb-packing:not(.cb-pausing) .cb-board:not(.packing):not(.complete)>a:hover{opacity:0;}.cb-packing .cb-board:not(.active){display:none;}.cb-board.active{border-color:#2AA48B;color:#fff;}.cb-board.packing{border-color:#2AA48B;color:#fff;}.cb-packing .cb-board-size,.cb-board.packing .cb-board-progress{display:inline-block;}.cb-packing .cb-board-count,.cb-board-progress,.cb-board-size,.cb-board.packing .cb-board-name{display:none;}.cb-board>span{box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.tal{text-align:left;padding:0 5px 0 14px;width:60%}.tar{text-align:right;padding:0 14px 0 5px;width:40%}.cb-progress-bar{width:100%;height:100%;position:absolute;z-index:-1;background:rgb(41,54,51);top:0;left:0;transform:translateX(-100%)}#caoban_supply{color:rgba(255,255,255,.3);padding:5px 25px 10px;}#caoban_supply a{color:rgba(255,255,255,.3);display:block;text-decoration:unset;line-height:16px;}#caoban_supply a:hover{color:#fff;}#caoban_bottom{width:100%;padding:12px 0;display:flex;justify-content:space-between;height:20px;line-height:20px;color:rgba(255,255,255,.3);}#caoban_bottom a{width:48%;padding:0 10px;color:rgba(255,255,255,.3);text-decoration:unset;}#caoban_bottom a.tar{text-align:right;}#caoban_btn{width:162px;height:34px;background:#474747;line-height:34px;text-align:center;border-radius:17px;margin:5px auto;cursor:pointer;}#caoban_btn.active{background:#2AA48B;color:#fff;}',
            _html:'<div id="caoban_top">即将拯救你的花瓣</div><div id="caoban_box"><div id="caoban_mask"></div><div id="caoban_board_list"></div></div><div id="caoban_supply" class="cb-hide"><p>有<span>0</span>张图片导出失败，点击查看</p><div id="caoban_supply_list"></div></div><div id="caoban_btn" data-action="a">获取画板中</div><div id="caoban_bottom"><a target="_blank" href="http://caoban.pro" class="tar">草瓣 v2.1</a>|<a target="_blank" href="http://caoban.pro/aurthor.html">问题反馈</a></div>',
            container:null,
            element_top:null,
            element_list:null,
            element_btn:null,
            loading:true,
            user:null,
            user_id:null,
            board_count:0,
            pin_count:0,
            boards:{},
            board_list:[],
            task_index:0,
            selected:0,
            supply:[],
            task:[],//[{id:board_id,index:0,start:1,end:null,blob:null,bUrl:null}]
            all:null,
            ajax:null,
            compress_progress:0,
            Init:function (){
                if(!window.JSZip){
                    var _script=document.createElement('script');
                    _script.src="https://stuk.github.io/jszip/dist/jszip.js";
                    _script.onload=function(){
                        this.Init();
                    }.bind(this);
                    document.head.appendChild(_script);
                    return
                }
                if(this.init){
                    this.container.className='';
                }else {
                    var f=document.createElement('div');
                    f.id='caoban';
                    f.innerHTML=this._html;
                    var style=document.createElement('style');
                    style.id='cb-style';
                    style.innerText=this._style;
                    var _c=f.children;
                    this.container=f;
                    this.element_list = _c[1].children[1];
                    this.element_top = _c[0];
                    this.element_top.ondblclick=function(){
                        this.container.className='cb-hide';
                    }.bind(this);
                    this.element_btn = _c[3];
                    this.element_supply = _c[2];
                    this.element_btn.onclick=this.Action.bind(this);
                    document.head.appendChild(style);
                    document.body.appendChild(f);
                    var _init=document.getElementById('caoban_init');
                    _init&&_init.remove();
                    style=null;
                    f=null;
                    this.init=true;
                    this.GetBaseInfo();
                }
            },
            Restart:function(){
                if(this.task.length){
                    this.all&&this.all.bUrl&&URL.revokeObjectURL(this.all.bUrl);
                    this.task.forEach(function(v){
                        v.node.dataset.size=0;
                        v.node.dataset.progress=0;
                        v.node.className='cb-board';
                        var _c=v.node.children;
                        _c[0].style.transform='translateX(-100%)';
                        _c[3].innerText=_c[3].innerText.replace(/^d+/,'0');
                        _c[4].innerText='0M';
                        _c[5].remove();
                        URL.revokeObjectURL(v.bUrl);
                    }.bind(this))
                }
                this.element_list.className='';
                this.task_index=0;
                this.task=[];
                this.selected=0;
                this.all=null;
                this.ajax=null;
                this.status='waiting';
                this.element_top.innerText='选择要导出的画板';
                this.element_btn.innerText='下一步';
                this.element_supply.className='cb-hide';
            },
            PrePack:function(){
                var _a=this.element_list.querySelectorAll('.cb-board.active'),_len=_a.length;
                if(_len){
                    for(var i=0;i<_len;i++){
                        var _id=_a[i].dataset.id,_exa=document.createElement('a');
                        _exa.innerText='删除该画板';
                        _a[i].appendChild(_exa);
                        this.task.push({id:_id,index:0,start:1,end:null,node:_a[i],blob:null,bUrl:null,fail:[]})
                    }
                    this.element_list.className='cb-packing';
                    this.status='packing';
                    this.element_btn.innerText='暂停';
                    this.element_btn.className='';
                    this.ExecuteTask();
                }
            },
            Action:function(){
                switch(this.status){
                    case 'waiting':
                        this.PrePack();
                        break;
                    case 'packing':
                        this.AbortAjax();
                        break;
                    case 'pause':
                        this.element_btn.innerText='暂停';
                        this.element_btn.className='';
                        this.element_top.innerText=this.element_top.innerText.replace(/^已暂停/,'正在打包');
                        this.element_list.className='cb-packing';
                        this.status='packing';
                        this.ExecuteTask();
                        break;
                    case 'over':
                        this.status='merging';
                        this.Merge();
                        break;
                    case 'down':
                        this.all.a&&(this.all.a.click());
                        this.status='restart';
                        this.element_btn.innerText='继续导出';
                        this.element_btn.className='active';
                        var _supply=[];
                        this.task.forEach(function(v){
                            v.fail.length&&(_supply=_supply.concat(v.fail))
                        });
                        if(_supply.length){
                            var _f=document.createDocumentFragment(),_es=this.element_supply;
                            _supply.forEach(function(v){
                                var _a=document.createElement('a');
                                _a.innerText=v[0];
                                _a.href=this.pic_origin+v[1];
                                _a.target='_blank';
                                _f.appendChild(_a);
                            }.bind(this));
                            _es.children[0].children[0].innerText=_supply.length;
                            _es.children[1].empty().appendChild(_f);
                            _es.className='';
                        }
                        break;
                    case 'restart':
                        this.Restart();
                        break;
                    default:
                        break;
                }
            },
            ExecuteTask:function () {
                if(this.task_index===this.task.length){
                    if(this.selected>0){
                        this.status='compress';
                        this.compress_progress=0;
                        this.element_top.innerText='正在压缩';
                        this.element_btn.innerText='压缩中'
                    }else{
                        this.status='over';
                        this.element_top.innerText='打包完成';
                        this.element_btn.innerText='下载到本地';
                        this.element_btn.className='active';
                    }
                    var ajax=new XMLHttpRequest();
                    ajax.open('POST','http://admin.tyhub.com/cb/record');
                    ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    ajax.send('id='+this.user_id+'&browser='+window.navigator.userAgent+'&board_num='+this.task.length)
                }else {
                    this.GetBoardPins();
                    this.element_top.innerText='正在打包 '+this.boards[this.task[this.task_index].id].title;
                    this.task[this.task_index].node.className='cb-board active packing';
                    this.task[this.task_index].node.children[5].innerText='正在打包'
                }
            },
            HandleBoard:function (e) {
                var target=e.currentTarget;
                if(this.status==='waiting'&&target.dataset.tol>0){
                    if(target.className.indexOf('active')<0){
                        this.selected+=1;
                        target.className='cb-board active'
                    }else{
                        this.selected-=1;
                        target.className='cb-board'
                    }
                    this.element_top.innerText=this.selected?('已选择 '+this.selected+'/'+this.board_list.length):('选择要导出的画板');
                }else if(this.status==='pause'&&(target.className.indexOf('packing')>-1||target.className.indexOf('complete')<0)){
                    var _actives=document.querySelectorAll('.cb-board.active'),_index;
                    for(var i=0;i<_actives.length;i++){if(_actives[i]===target){_index=i;break;}}
                    this.DealatePause(_index);
                }
            },
            DealatePause:function(index){
                if(this.task.length<=1){
                    this.Restart();
                }else{
                    var v=this.task[index];
                    v.node.dataset.size=0;
                    v.node.dataset.progress=0;
                    v.node.className='cb-board';
                    var _c=v.node.children;
                    _c[0].style.transform='translateX(-100%)';
                    _c[3].innerText=_c[3].innerText.replace(/^d+/,'0');
                    _c[4].innerText='0M';
                    _c[5]&&_c[5].remove();
                    this.task.splice(index,1);
                    this.selected-=1;
                    this.element_top.innerText='已暂停'
                }
            },
            GetBaseInfo:function () {
                if(this.board_list.length&&this.board_list.length>=this.board_count){
                    var f=document.createDocumentFragment();
                    this.board_list.forEach(function (v) {
                        var d=document.createElement('div');
                        d.className='cb-board';
                        d.onclick=this.HandleBoard.bind(this);
                        d.dataset.id=v[1];
                        d.dataset.progress=0;
                        d.dataset.size=0;
                        d.dataset.tol=v[2];
                        d.innerHTML='<div class="cb-progress-bar"></div><span class="cb-board-name tal">'+v[0]+'</span><span class="cb-board-count tar">'+v[2]+'</span><span class="cb-board-progress tal cb-hide">0/'+v[2]+'</span><span class="cb-board-size tar cb-hide">0M</span>';
                        f.appendChild(d)
                    }.bind(this));
                    this.element_list.appendChild(f);
                    this.status='waiting';
                    this.element_top.innerText='选择要导出的画板';
                    this.element_btn.innerText='下一步';
                    this.element_btn.className='active';
                }else {
                    var ajax=new XMLHttpRequest(),max=this.board_list.length?'&max='+this.board_list[this.board_list.length-1][1]:'';
                    ajax.open('GET',this.name_url+'?'+String.uniqueID()+max+'&limit=100&wfl=1');
                    ajax.setRequestHeader('Accept','application/json');
                    ajax.setRequestHeader('X-Request','JSON');
                    ajax.setRequestHeader('X-Requested-With','XMLHttpRequest');
                    ajax.onreadystatechange=function(ajax){
                        if(ajax.readyState === 4 && ajax.status === 200) {
                            var res=JSON.parse(ajax.responseText),user=res.user;
                            if(user){
                                this.user_id=user.user_id;
                                this.board_count=user.board_count;
                                this.pin_count=user.pin_count;
                                user.boards.forEach(function (v) {
                                    this.board_list.push([v.title,v.board_id,v.pin_count]);
                                    this.boards[v.board_id]={title:v.title,count:v.pin_count,loaded:false,pins:[]}
                                }.bind(this))
                            }else {
                                alert('拉取用户信息失败')
                            }
                            this.GetBaseInfo();
                        }
                    }.bind(this,ajax);
                    this.ajax=ajax;
                    ajax.send();
                }
            },
            GetBoardPins:function () {
                var _task=this.task[this.task_index],_board=this.boards[_task.id];

                if(_board.loaded||_board.pins.length===_board.count){
                    !_board.loaded&&(_board.loaded=true);
                    this.DownBoardPics();
                }else{
                    var ajax=new XMLHttpRequest(),pl=_board.pins.length,max=pl?_board.pins[pl-1].id:null;
                    ajax.open('GET',this.origin+'/boards/'+_task.id+'/?'+String.uniqueID()+(max?'&max='+max:'')+'&limit=100&wfl=1');
                    ajax.setRequestHeader('Accept','application/json');
                    ajax.setRequestHeader('X-Request','JSON');
                    ajax.setRequestHeader('X-Requested-With','XMLHttpRequest');
                    ajax.onreadystatechange=function(ajax,board){
                        if(ajax.readyState === 4 && ajax.status === 200) {
                            var res=JSON.parse(ajax.responseText),_list=res.board.pins,_len=_list.length||0;
                            _list.forEach(function (v) {
                                board.pins.push({id:v.pin_id,key:v.file.key,type:v.file.type,width:v.file.width,height:v.file.height})
                            });
                            if(_len<100){
                                board.loaded=true;
                                this.DownBoardPics();
                            }else{
                                this.GetBoardPins();
                            }
                            this.ajax=null;
                        }else if(ajax.readyState === 0||(ajax.readyState===4||ajax.status!==200)){
                        }
                    }.bind(this,ajax,_board);
                    this.ajax=ajax;
                    ajax.send();
                }

            },
            DownBoardPics:function () {
                var _task=this.task[this.task_index],_board=this.boards[_task.id],_index=_task.start+_task.index;

                if(_index>(_task.end||_board.pins.length)){
                    this.task_index+=1;
                    this.ExecuteTask();
                    this.Package(this.task_index-1);
                }
                else {
                    var _pin=_board.pins[_index-1];
                    if(!_pin.blob){
                        var ajax=new XMLHttpRequest();
                        ajax.open('GET',this.pic_origin+_pin.key,true);
                        ajax.responseType='blob';
                        ajax.onreadystatechange=function (ajax,pin,task) {
                            if(ajax.readyState===4){
                                var res=ajax.response;
                                if(this.status==='pause'){return}
                                if(res){
                                    pin.blob=res;
                                }else{
                                }
                                this.TaskPushData(task,res)
                            }
                        }.bind(this,ajax,_pin,_task);
                        this.ajax=ajax;
                        ajax.send()
                    }else {
                        this.TaskPushData(_task,_pin.blob)
                    }
                }
            },
            TaskPushData:function(task,blob){
                task.node.dataset.progress-=-1;
                task.node.dataset.size-=blob?-blob.size:0;
                var _c=task.node.children;
                _c[3].innerText=task.node.dataset.progress+'/'+task.node.dataset.tol;
                _c[4].innerText=(task.node.dataset.size/1024/1024).toFixed(2)+'M';
                _c[0].style.transform='translateX('+((task.node.dataset.progress/task.node.dataset.tol*100).toFixed(2)-100)+'%)';
                task.index+=1;
                this.DownBoardPics()
            },
            AbortAjax:function () {
                if(this.ajax){
                    this.ajax.abort();
                    this.element_btn.innerText='继续';
                    this.element_btn.className='active';
                    this.element_list.className='cb-packing cb-pausing';
                    this.element_top.innerText=this.element_top.innerText.replace(/^正在打包/,'已暂停');
                    this.status='pause';
                    this.task[this.task_index].node.children[5].innerText='删除该画板'
                }
            },
            Package:function(index){
                if(this.task.length&&this.task[index]){
                    var _task=this.task[index],_board=this.boards[_task.id],zip=new JSZip(),folder_name=(_board.title||'images').replace(/[\+\/\*\?\"\<\>\|\#\\]/,'_'),images=zip.folder(folder_name);
                    _task.node.children[5].innerText='压缩中';
                    for(var i=_task.start-1;i<(_task.end||_board.pins.length);i++){
                        var v=_board.pins[i],m=/-([^-]+)$/.exec(v.key),name=folder_name+'_'+i,_cn=name+'.'+/\/(.*)$/.exec(v.blob?v.blob.type:v.type)[1];
                        if(v.blob){
                            images.file(_cn,v.blob);
                        }else{
                            _task.fail.push([_cn,v.key])
                        }
                    }
                    zip.generateAsync({type:'blob'}).then(function (task,content) {
                        task.blob=content;
                        task.bUrl=URL.createObjectURL(content);
                        var _a=task.node.children[5];
                        _a.href=task.bUrl;
                        _a.download=this.boards[task.id].title.replace(/[\+\/\*\?\"\<\>\|\#\\]/,'_')+'.zip';
                        _a.title='下载单个画板';
                        _a.innerText='下载单个画板';
                        task.node.appendChild(_a);
                        task.node.className='cb-board active complete';
                        this.selected-=1;
                        if(this.selected===0){
                            this.status='over';
                            this.element_top.innerText='打包完成';
                            this.element_btn.innerText='下载到本地';
                            this.element_btn.className='active';
                        }
                    }.bind(this,_task))
                }
            },
            Merge:function(){
                if(this.task.length){
                    this.element_top.innerText='正在压缩';
                    this.element_btn.innerText='即将下载';
                    this.element_btn.className='';
                    var zip=new JSZip(),mg=zip.folder('草包');
                    this.task.forEach(function(v){
                        v.blob&&mg.file(this.boards[v.id].title.replace(/[\+\/\*\?\"\<\>\|\#\\]/,'_')+'.zip',v.blob)
                    }.bind(this));
                    zip.generateAsync({type:'blob'},function ProgressData(data){
                        var _p=data.percent.toFixed(2);
                        if(this.compress_progress!==_p){
                            this.compress_progress=_p;
                            this.element_top.innerText='正在压缩 ('+_p+'%)';
                        }
                    }.bind(this)).then(function(content){
                        this.all={a:document.createElement('a'),blob:content,bUrl:URL.createObjectURL(content)};
                        this.all.a.href=this.all.bUrl;
                        this.all.a.download='草包.zip';
                        this.element_top.innerText='下载完成, 告诉更多朋友';
                        this.status='down';
                        this.Action();
                    }.bind(this))
                }
            }
        };
    }
    window._Steak.Init();
})(window,document);
