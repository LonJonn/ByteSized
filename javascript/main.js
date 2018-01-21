var colourList = ['#ff8787', '#f783ac', '#da77f2', '#748ffc', '#3bc9db', '#69db7c', '#ffa94d'];

$(document).ready(function () {

    if (localStorage.getItem('Users') === null) {
        localStorage.setItem('Users', 'admin')
        localStorage.setItem('admin', '1234:999999:10000:999')
    }

    //START FUNCTIONS#######################################################

    function save() {
        user = $('#username').val()
        userInfo = localStorage.getItem(user).split(':');
        localStorage.setItem(user, userInfo[0]+':'+bits+':'+clickRate+':'+genRate)
        console.log("saved at: " + new Date().toLocaleString());
    }

    function setValues(user) {
        userInfo = localStorage.getItem(user).split(':');
        bits = parseInt(userInfo[1]);
        clickRate = parseInt(userInfo[2]);
        genRate = parseInt(userInfo[3]);
    }

    function loginSuccessful(name) {
        $('.welcome').html('Welcome, ' + name + '.')
        $('.login').fadeOut(1500, function () {
            $('.welcome').fadeIn(1500, function () {
                $('.welcome').delay(500).fadeOut(1500, function () {
                    setValues(name);
                    setInterval(updateBits, 250);
                    setInterval(bitGenerator, 250);
                    setInterval(save, 60000);
                    $('.program').fadeIn(1500);
                });
            });
        });

    }

    //LOGIN AND REGISTER#####################################################

    function checkPass() {
        var currentUser = $('#username').val();
        var currentUserAcc = localStorage.getItem(currentUser).split(':');
        if (currentUserAcc.includes($('#password').val())) {
            loginSuccessful(currentUser);
        } else {
            alert("Inccorect Password.");
        }
    }

    function register() {
        if ($('#username').val() !== '' && localStorage.getItem('Users').split(':').includes($('#username').val()) === false) {
            if ($('#password').val() !== '') {
                localStorage.setItem('Users', localStorage.getItem('Users') + ":" + $('#username').val());
                localStorage.setItem($('#username').val(), $('#password').val() + ':0:1:0');
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

    /*$(document).click(function () {
        $(".program").animate({
            bottom: '100px',
            opacity: '1'
        }, 1500);
    })*/

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
        if (localStorage.getItem('Users').split(':').includes($('#username').val())) {
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
        updateBits();
        $(".fa-microchip").css('transform', 'rotate(' + Math.floor(Math.random() * 180) + 'deg)');
    }).on('mouseleave', function () {
        $(this).css('background', 'linear-gradient(to bottom right, #56ccf2, #67bcff)');
        $(".fa-microchip").css('transform', 'rotate(0)');
    })


    //#########################


    setInterval(function () {
        if (localStorage.getItem('Users').split(':').includes($('#username').val())) {
            $('.fa-check').css('opacity', '1');
        } else {
            $('.fa-check').css('opacity', '0')
        }
    }, 1000);

})
