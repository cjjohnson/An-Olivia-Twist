var reset_disqus = function(identifier) {
    if(typeof DISQUS == 'undefined') {
        setTimeout(function() { reset_disqus(identifier); }, 100);
    } else {
        DISQUS.reset({
            reload: true,
            config: function () {  
                this.page.identifier = identifier;  
                this.page.url = window.location.href;
            }
        });
    }
};

$(function () {
    var USERNAME = "anoliviatwist";

    attributes = [
        "border-bottom-color",
        "border-left-color",
        "border-right-color",
        "border-top-color",
        "border-top-style",
        "border-top-width",
        "box-shadow",
        "box-sizing",
        "color",
        "display",
        "font-family",
        "font-size",
        "line-height",
        "padding-bottom",
        "padding-left",
        "padding-right",
        "text-align",
        "background-image"
    ];

    $.each(attributes, function(i, attribute) {
        $("#post_list").css(attribute, $("#navbarCollapse").css(attribute));
    });

    $("#post_list").css("float", "left");
    $("#post_list").css("width", "20%");
    $("#post_list").css("height", "200px");
    $("#post_list").css("padding", "10px");
    $("#post_list").css("overflow", "scroll");

    posts = [];

    $.ajax({
        async: false,
        dataType: "json",
        url: "https://roon.io/api/v1/blogs/" + USERNAME + "/posts",
        success: function (data) {
            $.each(data, function (key, val) {
                posts.push({
                    title: $("<p/>", {
                        html: val.title
                    }),
                    date: $("<p/>", {
                        html: new Date(val.published_at * 1000.0).toUTCString()
                    }),
                    content: $("<p/>", {
                        html: val.content_html
                    }),
                    slug: val.slug
                });
            });
        },
        error: function(e) {
            $("#post_list").html("Could not load posts");
        }
    });

    $.each(posts, function (key, value) {
        $("#post_list").append($(value.title[0]));
        $(value.title[0]).attr("id", value.slug);

        $(value.title[0]).click(function () {
	    window.location.href = window.location.origin + window.location.pathname + "#!" + value.slug;
            disqus_title = $(value.title[0]).html();

            $("#current_post").html("");
            $("#current_post").append($("<h3/>", { html: $(value.title[0]).clone().html() }));
            $("#current_post").append($(value.date[0]).clone());
            $("#current_post").append($(value.content[0]).clone());

            reset_disqus(disqus_title);
        });
    });

    var update = function() {
        var id = window.location.hash.slice(1).replace('!', '');
        $("#" + id).click();
    }

    if(window.location.hash) {
        update();
    } else {
        $("#post_list p").get(0).click();
    }

    window.onhashchange = function() {
        update();
    }
});
