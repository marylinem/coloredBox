(function () {

    let template = document.createElement("template");
    template.innerHTML = `
    <div class="sapUiBody" id="content">
    <button id="selModel" type="button">Select Model</button>
    <br>
    <br>
    <label for="selMeasure">Select Measure<br></label>
    <select id="selMeasure">
        <option>--NONE--</option>
    </select>
    <br>
    <br>
    <label for="selDim0">Select Events<br></label>
    <select id="selDim0">
        <option>--NONE--</option>
    </select>
    <br>
    <br>
    <label for="selDim1">Select Relation<br></label>
    <select id="selDim1">
        <option>--NONE--</option>
    </select>
    <br>
    <br>
    <label for="selDim2">Select Timestamp<br></label>
    <select id="selDim2">
        <option>--NONE--</option>
    </select>
    <br>
    <br>
    <button id="createModel" type="button">Apply</button>
    <br>
    <br>
    </div>
	<script
    id="sap-ui-bootstrap"
    src="https://sdk.openui5.org/resources/sap-ui-core.js"
    data-sap-ui-theme="sap_belize"
    data-sap-ui-libs="sap.m"
    data-sap-ui-compatVersion="edge"
    data-sap-ui-async="true"
    data-sap-ui-onInit="module:sap/ui/demo/walkthrough/webapp/index"
    data-sap-ui-resourceroots='{
        "sap.ui.demo.walkthrough": "./"
    }'>
	<button id="2" type="button">another Apply</button>
    </script>
    <style>
    :host {
    display: block;
    padding: 1em 1em 1em 1em;
    }
    </style>
    `;

	class ColoredBoxBuilderPanel extends HTMLElement {
		constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            //new sap.m.Button({ text: "Test Button" }).placeAt("builderContent");

            this._shadowRoot.getElementById("selModel").onclick = (ev) => {
                if (this.dataBindings) {
                    const db = this.dataBindings.getDataBinding('flowChartData');
                    if (db) {
                        db.openSelectModelDialog();
                    }
                }
                this._submit(ev);
            };
            this._shadowRoot.getElementById("createModel").onclick = async (ev) => {
                await this.createModel();
                this._submit(ev);
            };
        }
        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                    }
                }
            }));
        }

        setOptions(dimensions, dim, newVal = undefined) {
            dim.options.length = dimensions.length + 1;
            const val = newVal || dim.value;
            dimensions.forEach((d, i) => {
                dim.options[i + 1] = new Option(d.description, d.id, undefined, d.id == val);
            });
        }

        async updateSelector(initialUpdate) {

        }

        async onCustomWidgetAfterUpdate() {
            console.log("onCustomWidget");
            if (this.dataBindings) {
                const db = this.dataBindings.getDataBinding('flowChartData');
                let dbDims = db.getDimensions("dimensions");
                let dbMeas = db.getMembers("measures");
                if (db) {
                    const ds = await db.getDataSource();
                    if (ds) {
                        const dimensions = await ds.getDimensions();
                        const measures = await ds.getMeasures();
                        const dim0 = this._shadowRoot.getElementById("selDim0");
                        const dim1 = this._shadowRoot.getElementById("selDim1");
                        const dim2 = this._shadowRoot.getElementById("selDim2");
                        const meas = this._shadowRoot.getElementById("selMeasure");

                        this.setOptions(dimensions, dim0, dbDims?.[0]);
                        this.setOptions(dimensions, dim1, dbDims?.[1]);
                        this.setOptions(dimensions, dim2, dbDims?.[2]);
                        this.setOptions(measures, meas, dbMeas?.[0]);
                    }
                }
            }
        }

        async createModel() {
            console.log("createModel");
            const dim0 = this._shadowRoot.getElementById("selDim0");
            const dim1 = this._shadowRoot.getElementById("selDim1");
            const dim2 = this._shadowRoot.getElementById("selDim2");
            const meas = this._shadowRoot.getElementById("selMeasure");
            const d0v = dim0.value;
            const d1v = dim1.value;
            const d2v = dim2.value;
            const mv = meas.value;
            if (this.dataBindings && d0v && d1v && d2v && mv) {
                const db = this.dataBindings.getDataBinding('flowChartData');
                if (db) {
                    const oldDims = db.getDimensions("dimensions");
                    /* // Not working...
                    console.log("OldDims:", oldDims);
                    await oldDims.forEach(async (id) => {
                        await db.removeDimension(id);
                    });
                    const oldMeas = db.getMembers("measures");
                    oldMeas.forEach(async (id) => {
                        await db.removeMember(id);
                    });
                    */

                    await db.addMemberToFeed("measures", mv);
                    await db.addDimensionToFeed("dimensions", d0v, 0);
                    await db.addDimensionToFeed("dimensions", d1v, 1);
                    await db.addDimensionToFeed("dimensions", d2v, 2);
                }
            }
        }
    }
	customElements.define("com-sap-sample-coloredbox-builder", ColoredBoxBuilderPanel); //define a new HTML element and its tag, bind the class name 
})();