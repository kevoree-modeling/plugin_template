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

    var n        = 0;
    var self     = this;
    var parent   = this.view;

    var properties;

    if(query != undefined && src != undefined){
      this._children.forEach(function(child) {
        child.remove();
      });
      this._children = [];
      src.select(query,function(objs){
        for(var i=0;i<objs.length;i++){
          var loopElem = objs[i];
          var child;
          if (as) {
            properties     = { };
            properties[as] = loopElem;
          } else {
            properties = loopElem;
          }
          child = self.childTemplate.view(properties, {parent: parent });
          self._children.push(child);
          self.section.appendChild(child.render());
          n++;
        }
      });
    }
  }
});
