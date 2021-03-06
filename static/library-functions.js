"use strict";

/**************
    For doing a search of Users and rendering a list with buttons
**************/
function displayUserResults(results) {
    // Function for showing list of users

    var userList = $("#result-user-list");

    // remove any existing results
    userList.empty();

    //to check data against what rendered
    console.log(results);
    console.log(results.length);

        if (typeof(results) == 'string') {

            console.log("no such user");
            $("#visit-msg").empty().html("No such user is registered.");            

        } else if (results.length == 0) {

            console.log('clear');

        } else {

            for(var i = 0; i < results.length; i++) {
        
                    var btn = $("<button>", {
                                class: 'btn btn-primary res-btn',
                                name: 'user-id',
                                value: results[i]['user_id'],
                                on: {
                                    click: function() {
                                        console.log(this.value);
                                        $.post("/new-visit.json", {'user-id':this.value}, checkInConfirm);
                                            }
                                    }
                                });
        
                    btn.html('Check In');
        
                    $('#visit-msg').empty();
                    document.getElementById("user-search").reset();
                    userList.append("<li class='list-group-item admin-list'>" + results[i]['fname'] + 
                                    " " + results[i]['lname'] + " (" + results[i]['email'] + ")<br>")
                                    .append(btn);
                }
        }
}

function showUserResults(evt) {
    // Function to send form info to server as GET
    evt.preventDefault();
        //prevent from working automatically
    var formInput = $("#user-search").serialize();

    var searchPath = "/find-users.json?";

    var url = searchPath + formInput;
    // check that url path looks right
    console.log(url);

    $.get(url, displayUserResults);
}

/**************
    Button functions
**************/

function checkInConfirm(results) {
    // Confirmation message from server after clicking Check In button
    var userList = $("#result-user-list");
    console.log(results);
    userList.empty();
    userList.html("<p>" + results + "</p>");
}


$("#user-search").on('submit', showUserResults);
//library_view.html

/**************
    For doing a search of Books
**************/

function displayBookResults(results) {
    // Function for showing list of users

    var bookList = $("#result-book-list");

    bookList.removeClass('alert-info').empty();
    bookList.removeClass('alert');

    console.log(results);

    if (results.length == 0) {
        document.getElementById("book-search").reset();
        bookList.append("<p>No books found.</p>");
    } else {
        for(var i = 0; i < results.length; i++) {

            var btn = $("<button>", {
                            class: 'btn btn-primary res-btn',
                            name: 'book-id',
                            value: results[i]['book_id'],
                            on: {
                                click: function() {
                                    console.log(this.value);
                                    var url = "/add-book.json";
                                    var buttonVal = {
                                        'book-id': this.value,
                                        'visit-id': parseInt($('#visit-id').html()),
                                        }
                                    $.post(url, buttonVal, function(res) {
                                            document.getElementById("book-search").reset();
                                            $('#result-book-list').empty();
                                            $('#result-book-list').addClass('alert').addClass('alert-info').html("<strong>" + res + "</strong>");
                                            console.log(res)
                                        });

                                    }
                                }
                    }

                );

            btn.html("Add Book");

            bookList.append("<li class='list-group-item admin-list'><b>" + results[i]['title'] + 
                            "</b><br>" + results[i]['author'] +
                            "<br>" + results[i]['call_num'] +
                            "<br>").append(btn);
        }
    }
}

function showBookResults(evt) {
    // Function to send form info to server as GET
    evt.preventDefault();
        //prevent from working automatically
    var formInput = $("#book-search").serialize();

    var searchPath = "/find-books.json?";

    var url = searchPath + formInput;
    // check that url path looks right
    console.log(url);

    $.get(url, displayBookResults);
}

$("#book-search").on('submit', showBookResults);

/*************
    Display all the visits in the database
*************/

