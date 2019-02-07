if (window.location.href.includes('cs439')) {
    var rows = $('tr:gt(0)');
    $('table').after('<h2 id="empty" class="hidden" style="color:red">Could not find any commits with that id.</h2>');
    $('td:eq(0)').html('<p>commit id<input id="search" style="margin-left:20px;width:70%;"></input></p>')
    $('body').append('<iframe id="test" src="https://www.cs.utexas.edu/~gheith/cs439_sp19_p2/51f1fa0cca16b314c55ec792117a3df46a329250.cc"></iframe>');
    $('td:eq(2)').append('<span> ▶ </span>');
    $('tr:gt(0)').find('td:lt(3)').css('text-align', 'center');
    $('td:lt(3)').css('padding', '10px');
    $('table').find('tr').each(function() {
        $(this).find('td').css('font-size', '15px');
        $(this).find('td:eq(0)').append('<div id="more" class="hidden"></div>');
        $(this).find('td:gt(2)').each(function() {
            var color = $(this).css('background-color');
            var index = $(this).index();
            var test = $('tr:eq(0)').find(`td:eq(${index})`).text();
            var status = '';
            if (color == 'rgb(255, 0, 0)') {
                status = 'fail';
            } else if (color == 'rgb(0, 128, 0)') {
                status = 'success';
            }
            $(this).addClass(status);
            if (status == 'fail') {
                $(this).parent().find('#more').append(`<p style="font-size:small;margin-bottom:0px;">${status}: ${test}</p>`);
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
    $('tr:gt(0)').on('click', 'td:lt(3)', function() {
        $(this).parent().find("#more").toggleClass('hidden');
        $(this).parent().find("td:gt(2)").toggleClass('selected');
    });
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
        if ($('tr:visible').length == 1) {
            $("#empty").removeClass('hidden');
        } else {
            $("#empty").addClass('hidden');
        }

    });

    function sortList() {
        var sortedRows = rows.slice();
        sortedRows.sort(function(a, b) {
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
    averageMood();

    function averageMood() {
        let redAvg = 0;
        let greenAvg = 0;
        let blueAvg = 0;
        let numMoods = 0;
        $('tr:gt(0)').each(function() {
            var mood = $(this).find('td:eq(1)').css('color');
            console.log(mood);
            switch (mood) {
                case "rgb(255, 0, 0)":
                    redAvg += 255;
                    break;
                case "rgb(0, 128, 0)":
                    greenAvg += 255;
                    break;
                case "rgb(0, 0, 255)":
                    blueAvg += 255;
                    break;
                default:
                    numMoods++;
                    break;
            }
        });
        redAvg /= numMoods;
        greenAvg /= numMoods;
        blueAvg /= numMoods;
        $('td:eq(1)').css('color', `rgb(${redAvg}, ${greenAvg}, ${blueAvg})`);


    }

}