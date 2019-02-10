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
            status:'init',
            origin:location.origin,
            pic_origin:'http://img.hb.meiwu.co/',
            name_url:name_url,
            _style:'#caoban{color:#fff;font-size:12px;position:fixed;overflow:hidden;top:20px;right:50px;z-index:100000;box-sizing: border-box;width: 210px;border-radius: 8px;background: #292929;user-select:none;max-height:calc(100% - 30px);display:flex;flex-flow:column nowrap;}.cb-hide{display:none;}#caoban_top{width:160px;margin:12px auto;height:20px;line-height:20px;text-align:center;font-size:14px;color:#fff;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;flex:0 0 auto;}#caoban_box{position:relative;padding-bottom:10px;width:100%;display:flex;flex-flow:column nowrap;flex:1 1 auto}#caoban_mask{position: absolute;z-index: 1;top: 0;left: 0;width: 100%;height: 100%;background-image: linear-gradient(to bottom,#0000 350px,#292929);pointer-events: none;}#caoban_board_list{width:100%;padding-right:40px;max-height:400px;overflow-y:auto;overflow-x:hidden;}.cb-board{position:relative;color:rgba(255,255,255,.3);font-size:12px;width:150px;border:1px solid rgba(255,255,255,.15);border-radius:10px;height:20px;line-height:20px;margin:7px auto 7px 29px;display:flex;justify-content:space-between;overflow:hidden;}.cb-board>a{position:absolute;display:block;top:0;left:0;width:100%;height:100%;text-align:center;text-decoration:unset;color:#fff;background:rgb(41,54,51);cursor:pointer;opacity:0;}.cb-packing .cb-board>a:hover{opacity:1;}/*.cb-packing .cb-board:not(.packing):not(.complete)>a:hover{opacity:0;}*/.cb-packing .cb-board:not(.active){display:none;}.cb-board.active{border-color:#2AA48B;color:#fff;}.cb-board.packing{border-color:#2AA48B;color:#fff;}.cb-packing .cb-board-size,.cb-board.packing .cb-board-progress{display:inline-block;}.cb-packing .cb-board-count,.cb-board-progress,.cb-board-size,.cb-board.packing .cb-board-name{display:none;}.cb-board>span{box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.tal{text-align:left;padding:0 5px 0 14px;width:60%}.tar{text-align:right;padding:0 14px 0 5px;width:40%}.cb-progress-bar{width:100%;height:100%;position:absolute;z-index:-1;background:rgb(41,54,51);top:0;left:0;transform:translateX(-100%)}#caoban_supply{color:rgba(255,255,255,.3);padding:5px 25px 10px;display:flex;flex-flow:column nowrap;flex:1 2 auto;}#caoban_supply.cb-hide{display:none;}#caoban_supply a{color:rgba(255,255,255,.3);display:block;text-decoration:unset;line-height:16px;}#caoban_supply a:hover{color:#fff;}#caoban_bottom{width:100%;padding:12px 0;display:flex;justify-content:space-between;height:20px;line-height:20px;color:rgba(255,255,255,.3);flex:0 0 auto;}#caoban_threshold{flex:0 0 auto;}#caoban_threshold>p{text-align:center;margin:0 auto 12px;width:150px;color:rgba(255,255,255,.2)}#caoban_threshold input{border:1px solid rgba(255,255,255,.2);border-radius:3px;width:42px;display:inline-block;margin:0 5px;text-align:center;color:#fff;line-height:20px;background:transparent;}#caoban_threshold input.readonly{color:rgba(255,255,255,.5)}#caoban_bottom a{width:48%;padding:0 10px;color:rgba(255,255,255,.3);text-decoration:unset;}#caoban_bottom a.tar{text-align:right;}#caoban_btn{position:relative;width:162px;height:34px;background:#474747;line-height:34px;text-align:center;border-radius:17px;margin:5px auto;cursor:pointer;flex:0 0 auto;}#caoban_btn.active{background:#2AA48B;color:#fff;}#caoban_auto{height:24px;line-height:24px;background:#000;color:#fff;border-radius:4px;position:absolute;top:-34px;text-align:center;width:162px;left:0;display:none;}#caoban_auto a{color:#fff;text-decoration:underline}#caoban_auto p{display:block;height:10px;position:absolute;top:24px;width:100%;margin:0;background:transparent;}#caoban_btn.packing:not(.active):hover #caoban_auto{display:block}#caoban_supply_list{max-height:300px;width: 100%;padding-right: 50px;overflow-y: auto;overflow-x: hidden;}',
            _html:'<div id="caoban_top">即将拯救你的花瓣</div><div id="caoban_box"><div id="caoban_mask"></div><div id="caoban_board_list"></div></div><div id="caoban_supply" class="cb-hide"><p>由于花瓣限制，有<span>0</span>张图片导出失败，请点击手动保存</p><div id="caoban_supply_list"></div></div><div id="caoban_threshold"><p title="若出现卡顿、崩溃等，请调小频率">默认频率:<input type="text" value="800">MB/包</p></div><div id="caoban_btn" data-action="a"><span>获取画板中</span><span id="caoban_auto">点击了解 <a href="https://shimo.im/docs/nQQeaii9gZU8hNKz/" target="_blank">手动/自动下载</a><p></p></span></div><div id="caoban_bottom"><a target="_blank" href="http://caoban.pro" class="tar">草瓣v2.2.5</a>|<a target="_blank" href="http://caoban.pro/aurthor.html">问题反馈</a></div>',
            container:null,
            element_top:null,
            element_list:null,
            element_threshold:null,
            element_btn:null,
            element_btn_word:null,
            is_Mac:window.navigator.userAgent.indexOf('Mac')>-1,
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
            task:[],
            all:null,
            ajax:null,
            zip:null,
            collection:null,
            file:null,
            zip_size:0,
            size_limit:null,
            auto_down:false,
            limit_index:0,
            limit_complete:0,
            limit_down:null,
            compress_progress:0,
            speed_record:{size:null,time:null,show:null},
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
                    this.element_threshold = _c[3].children[0].children[0];
                    this.zip_size=this.is_Mac?1500:800;
                    this.element_threshold.value=this.zip_size;
                    this.element_btn = _c[4];
                    this.element_btn_word = _c[4].children[0];
                    this.element_supply = _c[2];
                    this.element_btn.onclick=this.Action.bind(this);
                    document.head.appendChild(style);
                    document.body.appendChild(f);
                    var _init=document.getElementById('caoban_init');
                    _init&&_init.remove();
                    style=null;
                    f=null;
                    this.zip=new JSZip();
                    this.collection=this.zip.folder('Pics');
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
                this.element_btn_word.innerText='下一步';
                this.element_supply.className='cb-hide';
                this.element_threshold.removeAttribute('readonly');
                this.DealclassName(this.element_threshold,'remove','cb-hide readonly')
            },
            PrePack:function(){
                if(!/^\d+$/.test(this.element_threshold.value)){alert('请设置正确阀值');return}
                this.size_limit=this.element_threshold.value;
                var _a=this.element_list.querySelectorAll('.cb-board.active'),_len=_a.length;
                if(_len){
                    for(var i=0;i<_len;i++){
                        var _id=_a[i].dataset.id,_exa=document.createElement('a');
                        _exa.innerText='删除该画板';
                        _a[i].appendChild(_exa);
                        this.task.push({id:_id,index:0,start:1,end:null,node:_a[i],blob:null,bUrl:null,fail:[],compress_progress:0})
                    }
                    this.element_list.className='cb-packing';
                    this.status='packing';
                    this.element_threshold.setAttribute('readonly','readonly');
                    this.DealclassName(this.element_threshold,'add','readonly cb-hide');
                    this.element_btn_word.innerText='切换到自动下载';
                    this.element_btn.className='packing hover';
                    this.ExecuteTask();
                }
            },
            Action:function(){
                switch(this.status){
                    case 'waiting':
                        this.PrePack();
                        break;
                    case 'packing':
                        this.auto_down=!this.auto_down;
                        this.element_btn_word.innerText=this.auto_down?'切换到手动下载':'切换到自动下载';
                        this.DealclassName(this.element_btn,this.auto_down?'remove':'add','hover');
                        break;
                    case 'pause':
                        this.element_btn_word.innerText='暂停';
                        this.element_btn.className='';
                        this.element_top.innerText=this.element_top.innerText.replace(/^已暂停/,'正在下载');
                        this.element_list.className='cb-packing';
                        this.status='packing';
                        this.ExecuteTask();
                        break;
                    case 'over':
                        this.status='merging';
                        this.Merge();
                        break;
                    case 'down':
                        this.status='restart';
                        this.element_btn_word.innerText='继续导出';
                        this.element_btn.className='active packing';
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
                    case 'wait_down_limit':
                        this.limit_down.click();
                        this.ContinueLimit();
                        break;
                    default:
                        break;
                }
            },
            DealclassName:function (element,handle,name) {
                var _className=element.className;
                name=name.split(/\s+/);
                if(handle==='add'&&name.length){
                    name.forEach(function (v) {
                        _className.indexOf(v)<0&&(_className+=' '+v)
                    });
                    element.className=_className;
                }else if(handle==='remove'){
                    name.forEach(function (v) {
                        while (_className.indexOf(v)>-1){
                            _className=_className.replace(v,'')
                        }
                    });
                    element.className=_className.replace(/\s+/,' ');
                }else if(handle==='has'){
                    var _has=true;
                    name.forEach(function (v) {
                        _className.indexOf(v)<0&&(_has=false)
                    });
                    return _has
                }else {
                    return element
                }
            },
            ExecuteTask:function () {
                if(this.task_index===this.task.length){
                    if(this.selected>0){
                        this.status='compress';
                        this.compress_progress=0;
                        this.element_top.innerText='正在压缩';
                        this.element_btn_word.innerText='压缩中'
                    }else{
                        this.status='over';
                        this.element_top.innerText='打包完成';
                        this.element_btn_word.innerText='下载到本地';
                        this.element_btn.className='active';
                    }
                    if(this.zip_size){
                        this.LimitPack(this.task[this.task_index],true);
                    }else{

                    }
                }else {
                    this.element_top.innerText='正在下载 '+this.boards[this.task[this.task_index].id].title;
                    this.task[this.task_index].node.className='cb-board active packing';
                    this.task[this.task_index].node.children[5].innerText='正在下载';
                    this.GetBoardPins();
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
                }else if(['packing','wait_down_limit'].indexOf(this.status)>-1&&target.className.indexOf('packing')<0&&target.className.indexOf('complete')<0){
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
                    this.element_btn_word.innerText='下一步';
                    this.element_btn.className='active';
                    this.DealclassName(this.element_threshold,'remove','cb-hide')
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
                    this.DownBoardPics(true);
                }else{
                    var ajax=new XMLHttpRequest(),pl=_board.pins.length,max=pl?_board.pins[pl-1].id:null;
                    ajax.open('GET',this.origin+'/boards/'+_task.id+'/?'+String.uniqueID()+(max?'&max='+max:'')+'&limit=100&wfl=1');
                    ajax.setRequestHeader('Accept','application/json');
                    ajax.setRequestHeader('X-Request','JSON');
                    ajax.setRequestHeader('X-Requested-With','XMLHttpRequest');
                    ajax.onreadystatechange=function(ajax,board,task){
                        if(ajax.readyState === 4 && ajax.status === 200) {
                            var res=JSON.parse(ajax.responseText);
                            if(!res.board){
                                return this.GetBoardPins();
                            }
                            var _list=res.board.pins,_len=_list.length||0;
                            _list.forEach(function (v) {
                                board.pins.push({id:v.pin_id,key:v.file.key,raw:v.raw_text,type:v.file.type,width:v.file.width,height:v.file.height})
                            });
                            if(_len<100){
                                board.loaded=true;
                                this.DownBoardPics(true);
                            }else{
                                this.GetBoardPins();
                            }
                            task.node.children[5].innerText='正在获取画板采集数据 '+board.pins.length;
                            this.ajax=null;
                        }else if(ajax.readyState === 0||(ajax.readyState===4||ajax.status!==200)){
                        }
                    }.bind(this,ajax,_board,_task);
                    this.ajax=ajax;
                    ajax.send();
                }

            },
            DownBoardPics:function (flag) {
                var _task=this.task[this.task_index],_board=this.boards[_task.id],_index=_task.start+_task.index;
                if(flag){
                    this.file=this.collection.folder('画板_'+(_board.title||'images').replace(/[\+\/\*\?\"\<\>\|\#\\]/,'_'))
                }
                if(_index>(_task.end||_board.pins.length)){
                    _task.node.children[5].innerText='下载速度:0kb/s';
                    this.task_index+=1;
                    this.ExecuteTask();
                }
                else {
                    var _pin=_board.pins[_index-1];
                    if(!_pin.blob){
                        var _record=this.speed_record,_time=(new Date()).getTime();
                        _record.size=_pin.size||0;
                        _record.time=_time;
                        _record.show=_record.show||_time;
                        !_record.show&&(_task.node.children[5].innerText='下载速度:0kb/s');
                        var ajax=new XMLHttpRequest();
                        ajax.open('GET',this.pic_origin+_pin.key,true);
                        ajax.responseType='blob';
                        ajax.onprogress=function(pin,task,progress){
                            if(progress.lengthComputable&&this.status==='packing'){
                                var time=(new Date()).getTime(),speed=((progress.loaded-this.speed_record.size)/1024/(time-this.speed_record.time)*1000).toFixed(1);
                                this.speed_record.time=time;
                                var _der=time-this.speed_record.show;
                                if(this.speed_record.size!==0&&speed>1&&_der>999){
                                    speed=speed>999?((speed/1024).toFixed(2)+'M/s'):speed+'kb/s';
                                    this.speed_record.show=time;
                                    task.node.children[5].innerText='下载速度:'+speed
                                };
                                this.speed_record.size=progress.loaded;
                            }
                        }.bind(this,_pin,_task);
                        ajax.onreadystatechange=function (ajax,pin,task,board,index) {
                            if(ajax.readyState===4){
                                var res=ajax.response;
                                if(this.status==='pause'){return}
                                var name=(board.title||'images').replace(/[\+\/\*\?\"\<\>\|\#\\]/,'_')+'_'+index+'.'+/\/(.*)$/.exec(res?res.type:pin.type)[1];
                                if(res){
                                    this.zip_size+=res.size;
                                    if(this.zip_size>this.size_limit*1024*1024){
                                        this.LimitPack(task);
                                    }
                                    else {
                                        this.file.file(name,res);
                                        this.TaskPushData(task,res)
                                    }
                                }else{
                                    task.fail.push([name,pin.key]);
                                    this.TaskPushData(task,res)
                                }

                            }
                        }.bind(this,ajax,_pin,_task,_board,_index-1);
                        this.ajax=ajax;
                        ajax.send()
                    }else {
                        this.TaskPushData(_task,_pin.blob)
                    }
                }
            },
            LimitPack:function (task) {
                this.status='limit';
                this.zip.generateAsync({type:'blob'},function(progress){

                }).then(function (task,content) {
                    this.limit_down=this.limit_down||document.createElement('a');
                    var a=this.limit_down,bUrl=URL.createObjectURL(content);
                    a.href=bUrl;
                    a.download='草包'+this.limit_index+'.zip';
                    this.status='wait_down_limit';
                    this.element_btn_word.innerText='下载并继续';
                    this.DealclassName(this.element_btn,'add','active');
                    this.element_top.innerText='待下载';
                    for(this.limit_complete;this.limit_complete<this.task_index;this.limit_complete++){
                        var _n=this.task[this.limit_complete].node;
                        _n.children[4].innerText='已下载！';
                        _n.children[5].innerText='已下载！';
                        _n.className='cb-board active complete';
                    }
                    if(this.auto_down){
                        a.click();
                        this.ContinueLimit()
                    }

                }.bind(this,task))
            },
            TaskPushData:function(task,blob){
                task.node.dataset.progress-=-1;
                task.node.dataset.size-=blob?-blob.size:0;
                var _c=task.node.children;
                _c[3].innerText=task.node.dataset.progress+'/'+task.node.dataset.tol;
                _c[4].innerText=(task.node.dataset.size/1024/1024).toFixed(2)+'M';
                _c[0].style.transform='translateX('+((task.node.dataset.progress/task.node.dataset.tol*100).toFixed(2)-100)+'%)';
                task.index+=1;
                this.status='packing';
                this.DownBoardPics()
            },
            ContinueLimit:function () {
                URL.revokeObjectURL(this.limit_down.href);
                this.limit_index+=1;
                this.zip.remove('Pics');
                this.zip_size=0;
                if(this.task_index===this.task.length){
                    this.status='down';
                    this.element_btn.click();
                    this.element_top.innerText='打包完成';
                    var pins_num=0,fail_num=0,size=0;
                    this.task.forEach(function(v){
                        size-=-v.node.dataset['size'];
                        fail_num+=v.fail.length;
                        pins_num+=this.boards[v.id].pins.length;
                    }.bind(this));
                    var ajax=new XMLHttpRequest();
                    ajax.open('POST','http://admin.tyhub.com/cb/record');
                    ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                    ajax.send('id='+this.user_id+'&browser='+encodeURIComponent(window.navigator.userAgent)+'&board_num='+this.task.length+'&pins_num='+pins_num+'&fail_num='+fail_num+'&size='+size)
                }else {
                    this.element_top.innerText='正在下载 '+this.boards[this.task[this.task_index].id].title;
                    this.DealclassName(this.element_btn,'remove','active');
                    this.element_btn_word.innerText=this.auto_down?'切换到手动下载':'切换到自动下载';
                    this.TaskPushData(this.task[this.task_index]);
                }

            },
            AbortAjax:function () {
                if(this.ajax){
                    this.ajax.abort();
                    this.element_btn_word.innerText='继续';
                    this.element_btn.className='active';
                    this.element_list.className='cb-packing cb-pausing';
                    this.element_top.innerText=this.element_top.innerText.replace(/^正在下载/,'已暂停');
                    this.status='pause';
                    this.task[this.task_index].node.children[5].innerText='删除该画板'
                }
            }
        };
    }
    window._Steak.Init();
})(window,document);
