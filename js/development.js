var XMLMapping = require('xml-mapping');
var source = $("#entry-template").html();
var template = Handlebars.compile(source);
var newsfeed = "http://crossorigin.me/http://dailybruin.com/feed";

Handlebars.registerHelper('clean', function(content){
    
    /* 
    
    This helper parses content in description to reflect custom styling e.g.
    untagged text -> text enclosed in <p> tags; <img> tags have custom styling
    stripped from them and replaced
    
    */
    
    // To wrap untagged text, we must first insert it into its own HTML node,
    // iterate through the contents, and wrap each content
    
    var cleanedContent = $('<div></div>');
    cleanedContent.html(content);
    
    $(cleanedContent).contents().filter(function() {
        return this.nodeType == 3; // for all text nodes 
    }).wrap('<p class="article">'); // wrap them in <p> tags
    
    // remove all styling from images, and replace them with our own
    
    $(cleanedContent).children("img").each(function() {
        $(this).removeAttr("class");
        $(this).removeAttr("style");
        $(this).attr("class","article_image");
    });
    
    // Return as HTML
    
    return new Handlebars.SafeString($(cleanedContent).html());
    
});

$(document).ready(function() {

    $.get(newsfeed,
        function(response) { // a callback when the GET request is successful
        
            var serialized_XML = new XMLSerializer().serializeToString(response);
            var json = XMLMapping.load(serialized_XML);
    
            // get source template
            var templateSource = $("#entry-template").html();
            template = Handlebars.compile(templateSource);

            //parse the data into the format we want
            var data = json["rss"]["channel"]["item"];

            var returndata = {data: data};

            //update the page with the formatted data
            var newsHTML = template(returndata);
            $("#news").html(newsHTML);

        });

    /* 
    For some reason, using the Object format {url: jsonsite, success: ...} triggers an XMLHTTPRequest error.
    Must be a bug in jQuery. Weird.
    */


});