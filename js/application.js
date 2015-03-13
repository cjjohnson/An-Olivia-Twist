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
    posts = [];

    $.ajax({
        async: false,
        dataType: "json",
        url: "https://www.googleapis.com/blogger/v3/blogs/3432018582304648349/posts?key=AIzaSyDu2FQVu5Q74NNd88D0ijV5nmBeYCZ3FqI",
        success: function (data) {
            $.each(data.items, function (index, val) {
                posts.push({
                    title: $("<p/>", {
                        html: val.title
                    }),
                    date: $("<p/>", {
                        html: new Date(val.published).toUTCString()
                    }),
                    content: $("<p/>", {
                        html: val.content
                    }),
                    slug: val.url.split('.html')[0].split('/').pop()
                });
            });
        }//,
        //error: function(e) {
        //    $("#post_list").html("Could not load posts");
        //}
    });

    //$.each(posts, function (key, value) {
    //    $("#post_list").append($(value.title[0]));
    //    $(value.title[0]).attr("id", value.slug);

    //    $(value.title[0]).click(function () {
    //      window.location.href = window.location.origin + window.location.pathname + "#!" + value.slug;
    //        disqus_title = $(value.title[0]).html();

    //        $("#current_post").html("");
    //        $("#current_post").append($("<h3/>", { html: $(value.title[0]).clone().html() }));
    //        $("#current_post").append($(value.date[0]).clone());
    //        $("#current_post").append($(value.content[0]).clone());

    //        reset_disqus(disqus_title);
    //    });
    //});

    var on_click = function(post) {
        window.location.href = window.location.origin + window.location.pathname + "#!" + post.slug;
        disqus_title = $(post.title[0]).html();

        $("#current_post").html("");
        $("#current_post").append($("<h3/>", { html: $(post.title[0]).clone().html() }));
        $("#current_post").append($(post.date[0]).clone());
        $("#current_post").append($(post.content[0]).clone());

        reset_disqus(disqus_title);
    }

    var position = 0;

    $("#previous").click(function() {
        if(position < posts.length - 1) {
            position = position + 1;

            // If previous has been clicked, than there must be a "next" post.
            $("#next").show()

            if(position == posts.length - 1) {
                $("#previous").hide();
            } else {
                $("#previous").show();
            }

            on_click(posts[position]);
        }
    });

    $("#next").click(function() {
        if(position > 0) {
            position = position - 1;

            $("#previous").show()

            if(position == 0) {
                $("#next").hide();
            } else {
                $("#next").show();
            }

            on_click(posts[position]);
        }
    });

    var update = function() {
        var id = window.location.hash.slice(1).replace('!', '');

        for(var i = 0; i < posts.length; i++) {
            if(posts[i].slug == id) {
                position = i;
                on_click(posts[position]);

                if(position == posts.length - 1) {
                    $("#previous").hide();
                } else if(position == 0) {
                    $("#next").hide();
                }

                break;
            }
        }
        //$("#" + id).click();
        //$("#sidebar").css('height', $("#post").css('height'));
    }


    if(window.location.hash) {
        update();
    } else {
        on_click(posts[position]);
        $("#next").hide();
        //$("#post_list p").get(position).click();
    }

    window.onhashchange = function() {
        update();
    }
});
