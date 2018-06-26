/**
 * Created by raytine on 2018/5/11.
 */
(function(){
    //判断活动是否截止
    $.activeTimeJudgment();

    //获取用户信息
    var userId = $.getUrlParam("userId");
    var userInfo;
    $.myAjax({
        url: url+"/user?id="+userId,
        type: "GET",
        async: false,
        data: {},
        beforeSend: function(res){
        },
        success: function(res){
            if(res.status=="200"){
                if(res.data!=""&&res.data!=null&&res.data!=undefined){
                    userInfo = res.data[0];
                    var urlArr = userInfo.votePhoto.photoUrl.split(".jpg");
                    var url = urlArr[0] + "_b.png";
                    $(".user-details-picture-frame").attr("src",url);
                    $(".user-details-name").html(userInfo.userName);
                    $(".user-details-number span").html(userInfo.id);
                    $(".user-details-good span").html(userInfo.laud);
                    if(userInfo.status==1){
                        $(".user-details-good-button").addClass("cur");
                    }
                    $(".main").removeClass("lording");
                    //分享设置
                    $.setShare("520为爱而试第 14 个国际临床试验日让我们为 "+userInfo.userName+" 点赞",userInfo.userName);
                }
            }else if(res.status=="201"){
                alert(res.message);
                window.location.href = "index.html";
            }
        },
        error: function(e){
        }
    });

    //点赞
    $(".user-details-good-button").click(function(){
        if($.activeTimeJudgment()){
            var obj = $(this);
            var id = userInfo.id;
            if(userInfo.status==1){
                console.log("您已为TA点过赞!");
                return false;
            }
            $.myAjax({
                url: url+"/laud",
                type: "POST",
                async: false,
                data: {"id":id},
                beforeSend: function(res){
                },
                success: function(res){
                    if(res.status=="200"){
                        console.log("点赞成功");
                        obj.addClass("cur").addClass("animation");
                        $(".user-details-good span").html(res.data[0].laud);
                    }else if(res.status=="201"){
                        console.log("您已为TA点过赞!");
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


    //分享点击
    $(".user-details-share-button").click(function(){
        $(".share-box").show();
    });
    $(".box-mask,.box-close").click(function(){
        $(".share-box").hide();
    });

    //我要参加
    $(".user-details-join-button").click(function(){
        window.location.href = "index.html";
    });

    //返回列表
    $(".go-list").click(function(){
        localStorage.setItem("detailsBack", "details");
        window.location.href = "index.html";
    });
})();