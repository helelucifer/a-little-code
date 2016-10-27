/**
 * Created by 黎阳 on 2016/10/24.
 */
$(function () {
    var $myBanner=$("#banner");
    var $indicator=$myBanner.children(".indicator");
    var $bannerInner=$myBanner.children(".inner");
    var $bannerLeft=$myBanner.children(".bannerLeft");
    var $bannerRight=$myBanner.children(".bannerRight");

    //inner中包裹Img的div集合
    var $divList=null;
    //inner中所有的img节点的集合
    var $imgList=null;
    //所有指示器的集合
    var $oLis=null;


    var jsonData=null;
    //1.使用jQuery的Ajax方法，请求服务端的数据
    $.ajax({
        url:"json/banner.txt?_="+Math.random(),
        type:"get",
        async:false,
        dataType:"json",//jQuery会自动将接受到json数据转换成对应的json对象
        success:function (data) {
            jsonData=data;
            console.log(data);
            //绑定数据
            bindData();
        }
    });
    //2.获得服务端数据后，解析数据，并将数据绑定到Html中
    function bindData() {
        //用来拼接Html代码的字符串
        var str1="",str2="";
        $.each(jsonData,function (index,item) {
            str1+="<div><img src='' truePath='"+item["img_url"]+"'></div>";
            index===0?str2+="<li class='bg'></li>":str2+="<li></li>";
        });
        $bannerInner.html(str1);
        $indicator.html(str2);

        //jQuery生成的节点数组不会根据html内容的更新而更新，而DOM中的节点数组会自动更新.需要重新更新数组

        //inner中包裹Img的div集合
        $divList=$bannerInner.children("div");
        //inner中所有的img节点的集合
        $imgList=$bannerInner.find("img");
        //所有指示器的集合
        $oLis=$indicator.children("li");
    }
    //3.实现图片的延迟加载
    function lazyImg() {
        $imgList.each(function (index, imgTag) {
            var oImg=new Image();
            oImg.src=$(this).attr("truePath");
            oImg.onload=function(){
                //imgTag.attr("src",this.src);
                $(imgTag).prop("src",this.src);
                oImg=null;
            };
        })
        //所有图片加载完毕，让第一张图片显示出来
        $divList.eq(0).css("zIndex",1)
            .animate({opacity:1},1000);
    }
    window.setTimeout(lazyImg,500);

    //4.实现自动轮播
    var interval=3000,step=0;//step记录当前切换到了第几张
    var autoTimer=window.setInterval(autoPlay,interval);
    function autoPlay() {
        if(step===jsonData.length-1)
        {
            step=-1;
        }
        step++;
        changePic();
    }
    function changePic() {
        //找到当前要显示的div
        var $curDiv=$divList.eq(step);
        $curDiv.css("zIndex",1).siblings().css("zIndex",0);
        $curDiv.animate({opacity:1},1000,function () {
            $(this).siblings().css("opacity",0);
        });
        var $curLi=$oLis.eq(step);
        $curLi.addClass("bg").siblings().removeClass("bg");
    }
    //5.实现指示器切换
    $oLis.click(function () {
        step=$(this).index();
        changePic();

    });

    //6.实现鼠标移动到轮播图上就暂停播放并显示左右按钮 移出则开始播放并隐藏左右按钮
    $myBanner.mouseover(function () {
        window.clearInterval(autoTimer);
        $bannerLeft.css("display","block");
        $bannerRight.css("display","block");
    }).mouseout(function () {
        autoTimer=window.setInterval(autoPlay,interval);
        $bannerLeft.css("display","none");
        $bannerRight.css("display","none");
    });

    //7.实现左右按钮切换
    $bannerRight.click(autoPlay);
    $bannerLeft.click(function () {
        if(step===0)
        {
            step=jsonData.length;
        }
        step--;
        changePic();
    })

});