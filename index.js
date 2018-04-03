  var mySwiper = new Swiper ('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    },
   
  }) 
  var iscroll=new IScroll(".content",{
  onmousewheel:true,
  scrollbars:true,
  shrinkScrollbars:"scale",
 
  click:true,

});
  var state="project";
  //点击新增处理
  $(".add").click(function () {
  	$(".mask").show();
  	$(".inputarea").transition({y:0},500);
    $(".submit").show();
    $(".update").hide();
  }); 
  //点击修改处理
  $(".update").click(function(){
      var val=$("#text").val();
    if(val===""){
      return;
    }
    $("#text").val("");
    var data=getDate();
    var index=$(this).data("index");
    data[index].content=val;
    //var time=new Date().getTime();
    //data.push({content:val,time,star:false,done:false})
    saveDate(data);
    render();
    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
      }); 
      
  }) 
  //取消处理
  $(".cancel").click(function(){
  	$(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
      }); 	
  })  
  
  function getDate(){
  	return localStorage.todo?JSON.parse(localStorage.todo):[]
  }
  function saveDate(data){
  	 localStorage.todo=JSON.stringify(data);
  }
  $(".submit").click(function(){
  	var val=$("#text").val();
  	if(val===""){
  		return;
  	}
  	$("#text").val("");
  	var data=getDate();
  	var time=new Date().getTime();
  	data.push({content:val,time,star:false,done:false})
  	saveDate(data);
  	render();
  	$(".inputarea").transition({y:"-62vh"},500,function(){
  			$(".mask").hide();
  		});
  	
  });
  
  function render(){
  	 var data=getDate();
  	 var str="";
  	 data.forEach(function(val,index){
    if(state==="project"&&val.done===false){
     str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">&#xe616;</span><div class='changestate'>完成</div></li>";
  	}else if(state==="done"&&val.done===true){
        str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">&#xe616;</span><div class='del'>删除</div></li>";
    }
    });
  	$(".itemlist").html(str);
    iscroll.refresh();
    addTouch();
    }
    render();
    //未完成
  $(".done").click(function(){
    state="done";
    $(this).addClass("active").siblings().removeClass("active");
    render();
  })
  $(".project").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    state="project";
    render();
  })
  $(".itemlist").on("click",".changestate",function(){
      var index=$(this).parent().attr("id");
      var data=getDate();
      data[index].done=true;
      saveDate(data);
      render();
  })
  .on("click",".del",function(){
     var index=$(this).parent().attr("id");
     var data=getDate();
     data.splice(index,1);
     saveDate(data);
      render();
  })
  .on("click","span",function(){
        var index=$(this).parent().attr("id");
       var data=getDate();
       data[index].star=!data[index].star;
       saveDate(data)
       render();
  })
  .on("click","p",function(){
        var index=$(this).parent().attr("id");
       var data=getDate();
       $(".inputarea").transition({y:0},500,)
        $(".mask").show();
        $("#text").val(data[index].content);
        $(".submit").hide();
        $(".update").show().data("index",index);

      
  })
  
  function  parseTime(time){
  	 var date=new Date();
  	date.setTime(time);
  	var year=date.getFullYear();
  	var month=setZero(date.getMonth()+1);
  	var day=setZero(date.getDay());
  	var hour=setZero(date.getHours());
  	var minutes=setZero(date.getMinutes());
  	var seconds=setZero(date.getSeconds());
  	return year+"/"+month+"/"+day+"<br>"+hour+":"+minutes+":"
  	+seconds;
  }
  function setZero(n){
return n<10?"0"+n:n;
}
function  addTouch(){
  $(".itemlist>li").each(function(index, ele) {
      var hammerobj=new Hammer(ele);
      var sx,movex;
      var max=window.innerWidth/5;
      var state="start";
      var flag=true;
    hammerobj.on("panstart",function(e){
      sx=e.center.x;
      ele.style.transition=""
    })
    hammerobj.on("panmove",function(e){
    let cx=e.center.x;
     movex=cx-sx;
    if(movex>0&&state=="start"){
      flag=false;
      return;
    }
    if(Math.abs(movex)>max){
      flag=false;
      state=state==="start"?"end":"start"
      if(state==="end"){
        $(ele).css("x",-max);
      }else{
        $(ele).css("x",0);
      }
      return;
    }
    if(movex<0&&state==="end"){
      flag=false;
      return
    }
    if(state==="end"){
      movex=cx-sx-max;
    }
    flag=true;
    $(ele).css("x",movex);
  })
  hammerobj.on("panend",function(e){
    if(!flag){
      return
    }
    if(Math.abs(movex)<max/2){
      $(ele).transition({x:0});
       state="start";
    }else {
       $(ele).transition({x:-max});
      state="end";
    }
  })  
    });
}
// localStorage.clear();
