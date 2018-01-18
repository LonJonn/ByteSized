var colourList = ['#ff8787', '#f783ac', '#da77f2', '#748ffc', '#3bc9db', '#69db7c', '#ffa94d'];

$(document).ready(function () {

    $("html").click(function () {
        $(".program").animate({
            bottom: '100px',
            opacity: '1'
        }, 1500);
        //$(".program").fadeIn(1500);
    })

    $('.header h2').on('click', function () {
        $(this).css('letter-spacing', Math.floor(Math.random() * 20))
    }).on('mouseleave', function () {
        $(this).css('letter-spacing', '3px');
    })

    $('.button').on('click', function () {
        $(this).css('background', colourList[Math.floor(Math.random() * colourList.length)])
    }).on('mouseleave', function () {
        $(this).css('background', '#67bcff');
    })

})
