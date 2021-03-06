var config = {}
config.Width = screen.width;
config.Height = screen.height;
config.Left = 0;
config.Top = 0;

config.defaultBrowser = 'firefox';
config.defaultFileManager = 'thunar';


// init skrollr
skrollr.init({
    forceHeight: false
});

$(document).ready(function() {
    $.getJSON('json/main.json', initByJson)
    .fail(function() {
        $('#output').append("<h2>could not load json</h2>");
    });
});

// navigation scrolling
function initNavScrolling() {
    $('.nav li a').bind('click',function(event){
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top -44
        }, 600);
        event.preventDefault();
    });

    $('#navigation').on('activate.bs.scrollspy', function() {
        var ele = $(this).find('.active');
        EleTxt = ele[0].innerText.replace(/[^A-Za-z]*/g, '');

        // mark news as seen when scrolling to newspage
        if (EleTxt.indexOf("News") != -1) {
            $('#link_news').text("News");
            lastNewsSeen = latestNewsDate;
            newNewsCtn = 0;
        }
    });
}

// init isotope
function initIsotope(container) {
    container.isotope({
         itemSelector: '.item',
         layoutMode: 'fitRows'
    });
}

function initByJson(data) {
    // menu bar
    menubar = data.menubar;
    $.each(menubar, function() {
        $('#menubar').append("<li><a href=\"#" + this.page + "\" id='link_"+ this.page + "'>" + this.title + "</a></li>");
    });

    // page list
    pagelist = data.menubar;
    $.each(pagelist, function() {
        var page = this.page;
        var title = this.title;
        $('body').append("<div id=\"" + page + "\" class=\"page\"></div>");
        $.getJSON('json/' + page + '.json', function(data) {
            if (data.iframe) {
                var container = $('<div>');
                container.append('<iframe src="'+ data.iframe + '" width=100% height='+document.documentElement.clientHeight +' frameborder=0 ></iframe></div>');
                $('#' + page).append(container);

                return;
            }
            if (data.text) {
                var container = $('<div class=text>');
                container.append('<p>' + data.text + '</p>');
                $('#' + page).append(container);
                return;
            }
            if (data.buttons) {
                var container = $('<div id=page>');
                var containercontent = $('<div id="pagecontent" >');
                container.append(containercontent);
                $.each(data.buttons, function() {
                    containercontent.append('<a href="'+this.logo_link+'"><div class="item" rel="tooltip" data-toggle="tooltip" title="' + this.logo_tip + '\
                        " ><div class="item-inner" style="background-color: ' + this.logo_bg_color +'">' + this.logo_letter + '</div><div class="descr">' + this.logo_word + '</div></div></a>');
                });
                $('#' + page).append(container);

                initIsotope(containercontent);
                // setup tooltips
                $("[rel=tooltip]").tooltip({placement : 'top'});
                // click animation
                $("[rel=tooltip]").bind('click', function () {
                    $(this).addClass('animated tada');
                });
                $('[rel=tooltip]').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass('animated tada');
                });
            }
            if (data.links) {
                var container = $('<div class="linkscontainer"></div>');
                var linkslist = $('<ul ></ul>');
                container.append(linkslist);
                $.each(data.links, function() {
                    linkslist.append('<li ><a href="'+this.tub_link+'"</a> '+this.link_desc+' </li>');
                });
                $('#' + page).append(container);
                return;
            }
        });
    });


    // refresh scroll spy
    $('body').scrollspy({ target: '#navigation', offset: 70 });
    $('[data-spy="scroll"]').each(function () {
        var $spy = $(this).scrollspy('refresh')
    })

    // bind scrolling on click
    initNavScrolling();

}

