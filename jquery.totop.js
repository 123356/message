$.fn.extend({totop:function(){
	$(this).click(function(){
		$("body,html").animate({scrollTop:0},500);
	})
}});

