var url = "http://vote.jsure.com/vote/tryforlove";

(function () {
    //弹框
    $.Box = function () {
        //通用弹框
        this.alertBox = function (btn,obj,close) {
            btn.on('click',function () {
                obj.fadeIn(300);
                $(".mark").fadeIn(300);
                $("body,html").css("overflow","hidden");
            });
            close.on('click',function () {
                obj.fadeOut(300);
                $(".mark").fadeOut(300);
                $("body,html").css("overflow","visible");
            });
        };
    };

    //判断活动是否截止
    $.activeTimeJudgment = function (){
        var activeStatus = true;
        var nowTime = new Date().getTime();
        var endTime = new Date("2018-5-21 00:00:00").getTime();
        if(nowTime >= endTime){
            activeStatus = false;
            $(".main").addClass("active-end");
        }
        return activeStatus;
    };

    //获取地址栏参数值
    $.getUrlParam = function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r  = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    };

    //判断浏览器
    //判断访问终端
    var browser={
        versions:function(){
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language:(navigator.browserLanguage || navigator.language).toLowerCase()
    };
    $.is_weixin = function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return "wx";
        }else if (ua.match(/WeiBo/i) == "weibo") {
            //在新浪微博客户端打开
            return "weibo";
        }else if (ua.match(/QQ/i) == "qq") {
            //在QQ空间打开
            return "qq";
        }else if (browser.versions.ios) {
            //是否在IOS浏览器打开
            return "ios";
        }else if(browser.versions.android){
            //是否在安卓浏览器打开
            return "android";
        }else {
            return "other";
        }
    };

    //手机号码验证
    $.validateMobile = function(mobile,mobileInp)
    {
        if(mobile.length==0)
        {
            alert('请输入手机号码！');
            mobileInp.focus();
            return false;
        }
        if(mobile.length!=11)
        {
            alert('请输入有效的手机号码！');
            mobileInp.focus();
            return false;
        }

        var myreg = /^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/;
        if(!myreg.test(mobile))
        {
            alert('请输入有效的手机号码！');
            mobileInp.focus();
            return false;
        }
        return true;
    };

    // 反序列化 $.param
    $.unserialize = function(str){
        var data = {};
        str && str.split('&').forEach(function(item){
            item = item.split('=');
            var key = decodeURIComponent(item[0]),
                val = decodeURIComponent(item[1]);
            if(key.indexOf("[]")>=0){
                key = key.replace("[]",'');
                if(!(key in data)){
                    data[key] = [];
                }
                data[key].push(val);
            }else{
                data[key] = val;
            }
        });
        return data;
    };

    //获取全部表单数据（json类型）
    $.fn.serializeObject = function(){
        var $form = $('<form></form>');
        $(this).children().clone().appendTo($form);
        return $.unserialize($form.serialize());
    };
    //获取全部表单数据（序列化类型）
    $.fn.serializeNew = function(){
        var $form = $('<form></form>');
        $(this).children().clone().appendTo($form);
        //给select赋值(因为clone出来后 select的值被重置为第一个选项)
        $(this).find("select").each(function(index,element){
            var thisVal = $(this).val();
            var name =  $(this).attr("name");
            $form.find("select[name='"+name+"']").val(thisVal);
        });
        return $form.serialize();
    };

    //上传图片
    var wURL = window.URL || window.webkitURL;
    $.UpImg = function(){
        this.up = function(button,upEven,fileObj,callback){
            button.click(function() {
                if (/msie/i.test(navigator.userAgent)) //IE
                {
                    fileObj.fireEvent("onclick");
                } else {
                    var e = document.createEvent('MouseEvent');
                    e.initEvent('click', false, false);
                    fileObj.get(0).dispatchEvent(e);
                }
            });

            fileObj.on("change",function(){
                drawTempPhoto();
            });

            //绘制照片
            function drawTempPhoto() {
                //检验是否为图像文件
                var file = fileObj.prop('files')[0];
                if (!/image\/\w+/.test(file.type)) {
                    alert("看清楚哦，这个需要图片！");
                    return false;
                }
                var reader = new FileReader();
                //将文件以Data URL形式读入页面
                reader.readAsDataURL(file);
                reader.onload = function(e) {

                    //预览效果
                    var img = upEven[0];
                    //加载图片
                    img.src = wURL.createObjectURL(file);
                    callback();
                }

            }
        };


        //上传多个图片
        this.upImgs = function(button){
            var upEven = "";
            button.click(function() {
                var sub = $(".file");
                if (/msie/i.test(navigator.userAgent)) //IE
                {
                    sub.fireEvent("onclick");
                } else {
                    var e = document.createEvent('MouseEvent');
                    e.initEvent('click', false, false);
                    sub.get(0).dispatchEvent(e);
                }
            });

            $(".file").on("change",function(){
                var file = $(".file").val();
                var obj = button.closest("form").submit();
                drawTempPhoto();
                imgSubmit(file,obj);
            });

            //单个图片提交
            function imgSubmit(val,obj){
                var fileName = val;
                var ldot = fileName.lastIndexOf(".");
                var ext = fileName.substring(ldot + 1);
                if (!(ext && /^(jpg|JPG|png|PNG)$/.test(ext))) {
                    alert("您上传的病历格式不对，仅支持jpg|png格式，请重新选择！");
                    return;
                }
                obj.submit();
            }

            //绘制照片
            function drawTempPhoto() {
                //检验是否为图像文件
                var file = $(".file").prop('files')[0];
                if (!/image\/\w+/.test(file.type)) {
                    alert("看清楚哦，这个需要图片！");
                    return false;
                }

                var html = $(".form-imgs>.form-img:eq(0)").clone(true).removeClass("template");  //复制模板
                button.before(html);
                upEven = button.prev(".form-img").find("img");

                var reader = new FileReader();
                //将文件以Data URL形式读入页面
                reader.readAsDataURL(file);
                reader.onload = function(e) {

                    //预览效果
                    var img = upEven[0];
                    //加载图片，此处的this.result为base64格式
                    img.src = this.result;

                }

            }
        }
    };


    /**
     * ajax简单封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
     * async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
     *       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
     * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
     * beforeSendfn 过程回调函数
     * successfn 成功回调函数
     * errorfn 失败回调函数
     */
    jQuery.myAjax=function(dataObj) {
        var url = (dataObj.url==null || dataObj.url=="" || typeof(dataObj.url)=="undefined")? "" : dataObj.url;
        var async = (dataObj.async==null || dataObj.async=="" || typeof(dataObj.async)=="undefined")? "true" : dataObj.async;
        var type = (dataObj.type==null || dataObj.type=="" || typeof(dataObj.type)=="undefined")? "post" : dataObj.type;
        var dataType = (dataObj.dataType==null || dataObj.dataType=="" || typeof(dataObj.dataType)=="undefined")? "json" : dataObj.dataType;
        var data = (dataObj.data==null || dataObj.data=="" || typeof(dataObj.data)=="undefined")? {"date": new Date().getTime()} : dataObj.data;
        var beforeSend = (dataObj.beforeSend==null || dataObj.beforeSend=="" || typeof(dataObj.beforeSend)=="undefined")? function(){} : dataObj.beforeSend;
        var success = (dataObj.success==null || dataObj.success=="" || typeof(dataObj.success)=="undefined")? function(){} : dataObj.success;
        var error = (dataObj.error==null || dataObj.error=="" || typeof(dataObj.error)=="undefined")? function(){} : dataObj.error;
        $.ajax({
            type: type,
            async: async,
            data: data,
            url: url,
            dataType: dataType,
            beforeSend: function(res){
                beforeSend(res);
            },
            success: function(d){
                success(d);
            },
            error: function(e){
                error(e);
            }
        });
    };

})();