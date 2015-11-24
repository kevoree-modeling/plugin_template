var Base   = require("./base");

function TraverseComponent() {
  Base.apply(this, arguments);
  this._children   = [];
}

module.exports = Base.extend(TraverseComponent, {

  initialize: function() {},
  setAttribute: function(k, v) { this[k] = v; },
  update: function() {

    var as       = this.as;
    var query    = this.query;
    var src      = this.src;

    var key      = this.key || "key";

    var self     = this;
    var parent   = this.view;

    var properties;

    if(query != undefined && src != undefined){
      this._children.forEach(function(child) {
        child.remove();
      });
      this._children = [];
      src.select(query,function(objs){

          if (as) {
              properties     = { };
              properties[as] = objs;
          } else {
              properties = objs;
          }
          var child = self.childTemplate.view(properties, {parent: parent });
          self._children.push(child);
          self.section.appendChild(child.render());

      });
    }
  }
});
