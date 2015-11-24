(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var template       = require(29);
var extend         = require(52);
var RunLoop        = require(28);

/**
 */

module.exports = {
  Attribute      : require(2),
  Component      : require(17),
  viewClass      : require(32),
  components     : require(18),
  attributes     : require(13),
  modifiers      : require(27),
  runloop        : new RunLoop(),
  vnode          : require(44),
  document       : global.document,
  noConflict: function() {
    delete global.paperclip;
  },
  template: function(source, options) {
    return template(source, extend({}, module.exports, options || {}));
  }
};

if (typeof window !== "undefined") {
  window.paperclip = module.exports;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"13":13,"17":17,"18":18,"2":2,"27":27,"28":28,"29":29,"32":32,"44":44,"52":52}],2:[function(require,module,exports){
var protoclass = require(51);

/**
 */

function Base(ref, key, value, view) {
  this.ref      = ref;
  this.node     = ref; // DEPRECATED
  this.key      = key;
  this.value    = value;
  this.view     = view;
  this.template = view.template;
  this.document = view.template.options.document;
  this.initialize();
}

/**
 */

protoclass(Base, {
  initialize: function() {
  },
  update: function() {
  }
});

/**
 */

module.exports = Base;

},{"51":51}],3:[function(require,module,exports){
var Base = require(2);

/**
 */

module.exports = Base.extend({

  /**
   */

  update: function() {

    var classes = this.value;

    if (typeof classes === "string") {
      return this.node.setAttribute("class", classes);
    }

    if (!classes) {
      return this.node.removeAttribute("class");
    }

    var classesToUse = this.node.getAttribute("class");
    classesToUse     = classesToUse ? classesToUse.split(" ") : [];

    for (var classNames in classes) {

      var useClass = classes[classNames];
      var classNamesArray = classNames.split(/[,\s]+/g);

      for (var i = 0, n = classNamesArray.length; i < n; i++) {
        var className = classNamesArray[i];

        var j = classesToUse.indexOf(className);
        if (useClass) {
          if (!~j) {
            classesToUse.push(className);
          }
        } else if (~j) {
          classesToUse.splice(j, 1);
        }
      }
    }

    this.node.setAttribute("class", classesToUse.join(" "));
  }
});

module.exports.test = function(vnode, key, value) {
  return typeof value !== "string";
};

},{"2":2}],4:[function(require,module,exports){
var Base = require(2);

module.exports = Base.extend({
  initialize: function() {
    this.node.addEventListener( "click", function( event ){ if(this.value != undefined){ this.value();} }.bind(this) );
  },
  update: function() {
  }
});

},{"2":2}],5:[function(require,module,exports){
var KeyCodedEventAttribute = require(14);

/**
 */

module.exports = KeyCodedEventAttribute.extend({
  keyCodes: [8]
});

},{"14":14}],6:[function(require,module,exports){
var Base = require(2);

/**
 */

module.exports = Base.extend({
  initialize: function() {
    this.view.transitions.push(this);
  },
  enter: function() {
    this.value.call(this.view, this.node, function() { });
  }
});

},{"2":2}],7:[function(require,module,exports){
var Base = require(2);

/**
 */

module.exports = Base.extend({
  initialize: function() {
    this.view.transitions.push(this);
  },
  exit: function(complete) {
    this.value.call(this.view, this.node, complete);
  }
});

},{"2":2}],8:[function(require,module,exports){
var Base = require(2);

/**
 */

module.exports = Base.extend({
  value: true,
  initialize: function() {
    this.update();
  },
  update: function() {
    if (this.value !== false) {
      this.node.removeAttribute("disabled");
    } else {
      this.node.setAttribute("disabled", "disabled");
    }
  }
});

},{"2":2}],9:[function(require,module,exports){
var KeyCodedEventAttribute = require(14);

/**
 */

module.exports = KeyCodedEventAttribute.extend({
  keyCodes: [13]
});

},{"14":14}],10:[function(require,module,exports){
var KeyCodedEventAttribute = require(14);

/**
 */

module.exports = KeyCodedEventAttribute.extend({
  keyCodes: [27]
});

},{"14":14}],11:[function(require,module,exports){
var Base = require(2);

/**
 */

module.exports = Base.extend({
  initialize: function() {
    if (!this.event) this.event = this.key.match(/on(.+)/)[1].toLowerCase();
    this.ref.addEventListener(this.event, this._onEvent.bind(this));
  },
  _onEvent: function(event) {
    this.value(event);
  }
});

},{"2":2}],12:[function(require,module,exports){
(function (process){
var Base = require(2);

/**
 */

module.exports = Base.extend({

  /**
   */

  update: function() {
    if (!this.value) return;
    if (this.node.focus) {
      var self = this;

      if (!process.browser) return this.node.focus();

      // focus after being on screen. Need to break out
      // of animation, so setTimeout is the best option
      setTimeout(function() {
        self.node.focus();
      }, 1);
    }
  }
});

}).call(this,require(50))
},{"2":2,"50":50}],13:[function(require,module,exports){

module.exports = {
  onenter       : require(9),
  ondelete      : require(5),
  focus         : require(12),
  onescape      : require(10),
  class         : require(3),
  style         : require(15),
  value         : require(16),
  checked       : require(16),
  easein        : require(6),
  easeout       : require(7),
  enable        : require(8),
  onclick       : require(4)
};

},{"10":10,"12":12,"15":15,"16":16,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9}],14:[function(require,module,exports){
var EventAttribute = require(11);

/**
 */

module.exports = EventAttribute.extend({

  /**
   */

  event: "keydown",

  /**
   */

  keyCodes: [],

  /**
   */

  _onEvent: function(event) {

    if (!~this.keyCodes.indexOf(event.keyCode)) {
      return;
    }

    EventAttribute.prototype._onEvent.apply(this, arguments);
  }
});

},{"11":11}],15:[function(require,module,exports){
var Base = require(2);

/**
 */

module.exports = Base.extend({

  /**
   */

  initialize: function() {
    this._currentStyles = {};
  },

  /**
   */

  update: function() {

    var styles = this.value;

    if (typeof styles === "string") {
      this.node.setAttribute("style", styles);
      return;
    }

    var newStyles = {};

    for (var name in styles) {
      var style = styles[name];
      if (style !== this._currentStyles[name]) {
        newStyles[name] = this._currentStyles[name] = style || "";
      }
    }

    for (var key in newStyles) {
      this.node.style[key] = newStyles[key];
    }
  }
});

/**
 */


module.exports.test = function(vnode, key, value) {
  return typeof value !== "string";
};

},{"2":2}],16:[function(require,module,exports){
var Base = require(2);
var _bind         = require(31);

/**
 */

module.exports = Base.extend({

  /**
   */

  _events: ["change", "keyup", "input"],

  /**
   */

  initialize: function() {
    this._onInput = _bind(this._onInput, this);
    var self = this;
    this._events.forEach(function(event) {
      self.node.addEventListener(event, self._onInput);
    });
  },

  /**
   */

  // bind: function() {
  //   Base.prototype.bind.call(this);
  //
  //   var self = this;
  //
  //   // TODO - move this to another attribute helper (more optimal)
  //   if (/^(text|password|email)$/.test(this.node.getAttribute("type"))) {
  //     this._autocompleteCheckInterval = setInterval(function() {
  //       self._onInput();
  //     }, process.browser ? 500 : 10);
  //   }
  // },

  /**
   */

  // unbind: function() {
  //   Base.prototype.unbind.call(this);
  //   clearInterval(this._autocompleteCheckInterval);
  //
  //   var self = this;
  // },

  /**
   */

  update: function() {

    var model = this.model = this.value;

    if (!model) return;

    if (!model || !model.__isReference) {
      throw new Error("input value must be a reference. Make sure you have <~> defined");
    }

    if (model.gettable) {
      this._elementValue(this._parseValue(model.value()));
    }
  },

  _parseValue: function(value) {
    if (value == null || value === "") return void 0;
    return value;
  },

  /**
   */

  _onInput: function(event) {

    clearInterval(this._autocompleteCheckInterval);

    // ignore some keys
    if (event && (!event.keyCode || !~[27].indexOf(event.keyCode))) {
      event.stopPropagation();
    }

    var value = this._parseValue(this._elementValue());

    if (!this.model) return;

    if (String(this.model.value()) == String(value))  return;

    this.model.value(value);
  },

  /**
   */

  _elementValue: function(value) {

    var isCheckbox        = /checkbox/.test(this.node.type);
    var isRadio           = /radio/.test(this.node.type);
    var isRadioOrCheckbox = isCheckbox || isRadio;
    var hasValue          = Object.prototype.hasOwnProperty.call(this.node, "value");
    var isInput           = hasValue || /input|textarea|checkbox/.test(this.node.nodeName.toLowerCase());

    if (!arguments.length) {
      if (isCheckbox) {
        return Boolean(this.node.checked);
      } else if (isInput) {
        return this.node.value || "";
      } else {
        return this.node.innerHTML || "";
      }
    }

    if (value == null) {
      value = "";
    } else {
      clearInterval(this._autocompleteCheckInterval);
    }

    if (isRadioOrCheckbox) {
      if (isRadio) {
        if (String(value) === String(this.node.value)) {
          this.node.checked = true;
        }
      } else {
        this.node.checked = value;
      }
    } else if (String(value) !== this._elementValue()) {

      if (isInput) {
        this.node.value = value;
      } else {
        this.node.innerHTML = value;
      }
    }
  }
});

/**
 */


module.exports.test = function(vnode, key, value) {
  return typeof value !== "string";
};

},{"2":2,"31":31}],17:[function(require,module,exports){
var protoclass = require(51);
var template   = require(29);
var fragment   = require(43);

/**
 */

function Component(section, vnode, attributes, view) {
  this.section       = section;
  this.vnode         = vnode;
  this.view          = view;
  this.document      = view.template.options.document;
  this.attributes    = {};
  if (vnode.childNodes) this.childTemplate = template(fragment(vnode.childNodes), view.template.options);
  for (var key in attributes) this.setAttribute(key, attributes[key]);
  this.initialize();
};

/**
 */

module.exports = protoclass(Component, {

  // TODO - add basic attribute validation here

  /**
   */

  initialize: function() {
    // OVERRIDE ME
  },

  /**
   */

  setAttribute: function(key, value) {
    this.attributes[key] = value;
  },

  /**
   */

  removeAttribute: function(key) {
    this.attributes[key] = void 0;
  }
});

},{"29":29,"43":43,"51":51}],18:[function(require,module,exports){
module.exports = {
  repeat : require(20),
  show   : require(21),
  stack  : require(22),
  switch : require(23),
  unsafe : require(25),
  traverse : require(24),
  infer : require(19)
};

},{"19":19,"20":20,"21":21,"22":22,"23":23,"24":24,"25":25}],19:[function(require,module,exports){
var Base   = require(17);

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

},{"17":17}],20:[function(require,module,exports){
var Base   = require(17);

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

},{"17":17}],21:[function(require,module,exports){
var Base   = require(17);

/**
 */

function ShowComponent() {
  Base.apply(this, arguments);
}

/**
 */

module.exports = Base.extend(ShowComponent, {

  /**
   */

  update: function() {
    var show = !!this.attributes.when;

    if (this._show === show) return;

    this._show = show;

    if (show) {
      this._view = this.childTemplate.view(this.view.context);
      this.section.appendChild(this._view.render());
    } else {

      if (this._view) {
        this._view.remove();
      }

      this._view = void 0;
    }
  }
});

},{"17":17}],22:[function(require,module,exports){
var Base     = require(17);
var template = require(29);

/**
 */

function StackComponent(options) {
  Base.apply(this, arguments);

  var self = this;

  this.childTemplates = this.childTemplate.vnode.target.childNodes.map(function(vnode) {
    return template(vnode, self.view.template.options);
  });
}

/**
 */

module.exports = Base.extend(StackComponent, {

  /**
   */

  update: function() {

    var currentTemplate;
    var show = this.attributes.state;

    if (typeof show === "number") {
      currentTemplate = this.childTemplates[show];
    } else {

      // match by name
      for (var i = this.childTemplates.length; i--;) {
        var childTemplate = this.childTemplates[i];
        if (childTemplate.vnode.target.attributes.name === show) {
          currentTemplate = childTemplate;
          break;
        }
      }
    }

    if (this.currentTemplate !== currentTemplate) {

      if (this.currentView) {
        this.currentView.remove();
        this.currentView = void 0;
      }

      this.currentTemplate = currentTemplate;

      if (this.currentTemplate) {
        this.currentView = currentTemplate.view(this.view.context);
        this.section.appendChild(this.currentView.render());
      }
    } else if (this.currentView) {
      this.currentView.update(this.view.context);
    }
  }
});

},{"17":17,"29":29}],23:[function(require,module,exports){
var Base       = require(17);
var _bind      = require(31);
var template   = require(29);
var fragment   = require(43);

/**
 */

function SwitchComponent() {
  Base.apply(this, arguments);

  var self = this;

  // console.log(this.vnode);
  // console.log(this.vnode)

  this.childTemplates = this.vnode.target.childNodes.map(function(vnode) {
    return template(vnode, self.view.template.options);
  });

  // this.vChildTemplates = this.vnode.target.childNodes.map(function(vnode) {

    // return template(vnode)
  // });
}

/**
 */

module.exports = Base.extend(SwitchComponent, {

  /**
   */

  update: function() {

    var child;
    var element;


    for (var i = 0, n = this.childTemplates.length; i < n; i++) {
      child = this.childTemplates[i];
      var dynamicVNode = child.vnode;
      element      = dynamicVNode.target;
      var atts = {};

      if (!dynamicVNode.bindingClass) break;

      // eesh - no beuno, but works well for now
      dynamicVNode.bindingClass.prototype.update2.call({
        view: this.view,
        setAttribute: function(k, v) {
          atts[k] = v;
        },
        setProperty: function(k, v) {
          atts[k] = v;
        }
      });

      if (atts.when) break;

    }

    if (this.currentChild == child) {
      this._view.context = this.view.context;
      return this._view.update();
    }

    if (this._view) {
      this._view.remove();
    }

    if (i == n) return;

    this.currentChild = child;

    var childChildTemplate = template(fragment(element.childNodes), this.view.template.options);

    this._view = childChildTemplate.view(this.view.context);
    this.section.appendChild(this._view.render());
  }
});

},{"17":17,"29":29,"31":31,"43":43}],24:[function(require,module,exports){
var Base   = require(17);

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

},{"17":17}],25:[function(require,module,exports){
(function (global){
var Base   = require(17);

/**
 */

function UnsafeComponent() {
  Base.apply(this, arguments);
}

/**
 */

module.exports = Base.extend(UnsafeComponent, {

  /**
   */

  update: function() {

    var value = this.attributes.html;

    // dirty check if is a binding
    if (typeof value === "object" && value.evaluate) {
      value = void 0;
    }

    if (this.currentValue && this.currentValue === value) {
      if (this.currentValue.__isView) {
        this.currentValue.update(this.currentValue.context);
      }
      return;
    }

    // has a remove script
    if (this.currentValue && this.currentValue.remove) {
      this.currentValue.remove();
    }

    this.currentValue = value;

    if (!value) {
      return this.section.removeChildNodes();
    }

    var node;

    if (value.render) {
      value.remove();
      node = value.render();
    } else if (value.nodeType != null) {
      node = value;
    } else {
      if (this.document !== global.document) {
        node = this.document.createTextNode(String(value));
      } else {
        var div = this.document.createElement("div");
        div.innerHTML = String(value);
        node = this.document.createDocumentFragment();
        var cn = Array.prototype.slice.call(div.childNodes);
        for (var i = 0, n = cn.length; i < n; i++) {
          node.appendChild(cn[i]);
        }
      }
    }

    this.section.removeChildNodes();
    this.section.appendChild(node);
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"17":17}],26:[function(require,module,exports){
var protoclass = require(51);

module.exports = function(initialize, update) {

  if (!update) update = function() { };

  /**
   */

  function Binding(ref, view) {
    this.ref              = ref;
    this.view             = view;
    this.template         = view.template;
    this.options          = this.template.options;
    this.attributeClasses = this.options.attributes || {};
    this.initialize();
    this.attrBindings     = {};
  }

  /**
   */

  protoclass(Binding, {

    /**
     */

    initialize: initialize || function() { },

    /**
     */

    update2: update || function() { },

    /**
     */

    setAttribute: function(key, value) {
      if (!this.setAsRegisteredAttribute(key, value)) {
        if (value != void 0) {
          this.ref.setAttribute(key, value);
        } else {
          this.ref.removeAttribute(key);
        }
      }
    },

    /**
     */

    setProperty: function(key, value) {
      if (!this.setAsRegisteredAttribute(key, value)) {

        // no node type? It's a registered component.
        if (!this.ref.nodeType) {
          this.ref.setAttribute(key, value);
        } else {
          this.ref[key] = value;
        }
      }
    },

    /**
     */

    setAsRegisteredAttribute: function(key, value) {
      if (this.attrBindings[key]) {
        this.attrBindings[key].value = value;
      } else {
        var attrClass = this.attributeClasses[key];
        if (attrClass) {
          this.attrBindings[key] = new attrClass(this.ref, key, value, this.view);
        } else {
          return false;
        }
      }
      return true;
    },

    /**
     */

    update: function(context) {
      this.update2(context);
      for(var key in this.attrBindings) {
        this.attrBindings[key].update(context);
      }
    }
  });

  return Binding;
};

},{"51":51}],27:[function(require,module,exports){
module.exports = {
  uppercase: function(value) {
    return String(value).toUpperCase();
  },
  lowercase: function(value) {
    return String(value).toLowerCase();
  },
  titlecase: function(value) {
    var str;

    str = String(value);
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  },
  json: function(value, count, delimiter) {
    return JSON.stringify.apply(JSON, arguments);
  },
  isNaN: function(value) {
    return isNaN(value);
  },
  round: Math.round
};

},{}],28:[function(require,module,exports){
(function (process,global){
var protoclass = require(51);

var rAF = (global.requestAnimationFrame      ||
          global.webkitRequestAnimationFrame ||
          global.mozRequestAnimationFrame    ||
          process.nextTick).bind(global);

/* istanbul ignore next */
if (process.browser) {
  var defaultTick = function(next) {
    rAF(next);
  };
} else {
  var defaultTick = function(next) {
    next();
  };
}

/**
 */

function RunLoop(options) {
  if (!options) options = {};
  this._animationQueue = [];
  this.tick = options.tick || defaultTick;
  this._id = options._id || 2;
}

protoclass(RunLoop, {

  /**
   * child runloop in-case we get into recursive loops
   */

  child: function() {
    return this.__child || (this.__child = new RunLoop({ tick: this.tick, _id: this._id << 2 }));
  },

  /**
   * Runs animatable object on requestAnimationFrame. This gets
   * called whenever the UI state changes.
   *
   * @method animate
   * @param {Object} animatable object. Must have `update()`
   */

  deferOnce: function(context) {

    if (!context.__running) context.__running = 1;

    if (context.__running & this._id) {
      if (this._running) {
        this.child().deferOnce(context);
      }
      return;
    }

    context.__running |= this._id;

    // push on the animatable object
    this._animationQueue.push(context);

    // if animating, don't continue
    if (this._requestingFrame) return;
    this._requestingFrame = true;
    var self = this;

    // run the animation frame, and callback all the animatable objects
    this.tick(function() {
      self.runNow();
      self._requestingFrame = false;
    });
  },

  /**
   */

  runNow: function() {
    var queue = this._animationQueue;
    this._animationQueue = [];
    this._running = true;

    // queue.length is important here, because animate() can be
    // called again immediately after an update
    for (var i = 0; i < queue.length; i++) {
      var item = queue[i];
      item.update();
      item.__running &= ~this._id;

      // check for anymore animations - need to run
      // them in order
      if (this._animationQueue.length) {
        this.runNow();
      }
    }

    this._running = false;
  }
});

module.exports = RunLoop;

}).call(this,require(50),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"50":50,"51":51}],29:[function(require,module,exports){
var ivd                = require(44);
var extend             = require(52);
var createBindingClass = require(26);

/**
 */

module.exports = function(source, options) {

  var vnode;
  var createVNode;

  if (typeof source === "object") {
    vnode = source;
  } else {

    // TODO - use options parser here
    createVNode = typeof source === "string" ? options.compile(source, options) : source;
    vnode       = createVNode(ivd.fragment, ivd.element, ivd.text, ivd.comment, ivd.dynamic, createBindingClass);
  }

  if (!options) options = {};

  if (!options.document && typeof document !== "undefined") {
    options.document = document;
  }

  return ivd.template(vnode, options);
};

},{"26":26,"44":44,"52":52}],30:[function(require,module,exports){
module.exports = {

  /**
   */

  each: function(items, each, complete) {

    var total     = items.length;
    var completed = 0;

    items.forEach(function(item) {
      var called = false;
      each(item, function() {
        if (called) throw new Error("callback called twice");
        called = true;
        if (++completed === total && complete) complete();
      });
    });
  }
};

},{}],31:[function(require,module,exports){
module.exports = function(callback, context) {
  if (callback.bind) return callback.bind.apply(callback, [context].concat(Array.prototype.slice.call(arguments, 2)));
  return function() {
    return callback.apply(context, arguments);
  };
};

},{}],32:[function(require,module,exports){
var ivd            = require(44);
var BaseView       = ivd.View;
var _stringifyNode = require(35);
var Transitions    = require(34);
var Reference      = require(33);
var extend         = require(52);

/**
 */

function _set(target, keypath, value) {

  var keys = typeof keypath === "string" ? keypath.split(".") : keypath;
  var ct = target;
  var key;

  for (var i = 0, n = keys.length - 1; i < n; i++) {
      key = keys[i];
      if (!ct[key]) {
          ct[key] = {};
      }
      ct = ct[key];
  }
  if (ct['_metaClass'] != undefined) {
      ct.setByName(keys[keys.length - 1], value);
  } else {
      ct[keys[keys.length - 1]] = value;
  }
  return value;

}

/**
 */

function PaperclipView(node, template, context, options) {

  if (!options) options = {};

  this.parent       = options.parent;
  this.transitions  = new Transitions();
  this.context      = context || {};
  this._remove      = this._remove.bind(this);

  BaseView.call(this, node, template, context, options);
}

/**
 */

BaseView.extend(PaperclipView, {

  /**
   */

  _getters: {},
  _callers: {},

  /**
   */

   get: function(keypath) {
     if (!this.context) return void 0;
     var keys = typeof keypath === "string" ? keypath.split(".") : keypath;
     var ct = this.context;
     var key;
     for (var i = 0, n = keys.length - 1; i < n; i++) {
         key = keys[i];
         if (!ct[key]) {
             ct[key] = {};
         }
       if (typeof ct[key] == "function") {
         ct = ct[key].apply(ct);
       } else {
         ct = ct[key];
       }
     }
     var getElemName = keys[keys.length - 1];
     if (ct['_metaClass'] != undefined) {
         var metaElem = ct.metaClass().metaByName(getElemName);
         if (metaElem != null) {
             var metaType = metaElem.metaType();
             if (metaType == org.kevoree.modeling.meta.MetaType.ATTRIBUTE) {
                 return ct.getByName(getElemName);
             }
             if (metaType == org.kevoree.modeling.meta.MetaType.RELATION) {
                 var kref = {};
                 kref._kmf_src = ct;
                 kref._kmf_elems = ct.getRelationValuesByName(getElemName);
                 kref._kmf_refName = getElemName;
                 return kref;
             }
         } else {
             if (ct[getElemName] != undefined) {
                 if (typeof ct[getElemName] == "function") {
                     return ct[getElemName].apply(ct);
                 } else {
                     return ct[getElemName];
                 }
             }
         }
         return null;
     } else {
         var pt = typeof keypath !== "string" ? keypath.join(".") : keypath;
         var v;
         try {
             var getter;
             if (!(getter = this._getters[pt])) {
                 getter = this._getters[pt] = new Function("return this." + pt);
             }
             v = getter.call(this.context);
         } catch (e) {
             v = void 0;
         }
         return v != void 0 ? v : this.parent ? this.parent.get(keypath) : void 0;
     }
   },

  /**
   */

  set: function(keypath, value, update) {
    if (!this.context) return void 0;
    if (typeof path === "string") path = path.split(".");
    var ret = _set(this.context, keypath, value);
    this.updateLater();
  },

  /**
   */

  setProperties: function(properties) {
    extend(this.context, properties);
    this.updateLater();
  },

  /**
   */

  ref: function(keypath, gettable, settable) {
    if (!this._refs) this._refs = {};

    return new Reference(this, keypath, gettable, settable);
    // return this._refs[keypath] || (this._refs[keypath] = new Reference(this, keypath, gettable, settable));
  },

  /**
   */

  call: function(keypath, params) {
    var keys = typeof keypath === "string" ? keypath.split(".") : keypath;
    var key;
    var ct = this.context;
    for (var i = 0, n = keys.length - 1; i < n; i++) {
      key = keys[i];
      if (!ct[key]) {
        ct[key] = {};
      }
      if (typeof ct[key] == "function") {
        ct = ct[key].apply(ct);
      } else {
        ct = ct[key];
      }
    }
    var getElemName = keys[keys.length - 1];
    if (ct[getElemName] != undefined) {
      if (typeof ct[getElemName] == "function") {
        return ct[getElemName].apply(ct);
      }
    }

    var caller;
    var v;

    if (typeof keypath !== "string") keypath = keypath.join(".");
    if (!(caller = this._callers[keypath])) {
      var ctxPath = ["this"].concat(keypath.split("."));
      ctxPath.pop();
      ctxPath = ctxPath.join(".");
      caller = this._callers[keypath] = new Function("params", "return this." + keypath + ".apply(" + ctxPath + ", params);");
    }

    try {
      v = caller.call(this.context, params);
    } catch (e) {
    }

    return v != void 0 ? v : this.parent ? this.parent.call(keypath, params) : void 0;
  },

  /**
   */

  updateLater: function() {
    this.runloop.deferOnce(this);
  },

  /**
   * for testing. TODO - move this stuff to sections instead.
   */

  toString: function() {

    // browser DOM?
    if (this.template.section.document && this.template.section.document.body) {
      return _stringifyNode(this.section.start ? this.section.start.parentNode : this.section.node);
    }

    return (this.section.start ? this.section.start.parentNode : this.section.node).toString();
  },

  /**
   */

  render: function() {
    this.update();
    var section = BaseView.prototype.render.call(this);
    this.transitions.enter();
    return section;
  },

  /**
   */

  remove: function() {
    if (this.__context) return;
    if (this.transitions.exit(this._remove)) return;
    this._remove();
    return this;
  },

  /**
   */

  _remove: function() {
    BaseView.prototype.remove.call(this);
  }
});

/**
 */

module.exports = PaperclipView;

},{"33":33,"34":34,"35":35,"44":44,"52":52}],33:[function(require,module,exports){
var protoclass = require(51);

/**
 */

function Reference(view, path, gettable, settable) {
  this.view     = view;
  this.path     = path;
  this.settable = settable !== false;
  this.gettable = gettable !== false;
}

/**
 */

protoclass(Reference, {

  /**
   */

  __isReference: true,

  /**
   */

  value: function(value) {
    if (!arguments.length) {
      return this.gettable ? this.view.get(this.path) : void 0;
    }
    if (this.settable) this.view.set(this.path, value);
  },

  /**
   */

  toString: function() {
    return this.view.get(this.path);
  }
});

module.exports = Reference;

},{"51":51}],34:[function(require,module,exports){
(function (process){
var protoclass = require(51);
var async      = require(30);

/**
 */

function Transitions() {
  this._enter = [];
  this._exit  = [];
}

/**
 */

module.exports = protoclass(Transitions, {

  /**
   */

  push: function(transition) {
    if (transition.enter) this._enter.push(transition);
    if (transition.exit) this._exit.push(transition);
  },

  /**
   */

  enter: function() {
    if (!this._enter.length) return false;
    for (var i = 0, n = this._enter.length; i < n; i++) {
      this._enter[i].enter();
    }
  },

  /**
   */

  exit: function(complete) {
    if (!this._exit.length) return false;
    var self = this;
    process.nextTick(function() {
      async.each(self._exit, function(transition, next) {
        transition.exit(next);
      }, complete);
    });

    return true;
  }
});

}).call(this,require(50))
},{"30":30,"50":50,"51":51}],35:[function(require,module,exports){
/* istanbul ignore next */
function _stringifyNode(node) {

  var buffer = "";

  if (node.nodeType === 11) {
    for (var i = 0, n = node.childNodes.length; i < n; i++) {
      buffer += _stringifyNode(node.childNodes[i]);
    }
    return buffer;
  }

  buffer = node.nodeValue || node.outerHTML || "";

  if (node.nodeType === 8) {
    buffer = "<!--" + buffer + "-->";
  }

  return buffer;
}

module.exports = _stringifyNode;

},{}],36:[function(require,module,exports){
var protoclass    = require(51);
var getNodeByPath = require(37);
var getNodePath   = require(38);

/**
 */

function FragmentSection(document, start, end) {
  this.document = document;

  this.start = start || document.createTextNode("");
  this.end   = end   || document.createTextNode("");

  if (!this.start.parentNode) {
    var parent = document.createDocumentFragment();
    parent.appendChild(this.start);
    parent.appendChild(this.end);
  }
}

/**
 */

protoclass(FragmentSection, {

  /**
   */

  appendChild: function(node) {
    this.end.parentNode.insertBefore(node, this.end);
  },

  /**
   */

  render: function() {
    return this.start.parentNode;
  },

  /**
   */

  remove: function() {
    var node     = this.removeChildNodes();
    node.insertBefore(this.start, node.childNodes[0]);
    node.appendChild(this.end);
    return this;
  },

  /**
   */

  removeChildNodes: function() {
    var node    = this.document.createDocumentFragment();
    var start   = this.start;
    var current = start.nextSibling;
    var end     = this.end;

    while (current !== end) {
      node.appendChild(current);
      current = start.nextSibling;
    }

    return node;
  },

  /**
   */

  createMarker: function() {
    return new Marker(this.document, getNodePath(this.start), getNodePath(this.end));
  },

  /**
   */

  clone: function() {
    var parentClone;

    // fragment?
    if (this.start.parentNode.nodeType === 11) {
      parentClone = this.start.parentNode.cloneNode(true);
    } else {
      parentClone  = this.document.createDocumentFragment();
      var children = this._getChildNodes();
      var n        = children.length;

      for (var i = 0; i < n; i++) {
        parentClone.appendChild(children[i].cloneNode(true));
      }
    }

    var first = parentClone.childNodes[0];
    var last  = parentClone.childNodes[parentClone.childNodes.length - 1];

    return new FragmentSection(this.document, first, last);
  },

  /**
   */

  _getChildNodes: function() {
    var current = this.start;
    var end     = this.end.nextSibling;
    var children = [];
    while (current !== end) {
      children.push(current);
      current = current.nextSibling;
    }
    return children;
  }
});

/**
 */

function Marker(document, startPath, endPath) {
  this.document  = document;
  this.startPath = startPath;
  this.endPath   = endPath;
}

/**
 */

protoclass(Marker, {

  /**
   */

  createSection: function(root) {
    return new FragmentSection(this.document, getNodeByPath(root, this.startPath), getNodeByPath(root, this.endPath));
  }
});

module.exports = FragmentSection;

},{"37":37,"38":38,"51":51}],37:[function(require,module,exports){
module.exports = function(root, path) {

  var c = root;

  for (var i = 0, n = path.length; i < n; i++) {
    c = c.childNodes[path[i]];
  }

  return c;
};

},{}],38:[function(require,module,exports){
module.exports = function(node) {

  var path = [];
  var p    = node.parentNode;
  var c    = node;

  while (p) {

    path.unshift(Array.prototype.indexOf.call(p.childNodes, c));
    c = p;

    p = p.parentNode;

    // virtual nodes - must be skipped
    while (p && p.nodeType > 12) p = p.parentNode;
  }

  return path;
};

},{}],39:[function(require,module,exports){
var protoclass    = require(51);
var getNodeByPath = require(37);
var getNodePath   = require(38);

/**
 */

function NodeSection(document, node) {
  this.document = document;
  this.node     = node;
}

/**
 */

protoclass(NodeSection, {

  /**
   */

  createMarker: function() {
    return new Marker(this.document, getNodePath(this.node));
  },

  /**
   */

  appendChild: function(childNode) {
    this.node.appendChild(childNode);
  },

  /**
   */

  render: function() {
    return this.node;
  },

  /**
   */

  remove: function() {
    if (this.node.parentNode) this.node.parentNode.removeChild(this.node);
  },

  /**
   */

  removeChildNodes: function() {
    while(this.node.childNodes.length) this.node.removeChild(this.childNodes[0]);
  },

  /**
   */

  clone: function() {
    return new NodeSection(this.document, this.node.cloneNode(true));
  }
});

/**
 */

function Marker(document, path) {
  this.document = document;
  this.path     = path;
}

/**
 */

protoclass(Marker, {

  /**
   */

  createSection: function(root) {
    return new NodeSection(this.document, this.findNode(root));
  },

  /**
   */

  findNode: function(root) {
    return getNodeByPath(root, this.path);
  }
});

module.exports = NodeSection;

},{"37":37,"38":38,"51":51}],40:[function(require,module,exports){
var protoclass = require(51);

/**
 */

function Comment(nodeValue) {
  this.nodeValue = nodeValue || "";
  this.target    = this;
}


protoclass(Comment, {
  nodeType: 8,
  freeze: function(options) {
    return options.document.createComment(this.nodeValue);
  }
});

/**
 */

module.exports = function(nodeValue) {
  return new Comment(nodeValue);
};

},{"51":51}],41:[function(require,module,exports){
var protoclass    = require(51);
var getNodePath   = require(38);
var getNodeByPath = require(37);

/**
 */

function DynamicNode(vnode, bindingClass) {
  this.vnode            = vnode;
  this.bindingClass     = bindingClass;
  this.vnode.parentNode = this;
  this.target           = vnode;
}

protoclass(DynamicNode, {
  freeze: function(options, hydrators) {
    if (options.components[this.vnode.nodeName]) {
      return this.freezeComponent(options, hydrators);
    } else {
      return this.freezeElement(options, hydrators);
    }
  },
  freezeComponent: function(options, hydrators) {
    var h2 = [];
    var element = this.vnode.freeze(options, h2);
    hydrators.push(new ComponentHydrator(h2[0], this.bindingClass, options));
    return element;
  },
  freezeElement: function(options, hydrators) {
    var node = this.vnode.freeze(options, hydrators);
    hydrators.push(new Hydrator(node, this.bindingClass, options));
    return node;
  }
});

/**
 */

function Hydrator(ref, bindingClass, options) {
  this.options      = options;
  this.ref          = ref;
  this.bindingClass = bindingClass;
}

/**
 */

protoclass(Hydrator, {

  /**
   */

  hydrate: function(root, view) {
    if (!this._refPath) this._refPath = getNodePath(this.ref);
    view.bindings.push(new this.bindingClass(getNodeByPath(root, this._refPath), view));
  }
});
/**
 */

function ComponentHydrator(hydrator, bindingClass, options) {
  this.options       = options;
  this.hydrator      = hydrator;
  this.bindingClass  = bindingClass;
}

/**
 */

protoclass(ComponentHydrator, {
  hydrate: function(root, view) {
    this.hydrator.hydrate(root, view);
    var component = view.bindings[view.bindings.length - 1];
    view.bindings.splice(view.bindings.indexOf(component), 0, new this.bindingClass(component, view));
  }
});

/**
 */

module.exports = function(vnode, bindingClass) {
  return new DynamicNode(vnode, bindingClass);
};

},{"37":37,"38":38,"51":51}],42:[function(require,module,exports){
var protoclass       = require(51);
var createSection    = require(45);
var fragment         = require(43);
var FragmentSection  = require(36);
var NodeSection      = require(39);

/**
 */

function Element(nodeName, attributes, childNodes) {
  this.nodeName   = String(nodeName).toLowerCase();
  this._nodeNameNoDashes = this.nodeName.replace(/-/g, "");
  this.attributes = attributes || {};
  this.childNodes = childNodes;
  this.target     = this;
  for (var i = childNodes.length; i--;) {
    childNodes[i].parentNode = this;
  }
}

protoclass(Element, {
  nodeType: 1,
  freeze: function(options, hydrators) {

    var components = options.components || {};
    var attributes = options.attributes || {};

    if (components[this._nodeNameNoDashes]) {
      return this._freezeComponent(components[this._nodeNameNoDashes], options, hydrators);
    }

    return this._freezeElement(options, hydrators);
  },
  setAttribute: function(key, value) {
    this.attributes[key] = value;
  },
  _freezeComponent: function(clazz, options, hydrators) {

    // TODO - check parent node to see if there are anymore children. If not, then user NodeSection
    var section = new FragmentSection(options.document);
    hydrators.push(new ComponentHydrator(clazz, section, this, this._splitAttributes(options), options));
    return section.render();
  },
  _freezeElement: function(options, hydrators) {

    var element = options.document.createElement(this.nodeName);

    var inf = this._splitAttributes(options);

    for (var attrName in inf.staticAttributes) {
      element.setAttribute(attrName, inf.staticAttributes[attrName]);
    }

    for (var i = 0, n = this.childNodes.length; i < n; i++) {
      element.appendChild(this.childNodes[i].freeze(options, hydrators));
    }

    if (Object.keys(inf.dynamicAttributes).length) {
      hydrators.push(new ElementAttributeHydrator(new NodeSection(options.document, element), options, inf.dynamicAttributes));
    }

    return element;
  },
  _splitAttributes: function(options) {

    var dynamicAttributes = {};
    var staticAttributes  = {};

    if (options.attributes) {
      for (var key in this.attributes) {
        var attrClass = options.attributes[key];
        if (attrClass && (!attrClass.test || attrClass.test(this, key, this.attributes[key]))) {
          dynamicAttributes[key] = this.attributes[key];
        } else {
          staticAttributes[key]  = this.attributes[key];
        }
      }
    } else {
      staticAttributes = this.attributes;
    }


    return {
      dynamicAttributes : dynamicAttributes,
      staticAttributes  : staticAttributes
    };
  }
})


/**
*/

function ComponentHydrator(clazz, section, element, attrInfo, options) {
  this.clazz                = clazz;
  this.section              = section;
  this.element              = element;
  this.dynamicAttributes    = attrInfo.dynamicAttributes;
  this.attributes           = attrInfo.staticAttributes;
  this.hasDynamicAttributes = !!Object.keys(attrInfo.dynamicAttributes).length;
  this.options              = options;
}


protoclass(ComponentHydrator, {
  hydrate: function(root, view) {
    if (!this._marker) this._marker = this.section.createMarker();
    var ref = new this.clazz(this._marker.createSection(root), this.element, this.attributes, view);
    if (this.hasDynamicAttributes) {
      _hydrateDynamicAttributes(ref, this.options, this.dynamicAttributes, view);
    }
    if (ref.update) view.bindings.push(ref);
  }
})

/**
 */

module.exports = function(name, attributes, children) {
  return new Element(name, attributes, Array.prototype.slice.call(arguments, 2));
};

/**
 */

function ElementAttributeHydrator(section, options, dynamicAttributes) {
  this.section           = section;
  this.options           = options;
  this.dynamicAttributes = dynamicAttributes;
}

protoclass(ElementAttributeHydrator, {
  hydrate: function(root, view) {
    if (!this._marker) this._marker = this.section.createMarker();
    _hydrateDynamicAttributes(this._marker.findNode(root), this.options, this.dynamicAttributes, view);
  }
})

/**
 */

function _hydrateDynamicAttributes(ref, options, dynamicAttributes, view) {
  for (var key in dynamicAttributes) {
    var clazz = options.attributes[key];
    var attr = new clazz(ref, key, dynamicAttributes[key], view);
    if (attr.update) view.bindings.push(attr);
  }
}

},{"36":36,"39":39,"43":43,"45":45,"51":51}],43:[function(require,module,exports){
var protoclass = require(51);

/**
 */

function Fragment(childNodes) {
  this.childNodes = childNodes;
  this.target     = this;
  for (var i = childNodes.length; i--;) childNodes[i].parentNode = this;
}

protoclass(Fragment, {
  nodeType: 11,
  freeze: function(options, hydrators) {

    var fragment = options.document.createDocumentFragment();

    for (var i = 0, n = this.childNodes.length; i < n; i++) {
      fragment.appendChild(this.childNodes[i].freeze(options, hydrators));
    }

    return fragment;
  }
});

/**
 */

module.exports = function(children) {
  if (children.length === 1) return children[0];
  return new Fragment(children);
};

},{"51":51}],44:[function(require,module,exports){
/**
 */

module.exports = {
  element   : require(42),
  fragment  : require(43),
  text      : require(48),
  dynamic   : require(41),
  comment   : require(40),
  template  : require(47),
  View      : require(49)
};

},{"40":40,"41":41,"42":42,"43":43,"47":47,"48":48,"49":49}],45:[function(require,module,exports){
var extend          = require(52);
var FragmentSection = require(36);
var NodeSection     = require(39);

module.exports = function(document, node) {
  if (node.nodeType === 11) {
    var section = new FragmentSection(document);
    section.appendChild(node);
    return section;
  } else {
    return new NodeSection(document, node);
  }
};

},{"36":36,"39":39,"52":52}],46:[function(require,module,exports){
var protoclass = require(51);

module.exports = function(template) {

  function Component(section, vnode, attributes, view) {
    this.section    = section;
    this.vnode      = vnode;
    this.attributes = attributes;
    this.view       = view;

    this.childView = template.view(this.attributes);
    this.section.appendChild(this.childView.render());
  }

  protoclass(Component, {
    template: template,
    setAttribute: function(key, value) {
      this.attributes[key] = value;
    },
    update: function(context) {
      this.childView.update();
    }
  });

  return Component;
}

},{"51":51}],47:[function(require,module,exports){
var View              = require(49);
var protoclass        = require(51);
var extend            = require(52);
var FragmentSection   = require(36);
var NodeSection       = require(39);
var templateComponent = require(46);

function _cleanupComponents(hash) {
  var c1 = hash || {};
  var c2 = {};

  for (var k in c1) {
    if (c1[k].__isTemplate) c1[k]  =  templateComponent(c1[k]);
    c2[k.toLowerCase()] = c1[k];
  }

  return c2;
}

/**
 */

function _cleanupOptions(options) {
  return extend({}, options, {
    components: _cleanupComponents(options.components),
    attributes: options.attributes
  });
}

/**
 */

function Template(vnode, options) {

  this.vnode = vnode;

  // hydrates nodes when the template is used
  this._hydrators = [];

  options = _cleanupOptions(options);

  this.viewClass = options.viewClass || View;
  this.options   = options;
  this.modifiers = options.modifiers || {};

  // freeze & create the template node immediately
  var node = vnode.freeze(options, this._hydrators);

  if (node.nodeType === 11) {
    this.section = new FragmentSection(options.document);
    this.section.appendChild(node);
  } else {
    this.section = new NodeSection(options.document, node);
  }
}

protoclass(Template, {
  __isTemplate: true,
  view: function(context, options) {
    // TODO - make compatible with IE 8
    var section     = this.section.clone();
    var view = new this.viewClass(section, this, context, options);

    var previousListener = null;
    var previousContextPrefix = {};

    if(options != undefined && options['modelContext'] != undefined && options['modelContext']['listen'] != undefined){
      var modelContext = options['modelContext'];
      modelContext.listen(function(){
        var flatCtxReload = {};
        for(var key in context){
          if(context[key] != undefined && context[key]['_metaClass'] != undefined){
            flatCtxReload[context[key].uuid()] = key;
          }
        }
        var toReloadKeys = [];
        for(var uuidKey in flatCtxReload){
          toReloadKeys.push(+uuidKey);
        }
        modelContext.model().lookupAllObjects(modelContext.originUniverse(), modelContext.originTime(), toReloadKeys, function(objects){
          if(objects != undefined){
            for(var i=0;i<objects.length;i++){
              if(objects[i] != undefined){
                var previousCtxKey = flatCtxReload[objects[i].uuid()];
                context[previousCtxKey] = objects[i];
              }
            }
          }
          view.update();
        });
      });
      previousListener = modelContext.model().createListener(modelContext.originUniverse());
      for(var key in context){
        if(context[key] != undefined && context[key]['_metaClass'] != undefined){
          previousListener.listen(context[key]);
          previousContextPrefix[context[key].uuid()] = key;
        }
      }
      previousListener.then(function(object){
        if(object != undefined && object != null){
          if(object.now() >= modelContext.originTime() && object.now() <= modelContext.maxTime()){
            var previousPath = previousContextPrefix[object.uuid()];
            if(previousPath){
              context[previousPath] = object;
              view.update();
            }
          }
        }
      });
    }
    for (var i = 0, n = this._hydrators.length; i < n; i++) {
      this._hydrators[i].hydrate(section.node || section.start.parentNode, view);
    }
    // TODO - set section instead of node
    return view;
  }
});
/**
 */

module.exports = function(vnode, options) {
  return new Template(vnode, options);
};

},{"36":36,"39":39,"46":46,"49":49,"51":51,"52":52}],48:[function(require,module,exports){
var protoclass = require(51);

/**
 */

function Text(nodeValue) {
  this.nodeValue = nodeValue || "";
  this.target    = this;
}

/**
 */

protoclass(Text, {
  freeze: function(options) {
    return options.document.createTextNode(this.nodeValue);
  }
});

/**
 */

module.exports = function(nodeValue) {
  return new Text(nodeValue);
};

},{"51":51}],49:[function(require,module,exports){
var protoclass = require(51);

/**
 */

function View(section, template, context, options) {
  this.section  = section;
  this.bindings = [];
  this.template = template;
  this.options  = options;
  this.context  = context;
  this.runloop  = template.options.runloop;
}

protoclass(View, {
  __isView: true,
  update: function() {
    for (var i = 0, n = this.bindings.length; i < n; i++) {
      this.bindings[i].update();
    }
  },
  render: function() {
    return this.section.render();
  },
  remove: function() {
    return this.section.remove();
  }
});
/**
 */

module.exports = View;

},{"51":51}],50:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],51:[function(require,module,exports){
function _copy (to, from) {

  for (var i = 0, n = from.length; i < n; i++) {

    var target = from[i];

    for (var property in target) {
      to[property] = target[property];
    }
  }

  return to;
}

function protoclass (parent, child) {

  var mixins = Array.prototype.slice.call(arguments, 2);

  if (typeof child !== "function") {
    if(child) mixins.unshift(child); // constructor is a mixin
    child   = parent;
    parent  = function() { };
  }

  _copy(child, parent); 

  function ctor () {
    this.constructor = child;
  }

  ctor.prototype  = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  child.parent    = child.superclass = parent;

  _copy(child.prototype, mixins);

  protoclass.setup(child);

  return child;
}

protoclass.setup = function (child) {


  if (!child.extend) {
    child.extend = function(constructor) {

      var args = Array.prototype.slice.call(arguments, 0);

      if (typeof constructor !== "function") {
        args.unshift(constructor = function () {
          constructor.parent.apply(this, arguments);
        });
      }

      return protoclass.apply(this, [this].concat(args));
    }

    child.mixin = function(proto) {
      _copy(this.prototype, arguments);
    }

    child.create = function () {
      var obj = Object.create(child.prototype);
      child.apply(obj, arguments);
      return obj;
    }
  }

  return child;
}


module.exports = protoclass;
},{}],52:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[1]);
