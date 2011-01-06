;(function($){
		$.fn.WsharEItemsBrowse = function(settings){
			var _defaultSettings = {
				loadfile : 'none',
				action : 0,
				borrowButton : false, /* Include borrowitems.js, if it's "true" */
				tooltipOffset : [-85,-274],
				tooltipPosition:'top center',
				autoScrollPages: 3,
				dynamicAction: false,
				loadingImage: 'none',
				autoLoadFile: 'none',
				displayType: 0,
				changeType: '',
				selectedTagImage: '',
				itemTagFile:'',
				activeTagSelect: false,
				setCredit: false,
				clickable:true,
				loadCreditFile:'',
				vertical:true,
			};
			var _settings =$.extend(_defaultSettings, settings);
			var AVOID_UNEXPECTED_LOAD = 0;
			var LOAD_LAST_PAGE = 0;
			var mother = this;
			var $container = $("<div class='items'></div>").appendTo(mother);
			var $tooltip = $("<div class='demotip'>&nbsp;</div>").insertBefore(mother);
			var ITEM_TAG_BLAMK_IMAGE_URL = '/yiidemo/capturer/images/blank.png';	
			var COUNT_FRIEND_ITEMS = 0;
			var STOP_FRIEND_ITEMS = 0;
			var _handler = function(){	
			    var $autoscroll = $("<div class='auto_scroll_bottom'></div>").insertAfter(mother);
				var $loadingSign = $("<div id='last_msg_loader'></div>").insertAfter(mother);
				$.post(_settings.loadfile,{action: _settings.action},
					function(data){	
						showItems(data); 					
						var scrollApi = startScrolling($autoscroll);
						selectedWhileHover();
						if(_settings.borrowButton)
							submitToBorrow();
						if(_settings.dynamicAction)
							changeActionWhileClick();
						if(_settings.activeTagSelect)
							startTagSelect(scrollApi);
						changeDisplayTypes();							
						if(_settings.changeType!=null && _settings.changeType!="")
							changeTypeByClick();						
					},'json');				
			};
			var tagtext;
			function startTagSelect(api){
				clocktrun = setInterval(setClick,1000);					
				function setClick(){
					if($.cookie('load_tag_finish')){
						$.cookie('load_tag_finish', false,{expires:1});
						clearInterval(clocktrun);	
						$('.menu').find('.tagsArea a').unbind('click');
						$('.menu').find('.tagsArea a').click(function(){
							tagtext = $(this).text();
							_settings.action = 5;							
							$.post(_settings.loadfile,{action: _settings.action, tag:tagtext},
								function(data){
									$container.empty();
									showItems(data);
									selectedWhileHover();
									LOAD_LAST_PAGE = 0;
									api.begin();
									//_settings.action = 1;
								},'json');	
						});
					}
				}				
			}
			function changeTypeByClick(){
				$(_settings.changeType).click(function(){
					if(_settings.displayType ==0)
						changeDisplayTypes(1);
					else
						changeDisplayTypes(0);
				});
			}
			function changeDisplayTypes(type){
				if(type!=null)
					_settings.displayType = type;
				switch(_settings.displayType){
					case 0:
						$('.items').children('div').css({width:'27.5%'});	
						$('.items p').hide();
						break;
					case 1:
						$('.items').children('div').css({width:'75%'});
						$('.items p').show();
						break;
					case 2:
						$('.items').children('div').css({width:'123%'});
						$('.items p').hide();//$('.items p').attr('visibility','hidden');
						break;
					case 3:
						$('.items').children('div').css({width:'150px'});
						$('.items p').hide();//$('.items p').attr('visibility','hidden');
						break;
					default:
						$('.items').children('div').css({width:'27.5%'});
				}
			}
			function changeActionWhileClick(){
				$container.empty();
			}
			function submitToBorrow(){
				$('.submitTOB').unbind('click');
				$('.submitTOB').bind('click', function(){
					var $bottom = $(this);
					$bottom.toggleClass('selected');
					$parent = $bottom.parents('.WSinsideitem');
					if($bottom.hasClass('selected')){
						//$bottom.attr('disabled',true);
						(function(WE){
							WE.create($parent);
						})($.WsharE.borrow);
					}else{
						(function(WE){
							WE.destroy($parent);
						})($.WsharE.borrow);
					}				
					return false;
				});
			}
			function selectedWhileHover(){
				var $itemDiv = $container.children('div');
				$itemDiv.unbind('mouseenter mouseleave');
				$itemDiv.hover(	
					function(){	
						$(this).css({border:'2px solid #69c'});
					},
					function(){
						$(this).css({border:'2px solid rgba(0,0,0,0)'});
					}
				);	
			}
			function startScrolling($scroll){
				var api = $(mother).scrollable({vertical:_settings.vertical,size:1,clickable:_settings.clickable}).mousewheel({api:true, speed:100});
				if(!_settings.vertical){
					$('.items').css({width:'20000em',height:'2em'});
					$('.scrollable ').css({height:'150px'});
				}
				api.begin();
				/* Auto scroll the item browsing view while mouse overing the buttom place */
				$scroll.bind('mouseover',function(){		
					api.move(_settings.autoScrollPages);
				});	
				api.onSeek(function(){
					if(LOAD_LAST_PAGE != this.getPageAmount() && LOAD_LAST_PAGE-this.getPageIndex() <=9 && AVOID_UNEXPECTED_LOAD ==0){
						LOAD_LAST_PAGE = this.getPageAmount();
						AVOID_UNEXPECTED_LOAD++;							
						last_msg_funtion();						
					}
				}); 
				return api;
			}
			function last_msg_funtion(){ 				
				$('div#last_msg_loader').html("<img src='"+_settings.loadingImage+"'/>");
				var params = getAutoloadParams();
				$.post( _settings.autoLoadFile, params,
					function(data){
						showItems(data);
						selectedWhileHover();
						$('div#last_msg_loader').empty();				
						AVOID_UNEXPECTED_LOAD = 0;						
					},'json');			
			}
			function getAutoloadParams(){
				switch(_settings.action){
					case 1: 
						return { action : _settings.action, offset:LOAD_LAST_PAGE};
						break;
					case 5:
						return { action : _settings.action, offset:LOAD_LAST_PAGE, tag:tagtext};
						break;
					case 6:
						var offset1 = LOAD_LAST_PAGE - COUNT_FRIEND_ITEMS;	
						//alert("offset1: "+offset1+", LOAD_LAST_PAGE: "+LOAD_LAST_PAGE+", COUNT_FRIEND_ITEMS: "+COUNT_FRIEND_ITEMS);
						return { action : _settings.action, offset : offset1, offset2 : COUNT_FRIEND_ITEMS, stop: STOP_FRIEND_ITEMS};
						break;
					default:
						var ID=$("div.WSinsideitem:last").attr("id");
						var itemId = RegExp('[0-9]+').exec(ID);
						return { action : _settings.action, last_msg_id: itemId, offset:LOAD_LAST_PAGE};
				}
			}
			function showItems(data){
				if(_settings.action == 6){
					obj = data[0];
					if(data[2]==0)
						STOP_FRIEND_ITEMS = 1;
					COUNT_FRIEND_ITEMS += data[2];
				}
				else
					obj = data;
				if(obj[0] != ""){
					for( var j in obj){
						var cons = "";
						if(obj[j].cons){
							for( var q in obj[j].cons)
									cons += obj[j].cons[q] +"<br>";
						}
						$item = $("<div id='msg_"+obj[j].id+"' class='WSinsideitem'><img src='"+obj[j].url+"' /><br>"+// title='"+obj[j].title+"' /><br>"+
								//"<h3>"+obj[j].title+"</h3>"+				  
								  "<div class='WSitemtext'><p style='display:none' >"+cons+"</p></div>"+
								  "</div>").appendTo($container);
						$tooltip_content = $("<div class='tooltip'><h2>hellow world:</h2>"+obj[j].title+"<img src='http://static.flowplayer.org/img/title/eye.png' alt='Flying screens'"+
												"style='float:left;margin:0 15px 20px 0' /></div>").insertAfter($tooltip);
						//$tooltip.append($tooltip_content);
						$item.children('img').tooltip({
							tip: $tooltip_content, //'.demotip', //$tooltip_content , //$tooltip,
							//effect: 'slide',
							position: _settings.tooltipPosition,
							offset: _settings.tooltipOffset
						});							
						if(_settings.setCredit){
							var credit=(obj[j].credit != null)?obj[j].credit:'Set for Credit...';							
							$credit = $("<div style='display:inline' class='WSitemcredit' >"+credit+"</div>").appendTo($item);
							$("<h3 style='display:inline'> Credit: </h3>").insertBefore($credit);
							var ID= $item.attr("id");
							var itemId = RegExp('[0-9]+').exec(ID);
							$credit.editable(_settings.loadCreditFile, { 
								//indicator : "<img src='img/indicator.gif'>",
								type      : 'WScredit',
								submitdata: { "itemId": itemId},
								submit    : 'OK',
								style     : "display: inline",
								tooltip   : "Set for Credit...",
								placeholder: "Set for Credit...",
							}); 																
						}
						if(_settings.borrowButton){	
							var statu = parseInt(obj[j].statu);
							if( statu != (-1)){								
								$item.find('img').after("<button class='submitTOB rounded'><span>Borrow</span></button><br/>");					
								if(statu >= 1)
									$item.find('button').attr('disabled',true).addClass('selected');
							}
						}
						changeDisplayTypes();
						if(_settings.action == 7){							
							(function(WE){
								WE.showBorrowProcess($item,obj[j].statu,obj[j].available);
							})($.WsharE.borrow);
						}
						if(_settings.action == 8){							
							(function(WE){								
								WE.showLendProcess($item,obj[j].statu,obj[j].borrower,obj[j].available);
							})($.WsharE.borrow);
						}
						if(_settings.action == 6){						
							(function(WE){
								WE.showTag(obj[j], data[1], $item);
								WE.clickmenu($showtag);
								WE.editable($showtag);
							})($.WsharE.itemtag);	
							//startSetItemsTag($showtag);
							//startSetItemTagEdit($showtag);
						}							
					}	
					if(_settings.borrowButton)
							submitToBorrow();
				}
			}
			/*function startSetItemsTag($taglist){
				$taglist.clickMenu({
					mainDelay :'slow',
					onClick:function(){	
						setItemTag($(this), $(this).text());										
					},
				}); 
			}
			function startSetItemTagEdit($taglist){
				$taglist.find('ul li:last').editable(_settings.itemTagFile, {
					id : 'Myid',
					indicator : 'Saving...',
					tooltip   : '+Add New',	
					placeholder: '+Add New',		
					callback  : function(value,settings){
						if(value != ""){
							var $editli = $(this);
							$editli.text('');
							$addnew = $("<li>"+value+"</li>");
							$('.clickMenus').find('ul li:last').before($addnew);
							//$addnew.insertBefore($(this));
							setItemTag($editli.prev('li'), value);
						}
						return;
					}
				});	
			}
			function setItemTag($target, content){
				var $parent = $target.parents('.WSinsideitem');
				var ID= $parent.attr("id");
				var itemId = RegExp('[0-9]+').exec(ID);
				var $selectedIcon = $target.find('img');
				if($selectedIcon.is('img')){	
					$.post(_settings.itemTagFile ,{ "tag": content, "itemId":itemId, "action":2 },
						function(data){	
							//alert(data);
						}, "html");
					$selectedIcon.remove();
					var whichtag = 0;
					for(var m=0; m<$parent.find('span').size(); m++){					
						if( $parent.find('span:eq('+m+')').text() == content+', ')
								whichtag = m;
					}					
					$parent.find('span:eq('+whichtag+')').remove();
				}else if(content!=""){							
					$target.prepend("<img src='"+_settings.selectedTagImage+"' style='height:15px;width:15px'/>");
					$.post(_settings.itemTagFile,
						{ "tag": content, "itemId":itemId, "action":1 },
						function(data){	
							//alert(data);
						}, "html");	
						var $lastSpan = $parent.find('span:last');
						if($lastSpan.is('span'))
							$lastSpan.after("<span>"+content+", </span>");
						else
							$parent.find('p').before("<span>"+content+", </span>");
				}else 
					return;					
			}*/
			return this.each(_handler);
		};
	})(jQuery);