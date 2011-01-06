;(function($){
	$.fn.WsharEItemsBorrow = function(settings){
		var _defaultSettings = {
				loadFile : 'none',
				changeStatuFile: 'none',
				messageFile: 'none',
		};
		var _settings =$.extend(_defaultSettings, settings);
		var TRADE_STATU = 0;
		var TRADE_CONFIRM = false;
		var IS_OWNER = false;
		$.namespace( 'jQuery.WsharE.borrow' );
		
		$.WsharE.borrow.create = function($item){
			var ID = $item.attr('id');
			var itemId = RegExp('[0-9]+').exec(ID);
			$.post(_settings.loadFile ,{ "itemId":itemId, "action":1},
				function(data){	
				alert(data);
				}, "html");
		};
		
		$.WsharE.borrow.destroy = function($item, isRemove, borrowerId){
			var ID = $item.attr('id');
			var itemId = RegExp('[0-9]+').exec(ID);
			var params = borrowerId == null?{ "itemId":itemId, "action":0 }:{ "itemId":itemId, "action":0 ,"borrowerId":borrowerId};
			$.post(_settings.loadFile ,params,
				function(data){	
				alert(data);	
				if(isRemove)
					$item.remove();
				}, "html");
		};
		$.WsharE.borrow.showBorrowProcess = function($item,statu,available){
			var ID = $item.attr('id');
			var itemId = RegExp('[0-9]+').exec(ID);
			TRADE_STATU = parseInt(statu);				
			switch(statu){
				case '1':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s4 current'>Selected Wanted</a></li>"+ 				
						"</ul>").appendTo($item); 
					startTabsable($processBar,itemId);					
						break;
				case '2':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Wait for the agreement...</a></li>"+ 
						"</ul>").appendTo($item); 
					if(available == '0')
						$processBar.find('a').text('This stuff has been borrowed');
					//startTabsable($processBar,itemId);					
						break;	
				case '3':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p2 s3 current'>Grant for promise</a></li>"+ 
						"</ul>").appendTo($item); 
					startTabsable($processBar,itemId);					
						break;	
				case '4':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p2 s2'>Grant for promise</a></li>"+ 
						"<li><a href='#' class='p3 s3 current'>Derive the Item</a></li>"+ 
						"</ul>").appendTo($item);
					 startTabsable($processBar,itemId);					
					break;
				case '5':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p2 s2'>Grant for promise</a></li>"+ 
						"<li><a href='#' class='p3 s3 current'>Derive the Item</a></li>"+ 
						"</ul>").appendTo($item);
					TRADE_STATU = 4;
					TRADE_CONFIRM = true;
					 startTabsable($processBar,itemId);					
					break;
				case '6':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p2 s2'>Grant for promise</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Wait for confirm!</a></li>"+ 
						"</ul>").appendTo($item);			
					break;
				case '7':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p2 s2'>Contact & Wait</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Success to Borrow</a></li>"+ 
						"<li><a href='#' class='p4 s3 current'>Give back</a></li>"+ 
						"</ul>").appendTo($item);
					startTabsable($processBar,itemId);	
					break;
				case '8':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p2 s2'>Grant for promise</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Derive the Item</a></li>"+
						"<li><a href='#' class='p4 s3 current'>Give back</a></li>"+ 
						"</ul>").appendTo($item);
					TRADE_STATU = 7;
					TRADE_CONFIRM = true;
					 startTabsable($processBar,itemId);					
					break;
				case '9':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p2 s2'>Grant for promise</a></li>"+
						"<li><a href='#' class='p3 s2'>Derive the Item</a></li>"+
						"<li><a href='#' class='p4 s2'>Wait for confirm!</a></li>"+ 
						"</ul>").appendTo($item);
					break;
				case '10':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p2 s2'>Contact & Wait</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Derive the Item</a></li>"+ 
						//"<li><a href='#' class='p4 s2'>Give back</a></li>"+ 
						"<li><a href='#' class='p4 s2'>Finish a Trade</a></li>"+ 
						"</ul>").appendTo($item);				
					break;
				default:
					$item.append("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+ 
						"<li><a href='#' class='p2 s2'>Contact & Wait</a></li>"+ 
						"<li><a href='#' class='p3 s3'>Derive the Item</a></li>"+ 
						"</ul>"); 
					break;
			}
			var $deleteButton = $("<ul class='tradedelete' ><a href='#'>Delete</a></ul>").appendTo($item);
			$deleteButton.click(function(){
				$.WsharE.borrow.destroy($item, true);
			});
		}			
		$.WsharE.borrow.showLendProcess	 = function($item,statu,borrower,available){
			var ID = $item.attr('id');
			var itemId = RegExp('[0-9]+').exec(ID);
			TRADE_STATU = parseFloat(statu);
			IS_OWNER = true;
			$("<h2 style='display:inline'>"+borrower.name+" <h4 style='display:inline'>request to borrow: </h4></h2>").prependTo($item);
			switch(statu){
				/*case '1':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s4 current'>Selected Wanted</a></li>"+ 				
						"</ul>").appendTo($item); 
					startTabsable($processBar,itemId);					
						break;*/
				case '2':
					$processBar = $("<ul class='itemprocess'>"+ 
						//"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+
						"<li><a href='#' class='p1 s4 current'>Give a chance</a></li>"+ 
						"</ul>").appendTo($item); 
					if(available == '0')
						$processBar.find('a').text('This stuff has been lent').removeClass('s4 current').addClass('s1');
					else
						startTabsable($processBar,itemId);						
						break;
				case '3':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Thanks for your kindness!</a></li>"+						
						"</ul>").appendTo($item); 
					//startTabsable($processBar,itemId);					
						break;
				case '4':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Give a chance</a></li>"+
						"<li><a href='#' class='p2 s3 current'>You need to give</a></li>"+ 
						//"<li><a href='#' class='p3 s3 current'>Derive the Item</a></li>"+ 
						"</ul>").appendTo($item);
					TRADE_STATU = 5;
					 startTabsable($processBar,itemId);					
					break;
				case '5':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Give a chance</a></li>"+
						"<li><a href='#' class='p2 s2'>You need to give</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Wait for confirm</a></li>"+ 
						"</ul>").appendTo($item);									
					break;
				case '6':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Give a chance</a></li>"+
						"<li><a href='#' class='p2 s2'>You need to give</a></li>"+ 
						"<li><a href='#' class='p3 s3 current'>Trade out the stuff</a></li>"+
						"</ul>").appendTo($item);
					TRADE_STATU = 5;
					TRADE_CONFIRM = true;
					 startTabsable($processBar,itemId);					
					break;
				case '7':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Give a chance</a></li>"+
						"<li><a href='#' class='p2 s2'>You need to give</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Success to Lend</a></li>"+ 
						"<li><a href='#' class='p4 s3 current'>Return to you</a></li>"+
						"</ul>").appendTo($item);
					TRADE_STATU = 8;
					 startTabsable($processBar,itemId);	
					break;
				case '8':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Give a chance</a></li>"+
						"<li><a href='#' class='p2 s2'>You need to give</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Success to Lend</a></li>"+ 
						"<li><a href='#' class='p4 s2'>Wait for confirm</a></li>"+ 
						"</ul>").appendTo($item);									
					break;
				case '9':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Give a chance</a></li>"+
						"<li><a href='#' class='p2 s2'>You need to give</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Trade out the stuff</a></li>"+
						"<li><a href='#' class='p4 s3 current'>Return to you</a></li>"+ 
						"</ul>").appendTo($item);
					TRADE_STATU = 8;
					TRADE_CONFIRM = true;
					 startTabsable($processBar,itemId);					
					break;
				case '10':
					$processBar = $("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Give a chance</a></li>"+
						"<li><a href='#' class='p2 s2'>You need to give</a></li>"+ 
						"<li><a href='#' class='p3 s2'>Trade out the stuff</a></li>"+ 
						//"<li><a href='#' class='p4 s2'>Return to you</a></li>"+
						"<li><a href='#' class='p4 s2'>Finish a Trade</a></li>"+
						"</ul>").appendTo($item);
					break;
				default:
					$item.append("<ul class='itemprocess'>"+ 
						"<li><a href='#' class='p1 s1'>Selected Wanted</a></li>"+ 
						"<li><a href='#' class='p2 s2'>Contact & Wait</a></li>"+ 
						"<li><a href='#' class='p3 s3'>Derive the Item</a></li>"+ 
						"</ul>"); 
					break;
			}
			var $deleteButton = $("<ul class='tradedelete' ><a href='#' ref='"+borrower.id+"' >Delete</a></ul>").appendTo($item);
			$deleteButton.click(function(){				
				$.WsharE.borrow.destroy($item, true, $deleteButton.children('a').attr('ref'));
			});
		}	

