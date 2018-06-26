/**
 * Created by raytine on 2018/5/9.
 */
(function(){
    //判断活动是否截止
    $.activeTimeJudgment();

    //列表滚动
    //获取列表数据
    var myScroll,
        upIcon = $("#up-icon"),
        downIcon = $("#down-icon"),
        pageIndex = 1,
        pageSize = 10,
        scrollStatus = true;
    function loadList (Index,Size,status) {
        $.myAjax({
            url: url+"/userList?pageIndex="+Index+"&pageSize="+Size,
            type: "GET",
            async: true,
            data: {},
            beforeSend: function(res){
            },
            success: function(res){
                scrollStatus = true;
                if(res.status=="200"){
                    var data = res.data;
                    var listHtml = getListHtml(data.userList);
                    //刷新则清空列表数据再添加
                    if(status=="refresh"){
                        $(".user-list-content").html("").append(listHtml);
                        $('#scroller-pullUp').show();
                    }else {
                        $(".user-list-content").append(listHtml);
                    }
                    //所有用户已加载完则没有加载更多
                    if (pageIndex*pageSize>=data.count) {
                        $('#scroller-pullUp').hide();
                    }
                    //第一次加载 绑定滚动事件
                    if(status=="first"){
                        listScroll ();
                    }else {
                        setTimeout(function () {
                            myScroll.refresh();
                        }, 0);
                    }
                    pageIndex++;
                }else {
                    $('#scroller-pullUp').hide();
                }
            },
            error: function(e){
            }
        });
    }
    loadList(pageIndex,pageSize,"first");

    //设置列表滚动
    function listScroll () {
        myScroll = new IScroll('#wrapper', {
            probeType:3,
            mouseWheel: true,
            click: true,
            taps:true
        });
        myScroll.on("scroll",function(){
            //scroll事件，可以用来控制上拉和下拉之后显示的模块中，
            //样式和内容展示的部分的改变。
            var y = this.y,
                maxY = this.maxScrollY - y,
                downHasClass = downIcon.hasClass("reverse_icon"),
                upHasClass = upIcon.hasClass("reverse_icon");

            //下拉刷新
            if(y >=100 ){
                if(scrollStatus){
                    $.activeTimeJudgment();
                    scrollStatus = false;
                    pageIndex = 1;
                    !downHasClass && downIcon.addClass("reverse_icon");
                    $("#pullDown-msg").html("刷新中...");
                    $("#scroller-pullDown").addClass("lord");
                    setTimeout(function(){
                        loadList(pageIndex,pageSize,"refresh");
                    },1000)
                }
                return "";
            }else if(y < 100&& y > 0 && !$("#scroller-pullDown").hasClass("lord")){
                downHasClass && downIcon.removeClass("reverse_icon");
                $("#pullDown-msg").html("下拉刷新");
                return "";
            }

            //上拉加载
            if(maxY >= 100 && $.activeTimeJudgment()){
                if(scrollStatus){
                    scrollStatus = false;
                    !upHasClass && upIcon.addClass("reverse_icon");
                    $("#pullUp-msg").html("加载中...");
                    loadList(pageIndex,pageSize,"");
                }
                return "";
            }else if(maxY < 100 && maxY >=0){
                upHasClass && upIcon.removeClass("reverse_icon");
                $("#pullUp-msg").html("上拉加载");
                return "";
            }
        });
        myScroll.on("refresh",function(){
            $("#pullDown-msg").html("刷新成功");
            $("#scroller-pullDown").removeClass("lord");
            setTimeout(function(){
                $("#pullDown-msg").html("下拉刷新");
            },500);
            $("#pullUp-msg").html("上拉加载");
        });
    }

    //渲染列表
    function  getListHtml (data) {
        var listHtml = "";
        data.forEach(function(val,index,arr){
            var urlArr = val.votePhoto.photoUrl.split(".jpg");
            var url = urlArr[0] + "_s.jpg";
            var index = parseInt(index)+1;
            var ranking = index<10?'0'+index:index;
            listHtml +=
                '<a class="user-list-item" href="details.html?userId='+val.id+'">' +
                    '<div class="user-item-img">' +
                        '<img class="user-img-phone" src="'+url+'"/>' +
                        '<img class="user-picture-frame" src="'+val.votePhoto.photoFrame+'" alt="相框"/>' +
                    '</div>' +
                    '<div class="user-item-info">' +
                        '<div class="user-item-name">'+val.userName+'</div>' +
                        '<div class="user-item-number">NO.'+val.id+'</div>' +
                        '<div class="user-item-good">已获 <span>'+val.laud+'</span> 个赞</div>' +
                    '</div>' +
                    '<div class="user-item-buttons">' +
                        '<span class="user-item-button-good mod-transition '+(val.status==1?'cur':'')+'" data-id="'+val.id+'">' +
                            '<i class="good-heart mod-transition"></i>' +
                        '</span>' +
                        '<span class="ranking">' +
                            '<i></i>' +
                            '<span>'+ranking+'</span>' +
                        '</span>' +
                    '</div>' +
                '</a>'
        });
        return listHtml;
    }

    //搜索
    function search (){
        if($.activeTimeJudgment()){
            var id = $(".mod-search-input").val();
            if(id==""||id==null||id==undefined){
                loadList();
                return false;
            }
            $.myAjax({
                url: url+"/user?id="+id,
                type: "GET",
                async: true,
                data: {},
                beforeSend: function(res){
                },
                success: function(res){
                    if(res.status=="200"){
                        var data = res.data;
                        var listHtml = getListHtml(data);
                        $(".user-list-content").html("").append(listHtml);
                        myScroll.refresh();
                    }else if(res.status=="201"){
                        alert(res.message)
                    }
                },
                error: function(e){
                }
            });
        }else {
            alert("活动已结束！");
            window.location.reload();
        }
    }
    //搜索用户
    $(".mod-search-button").click(function(){
        search ()
    });
    $(".mod-search-input").on('keypress',function(e) {
        var keycode = e.keyCode;
        if(keycode=='13') {
            e.preventDefault();
            //请求搜索接口
            search ();
            $(".mod-search-input").blur();
        }
    });
    //搜索聚焦
    $(".mod-search-input").focus(function(){
        $(".mod-search").addClass("fixed");
        $(".search-mark").show();
    });
    $(".mod-search-input").blur(function(){
        setTimeout(function(){
            $(".mod-search").removeClass("fixed");
            $(".search-mark").hide();
        },1);
    });

    //点赞
    $(".user-list").on("click",".user-item-buttons .user-item-button-good",function(e){
        if($.activeTimeJudgment()){
            var oEvent = e || event;
            var obj = $(this);
            var id = obj.attr("data-id");
            //js阻止链接默认行为
            oEvent.preventDefault();
            if(obj.hasClass("cur")){
                console.log("您已为TA点过赞!");
                return false;
            }
            $.myAjax({
                url: url+"/laud",
                type: "POST",
                async: true,
                data: {"id":id},
                beforeSend: function(res){
                },
                success: function(res){
                    if(res.status=="200"){
                        obj.addClass("cur");
                        obj.closest(".user-list-item").find(".user-item-good span").html(res.data[0].laud);
                    }else if(res.status=="201"){
                        alert("您已为TA点过赞!");
                        obj.addClass("cur");
                    }
                },
                error: function(e){
                }
            });
        }else {
            alert("活动已结束！");
            window.location.reload();
        }
    });

    //绑定上传事件
    var up = new $.UpImg;
    var btn = $(".up-img-even-button");
    var upEven = $(".template-phone");
    var file = $(".file");
    var cropperObj;
    up.up(btn,upEven,file,function(){
        callBackFun ()
    });
    function callBackFun () {
        //跳转选择相框页动画
        if($(".page2").css("display")=="flex"){
            $(".page2 .page-title").css("opacity",0);
            $(".page2 .top-bg-img").css({
                "margin-top":"-60px",
                "opacity": 0
            });
            $(".page2 .center-contend").css({
                "margin-left":"-160px",
                "opacity": 0
            });
            $(".page2 .bottom-bg-img").css({
                "margin-bottom":"-60px",
                "opacity": 0
            });
            $(".page3").css("display","flex");
            setTimeout(function(){
                $(".page2").hide();
            },500)
        }
        //绑定裁切事件
        upEven.cropper("destroy");
        $(".page3").removeClass("show").addClass("hide");
        cropperObj = upEven.cropper({
            aspectRatio: 1 / 1,
            dragMode: "move",
            cropBoxResizable: false,
            viewMode:1,
            crop: function(event) {
            }
        });
    }

    //确认裁切图片
    $(".confirm-img").click(function(){
        var $imgUrl = cropperObj.cropper('getCroppedCanvas');
        upEven.cropper("destroy");
        upEven.attr("src",$imgUrl.toDataURL('image/jpeg',0.5));
        $(".page3").removeClass("hide").addClass("show");
    });

    //切换相框
    $(".picture-frame-item").click(function(){
        var id = $(this).attr("data-id");
        $(".picture-frame-item").removeClass("cur");
        $(this).addClass("cur");
        $(".template-picture-frame").attr("src","imgs/b0"+id+".png");
    });

    //活动规则
    $(".active-rule").click(function(){
        $(".active-rule-box").show();
    });
    $(".active-rule-mask,.I-know,.active-rule-close").click(function(){
        $(".active-rule-box").hide();
    });

    //分享点击
    $(".share-index").click(function(){
        $(".share-box").show();
    });
    $(".box-mask,.box-close").click(function(){
        $(".share-box").hide();
    });


    //分享设置
    $.setShare("520为爱而试第 14 个国际临床试验日让我们为行业里每张鲜活的脸点赞");
})();