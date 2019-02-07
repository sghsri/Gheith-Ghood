if(window.location.href.includes('cs439')){
    var rows = $('tr:gt(0)');
    $('body').prepend('<button id="reset">Reset</button>');
    $('body').prepend('<button id="sort">Sort</button>');
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
        if(index > 2){
            $('table').find('tr').each(function(){
                    $(this).find(`td:eq(${index})`).each(function(){
                        $(this).addClass('hovered');
                    });
            });
        } else {
            $(this).parent().find('td:lt(3)').addClass('hovered');
        }
    })
    $('table').on('mouseout','td',function(){
        $('td').removeClass('hovered');
    })
    $('#sort').click(function(){
        var sortedRows = rows.slice();
        sortedRows.sort(function(a,b){
            console.log(a);
            var passA = $(a).find('td:eq(2)').text();
            var passB = $(b).find('td:eq(2)').text();
            return parseInt(passA)-parseInt(passB);
        });
        $('table>tr').remove();
        sortedRows.each(function(){
            $('table').append($(this));
        });
    });
    $("#reset").click(function(){
        $('table>tr').remove();
        rows.each(function(){
            $('table').append($(this));
        });
    });

}
