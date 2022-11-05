sap.ui.define([
    "sap/ui/core/mvc/Controller"
 ], function (Controller) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.webapp.controller.App", {
       onShowHello : function () {
          alert("Hello World");
       }
    });
 });