var Base = require("./base");

module.exports = Base.extend({
  initialize: function() {
    this.node.addEventListener( "click", function( event ){ if(this.value != undefined){ this.value();} }.bind(this) );
  },
  update: function() {
  }
});
