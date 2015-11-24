var Base   = require("./base");

/**
 */

function RepeatComponent() {
  Base.apply(this, arguments);
  this._children   = [];
}

/**
 */

 function _each(target, iterate) {
     if (!target) return;
     if (target['_kmf_src'] != undefined && target['_kmf_elems'] != undefined) {
         var refValues = target['_kmf_elems'];
         var src = target['_kmf_src'];
         var manager = target['_kmf_src'].manager();
         manager.lookupAllObjects(src.universe(), src.now(), refValues, function (objs) {
             for (var key in objs) {
                 iterate(objs[key], key);
             }
         });
     } else {
         if (target.forEach) {
             // use API here since target could be an object
             target.forEach(iterate);
         } else {
             if (Object.prototype.toString.call(target) === "[object Array]") {
                 for (var i = 0, n = target.length; i < n; i++) iterate(target[i], i);
             } else {
                 for (var key in target) {
                     if (target.hasOwnProperty(key)) iterate(target[key], key);
                 }
             }
         }
     }
 }

/**
 */

module.exports = Base.extend(RepeatComponent, {

  /**
   */

  initialize: function() {
    // TODO - throw error of props don't exist here
  },

  /**
   */

  setAttribute: function(k, v) {
    // TODO - call the KMF mutate here
    this[k] = v;
  },

  /**
   */

  update: function() {

    var as       = this.as;
    var each     = this.each;
    var query    = this.query;
    var src      = this.src;

    var key      = this.key || "key";

    var n        = 0;
    var self     = this;
    var parent   = this.view;

    var properties;

    if(each != undefined){
      this._children.forEach(function(child) {
        child.remove();
      });
      this._children = [];
      _each(each, function(model, k) {
        var child;
        if (as) {
          properties       = { };
          for (var parentKey in parent.context) {
              properties[parentKey] = parent.context[parentKey];
          }
          properties.prototype = parent.context.prototype;
          properties[key]  = k;
          properties[as]   = model;
        } else {
          properties = model;
        }
        // TODO - provide SAME context here for speed and stability
        if (n >= self._children.length) {
          child = self.childTemplate.view(properties, {
            parent: parent
          });
          self._children.push(child);
          self.section.appendChild(child.render());
        } else {
          child = self._children[n];
          child.context = properties;
          child.update();
        }
        n++;
      });
    }
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
