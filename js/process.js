/**
 * Created by raytine on 2018/5/10.
 */
(function(){
    var windowHeight = $(window).height();
    //首页
    var page = {
        //为520投票
        showList : function(){
            $(".bottom-title-img").addClass("move");
            setTimeout(function(){
                $(".page1").css("margin-top",-windowHeight);
            },200);
        },

        //回到首页
        hideList : function(){
            $(".page1").css("margin-top",0);
            $(".bottom-title-img").removeClass("move");
        },

        //参与活动
        goActive : function(){
            var time = 500;
            $(".good-tip,.top-img-small,.page5").hide();
            $(".top-img.big").show();
            $(".page1 .top-title-img").css({
                "top":0,
                "opacity": 0
            });
            $(".page1 .center-contend").css({
                "margin-left":"-60px",
                "opacity": 0
            });
            $(".page1 .bottom-title-img").css({
                "bottom":"-200px",
                "opacity": 0
            });
            setTimeout(function(){
                $(".page1").hide();
                $(".page2").css("display","flex");
                $(".page2 .page-title").css("opacity",1).fadeIn(time);
                $(".page2 .top-bg-img").css({
                    "margin-top":"0",
                    "opacity": 1
                });
                $(".page2 .center-contend").css({
                    "margin-right":"0",
                    "opacity": 1
                });
                $(".page2 .bottom-bg-img").css({
                    "margin-bottom":"0",
                    "opacity": 1
                });
            },time)
        },

        //跳转完成信息
        goAddUserInf : function(){
            var time = 500;
            $(".page3 .page-title").css("opacity",0);
            $(".page3 .picture-frame-list").css({
                "margin-top": "-80px",
                "opacity": 0
            });
            $(".page3 .template").css({
                "margin-left":"-95px",
                "opacity": 0
            });
            $(".page3 .up-buttons").css({
                "margin-bottom":"-80px",
                "opacity": 0
            });
            setTimeout(function(){
                $(".page3").hide();
                $(".page4").css("display","flex");
                $(".page4 .page-title").css("opacity",1).fadeIn(time);
                $(".page4 .center-text").css({
                    "margin-right":"65px",
                    "opacity": 1
                });
                $(".page4 .mod-form").css({
                    "margin-left":"0",
                    "opacity": 1
                });
            },time)
        }

        //跳转到用户预览页
        //goAudit : function(){
        //    var time = 500;
        //    $(".page4 .page-title").css("opacity",0);
        //    $(".page4 .center-text").css({
        //        "margin-left": "-65px",
        //        "opacity": 0
        //    });
        //    $(".page4 .mod-form").css({
        //        "margin-left":"-65px",
        //        "opacity": 0
        //    });
        //    setTimeout(function(){
        //        $(".page4").hide();
        //        $(".page6").css("display","flex");
        //        $(".page6 .page-title").css("opacity",1).fadeIn(time);
        //        $(".page6 .user-details-img").css({
        //            "margin-top":"40px",
        //            "opacity": 1
        //        });
        //        $(".page6 .user-details-info").css({
        //            "margin-top":"0",
        //            "opacity": 1
        //        });
        //        $(".page6 .audit-tips").css({
        //            "margin-bottom":"0",
        //            "opacity": 1
        //        });
        //        $(".page6 .back-index").css({
        //            "margin-bottom":"0",
        //            "opacity": 1
        //        });
        //        $(".page6 .to-zhaoyao").css({
        //            "margin-bottom":"0",
        //            "opacity": 1
        //        });
        //    },time)
        //}
    };

    //判断是否从详情页返回列表
    var detailsBack = localStorage.getItem("detailsBack");
    if(detailsBack&&detailsBack=="details"){
        localStorage.removeItem("detailsBack");
        page.showList();
    }

    //为爱而试点击
    $(".bottom-title-img,.good-tip").click(function(){
        page.showList();
    });

    //回到首页按钮点击
    $(".up-back").click(function(){
        page.hideList();
    });

    //跳转上传图片页
    $(".go-active").click(function(){
        if($.activeTimeJudgment()){
            page.goActive();
        }else {
            alert("活动已结束！");
            window.location.reload();
        }
    });

    //跳转完成信息
    var photoUrl = "";
    var photoFrame  = "";
    $(".submit-img").click(function(){
        if($.activeTimeJudgment()){
            var obj = $(this);
            var imgData = $(".template-phone").attr("src");
            $.myAjax({
                url: url+"/upload",
                type: "POST",
                async: false,
                data: {"imgData":imgData},
                beforeSend: function(res){
                    obj.html("上传中。。。");
                    obj.addClass("lording");
                    $(".lording-mark").show();
                },
                success: function(res){
                    if(res.status=="200"){
                        photoUrl = res.data;
                        photoFrame = $(".page3 .template-picture-frame").attr("src");
                        page.goAddUserInf();
                    }else if(res.status=="201"){
                        alert(res.message);
                    }
                },
                error: function(e){
                    obj.html("提交图片");
                    obj.removeClass("lording");
                    $(".lording-mark").hide();
                }
            });
        }else {
            alert("活动已结束！");
            window.location.reload();
        }
    });

    //提交信息
    $(".submit-button").click(function(){
        if($.activeTimeJudgment()){
            var userName = $("#name").val();
            var contact = $("#contactInformation").val();
            if(userName==""||userName==null||userName==undefined){
                alert("名字不能为空！");
                return false;
            }
            //验证手机号码
            if(!$.validateMobile(contact,$("#contactInformation"))){
                return false;
            }

            $.myAjax({
                url: url+"/user",
                type: "POST",
                async: false,
                data: {
                    "userName":userName ,
                    "contact":contact,
                    "photoUrl":photoUrl,
                    "photoFrame":photoFrame
                },
                beforeSend: function(res){
                },
                success: function(res){
                    if(res.status=="200"){
                        window.location.href = "details.html?userId="+res.data[0].id;
                    }else if(res.status=="201"){
                        alert(res.message);
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
})();