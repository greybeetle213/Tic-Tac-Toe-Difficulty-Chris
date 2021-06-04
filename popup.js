function closePopup(popUpFunction){
    $("#popup").css("visibility", "hidden") //close the popup
    if(typeof(popUpFunction) == "function"){ //if a function has been given
        popUpFunction() //run it
    }
}
popup = {
    alert:function(title, content, prompt="close", onclose="") {
        $("#popupTitle").html(title)
        $("#popupText").html(content)
        $("#popupButtons").html("<button id='popupButton' onclick='closePopup("+onclose+")'>"+prompt+"</button>") //make a button
        $("#popup").css("visibility", "visible") //show the popup
    },
    confirm:function(title,content,accept,deny,on_accept="",on_deny=""){
        $("#popupTitle").html(title)
        $("#popupText").html(content)
        $("#popupButtons").html("<button id='popupButton' onclick='closePopup("+on_accept+")'>"+accept+"</button> <button id='popupButton2' onclick='closePopup("+on_deny+")'>"+deny+"</button>")
        $("#popup").css("visibility", "visible") //show the popup
    },
    input:function(title,content,on_enter=""){
        $("#popupTitle").html(title)
        $("#popupText").html(content)
        $("#popupButtons").html("<input type='text' id='popupInput'>") //make a text input
        $("#popupButtons").css("left", "20%")//make it centered
        test = function(){console.log("why")}
        $("#popupInput").on("keypress",function(e,on_done=on_enter){ //when a key is pressed in the text box
            if(e.key == "Enter"){ // if the key is enter
                $("#popup").css("visibility", "hidden") //close the popup
                $("#popupButtons").css("left", "40%")
                if(on_done != ""){ // if there is a function to run
                    on_done(document.getElementById("popupInput").value) //run it with the value of the text box as a paramater
                }
            }
        })
        $("#popup").css("visibility", "visible") //show the popup
    }
}
