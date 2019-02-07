if (window.location.href.includes('cs439')) {
    $('td:lt(3)').css('padding', '10px');
    $('td:eq(2)').append('<span> ▶ </span>');
    var rows = $('tr:gt(0)');
    $('body').append('<h2 id="empty" class="hidden" style="color:red">Could not find any commits with that id.</h2>');
    $('td:eq(0)').html('<p>commit id<input id="search" style="margin-left:20px;width:70%;"></input></p>')
    var modhtml = `<div class=modal id=myModal>
							<div class=modal-content>
							   <span class=close>×</span>
                               <div style="display:flex;">
							   <iframe style="width:70%; height:60%;" id="problem"></iframe>
                               <iframe style="width:30%;"id="solution"></iframe>
                               </div>
							</div>
	              </div>`;
    $("body").prepend(modhtml);
    // $('body').append('<iframe id="test" src="https://www.cs.utexas.edu/~gheith/cs439_sp19_p2/51f1fa0cca16b314c55ec792117a3df46a329250.cc"></iframe>');
    $('tr:gt(0)').find('td:lt(3)').css('text-align', 'center');
    $('table').find('tr').each(function() {
        $(this).find('td:eq(0)').append('<div id="more" class="hidden"></div>');
        $(this).find('td:gt(2)').each(function() {
            var color = $(this).css('background-color');
            var status = '';
            if (color == 'rgb(255, 0, 0)') {
                status = 'fail';
            } else if (color == 'rgb(0, 128, 0)') {
                status = 'success';
            }
            $(this).addClass(status);
            var index = $(this).index();
            var test = $('tr:eq(0)').find(`td:eq(${index})`).text();
            if (status == 'fail') {
                $(this).parent().find('#more').append(`<p style="font-size:small;margin:0px;padding:0px;">${status}: ${test}</p>`);
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
    $('tr:gt(0)').on('click', 'td:gt(2)', function() {
        getTestInfo($(this).index());
    })
    $('table').on('mouseout', 'td', function() {
        $('td').removeClass('hovered');
    })
    $("#search").on('input', function() {
        var val = $(this).val();
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

    function getTestInfo(index) {
        let td = $(`td:eq(${index})`);
        let test = $(td).find('a:eq(0)').attr('href');
        let out = $(td).find('a:eq(1)').attr('href');
        $("#myModal").fadeIn(150);
        $("#problem").attr('src', test);
        $("#solution").attr('src', out);
    }

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
    $('.close').click(function() {
        $("#myModal").fadeOut(150);
    });

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