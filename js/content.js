if (window.location.href.includes('cs439')) {
    let numUsers = -999;
    let fadetime = 100;
    $('td:lt(3)').css('padding', '10px');
    $('td:eq(2)').css('display', 'flex').append('<span style="margin-left: 5px"> ▶ </span>');
    $('td:eq(2)').css('cursor', 'pointer');
    var rows = $('tr:gt(0)');
    $('body').append('<h2 id="empty" class="hidden" style="color:red">Could not find any commits with that id.</h2>');
    $('body').append(`<div class="modal" id="data-modal">
                        <div class="modal-content">
                          <h1 id="users-online"></h1>
                        </div>
                      </div>`);
    $('body').append('<svg xmlns="http://www.w3.org/2000/svg" id="data-toggle" width="24" height="24" viewBox="0 0 24 24"><path d="M7 24h-6v-6h6v6zm8-9h-6v9h6v-9zm8-4h-6v13h6v-13zm0-11l-6 1.221 1.716 1.708-6.85 6.733-3.001-3.002-7.841 7.797 1.41 1.418 6.427-6.39 2.991 2.993 8.28-8.137 1.667 1.66 1.201-6.001z"/></svg>');
    document.getElementById("data-toggle").onclick = (e) => {
        $("#users-online").html(`There ${numUsers == 1 ? "is" : "are"} ` + numUsers + ` user${numUsers == 1 ? '' : 's'} currently online. ${numUsers == 1 ? "It's you :)" : ""}`);
        $("#data-modal").fadeIn(150);
    }

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
    $('tr:gt(0)').find('td:lt(3):gt(0)').css('text-align', 'center');
    $('td:eq(1)').css('cursor', 'auto');
    $('tr:gt(0)').find('td:lt(3)').addClass('commitID');
    $('table').find('tr').each(function () {
        $(this).find('td:eq(0)').append('<div id="more" class="hidden"></div>');
        $(this).find('td:gt(2)').css('cursor', 'pointer');
    });
    // This filters the list once when we load the site
    var savedCommitId = localStorage.getItem('commitID');
    savedCommitId = savedCommitId ? savedCommitId : "";
    if (savedCommitId) {
        filterList(savedCommitId);
    }
    $('td:eq(0)').html('<p>commit id<input id="search" value="' + savedCommitId + '" style="margin-left:20px;width:60%;"></input></p>');
    //     $(this).find('td:gt(2)').each(function() {
    //         var color = $(this).css('background-color');
    //         var status = '';
    //         if (color == 'rgb(255, 0, 0)') {
    //             status = 'fail';
    //         } else if (color == 'rgb(0, 128, 0)') {
    //             status = 'success';
    //         }
    //         $(this).addClass(status);
    //         var index = $(this).index();
    //         var test = $('tr:eq(0)').find(`td:eq(${index})`).text();
    //         if (status == 'fail') {
    //             $(this).parent().find('#more').append(`<p style="font-size:small;margin:0px;padding:0px;">${status}: ${test}</p>`);
    //         }
    //         $(this).css('background-color', '');
    //     });
    // });
    $('.modal').click(function () {
        $(this).fadeOut(150);
    });
    $('table').on('mouseenter', 'td', function () {
        var index = $(this).index();
        if (index > 2) {
            $('table').find('tr').each(function () {
                $(this).find(`td:eq(${index})`).each(function () {
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
    $('tr:gt(0)').on('click', 'td:lt(3)', function () {
        // $(this).parent().find('td:lt(3)').removeClass('hovered')
        // $(this).parent().addClass('open');
        $(this).parent().find("#more").toggleClass('hidden');
        $(this).parent().find("td:gt(2)").toggleClass('selected');
        if ($(this).parent().find("#failedList>li").length == 0) {
            $(this).parent().find('#more').append('<ul style="list-style-type: none;margin-top:5px;"id="failedList"></ul>');
            var failedTests = [];
            $(this).parent().find('td').each(function () {
                var color = $(this).css('background-color');
                if (color == 'rgb(255, 0, 0)') {
                    status = 'fail';
                    failedTests.push(getTestInfo($(this).index()));
                }
            });
            for (let i in failedTests) {
                $(this).parent().find('#failedList').append(`<li value="${failedTests[i].rowindex}" style="margin:0px;cursor:pointer;"><div class='chip'><p  id="failtest" class="failtest">${failedTests[i].name}</p></div></li>`);
            }
        }
    });
    $('tr:gt(0)').on('click', 'td:gt(2)', function () {
        displayTest($(this).index());
    })
    $('table').on('mouseleave', 'td', function () {
        $('td').removeClass('hovered');
    })
    $("#search").on('input', function () {
        var val = $(this).val();
        filterList(val)
        storeCommitID(e.target.value);
    });
    $("tr").on('click', 'li ', function (e) {
        displayTest($(this).val());
        e.stopPropagation();
    });

    function filterList(id) {
        $('tr:gt(0)').each(function () {
            if (!($(this).find('td:eq(0)').text().startsWith(id))) {
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
    }

    function displayTest(index) {
        var test = getTestInfo(index);
        $("#problem").attr('src', test.test);
        $("#solution").attr('src', test.sol);
        $("#myModal").fadeIn(fadetime);
    }


    function getTestInfo(index) {
        let td = $(`td:eq(${index})`);
        return {
            rowindex: index,
            name: $(td).find('a').attr('title').substring(0, 5),
            test: $(td).find('a:eq(0)').attr('href'),
            sol: $(td).find('a:eq(1)').attr('href')
        };
    }

    function sortList() {
        var sortedRows = rows.slice();
        sortedRows.sort(function (a, b) {
            var passA = $(a).find('td:eq(2)').text();
            var passB = $(b).find('td:eq(2)').text();
            return parseInt(passB) - parseInt(passA);
        });
        $('table>tr').remove();
        sortedRows.each(function () {
            $('table').append($(this));
        });
    }
    $('.close').click(function () {
        $("#myModal").fadeOut(fadetime);
    });

    function resetList() {
        $('table>tr').remove();
        rows.each(function () {
            $('table').append($(this));
        });
    }
    $('td:eq(2)').click(function () {
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
        $('tr:gt(0)').each(function () {
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

    function storeCommitID(id) {
        window.localStorage.setItem('commitID', id);
    }




    // When the document loads, we want to increment the number of people that are on the site
    // We also send a callback function, which the db.js file uses to log the number of people online
    chrome.runtime.sendMessage({
        type: 'incrementCounter'
    }, (num) => {
        numUsers = num;
    });

    // When the user closes the webpage, we decrement the number of people on the site
    window.onbeforeunload = function () {
        chrome.runtime.sendMessage({
            type: 'decrementCounter'
        }, (num) => {
            numUsers = num;
        });
    };

}