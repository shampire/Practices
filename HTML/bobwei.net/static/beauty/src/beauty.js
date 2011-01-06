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
			var NOfBeauties = 10 * 2;
			var NOfPages = 2;
			for(j=0;j<NOfPages;j++){
				var imgTagsStr = '';
				
				for(i=0+j*NOfBeauties;i<NOfBeauties+j*NOfBeauties;i+=2){
					beauties[i] = result[i].split(' ')[0];
					beautiesWretchURL[i] = result[i].split(' ')[3];
					var tmp =  "<a style='text-decoration: none; border: none;' href='" + beautiesWretchURL[i] + "'>" + "<img width='70%' class='beauty' src='http://testforbabyupload.appspot.com/Image?index=" + beauties[i] + "'/></a>";
					imgTagsStr = imgTagsStr.concat(tmp);					
				}
				
				$('#msg').html('beauties:' + NOfBeauties/2*NOfPages);
				$('#beautyBox').html(''.concat('<section style="width: 97%;">', imgTagsStr, '</section>'));
			}
			
	    }
	  });
	
}

