_.mixin({
    bindDelay: function(func, context, wait) {
        return _.delay(_.bind(func, context || this, _(arguments).toArray().last(3)), wait);
    },
    
    bindDefer: function(func, context) {
        return _.defer(_.bind(func, context || this, _(arguments).toArray().last(2)));
    },
    
    isSomething: function(obj) {
		return obj !== undefined && obj !== null && obj !== "";
	},

	isNothing: function(obj) {
		return !this.isSomething(obj);
	}
});