function displayCurrentVisitors(results) {
    //List of current checked-in visitors

    var visitorList = $("#current-visitors");

    // clear out the past visitor list
    $("#msg-bad").empty().removeClass('alert-warning');
    $("#msg-bad").removeClass('alert');
    visitorList.empty();
    // check data

    for (var i = 0; i < results.length; i++) {
        //check that results will render right
        console.log(results[i]['fname'] + " " + results[i]['lname']
                    + " " + results[i]['visit_timein']);

        var btn1 = $("<button>", {
                    id: 'btn1-' + results[i]['visit_id'],
                    class: 'btn btn-primary res-btn',
                    name: 'visit-id',
                    value: results[i]['visit_id'],
                    on: {
                        click: function() {
                            //check to see if right value sent
                            console.log(this.value);
                            var url = "/checkout.json";
                            var buttonVal = {
                                'visit-id': this.value
                            }
                            //show what is getting sent to server
                            console.log(buttonVal);
                            $.post(url, buttonVal, function(res){
                                //show what got back from server
                                console.log(res);
                                if (res == 'None') {
                                    $("#msg-bad").addClass('alert').addClass('alert-warning').html("User has outstanding books and cannot be checked out.");

                                } else {

                                    console.log(res);
                                    console.log(res['visit_id']);
                                    $("#li-"+ res['visit_id']).empty().html("User has been checked out.");
                                    $("#btn1-" + res['visit_id']).remove();
                                    $("#btn2-" + res['visit_id']).remove();
                                    $("#btn3-" + res['visit_id']).remove();
                                    }

                            });
                        }
                    }
            });

        var btn2 = $("<button>", {
                    id: 'btn2-' + results[i]['visit_id'],
                    class: 'btn btn-primary res-btn',
                    name: 'add-book',
                    value: results[i]['visit_id'],
                    on: {
                        click: function() {
                            var url = "/book-search?visit-id="+ this.value;
                            $.get(window.location.href = url);
                        }
                    }
            });

        var btn3 = $("<button>", {
                    id: 'btn3-' + results[i]['visit_id'],
                    class: 'btn btn-primary res-btn',
                    name: 'return-book',
                    value: results[i]['visit_id'],
                    on: {
                        click: function() {
                            var url = "/return-book?visit-id="+ this.value;
                            $.get(window.location.href = url);
                        }
                    }
        });


        btn1.html('Check Out');
        btn2.html('Add Book');
        btn3.html('Return Books');

        visitorList.append("<li id=\"li-" + results[i]['visit_id'] + 
                        "\" class='list-group-item admin-list'>"
                        + results[i]['fname'] + " " + results[i]['lname'] 
                        + 
                        " in at " + formatDate(results[i]['visit_timein']))
                        .append(btn1).append(btn2).append(btn3).append("</li>");
    }
}

function getCurrentVisitors(evt) {
    //send query to server for all current checkin in visitors
    evt.preventDefault();

    $.get("/display-visitors", displayCurrentVisitors);

}

$("#display-visits").on('click', getCurrentVisitors);
//library_view.html

function goHome(evt) {
    evt.preventDefault();

    window.location.replace("/");
}

$("#home").on('click', goHome);
/*************
    For display patron request for appointments
*************/

function displayApptRequests(results) {
    console.log(results);

    $('#appt-requests').empty();

    if (typeof(results) == 'string') {
        $("#msg-bad").empty().append('<p class="list-group-item admin-list">' + results + '</p>');
    } else {

        for (var i = 0; i < results.length; i++) {
            $('#appt-requests').append('<li class="list-group-item admin-list">' 
                + results[i]['fname'] + ' ' + results[i]['lname']
                + '<br>Waiting for approval' + '<br><a href="' + results[i]['appt_link']
                + '" class="external-url" target="_blank">View on Google Calendar</a></li>');
        }
        
    }
}

function getApptRequests(evt) {
     evt.preventDefault();

    $.get("/display-appts", displayApptRequests);
}

$("#display-appts").on("click", getApptRequests);

/*************
    For logging in
*************/

function loginResults(results) {
    //check to see which view to render

    if (results == 'None') {
        $("#msg").empty().append("<p>No such user. Please register.</p>");
    } else {
        location.replace('/user');
    }
}

