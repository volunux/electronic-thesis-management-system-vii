var $formProcess = $('#formSubmit') , $links = $('#link').val() , $title = '' , data = {} , rmethod = $('#rmethod').val() , objectKeys = [] , $body = '';

$.get('/api/upload/signature' , {})

.done((s3Hash) => {

	new FroalaEditor('textarea' , {

		'height' : 500,
		'heightMin' : 400,
		'heightMax' : 1000,
		'charCounterMax' : 6000,
		'imageAllowedTypes' : ['jpeg' , 'jpg' , 'png'],
		'imageDefaultAlign' : 'center',
		'imageDefaultDisplay' : 'block',
		'imageMaxSize' : 1024 * 1024,
		'imageUpload' : true,
		'imageAddNewLine' : true,
		'imageUploadToS3' : s3Hash ,
		'imageUploadMethod' : 'POST',
		'imageUploadRemoteUrls' : false,
		'imageManagerDeleteMethod' : 'POST',
		'imageManagerDleteUrl' : 'http://localhost:3000/delete',
		'saveInterval' : 10000,
		'saveMethod' : 'POST',
		'saveParam' : 'content',
		'saveURL' : null, 
		'fileAllowedTypes' : ['image/jpeg' , 'image/jpg' , 'image/png'],
		'fileMaxSize' : 1024 * 1024,
		'fileUpload' : false,
		'fileUploadMethod' : 'POST',
		'fileUploadParam' : 'Attachment',
		'fileUploadURL' : 'https://i.froala.com/upload?i=1',
		'fileUploadParams' : {'id' : 'my_editor'},
		'fontFamily' : {
  'Arial,Helvetica,sans-serif': 'Arial',
  'Georgia,serif': 'Georgia',
  'Impact,Charcoal,sans-serif': 'Impact',
  'Tahoma,Geneva,sans-serif': 'Tahoma',
  "'Times New Roman',Times,serif": 'Times New Roman',
  'Verdana,Geneva,sans-serif': 'Verdana',
  "'Trebuchet MS'" : 'Trebuchet MS'},
  	'fontFamilySelection' : false,
  	'fontSize' : ['8', '9', '10', '11', '12', '13', '14', '18', '22' , '24', '30', '36', '48', '60', '72', '96'],
  	'attribution' : false,
  	'documentReady' : true,
  	'editorClass' : 'volunux',
  	'enter' : FroalaEditor.ENTER_P,
  	'htmlAllowComments' : false,
		'htmlAllowedStyleProps' : ['style' , 'font-family', 'font-size', 'background', 'color', 'width', 'text-align', 'vertical-align', 'background-color'],
		'htmlExecuteScripts' : false,
		'pastePlain' : true,
		'tabSpaces' : 4,
		'quickInsertEnabled' : false,
		'events' : {  
								'image.removed' : ($img) => { var img = $img[0]['src'];

											$.post('/form' , { 'Key' : img } , (data) => { });
								} ,

								'image.uploaded' : ($img) => { } ,

								'image.uploadedToS3' : (link , key , response) => {

								 objectKeys.push({'key' : key , 'location' : link});

									$.post('/api/upload/save' , {	'Key' : key , 'Location' : link } , (data) => { });
								} ,

								'image.error' : (err) => {

										if (err.code == 5) { var layer = $('.fr-image-progress-bar-layer h3');

											layer.text(err.message); }

										else if (err.code == 6) { var layer = $('.fr-image-progress-bar-layer h3');

											layer.text(err.message); }

										else if (err.code == 3) { var layer = $('.fr-image-progress-bar-layer h3');

											layer.text(err.message); }
								} ,

								'image.inserted' : ($img) => { } ,

								'image.beforeUpload' : ($img , b , c) => { } ,
	}

	})


	})
