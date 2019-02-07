if (window.location.href.includes('cs439')) {
    var rows = $('tr:gt(0)');
    $('td:eq(0)').html('<p>commit id<input id="search" style="margin-left:20px;width:70%;"></input></p>')
    $('body').append('<iframe id="test" src="https://www.cs.utexas.edu/~gheith/cs439_sp19_p2/51f1fa0cca16b314c55ec792117a3df46a329250.cc"></iframe>');
    $('td:eq(2)').append('<span> ▶ </span>');
    $('tr:gt(0)').find('td:lt(3)').css('text-align', 'center');
    $('td:lt(3)').css('padding', '10px');
    $('table').find('tr').each(function() {
        $(this).find('td').css('font-size', '15px');
        $(this).find('td').each(function() {
            var color = $(this).css('background-color')
            console.log(color);
            if (color == 'rgb(255, 0, 0)') {
                $(this).addClass('fail');
            } else if (color == 'rgb(0, 128, 0)') {
                $(this).addClass('success');
            }
            $(this).css('background-color', '');
        });
    });
    $('table').on('mouseover', 'td', function() {
        var index = $(this).index();
        if (index > 2) {
            $('table').find('tr').each(function() {
                $(this).find(`td:eq(${index})`).each(function() {
                    $(this).addClass('hovered');
                });
            });
        } else {
            if ($(this).parent().index() != 0) {
                $(this).parent().find('td:lt(3)').addClass('hovered');
            } else {
                $(this).addClass('hovered');
            }
        }
    })
    $('table').on('mouseout', 'td', function() {
        $('td').removeClass('hovered');
    })
    $("#search").on('input', function() {
        var val = $(this).val();
        console.log(val);
        $('tr:gt(0)').each(function() {
            if (!($(this).find('td:eq(0)').text().startsWith(val))) {
                $(this).addClass('hidden');
            } else {
                $(this).removeClass('hidden');
            }
        });

    });

    function sortList() {
        var sortedRows = rows.slice();
        sortedRows.sort(function(a, b) {
            console.log(a);
            var passA = $(a).find('td:eq(2)').text();
            var passB = $(b).find('td:eq(2)').text();
            return parseInt(passB) - parseInt(passA);
        });
        $('table>tr').remove();
        sortedRows.each(function() {
            $('table').append($(this));
        });
    }

    function resetList() {
        $('table>tr').remove();
        rows.each(function() {
            $('table').append($(this));
        });
    }
    $('td:eq(2)').click(function() {
        if ($(this).text().includes(' ▶ ')) {
            $(this).find('span').text(' ▼ ');
            sortList();
        } else {
            $(this).find('span').text(' ▶ ');
            resetList();
        }
    });

}