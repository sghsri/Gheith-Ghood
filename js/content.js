if(window.location.href.includes('cs439')){
    $('table').find('tr').each(function(){
        $(this).find('td').css('font-size','15px');
        $(this).find('td').each(function(){
            var color = $(this).css('background-color')
            if(color == 'rgb(255, 0, 0)'){
                $(this).css('background-color','#FF5252');
            }
        });
    });

}
