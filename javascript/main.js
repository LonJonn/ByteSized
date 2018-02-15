var colourList = ['#ff8787', '#f783ac', '#da77f2', '#748ffc', '#3bc9db', '#69db7c', '#ffa94d'];

if (localStorage.getItem('Users') === null) {
    localStorage.setItem('Users', '[{"username":"admin","password":"1234","bits":99999,"clickRate":100,"genRate":99,"upgrades":{"item0":0}}]');
}

accountsJSON = JSON.parse(localStorage.getItem('Users'));

//START FUNCTIONS#######################################################

function beginJSON() {
    accountUsernames = [];
    for (var i = 0; i < accountsJSON.length; i++) {
        accountUsernames.push(accountsJSON[i].username);
    };
};

function save() {
    accountsJSON[userIndex].bits = bits;
    accountsJSON[userIndex].clickRate = clickRate;
    accountsJSON[userIndex].genRate = genRate;
    for (var i = 0; i < $('.upgrades').children().length; i++) {
        eval('accountsJSON[userIndex].upgrades.item' + i + ' =  $("#item" + ' + i + '+ " > .itemOwned").html()');
    }
    localStorage.setItem('Users', JSON.stringify(accountsJSON));
    console.log("saved for account '" + currentUsername + "' at: " + new Date().toLocaleString() + "\n...");
}

function setValues() {
    bits = accountsJSON[userIndex].bits;
    clickRate = accountsJSON[userIndex].clickRate;
    genRate = accountsJSON[userIndex].genRate;
    for (var i = 0; i < $('.upgrades').children().length; i++) {
        $('.upgrades > #item' + i + ' > .itemOwned').html(eval('accountsJSON[userIndex].upgrades.item' + i));
    }
}

function loginSuccessful() {
    $('.welcome').html('Welcome, ' + currentUsername + '.')
    $('.login').fadeOut(1500, function () {
        $('.welcome').fadeIn(1500, function () {
            $('.welcome').delay(1000).fadeOut(1500, function () {
                setValues();
                setInterval(updateBits, 250);
                setInterval(bitGenerator, 250);
                setInterval(save, 60000);
                for (var i = 0; i < $('.upgrades').children().length; i++) {
                    for (var j = 0; j < parseInt($('#item' + i + ' > .itemOwned').html()); j++) {
                        $('#item' + i).find('#cost').html(Math.floor($('#item' + i).find('#cost').html() * 1.15));
                        if ($('#item' + i).find('#info').html().includes('click')) {
                            $('#item' + i).find('.itemCost').html('Purchased');
                        }
                    }
                }
                $('.program').fadeIn(1500);
            });
        });
    });

}

//LOGIN AND REGISTER#####################################################

function checkPass() {
    currentUsername = $('#username').val();
    for (var i = 0; i < accountsJSON.length; i++) {
        if ($('#username').val() == accountsJSON[i].username) {
            userIndex = i;
        }
    }
    if (accountsJSON[userIndex].password == ($('#password').val())) {
        loginSuccessful();
    } else {
        alert("Inccorect Password.");
    }
}

function register() {
    if ($('#username').val() !== '' && accountUsernames.includes($('#username').val()) === false) {
        if ($('#password').val() !== '') {
            accountsJSON.push(JSON.parse('{"username":"' + $('#username').val() + '","password":"' + $('#password').val() + '","bits":0,"clickRate":1,"genRate":0,"upgrades":{"item0":0,"item1":0,"item2":0}}'))
            beginJSON();
            localStorage.setItem('Users', JSON.stringify(accountsJSON));
            alert('Registration Complete!');
        } else {
            alert('Please enter a password!');
        }
    } else {
        alert('Username already used!');
    }
}

//LOGIN AND REGISTER#####################################################

