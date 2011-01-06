var beauties;
var beautiesWretchURL;
function getBeautyList(){
	$.ajax({
	    url: 'getBeautyList',
	    error: function(xhr) {
	      $('#msg').html('getBeautyList error');
	     // $(e.target).attr('disabled', false);
	    },
	    success: function(response) {
			//$('#msg').html(response);
			var result = response.split('\n');
			beauties = new Array(result.length);
			beautiesWretchURL = new Array(result.length);
			var NOfBeauties = 30 * 2;
			var NOfPages = 3;
			for(j=0;j<NOfPages;j++){
				var imgTagsStr = '';
				
				for(i=0+j*NOfBeauties;i<NOfBeauties+j*NOfBeauties;i+=2){
					beauties[i] = result[i].split(' ')[0];
					beautiesWretchURL[i] = result[i].split(' ')[3];
                    if(j == 2){
                        if(i%12 == 0)
    					    {var tmp =  "<a rel='example_group' style='text-decoration: none; border: none;' href='" + "ibeauty99src/1.jpg" + "'>" + "<img class='beauty' src='http://testforbabyupload.appspot.com/Image?index=t1044808815.jpg'/></a>";}
                        else if(i%12 == 2)
    					    {var tmp =  "<a rel='example_group' style='text-decoration: none; border: none;' href='" + "ibeauty99src/2.jpg" + "'>" + "<img class='beauty' src='http://testforbabyupload.appspot.com/Image?index=t1304972781.jpg'/></a>";}
                        else if(i%12 == 4)
    					    {var tmp =  "<a rel='example_group' style='text-decoration: none; border: none;' href='" + "ibeauty99src/3.jpg" + "'>" + "<img class='beauty' src='http://testforbabyupload.appspot.com/Image?index=t1502890984.jpg'/></a>";}
                        else if(i%12 == 6)
    					    {var tmp =  "<a rel='example_group' style='text-decoration: none; border: none;' href='" + "ibeauty99src/4.jpg" + "'>" + "<img class='beauty' src='http://testforbabyupload.appspot.com/Image?index=t1584272483.jpg'/></a>";}
                        else if(i%12 == 8)
    					    {var tmp =  "<a rel='example_group' style='text-decoration: none; border: none;' href='" + "ibeauty99src/5.jpg" + "'>" + "<img class='beauty' src='http://testforbabyupload.appspot.com/Image?index=t1565995834.jpg'/></a>";}
                        else 
    					    {var tmp =  "<a rel='example_group' style='text-decoration: none; border: none;' href='" + "ibeauty99src/6.jpg" + "'>" + "<img class='beauty' src='http://testforbabyupload.appspot.com/Image?index=t1462129059.jpg'/></a>";}
                    } else {
					    var tmp =  "<a style='text-decoration: none; border: none;' href='" + beautiesWretchURL[i] + "'>" + "<img class='beauty' src='http://testforbabyupload.appspot.com/Image?index=" + beauties[i] + "'/></a>";
                    }
					imgTagsStr = imgTagsStr.concat(tmp);					
				}
				
				$('#msg').html('beauties:' + NOfBeauties/2*NOfPages);
				$('#test' + parseInt(j,10)).html(''.concat('<section style="width: 97%;">', imgTagsStr, '</section>'));
			}
            fancy();
	    }
	  });
	
}

