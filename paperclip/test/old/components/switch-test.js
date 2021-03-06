var assert     = require("assert"),
pc             = require("../../..")
template       = pc.template,
stringifyView = require("../utils/stringifyView");

/*

var tpl = paperclip.template("abba")
*/

describe(__filename + "#", function () {


  it("can show conditional content", function () {
    var v = pc.template(
      "a <switch>" +
        "<show when={{true}}>" +
          "b" +
        "</show>" +
      "</switch>"
    , pc).view({});


    assert.equal(stringifyView(v), "a b");
  });

  it("cascades show statements", function () {
    var v = pc.template(
      "a <switch>" +
        "<show when={{false}}>" +
          "b" +
        "</show>" +
        "<show when={{true}}>" +
          "c" +
        "</show>" +
      "</switch>"
    , pc).view({});


    assert.equal(stringifyView(v), "a c");
  });

  it("shows an item if there is now 'when' attribute", function () {
    var v = pc.template(
      "a <switch>" +
        "<show when={{false}}>" +
          "b" +
        "</show>" +
        "<show>" +
          "c" +
        "</show>" +
        "<show when={{false}}>" +
          "d" +
        "</show>" +
      "</switch>"
    , pc).view({});


    assert.equal(stringifyView(v), "a c");
  });

  it("doesn't show any items if there are no matches", function () {
    var v = pc.template(
      "a <switch>" +
        "<show when={{false}}>" +
          "b" +
        "</show>" +
        "<show when={{false}}>" +
          "d" +
        "</show>" +
      "</switch>"
    , pc).view({});


    assert.equal(stringifyView(v), "a ");
  });

  it("dynamically toggles between show statements", function () {
    var v = pc.template(
      "a <switch>" +
        "<show when={{a}}>" +
          "b" +
        "</show>" +
        "<show when={{b}}>" +
          "c" +
        "</show>" +
        "<show when={{c}}>" +
          "d" +
        "</show>" +
      "</switch>"
    , pc).view({});


    assert.equal(stringifyView(v), "a ");
    v.set("a", true);
    // v.runloop.runNow();
    assert.equal(stringifyView(v), "a b");
    v.set("a", false);
    v.set("b", true);
    // v.runloop.runNow();
    assert.equal(stringifyView(v), "a c");
    v.set("b", false);
    v.set("c", true);
    // v.runloop.runNow();
    assert.equal(stringifyView(v), "a d");
    v.set("a", true);
    // v.runloop.runNow();
    assert.equal(stringifyView(v), "a b");
  });

  it("can embed a switch statement", function () {
    var v = pc.template(
      "a <switch>" +
        "<show when={{a}}>" +
          "<switch>" +
            "<show when={{a2}}>" +
              "b2" +
            "</show>" +
            "<show when={{a3}}>" +
              "b3" +
            "</show>" +
            "<show>" +
              "b4" +
            "</show>" +
          "</switch>" +
        "</show>" +
        "<show when={{b}}>" +
          "c" +
        "</show>" +
      "</switch>"
    , pc).view({});

    assert.equal(stringifyView(v), "a ");
    v.set("a", true);
    // v.runloop.runNow();
    assert.equal(stringifyView(v), "a b4");
    v.set("a2", true);
    // v.runloop.runNow();
    assert.equal(stringifyView(v), "a b2");
    v.set("a2", false);
    v.set("a3", true);
    // v.runloop.runNow();
    assert.equal(stringifyView(v), "a b3");
    v.set("a", false);
    v.set("b", true);
    // v.runloop.runNow();
    assert.equal(stringifyView(v), "a c");
  });

  it("shows the else if when is undefined", function () {
    var v = pc.template(
      "a <switch>" +
        "<show when={{undefined}}>" +
          "b" +
        "</show>" +
        "<show>" +
          "c" +
        "</show>" +
      "</switch>"
    , pc).view({});

    assert.equal(stringifyView(v), "a c");
  });

  it("can rebind to a different context", function () {
    var tpl = template("<switch><show>{{name}}</show></switch>", pc);
    var v = tpl.view({name:"a"});
    assert.equal(stringifyView(v), "a");
    v.context = {name:"b"};
    v.update();
    assert.equal(stringifyView(v), "b");
  });
});
