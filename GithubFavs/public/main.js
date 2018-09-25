$(function() { 
  
  // Initialize variables
  var $window = $(window);
  var $button = $('button');
  var $searchField = $('input');
  var $searchButton = $("#search");
  var $repoList = $(".repoList");
  var $repoTable = $("#repoTable");
  var $favTable = $("#favTable");
  var $mainPage = $('.main.page');
  var reposjson;
  var enterKey = jQuery.Event("keydown");
  //enterKey.which = 13; //Enter key

  $mainPage.show();
  $searchField.focus();
  
  //Check if input field is empty every second
  setInterval(function(){
	if (!$searchField.val()){
		$repoTable.children().remove();
	}
  }
  ,1000);

  //Remove duplicates from favourites
  setInterval(function(){
    $.each($("#favTable tr"), function(i, item) {
        var currIndex = $("#favTable tr").eq(i);
        var matchText = currIndex.children("td").first().text();
        $(this).nextAll().each(function(i, inItem) {
            if(matchText===$(this).children("td").first().text()) {
                $(this).remove();
            }
        });
    });
  },1000);

  //Search button functions, click anytime to refresh search
  $searchButton.click(function(){ 
	  $(".repotableHead").remove();
	  $("#repoTable .rows").remove();
	  $repoTable.append(" <tr class=repotableHead><th>Name</th><th>Language</th> <th>Score</th><th> </th></tr>");
	  var numEntries = 15;
	  $.when(
	    $.getJSON("https://api.github.com/search/repositories?q=" + $searchField.val() + "&sort=stars&order=desc", function(data) {
		reposjson = data;
	    })  
	  ).then(function() {
	    if (reposjson) {
	          
		  for (i = 0; i < numEntries; i++) {
			$repoTable.append("<tr class='" + "rows" + "'  id='" + i + "'>" +
						 "<td>" + reposjson.items[i].full_name +"</td>"+
		                                 "<td>" + reposjson.items[i].language +"</td>"+
		                                 "<td>"+ reposjson.items[i].score +"</td>"+
		                                 "<td style=color:blue class=addFav id='" + i + "'><u>" + "Add" +"</u></td>"+
		                                 "</tr>");
		  }
			$(".addFav").click(function(){
			    var $parentRowID = $("#"+$(this).parents('tr:first').attr('id'));
			    var tableID = $(this).parents('tr:first').parent().attr('id') + "";
			    if(tableID === "repoTable"){

				$favTable.append($parentRowID.clone(true, true));
			    	$("#favTable "+"#"+$(this).parents('tr:first').attr('id')+ " .addFav").html("<u>Remove</u>");
			    }
			    else{
				$("#favTable "+"#"+$(this).parents('tr:first').attr('id')).remove();
			    }


			});

	    }
	    else {
		console.log("Error JSON file not found");
	    }
	    
	   });
  });
});
