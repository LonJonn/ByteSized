var colourList = ['#ff8787', '#f783ac', '#da77f2', '#748ffc', '#3bc9db', '#69db7c', '#ffa94d'];
var bits = parseInt(localStorage.getItem('Bits Stored'));
var clickRate = parseInt(localStorage.getItem('Click Rate'));
var genRate = parseInt(localStorage.getItem('Generator Rate'));

$(document).ready(function () {

    if (localStorage.getItem('Users') === null) {
        localStorage.setItem('Users', 'admin')
        localStorage.setItem('admin', '1234:999999:10000:999')
    }

 //START FUNCTIONS#######################################################

    function save() {
        localStorage.setItem('Bits Stored', bits);
        localStorage.setItem('Click Rate', clickRate);
        localStorage.setItem('Generator Rate', genRate);
        console.log("saved at: " + new Date().toLocaleString());
    }

//LOGIN AND REGISTER#####################################################

    function checkPass() {
        var currentUser = $('#username').val();
        var currentUserAcc = localStorage.getItem(currentUser).split(':');
        if (currentUserAcc.includes($('#password').val())) {
            alert('Welcome.');
        } else {
            alert("Inccorect Password.");
        }
    }

    function register() {
        var temp = $('#username').val()
        if ($('#username').val() !== '' && localStorage.getItem('Users').split(':').includes(temp) === false) {
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

    $('.login').keypress(function(e){
    if (e.which == 13){
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

    setInterval(save, 120000);
    setInterval(function () {
        if (localStorage.getItem('Users').split(':').includes($('#username').val())) {
            $('.fa-check').css('opacity', '1');
        } else {
            $('.fa-check').css('opacity', '0')
        }
    }, 1000)
    //setInterval(updateBits, 250);
    //setInterval(bitGenerator, 250)

})
