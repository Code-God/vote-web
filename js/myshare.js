/**
 * Created by raytine on 2018/5/14.
 */
//分享设置
$.setShare = function(text,userName){
    //分享提示框设置
    var pageHref  = window.location.href;
    var shareContent = text;
    if(userName){
        $(".box-content-text span").html(userName)
    }
    $(".box-content-href").html(pageHref);
    $("#copyInput").val(shareContent+" ："+pageHref);
    var clipboard = new ClipboardJS('.box-content-copy');
    if($.is_weixin()=="wx"||$.is_weixin()=="qq"){
        $(".box-content-href,.box-content-copy").hide();
        $(".box-share-tips,.box-arrow-share").show();
    }
    //剪切成功
    clipboard.on('success', function(e) {
        alert("复制成功");
    });
    clipboard.on('error', function(e) {
    });


    //设置微信/QQ分享
    //根据字段看网址是否拼接&字符串
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
    var shareurl = location.href.split('#')[0];
    //处理分享地址  去除微信自带参数
    var re=/[\&]*from\=[^\&\=]+/i;
    if(location.href.indexOf("from=")>-1){
        window.location.href=location.href.replace(re,'');
    }
    $.myAjax({
        url: url+"/wxshare?url="+shareurl,
        type: "GET",
        async: true,
        data: {},
        beforeSend: function(res){
        },
        success: function(data){
            var wxData = data.data;

            setShareInfo({
                title:'520国际临床试验日"为爱而试"', // 分享标题
                summary:text, // 分享内容
                pic:'http://vote.jsure.com/520/imgs/share-logo-new.png', // 分享图片
                url:location.href, // 分享链接
                // 微信权限验证配置信息，若不在微信传播，可忽略
                WXconfig: {
                    swapTitleInWX: true, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
                    appId: wxData.appId, // 公众号的唯一标识
                    timestamp: wxData.timestamp, // 生成签名的时间戳
                    nonceStr: wxData.nonceStr, // 生成签名的随机串
                    signature:  wxData.signature, // 签名
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ','onMenuShareQZone']
                }
            });
        },
        error: function(e){
            console.log(e)
        }
    });
};
