sap.ui.define([
    "sap/ui/core/mvc/XMLView"
], function (XMLView) {
    "use strict";
    alert("Code funktioniert")

    XMLView.create({
        viewName: "sap.ui.demo.walkthrough.webapp.view.App"
    }).then(function (oView) {
        oView.placeAt("content");
    });

});