function updateBits() {
    $("#bits").html(Math.round(bits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

function bitGenerator() {
    $("#bitGenRate").html(genRate);
    bits += genRate / 4;
}

//END FUNCTIONS######################################################


$(document).ready(function () {

    beginJSON();

    $('.header h2').on('click', function () {
        $(this).css('letter-spacing', Math.floor(Math.random() * 20))
    }).on('mouseleave', function () {
        $(this).css('letter-spacing', '3px');
    })

    $('#showhide').on('click', function () {
        if ($('#password').attr('type') === 'text') {
            $('#password').attr('type', 'password')
        } else {
            $('#password').attr('type', 'text')
        }
    })

    $('#submit').on('click', function () {
        if (accountUsernames.includes($('#username').val())) {
            checkPass();
        } else {
            alert("Username doesn't exist!");
        }
    })

    $('#register').on('click', function () {
        register();
    })

    $('.login').keypress(function (e) {
        if (e.which == 13) {
            $("#submit").click();
        }
    });

    $('.button').on('click', function () {
        $(this).css('background', colourList[Math.floor(Math.random() * colourList.length)]);
        bits += clickRate;
        $(".fa-microchip").css('transform', 'rotate(' + Math.floor(Math.random() * 180) + 'deg)');
    }).on('mouseleave', function () {
        $(this).css('background', 'linear-gradient(to bottom right, #56ccf2, #67bcff)');
        $(".fa-microchip").css('transform', 'rotate(0)');
    })

    $('.delete').on('click', function () {
        if (window.confirm("Are you sure you want to delete this account?\nYou won't be able to undo this.") && currentUsername !== 'admin') {
            if (window.confirm("No, seriously, you're about to lose everything.\nMaybe you missclicked.\nAre you certain you wan't to do this?")) {
                accountsJSON.splice(userIndex, 1);
                localStorage.setItem('Users', JSON.stringify(accountsJSON));
                location.reload();
            }
        } else {
            window.alert('Account not deleted.')
        }
    })

    $('.info').on('click', function () {
        alert('Made in HTML5, CSS3 and Javascript with <3!\n-Leon')
    });

    $('.per-second').mouseenter(function () {
        $(this).html('<span id="bitClickRate">...</span> /click')
        $("#bitClickRate").html(clickRate);
    })

    $('.per-second').mouseleave(function () {
        $(this).html('<span id="bitGenRate">...</span> /second')
        $("#bitGenRate").html(genRate);
    })

    $('.item').mouseenter(function () {
        $(this).find(".itemName").html($(this).find("#info").html())
    })

    $('.item').mouseleave(function () {
        $(this).find(".itemName").html($(this).find("#nameBak").html())
    })

    $('.item').on('click', function () {
        var owned = $(this).find(".itemOwned").html();
        var cost = $(this).find("#cost").html();
        if (cost <= bits) {
            bits -= cost;
            updateBits();
            owned++;
            $(this).find(".itemOwned").html(owned);
            $(this).find("#cost").html(Math.floor($(this).find("#cost").html() * 1.15));
            if ($(this).find("#info").html().includes('click')) {
                $(this).find(".itemCost").html('Purchased');
            }

            var info = $(this).find("#info").html().split('/');
            if (info[1] == 'sec') {
                genRate += parseInt(info[0].substr(1));
            } else if (info[1] == 'click') {
                clickRate = parseInt(info[0]);
            } else {
                $('.program').css({
                    'animation': 'shake 0.7s',
                    'animation-iteration-count': 'infinite'
                }).delay(1000).slideDown(1000).fadeOut(1000, function () {
                    $('.end').delay(700).fadeIn(2000);
                    bits = 'ERROR';
                    clickRate = 'ERROR';
                    genRate = 'ERROR';
                    save();
                });
            }
        } else {
            $(this).toggleClass('red');
            $this = $(this)
            setTimeout(function () {
                $this.toggleClass('red');
            }, 300)
            $('#bits').css({
                'animation': 'shake 0.5s',
                'color': '#ff8787'
            });
            setTimeout(
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
        if (accountUsernames.includes($('#username').val())) {
            $('.fa-check').css('opacity', '1');
        } else {
            $('.fa-check').css('opacity', '0')
        }
    }, 1000);

    setInterval(function () {
        for (var i = 0; i < $('.upgrades').children().length; i++) {
            if (parseInt($('.upgrades > #item' + i + ' > .itemCost > #cost').html()) <= bits) {
                $('.upgrades > #item' + i).css({
                    'opacity': '1',
                    backgroundColor: ''
                });
                $('.upgrades > #item' + i + ' > .itemCost').css('color', '#51cf66');
            } else {
                $('.upgrades > #item' + i).css({
                    'opacity': '0.7',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                });
                $('.upgrades > #item' + i + ' > .itemCost').css('color', '#ed6e6e');
            }
        }
    }, 250)

})
