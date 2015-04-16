(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['spaceLink'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"panel space\" id=\"space-"
    + alias2(alias1((depth0 != null ? depth0.moduleID : depth0), depth0))
    + "\">\n    <script>\n        var t = \""
    + alias2(alias1((depth0 != null ? depth0.moduleID : depth0), depth0))
    + "\";\n        var ref = encodeURI(t);\n        var a = '<a href=\"threads?space=' + ref + '\">"
    + alias2(alias1((depth0 != null ? depth0.moduleID : depth0), depth0))
    + " - "
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</a>';\n        document.write(a);\n    </script>\n    <p>Year: "
    + alias2(alias1((depth0 != null ? depth0.academicYear : depth0), depth0))
    + "</p>\n    <!--TODO Maybe list admins? -->\n</div>";
},"useData":true});
})();
