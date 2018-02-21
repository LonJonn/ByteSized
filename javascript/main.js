var colourList = ['#ff8787', '#f783ac', '#da77f2', '#748ffc', '#3bc9db', '#69db7c', '#ffa94d'];

if (localStorage.getItem('Users') === null) { //if no account exists, create one
    localStorage.setItem('Users', '[{"username":"admin","password":"1234","bits":99999,"clickRate":100,"genRate":99,"upgrades":{"item0":0},"saved":0}]');
}

accountsJSON = JSON.parse(localStorage.getItem('Users')); //get accounts from local storage and parse them into an object

//START FUNCTIONS#######################################################

function beginJSON() { //create list of accounts
    accountUsernames = [];
    for (var i = 0; i < accountsJSON.length; i++) {
        accountUsernames.push(accountsJSON[i].username);
    };
};

function save() { //update and saved details for active account to local storage
    timesSaved++;
    accountsJSON[userIndex].saved = timesSaved;
    accountsJSON[userIndex].bits = bits;
    accountsJSON[userIndex].clickRate = clickRate;
    accountsJSON[userIndex].genRate = genRate;
    for (var i = 0; i < $('.upgrades').children().length; i++) {    //for each upgrade, update the amount owned
        eval('accountsJSON[userIndex].upgrades.item' + i + ' =  $("#item" + ' + i + '+ " > .itemOwned").html()');
    }
    localStorage.setItem('Users', JSON.stringify(accountsJSON));    //change object to string and store to local storage
    console.log("saved for account '" + currentUsername + "' at: " + new Date().toLocaleString() + "\n...");    //log time and date
}

function setValues() {  //define user values from account info
    bits = accountsJSON[userIndex].bits;
    clickRate = accountsJSON[userIndex].clickRate;
    genRate = accountsJSON[userIndex].genRate;
    timesSaved = accountsJSON[userIndex].saved;
    for (var i = 0; i < $('.upgrades').children().length; i++) {    //for each upgrade, update the amount owned
        $('.upgrades > #item' + i + ' > .itemOwned').html(eval('accountsJSON[userIndex].upgrades.item' + i));
    }
}

function loginSuccessful() {    //validate login
    $('.welcome').html('Welcome, ' + currentUsername + '.') //display welcome message
    $('.login').fadeOut(1500, function () { //transition to main game window
        $('.welcome').fadeIn(1500, function () {
            $('.welcome').delay(1000).fadeOut(1500, function () {
                setValues();    //set values for user
                setInterval(updateBits, 250);   //update bits every quater second
                setInterval(bitGenerator, 250); //generate bits every quater second
                setInterval(save, 60000);   //save every minute
                for (var i = 0; i < $('.upgrades').children().length; i++) {    //for each item in shop
                    for (var j = 0; j < parseInt($('#item' + i + ' > .itemOwned').html()); j++) {   //and the amount of said item owned
                        $('#item' + i).find('#cost').html(Math.floor($('#item' + i).find('#cost').html() * 1.15));  //multiply current cost by 15%
                        if ($('#item' + i).find('#info').html().includes('click')) {    //if the upgrade is a click type upgrade and has been purchased before
                            $('#item' + i).find('.itemCost').html('Purchased'); //set to "purchased"
                        }
                    }
                }
                $('.program').fadeIn(1500);
            });
        });
    });

}

//LOGIN AND REGISTER#####################################################

function checkPass() {  //check user password
    currentUsername = $('#username').val(); //set current username to logged in user
    for (var i = 0; i < accountsJSON.length; i++) { //find the index the current user is located at in the account database
        if ($('#username').val() == accountsJSON[i].username) {
            userIndex = i;  //set user index
        }
    }
    if (accountsJSON[userIndex].password == ($('#password').val())) {   //if password is correct, login
        loginSuccessful();
    } else {
        modal("Inccorect Password.", "Please try again.");  //else, give a warning message
    }
}

