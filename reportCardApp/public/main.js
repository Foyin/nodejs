$(function() { 
  // Initialize variables
  var $window = $(window);
  var $button = $('button');
  var $nameSearch = $('#nameSearch');
  var $tagSearch = $('#tagSearch');
  var $list = $("#list");
  var $mainPage = $('.main.page');
  var jsonFile;
  var enterKey = jQuery.Event("keydown");
  //enterKey.which = 13; //Enter key
  
  function avg(arr){
    return arr.reduce((a,b) => a + b, 0) / arr.length
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

  $.fn.extend({
    toggleText: function(a, b){
        return this.text(this.text() == b ? a : b);
    }
   });

  $nameSearch.on('input',function(){
        var matcher = new RegExp($(this).val(), 'gi');
        $('.listItem').show().not(function(){
            return matcher.test($(this).find('.name').text())
        }).hide();
  })

  $mainPage.show();

  $.when(
    $.getJSON("/studentInfo.json", function(data) {
	jsonFile = data;
    })  
  ).then(function() {
    if (jsonFile) {
	  for (var i = 0; i < jsonFile.students.length; i++) {
		$list.append("<div class=listItem id='" + i + "'>" +
                                  "<img src=images/image"+ getRandomIntInclusive(1, 7) +".png height=100% width=10%>" +
                                  "<b class=name style=font-size:250%>" + jsonFile.students[i].firstName + " " + jsonFile.students[i].lastName+"</b>" +
                                  "<ul class=expandIcon display=inline-block style=float:right style=position:absolute style=font-size:200%>+</ul>" +
                                  "<ul align=justify>"+ "Email: " + jsonFile.students[i].email+"</ul>" +
                                  "<ul align=justify>" + "Company: " + jsonFile.students[i].company +"</ul>" +
                                  "<ul align=justify>" + "Skill: "+ jsonFile.students[i].skill +"</ul>" +
                                  "<ul align=justify>" + "Average: " + avg(jsonFile.students[i].grades.map(Number)) +"</ul></div>"+
                                  "<div class=expand > <u>" + jsonFile.students[i].firstName + " " + jsonFile.students[i].lastName +"'s Test scores-</u>" +
                                  "<p>" + "Test1: "+ jsonFile.students[i].grades[0] +"%</p>" +
                                  "<p>" + "Test2: "+ jsonFile.students[i].grades[1] +"%</p>" +
                                  "<p>" + "Test3: "+ jsonFile.students[i].grades[2] +"%</p>" +
                                  "<p>" + "Test4: "+ jsonFile.students[i].grades[3] +"%</p>" +
                                  "<p>" + "Test5: "+ jsonFile.students[i].grades[4] +"%</p>" +
                                  "<p>" + "Test6: "+ jsonFile.students[i].grades[5] +"%</p>" +
                                  "<p>" + "Test7: "+ jsonFile.students[i].grades[6] +"%</p>" +
                                  "<p>" + "Test8: "+ jsonFile.students[i].grades[7] +"%</p>" +
                                  "<div id=listEnd"+ i +"> </div>" +
                                  "<input class=inputTag type=text placeholder='Add a tag' /></div>");
                
	  }
          $(".expand").toggle();
          
          $(".listItem").click(function(){
               $(this).next().toggle("slow");
               $(this).find(".expandIcon").toggleText('+', '-');
          });
          
          $('.inputTag').keypress(function (e) {
               if(e.which ==13){
                  $(this).prev().append("<a class=tag font-size; > "+ $(this).val() +" </a>");   
                  $(this).val("");
               }
          });

    }
    else {
	console.log("Error JSON file not found");
    }
    
   });
});