function loginUser(evt) {
    //Login in user and set up a session in server
    evt.preventDefault();

    var formInput = $("#log-in").serialize();

    $.post("/log-in.json", formInput, loginResults);

}

$("#log-in").on("submit", loginUser);


/*************
    Add new users
*************/

function addUserResults(results) {

    var regMsg = $("#register-msg");
    
    if (typeof(results) == 'string') {
        regMsg.html("<p>" + results + "</p>");
    } else {
        var btn = $("<button>", {
                            class: 'btn btn-primary res-btn',
                            name: 'user-id',
                            value: results['user_id'],
                            on: {
                            click: function() {
                                //check to see if right value sent
                                console.log(this.value);
                                var url = "/new-visit.json";
                                var buttonVal = {
                                    'user-id': this.value
                                    }
                                //show what is getting sent to server
                                console.log(buttonVal);
                                $.post(url, buttonVal, function(res){
                                    //show what got back from server
                                    console.log(res);
                                    regMsg.empty().html("<p>User visit has been added</p>");                                       
                                });
                                                }
                            }
        });

        btn.html("Check In");

        console.log(results);
        document.getElementById("add-user").reset();
        regMsg.empty().append("<p>" + results['fname'] + " " 
                        + results['lname'] + " has been added."
                        + "</p>").append(btn);
    }

}

function registerUser(evt) {
    //Register a new user - Library
    evt.preventDefault();

    var formInput = $("#add-user").serialize();

    $.post("/add-user.json", formInput, addUserResults);
}

$("#add-user").on("submit", registerUser)
//library_view.html


/*************
    Choose an event
**************/

function confirmSent(results) {

    $("#appt-selection-list").remove();
    var apptMsg = $("#appt-block");
    apptMsg.append(results);

}

function chooseEvent(evt) {
    // send to server
    evt.preventDefault();
    evt.stopImmediatePropagation();

    var formInput = $('input[name=appt]:checked').val();
    
    var url = "/appointment.json?appt=" + formInput;

    $.get(url, confirmSent);
}

$("#appt-selection-list").on("submit", chooseEvent)

// $(".event-choice").on('click', chooseEvent)
/*************
    Display all outstanding books for a visit and allow for return
*************/

function displayOutstandingBooks(results) {
    // show all outstanding books for a users with buttons to return
    var bookList = $("#outstanding-books");
    bookList.empty();

    console.log(results);

    for (var i = 0; i < results.length; i++) {

        var btn = $("<button>", {
                    id: results[i]["book_id"],
                    class: 'btn btn-primary res-btn',
                    name: "book-id",
                    value: results[i]["book_id"],
                    on: {
                        click: function() {
                            var url = "/book-return.json";
                            var buttonVal = {
                                'book-id': this.value
                            }
                            var buttonId = this.value;
                            $.post(url, buttonVal, function(res) {
                                $("#" + buttonId).remove();
                                $("#li-" + buttonId).empty().html(res);
                            });
                        }
                    }
        });

        btn.html('Return Book');

        bookList.append("<li id=\"li-" + results[i]['book_id'] + "\" class='list-group-item admin-list'><b>"
                        + results[i]['title'] + "</b><br>" 
                        + results[i]['author'] + "<br>" 
                        + results[i]['call_num']).append(btn);

    }

}

function getOutstandingBooks() {
    //send query to server for all current checkin in visitors

    var formInput = $("#visit-id").html();
    var url = "/show-books.json?visit-id=" + formInput;
    $.get(url, displayOutstandingBooks);

}
//return_books.html & book_search.html

/*************
    Some helper functions to get it out of the way
**************/

function formatDate(date) {
    var newDate = new Date(date);
    var date = newDate.toDateString();
    var hour = newDate.getHours();
    var minutes = newDate.getMinutes();

    var time = function (hr, min) { 
        if (min < 10) {
            min = '0' + min;
        }
        if (hour > 12) {
            hour = hour - 12;
            min += 'PM';
        } else {
            min += 'AM';
        }
        return hour + ':' + min;
    };

    // return date + ' ' + time(hour, minutes);
    return date;
}