function register() {   //registration
    if ($('#username').val() !== '' && accountUsernames.includes($('#username').val()) === false) { //if username not empty and doesnt exist already
        if ($('#password').val() !== '') {  //and if password isnt blank
            accountsJSON.push(JSON.parse('{"username":"' + $('#username').val() + '","password":"' + $('#password').val() + '","bits":0,"clickRate":1,"genRate":0,"upgrades":{"item0":0,"item1":0,"item2":0},"saved":0}'))  //create account based on user input
            beginJSON();    //update JSON
            localStorage.setItem('Users', JSON.stringify(accountsJSON));    //update database
            modal('Registration Complete!', "You can now sign in!");    //provide feedback message
        } else {
            modal('Please enter a password!', '');  //else, give warning
        }
    } else if ($('#username').val() !== '') {   //if username used
        modal('Username already used.', "Try another username.");
    } else {    //if username empty
        modal('Please enter a username & password to register an account.', '');
    }
}

//LOGIN AND REGISTER#####################################################

function updateBits() { //update bit counter
    $("#bits").html(Math.round(bits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

function bitGenerator() {   //generate bits every second
    $("#bitGenRate").html(genRate);
    bits += genRate / 4;
}

function modal(text1, text2) {  //function for warning
    $('.modalBody>p:nth-child(1)').html(text1);
    $('.modalBody>p:nth-child(2)').html(text2);
    $('.modal').fadeIn(200);

}
//END FUNCTIONS######################################################


$(document).ready(function () {

    beginJSON();    //update JSON

    $('.modalClose, .modalButton').on('click', function() { //close warning
        $('.modal').fadeOut(200);
    })

    $('.header h2').on('click', function () {   //easter egg for header
        $(this).css('letter-spacing', Math.floor(Math.random() * 20));
    }).on('mouseleave', function () {   //one mouse leave, reset
        $(this).css('letter-spacing', '3px');
    })

    $('#showhide').on('click', function () {    //show/hide password
        if ($('#password').attr('type') === 'text') {
            $('#password').attr('type', 'password')
        } else {
            $('#password').attr('type', 'text')
        }
    })

    $('#submit').on('click', function () {  //activate login function on button press
        if (accountUsernames.includes($('#username').val())) {  //if user exists
            checkPass();    //check password
        } else {    //else, warn user
            modal("Username doesn't exist!", "Please register an account first.");
        }
    })

    $('#register').on('click', function () {    //register on button press
        register();
    })

    $('.login').keypress(function (e) { //bind enter key to login button
        if (e.which == 13) {
            $("#submit").click();
        }
    });

    $('.button').on('click', function () {  //on main button click
        $(this).css('background', colourList[Math.floor(Math.random() * colourList.length)]);   //chose random background colour
        bits += clickRate;  //increase bits by bit rate
        $(".fa-microchip").css('transform', 'rotate(' + Math.floor(Math.random() * 180) + 'deg)');  //rotate random degree
    }).on('mouseleave', function () {   //on mouse leave, reset to default
        $(this).css('background', 'linear-gradient(to bottom right, #56ccf2, #67bcff)');
        $(".fa-microchip").css('transform', 'rotate(0)');
    })

    $('.delete').on('click', function () {  //on delete button press
        if (window.confirm("Are you sure you want to delete this account?\nYou won't be able to undo this.") && currentUsername !== 'admin') {  //warn user and check if account is admin, if cancel or account is admin, dont delete
            if (window.confirm("No, seriously, you're about to lose everything.\nMaybe you missclicked.\nAre you certain you wan't to do this?")) { //reconfirm
                accountsJSON.splice(userIndex, 1);  //remove account from database
                localStorage.setItem('Users', JSON.stringify(accountsJSON));    //stringify database and save to local storage
                location.reload();  //reload webpage
            }
        } else {    //else, warn user
            modal('Account not deleted.', '')
        }
    })

    $('.info').on('click', function () {    //on info button click
        modal('Made in HTML5, CSS3 and Javascript with <i class="fas fa-heart"></i>!', '-Leon') //give info about page
    });

    $('.per-second').mouseenter(function () {   //when hovering over bits per second, show click rate
        $(this).html('<span id="bitClickRate">...</span> /click')
        $("#bitClickRate").html(clickRate);
    })

    $('.per-second').mouseleave(function () {   //when not hovering, change back
        $(this).html('<span id="bitGenRate">...</span> /second')
        $("#bitGenRate").html(genRate);
    })

    $('.item').mouseenter(function () { //when hovering over upgrade, give info about upgrade
        $(this).find(".itemName").html($(this).find("#info").html())
    })

    $('.item').mouseleave(function () { //when not hovering over upgrade, change info text back to name
        $(this).find(".itemName").html($(this).find("#nameBak").html())
    })

    $('.item').on('click', function () {    //on upgrade click
        var owned = $(this).find(".itemOwned").html();  //get amount of item owned
        var cost = $(this).find("#cost").html();    //get cost
        if (cost <= bits) { //check if user can afford item
            bits -= cost;   //subtract cost
            updateBits();   //update bits owned
            owned++;    //increased upgraded owned amount by 1
            $(this).find(".itemOwned").html(owned); //update amount owned
            $(this).find("#cost").html(Math.floor($(this).find("#cost").html() * 1.15));    //incrase cost by 15%
            if ($(this).find("#info").html().includes('click')) {   //check what type of upgrade
                $(this).find(".itemCost").html('Purchased');    //chagne to purchased if click upgrade
            }

            var info = $(this).find("#info").html().split('/'); //get values from upgrade info
            if (info[1] == 'sec') {
                genRate += parseInt(info[0].substr(1)); //increment gen rate by upgrade amount
            } else if (info[1] == 'click') {
                clickRate = parseInt(info[0]);  //else, do it for click rate
            } else {    //if user buys ending, show end screen
                $('.program').css({
                    'animation': 'shake 0.7s',
                    'animation-iteration-count': 'infinite'
                }).delay(1000).slideDown(1000).fadeOut(1000, function () {
                    $('#time').html(timesSaved);
                    $('.end').delay(700).fadeIn(2000);
                    bits = 'ERROR'; //set values to error
                    clickRate = 'ERROR';
                    genRate = 'ERROR';
                    save(); //save
                });
            }
        } else { //if cant afford, display feedback
            $(this).toggleClass('red');
            $this = $(this)
            setTimeout(function () {
                $this.toggleClass('red');
            }, 300)
            $('#bits').css({
                'animation': 'shake 0.5s',
                'color': '#ff8787'
            });
            setTimeout( //change colour back to normal after half a second
                function () {
                    $('#bits').css({
                        'animation': '',
                        'color': '#51cf66'
                    });
                }, 500)
        }
    })

    //#########################

    setInterval(function () { //Check if user exists
        if (accountUsernames.includes($('#username').val())) {  //if yes, show tick
            $('.fa-check').css('opacity', '1');
        } else {
            $('.fa-check').css('opacity', '0')  //else hide tick
        }
    }, 1000);   //repeat every second

    setInterval(function () {   //check if user can afford upgrade
        for (var i = 0; i < $('.upgrades').children().length; i++) {
            if (parseInt($('.upgrades > #item' + i + ' > .itemCost > #cost').html()) <= bits) {
                $('.upgrades > #item' + i).css({
                    'opacity': '1',
                    backgroundColor: ''
                });
                $('.upgrades > #item' + i + ' > .itemCost').css('color', '#51cf66');
            } else {    //else, gray out the upgrade
                $('.upgrades > #item' + i).css({
                    'opacity': '0.7',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                });
                $('.upgrades > #item' + i + ' > .itemCost').css('color', '#ed6e6e');
            }
        }
    }, 250) //repeat every quater second

})
