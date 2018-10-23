$(function() { 
  // Initialize variables
  var $window = $(window);
  var $button = $('button');
  var $searchField = $('input');
  var $searchButton = $("#searchBtn");
  var $repoTable = $("#repoTable");
  var $mainPage = $('.main.page');
  var $searchTab = $('.searchTab');
  var reposjson;

  $mainPage.show();
  $searchTab.show();
  $searchField.focus();

  /*Check if input field is empty every second
  setInterval(function(){
	if (!$searchField.val()){
		$repoTable.children().remove();

	}
  }
  ,1000);
  */

  function main(){
  	$(".listItem").fadeOut('slow');
  	$(".dropDownMenu").fadeOut('slow');
  	$("#backgroundMessage").fadeOut('slow');
		        
	$.when(
		$.getJSON("https://api.github.com/search/repositories?q="+$searchField.val()+"&sort=stars&order=desc", function(data) {
			reposjson = data;
		})  
	).then(function() {
		if (reposjson) {
			if(reposjson.items.length === 0){alert("No such repository exists");}
			for (i = 0; i < reposjson.items.length; i++) {
				$repoTable.append("<button class=listItem>" + reposjson.items[i].name +"</button>"+
				                  "<div class=dropDownMenu id='" + i + "' ><p>" + "Description: " + reposjson.items[i].description +"</p>" +
				                  "<p>" + "Language: "+ reposjson.items[i].language +"</p>" +
				                  "<p>" + "Size: " + reposjson.items[i].size +"KB</p>" +
				                  "<p>" + "Number of forks: " + reposjson.items[i].forks +"</p>" +
				                  "<p>" + "Watchers: " + reposjson.items[i].watchers +"</p>" +
				                  "<p>" + "Repository Score: " + reposjson.items[i].score +"</p>" +
				                  "<p>" + "Date created: " + reposjson.items[i].created_at.substring(0,10) +"</p>" +
				                  "<p><a href=https://github.com/" + reposjson.items[i].full_name +" target=_blank>Visit Repository</a></p></div>").hide().fadeIn();
				
			  }
			$(".listItem").click(function(){
				$(this).next().toggle("slow");
			});
			  
		}
		else {
			console.log("Error JSON file not found");
		}
	    
	   });
  }

  $searchButton.click(main);
  $searchField.keypress(function (key) {
	if (key.which == 13) {
		main();  
  	}
  });
});
