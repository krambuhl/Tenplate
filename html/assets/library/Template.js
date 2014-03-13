Template = (function() {
    return {
        get: function(name) {
            var prefix = "assets/templates/";
            return Templates[prefix + name + ".hbs"] || Templates[prefix + name + ".handlebars"];
        },

        html: function(name, data) {
            return this.get(name)(data);
        }
    };
})();