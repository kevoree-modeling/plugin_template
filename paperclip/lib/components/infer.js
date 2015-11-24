var Base   = require("./base");

function InferComponent() {
  Base.apply(this, arguments);
  this._children   = [];
}

module.exports = Base.extend(InferComponent, {
  initialize: function() {},
  setAttribute: function(k, v) { this[k] = v; },
  update: function() {
    var as = this.as;
    var dependencies = [];
    for (var key in this) {
        if (this.hasOwnProperty(key) && key.startsWith("dependency_")) {
            dependencies.push(this[key]);
        }
    }
    var src = this.src;
    var self = this;
    var parent = this.view;
    var properties;
    if (src != undefined) {
        this._children.forEach(function (child) {
            child.remove();
        });
        this._children = [];
        src.genericInfer(dependencies, function (resolveResult) {
            var child;
            if (as) {
                properties = {};
                properties[as] = resolveResult;
            } else {
                properties = resolveResult;
            }
            child = self.childTemplate.view(properties, {parent: parent});
            self._children.push(child);
            self.section.appendChild(child.render());
        });
    }
  }
});
