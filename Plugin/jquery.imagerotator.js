/*
 ___                     ___     _        _           
|_ _|_ __  __ _ __ _ ___| _ \___| |_ __ _| |_ ___ _ _ 
 | || '  \/ _` / _` / -_)   / _ \  _/ _` |  _/ _ \ '_|
|___|_|_|_\__,_\__, \___|_|_\___/\__\__,_|\__\___/_|  
               |___/

     AUTHOR: Anthony Garand
    CREATED: 1/01/2011
    UPDATED: 7/24/2011
DESCRIPTION: Simple jQuery Image Rotator Plugin

*/
(function($){  
	$.fn.imageRotator = function(options) {
		
		var defaults = {
			width: 400,
			height: 300,
			speed: 500,
			autoRotate: true,
			autoRotateDelay: 2000,
			showArrows: true,
			showCircles: true,
		};
		var options = $.extend(defaults,options);
		$(this).find("img").css("width",options.width+"px");
		$(this).find("img").css("height",options.height+"px");
		imgWidth = options.width;
		imgHeight = options.height;
		
		var imgWidth,imgHeight,arrowHeight;
		function arrowSlide(direction,object) {
			var rotatorToSwitch = $(object).closest(".imgRotate").attr("id");
			var rotator = $(".imgRotate[id=" + rotatorToSwitch + "]");
			var imgWidth = options.width;
			var imgHeight = options.height;
			var numImg = $(rotator).find(".imgBorder > .imgMask > .imgWrap").children().size();
			var curImg = $(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgBorder > .imgMask > .imgWrap").css("left");
			curImg = curImg.replace(/[^0-9]/g, '');
			curImg = (Math.abs(curImg)/imgWidth)+1;
			var imgToGoTo;
			if (direction == "left") {
				imgToGoTo = curImg-1;
				if (curImg == 1) {imgToGoTo = numImg;}
			}
			else if (direction == "right") {
				imgToGoTo = curImg+1;
				if (curImg == numImg) {imgToGoTo = 1;}
			}
			$(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgBorder > .imgMask > .imgWrap").animate({ left: -((imgToGoTo-1)*imgWidth) }, options.speed, function() { });
			$(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgRotateControls > ul > li > a").removeClass("active");
			$(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgRotateControls > ul > li > a[href=#" + rotatorToSwitch + "-" + imgToGoTo + "]").addClass("active");
			$(".imgRotate[id=" + rotatorToSwitch + "]").find(".thumbControls > ul > li > a").removeClass("active");
			$(".imgRotate[id=" + rotatorToSwitch + "]").find(".thumbControls > ul > li > a[href=#" + rotatorToSwitch + "-" + imgToGoTo + "]").addClass("active");
		}
		return $(this).each(function(currRotator) {
			$(this).attr("id","imageRotator" + (currRotator+1)); // Set ID's on each rotator
			$(this).addClass("imgRotate");
			var rotator = this;
			var numImg = $(this).children().size(); // Get the number of images per rotator
			$(rotator).children().wrapAll('<div class="imgWrap"/></div>');
			$(rotator).children().wrapAll('<div class="imgMask"/></div>');
			$(rotator).children().wrapAll('<div class="imgBorder"/></div>'); // Wrap additional markup

			$(rotator).find(".imgWrap").width(numImg*imgWidth);
			$(rotator).find(".imgMask").width(imgWidth);
			$(rotator).find(".imgBorder").width(imgWidth);

			// If there are multiple images
			if ($(rotator).find(".imgBorder > .imgMask > .imgWrap").children().size() > 1) {
				$(rotator).find(".imgBorder").prepend('<a href="#" class="leftControl"/></a><a href="#" class="rightControl"/></a>');
				arrowHeight = $(rotator).find("a").height();
				$(rotator).find(".imgBorder > a").css("top",((imgHeight/2)+(arrowHeight/2))+"px");
				$(rotator).find(".imgBorder > a.rightControl").css("left",imgWidth+"px");
				var imgControls = '<div class="imgRotateControls"><ul><li class="left"></li>';
				var thumbControls = '<div class="thumbControls"><ul>';
				for (var i = 1; i <= numImg; i++) {	
					imgControls += '<li><a href="#' + $(this).attr("id") + '-' + i + '"></a></li>';
				}
				
				$(this + ".imgBorder > .imgMask > .imgWrap > img").each(function(count){
					$(this).attr("id",$(rotator).attr("id") + '-' + (count+1));
					thumbControls += '<li><a href="#' + $(this).attr("id")+'"><img src="'+$(this).attr("src")+'"/></a></li>';
				});
				
				thumbControls += '</ul></div>';

				imgControls += '<li class="right"></li></ul></div>';
				$(this).append(imgControls);
				$(this).append(thumbControls);
				
				var imgBorderWidth = ($(rotator).find(".imgBorder").outerWidth()-(imgWidth));
				var controlsWidth = $(rotator).find(".imgRotateControls").width();
				
				$(rotator).find(".imgRotateControls").css("margin-left",((imgWidth+imgBorderWidth)-(controlsWidth))/2);
				$(rotator).find(".imgRotateControls > ul > li:nth-child(2) > a").addClass("active");
				$(rotator).find(".thumbControls > ul > li:nth-child(1) > a").addClass("active");
			}

			// On click rotate image for specific slider group
			$(".imgRotate > .imgRotateControls > ul > li > a").click(function(){
				var rotatorToSwitch = $(this).closest(".imgRotate").attr("id");
				var imgToGoTo = $(this).attr("href");
				imgToGoTo = imgToGoTo.substring(imgToGoTo.indexOf("-")+1);
				$(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgBorder > .imgMask > .imgWrap").animate({ left: -((imgToGoTo-1)*imgWidth) }, options.speed, function() {});
				$(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgRotateControls > ul > li > a").removeClass("active");
				$(".imgRotate[id=" + rotatorToSwitch + "]").find(".thumbControls > ul > li > a").removeClass("active");
				$(".imgRotate[id=" + rotatorToSwitch + "]").find(".thumbControls > ul > li > a[href=#"+rotatorToSwitch+"-"+imgToGoTo+"]").addClass("active");
				$(this).addClass("active");
				return false;
			});
			
			$(".imgRotate > .thumbControls > ul > li > a").click(function(){
				var rotatorToSwitch = $(this).closest(".imgRotate").attr("id");
				var imgToGoTo = $(this).attr("href");
				imgToGoTo = imgToGoTo.substring(imgToGoTo.indexOf("-")+1);
				$(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgBorder > .imgMask > .imgWrap").animate({ left: -((imgToGoTo-1)*imgWidth) }, options.speed, function() {});
				$(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgRotateControls > ul > li > a").removeClass("active");
				$(".imgRotate[id=" + rotatorToSwitch + "]").find(".thumbControls > ul > li > a").removeClass("active");
				$(".imgRotate[id=" + rotatorToSwitch + "]").find(".imgRotateControls > ul > li > a[href=#"+rotatorToSwitch+"-"+imgToGoTo+"]").addClass("active");
				$(this).addClass("active");
				return false;
			});

			$(".imgRotate > .imgBorder a.leftControl").click(function(){
				if (!($(".imgBorder > .imgMask > .imgWrap").is(':animated'))){
					arrowSlide("left",this);
					return false;
				}
			});

			$(".imgRotate > .imgBorder a.rightControl").click(function(){
				if (!($(".imgBorder > .imgMask > .imgWrap").is(':animated'))){
					arrowSlide("right",this);
					return false;
				}
			});
			
			if (options.autoRotate) {
			  var autoRotate = window.setInterval(function(){
			    if (!($(".imgBorder > .imgMask > .imgWrap").is(':animated'))){
			      arrowSlide("right",rotator);
		      }
			  },options.autoRotateDelay+options.speed);
			}
			
			if (!options.showArrows) {
			  $(this).find("a.leftControl").hide();
			  $(this).find("a.rightControl").hide();
			}
			if (!options.showCircles) {
			  $(this).find(".imgRotateControls").hide();
			}
			if (!options.showArrows && !options.showCircles) {
			  console.log("WARNING: There is no way to rotate the images.");
			}
		});
	};  
})(jQuery);