//Pagination
		$.namespace( 'jQuery.WsharE.pagination' );
		
		$.WsharE.pagination.create = function($item){
           var optInit = { 
                items_per_page:3,    
                num_display_entries:10,  
                current_page:0,    
                num_edge_entries:0,    
                link_to:"#",    
                prev_text:"Prev",
                next_text:"Next",
                ellipse_text:"...",
                prev_show_always:true,    
                next_show_always:true,    
                renderer:"defaultRenderer",
                fragmentClass:"pagination",
                //call back function
                getUrlCallback:false,
                goToPageCallback:false,
                callback: function(page_index, jq, items_per_page){ pageselectCallback(page_index, jq, items_per_page);}   //default callback function
            };  
            $("#Pagination").pagination(members.length, optInit);

		};
//End of Pagination

		function startTabsable($processBar,itemId){			
			var size = $processBar.find('a').size();
			var BUTTON_CANCEL = 0;
			$('.cancel').hover(
				function(){BUTTON_CANCEL = 1;},
				function(){BUTTON_CANCEL = 0;}
			);
			var ACCEPTED = false;
			switch(TRADE_STATU){
				case 1:					
					$processBar.overlay({
						left: 'left',
						top:'10%',
						closeOnClick:false,
						target:'.pane1',
						onBeforeLoad:function(){
							if(ACCEPTED)
								return false;
						},
						onBeforeClose:function(event){
							if(!ACCEPTED){
								var $terms = $("#terms");
								var $termsparent = $terms.parent();
								//alert($('.close',$(this).getOverlay()).hasClass('cancel'));
								//alert(this.getClosers().hasClass('cancel'));
								if(BUTTON_CANCEL == 1){
									BUTTON_CANCEL =0;
									if (!$terms.get(0).checked)					
										$termsparent.addClass("error");
									else 
										$termsparent.removeClass("error");
									return true;
								}
								if (!$terms.get(0).checked){ 					
									$termsparent.addClass("error");
									return false; // when false is returned, the user cannot advance to the next tab
								}
								$termsparent.removeClass("error");
								changeBorrowStatu(itemId,1);
								changeStatuOnView($processBar,1);
								ACCEPTED = true;
							}
						},
						expose: { 						 
								// you might also consider a "transparent" color for the mask 
								color: '#101570', 						 
								// load mask a little faster 
								loadSpeed: 200, 						 
								// highly transparent 
								opacity: 0.5 
						}, 						
					});
					break;
				case 2:	
					$processBar.overlay({
						left: 'left',
						top:'10%',
						closeOnClick:false,
						target:'.pane2',
						onBeforeLoad:function(){
							if(ACCEPTED)
								return false;
						},
						onBeforeClose:function(){
							if(!ACCEPTED){
								if(BUTTON_CANCEL == 1){
									BUTTON_CANCEL =0;								
									return true;
								}	
								changeBorrowStatu(itemId,2);
								changeStatuOnView($processBar,2);
								ACCEPTED = true;
							}
						},
						expose: { color: '#101570', loadSpeed: 200, opacity: 0.5 }, 		
					});
					break;
				case 3:
					$processBar.overlay({
						left: 'left',
						top:'10%',
						closeOnClick:false,
						target:'.pane3',
						onBeforeLoad:function(){
							if(ACCEPTED)
								return false;
						},
						onBeforeClose:function(){	
							if(!ACCEPTED){
								if(BUTTON_CANCEL == 1){
									BUTTON_CANCEL =0;								
									return true;
								}	
								changeBorrowStatu(itemId,3);
								changeStatuOnView($processBar,3);
								ACCEPTED = true;
							}
						},
						expose: { color: '#101570', loadSpeed: 200, opacity: 0.5 }, 		
					});
					break;
				case 4:
					$processBar.overlay({
						left: 'left',
						top:'10%',
						closeOnClick:false,
						target:'.pane4',
						onBeforeLoad:function(){
							if(ACCEPTED)
								return false;
						},
						onBeforeClose:function(){
							if(!ACCEPTED){
								if(BUTTON_CANCEL == 1){
									BUTTON_CANCEL =0;								
									return true;
								}	
								changeBorrowStatu(itemId,4);
								if(TRADE_CONFIRM == true)
									changeStatuOnView($processBar,5);
								else
									changeStatuOnView($processBar,4);
								ACCEPTED = true;
							}
						},
						expose: { color: '#101570', loadSpeed: 200, opacity: 0.5 }, 		
					});
					break;
				case 5:
					$processBar.overlay({
						left: 'left',
						top:'10%',
						closeOnClick:false,
						target:'.pane5',
						onBeforeLoad:function(){
							if(ACCEPTED)
								return false;
						},
						onBeforeClose:function(){
							if(!ACCEPTED){
								if(BUTTON_CANCEL == 1){
									BUTTON_CANCEL =0;								
									return true;
								}	
								changeBorrowStatu(itemId,4);
								if(TRADE_CONFIRM == true)
									changeStatuOnView($processBar,5);
								else
									changeStatuOnView($processBar,4);								
								ACCEPTED = true;
							}
						},
						expose: { color: '#101570', loadSpeed: 200, opacity: 0.5 }, 		
					});
					break;
				case 7:
					$processBar.overlay({
						left: 'left',
						top:'10%',
						closeOnClick:false,
						target:'.pane7',
						onBeforeLoad:function(){
							if(ACCEPTED)
								return false;
						},
						onBeforeClose:function(){
							if(!ACCEPTED){
								if(BUTTON_CANCEL == 1){
									BUTTON_CANCEL =0;								
									return true;
								}	
								changeBorrowStatu(itemId,7);
								if(TRADE_CONFIRM == true)
									changeStatuOnView($processBar,8);
								else
									changeStatuOnView($processBar,7);							
								ACCEPTED = true;
							}
						},
						expose: { color: '#101570', loadSpeed: 200, opacity: 0.5 }, 		
					});
					break;
				case 8:
					$processBar.overlay({
						left: 'left',
						top:'10%',
						closeOnClick:false,
						target:'.pane8',
						onBeforeLoad:function(){
							if(ACCEPTED)
								return false;
						},
						onBeforeClose:function(){
							if(!ACCEPTED){
								if(BUTTON_CANCEL == 1){
									BUTTON_CANCEL =0;								
									return true;
								}	
								changeBorrowStatu(itemId,7);
								if(TRADE_CONFIRM == true)
									changeStatuOnView($processBar,8);
								else
									changeStatuOnView($processBar,7);								
								ACCEPTED = true;
							}
						},
						expose: { color: '#101570', loadSpeed: 200, opacity: 0.5 }, 		
					});
					break;
				default:
					break;
			}			
		}
		function changeStatuOnView($processBar, originalStatu){
			alert(originalStatu);
			switch(originalStatu){				
				case 1:
					$processBar.find('a').text('Wait for the agreement...').removeClass('s4 current').addClass('s1');
					break;
				case 2:
					$processBar.find('a').text('Thanks for kindness!').removeClass('s4 current').addClass('s1');
					break;
				case 3:
					$processBar.find('a:last').text('You can get the stuff').removeClass('s3 current').addClass('s2');
					break;
				case 4:
					$processBar.find('a:last').text('Wait for confirm!').removeClass('s3 current').addClass('s2');
					break;
				case 5:
					$processBar.find('a:last').text('Success to trade!').removeClass('s3 current').addClass('s2');
					break;
				case 7:
					$processBar.find('a:last').text('Wait for confirm!').removeClass('s3 current').addClass('s2');
					break;
				case 8:
					$processBar.find('a:last').text('Finish the Trade!').removeClass('s3 current').addClass('s2');
					break;
				default:					
					alert('ooh');
					break;
			}
		}
		function changeBorrowStatu(itemId, statu){
			$.post(_settings.changeStatuFile ,{ "itemId":itemId, "plus":true , "owner":IS_OWNER, "statu":statu },
				function(data){	
				alert(data);
				}, "html");
			if(statu ==1){
				$.post(_settings.messageFile ,{ "itemId":itemId, "statu": statu },
					function(data){	
					alert(data);
					}, "html");
			}
		}
		return;
	};
})(jQuery);
