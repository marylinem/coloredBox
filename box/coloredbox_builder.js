(function () {

    let template = document.createElement("template");
    template.innerHTML = `
    <div class="sapUiBody" id="content">
    <button id="selModel" type="button">Select Model</button>
    <br>
    <br>
    <div class="selectdiv">
    <label for="selMeasure">Select Measure<br></label>
    <select id="selMeasure">
        <option>--NONE--</option>
    </select>
    </div>

    <br>
    <div class="selectdiv">
    <label for="selDim0">Select Events<br></label>
    <select id="selDim0">
        <option>--NONE--</option>
    </select>
    </div>

    <br>
    <div class="selectdiv">
    <label for="selDim1">Select Relation<br></label>
    <select id="selDim1">
        <option>--NONE--</option>
    </select>
    </div>

    <br>
    <div class="selectdiv">
    <label for="selDim2">Select Timestamp<br></label>
    <select id="selDim2">
        <option>--NONE--</option>
    </select>
    </div>

    <br>
    <button id="createModel" type="button">Apply</button>
	<br>
    </div>

    <style>
    :host {
    display: block;
    padding: 1em 1em 1em 1em;
    }
    #selModel, #createModel {
        background: #346187;
        border-radius: 3px;
        color: #fff;
        text-shadow: none;
        line-height: 1.5rem;
        cursor: pointer;
        white-space: normal;
        text-align: center;
        height: 26px;
        vertical-align: middle;
        margin: 0 4px;
        padding: 0 0.5rem;
        min-width: 2rem;
        height: 26px;
        font-size: .875rem;
    }
    label {
        font-size: 1.125rem;
        font-weight: 400;
        cursor: pointer;
        margin-right: 2rem;
        font-family: "72fallback","72","72full",Arial,Helvetica,sans-serif;
        font-size: 1.25rem;
        text-decoration: none;
        color: #666;
        line-height: 1.75;
        margin-left: 0.25rem;
    }
    .selectdiv {
        height: 40px;
        width: 100%;
        overflow: hidden;
        position: relative;
        border-radius: 3px;
        margin-bottom: 1em;
      }
      
      .selectdiv::before {
            content: ">";
            transform: rotateZ(90deg);
            transition-duration: 500ms;
            color: #346187;
            font-size: 2rem;
            text-align: center;
            cursor: pointer;
            line-height: 2rem;
            width: 1.5rem;
            margin: 0 0.75rem;          
      }
      
      select::-ms-expand {
      display: none;
      }
      
      .selectdiv select {
        height: 40px;
        width: 100%;
        padding: 5px 15px;
        color: #616263;
        background-color: #ececec;
        border: 1px solid #e3e3e3;
        outline: none;
        font-size: 16px;
        -webkit-appearance: none;
        /* for webkit browsers */
        -moz-appearance: none;
        /* for firefox */
        appearance: none;
        /* for modern browsers */
        
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