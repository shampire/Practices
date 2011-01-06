<?php echo Html::scriptFile(Html::jsUrl('cookie.js')); ?>
<?php echo Html::cssFile(Html::cssUrl('scrollable-vertical.css')); ?>
<?php echo Html::scriptFile(Html::jsUrl('jQueryTool/jquery.tools.min-1.1.2.js')); ?>
<?php echo Html::scriptFile(Html::jsUrl('jQueryTool/scrollable-1.1.2.js')); ?>
<?php echo Html::scriptFile(Html::jsUrl('jQueryTool/crollable.mousewheel-1.0.1.js')); ?>
<?php echo Html::scriptFile(Html::jsUrl('jQueryTool/tooltip-1.1.3.js')); ?>


<?php echo Html::cssFile(Html::cssUrl('uicomponent/browseitem.css')); ?>
<?php echo Html::scriptFile(Html::jsUrl('uicomponent/browseitem.js')); ?>

<?php echo Html::cssFile(Html::cssUrl('greenButton/greenbutton.css')); ?>
<?php echo Html::cssFile(Html::cssUrl('greenButton/greenbutton_selected.css')); ?>

<?php echo Html::scriptFile(Html::jsUrl('uicomponent/borrowitems.js')); ?>
<?php echo Html::scriptFile(Html::jsUrl('uicomponent/namespace.js')); ?>

<script>	
	$(document).ready(function(){		
		$('div.scrollable').WsharEItemsBrowse({
			loadfile: '<?php echo CController::createUrl('item/manageitems'); ?>',
			action: 1,
			loadingImage: '<?php echo Html::imageUrl('bigLoader.gif'); ?>',
			autoLoadFile: '<?php echo CController::createUrl('item/autoloaditems'); ?>',
			displayType: 3,
			changeType: '#Iliketochange',
			borrowButton :true,
			activeTagSelect:true,
			vertical:false,
		}).WsharEItemsBorrow({
			loadFile: '<?php echo CController::createUrl('trade/createBorrow'); ?>',
		});
	});		
</script>
<!-- the items for browing while scrolling --> 
<div class="scrollable vertical"></div>
<input type='button' id='Iliketochange' value='Change Type'/> 