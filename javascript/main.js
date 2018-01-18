var colourList = ['#ff8787', '#f783ac', '#da77f2', '#748ffc', '#3bc9db', '#69db7c', '#ffa94d'];
var bits = 0;
var clickRate = 1;
var GenRate = 0;

$(document).ready(function () {

    function updateBits() {
        $("#bits").html(bits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }

    function bitGenerator() {
        $("#bitGenRate").html(GenRate);
        bits += GenRate;
    }

//########################

    $("html").click(function () {
        $(".program").animate({
            bottom: '100px',
            opacity: '1'
        }, 1500);
    })

    $('.header h2').on('click', function () {
        $(this).css('letter-spacing', Math.floor(Math.random() * 20))
    }).on('mouseleave', function () {
        $(this).css('letter-spacing', '3px');
    })

    $('.button').on('click', function () {
        $(this).css('background', colourList[Math.floor(Math.random() * colourList.length)]);
        bits += clickRate;
        $("#bits").html(bits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $(".fa-microchip").css('transform', 'rotate(' + Math.floor(Math.random() * 180) + 'deg)');
    }).on('mouseleave', function () {
        $(this).css('background', '#67bcff');
        $(".fa-microchip").css('transform', 'rotate(0)');
    })

//#########################

    setInterval(updateBits, 250);
    setInterval(bitGenerator, 1000)

})
