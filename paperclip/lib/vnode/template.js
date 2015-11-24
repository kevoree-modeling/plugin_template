var View              = require("./view");
var protoclass        = require("protoclass");
var extend            = require("xtend/mutable");
var FragmentSection   = require("./_fragment-section");
var NodeSection       = require("./_node-section");
var templateComponent = require("./template-component");

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
