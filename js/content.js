if(window.location.href.includes('cs439')){
    // $('body').prepend('<button id="hide">Hello</button>');

    $('table').find('tr').each(function(){
        $(this).find('td').css('font-size','15px');
        $(this).find('td').each(function(){
            var color = $(this).css('background-color')
            console.log(color);
            if(color == 'rgb(255, 0, 0)'){
                $(this).addClass('fail');
            } else if(color == 'rgb(0, 128, 0)'){
                $(this).addClass('success');
            }
            $(this).css('background-color','');
        });
    });
    $('table').on('mouseover','td',function(){
        var index = $(this).index();
        $('table').find('tr').each(function(){
            $(this).find(`td:eq(${index})`).each(function(){
                $(this).addClass('hovered');
            });
        });
    })
    $('table').on('mouseout','td',function(){
        $('td').removeClass('hovered');
    })
    // $('#hide').click(function(){
    //     $('')
    // });

}
