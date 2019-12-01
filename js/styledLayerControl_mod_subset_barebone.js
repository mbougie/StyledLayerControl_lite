



L.Control.StyledLayerControl = L.Control.Layers.extend({

    ///Extension methods ---- Every control should extend from L.Control and (re-)implement the following methods.
    ////Should return the container DOM element for the control and add listeners on relevant map events. Called on control.addTo(map).
    //// these options are not all baked in and have to be created in this script.  ONly baked in one is position for Control!!!
    //// trick is to check the control script if things are not showing up with the control
    /////Note: the extend function is in the leaflet Class section
    /////Extends the current class given the properties to be included. Returns a Javascript function that is a class constructor (to be called with new).
    //// th extend function returns a function

    /////Inheritance You use L.Class.extend to define new classes, but you can use the same method on any class to inherit from it


    // You already know controls - the zoom control in the top left corner, the scale at the bottom left, the layer switcher at the top right. At their core, an L.Control is an HTML Element that is at a static position in the map container.

    // To make a control, simply inherit from L.Control and implement onAdd() and onRemove(). These methods work in a similar way to their L.Layer counterparts (they run whenever the control is added to or removed from the map), except that onAdd() must return an instance of HTMLElement representing the control. Adding the element to the map is done automatically, and so is removing it.

    ///Note: within this extend function need to stay in the bounds of the 3 functions inside it's sub-functions (cant do console.log outside of functions!)

    options: {
        collapsed: false,
        position: 'topright', 
        autoZIndex: true,
        group_togglers: {
            show: false,
            labelAll: 'All',
            labelNone: 'None'
        },
        groupDeleteLabel: 'Delete the group'
    },


    initialize: function(baseLayers, overlays, options) {
        //// take in the arrays form user input in the script.js and assigns to the "this" object

        console.log("############## initialize ##################################################################################")
        var i,j;

        //// set the options from above /////
        L.Util.setOptions(this, options);
        this._layerControlInputs = [];
        this._layers = [];
        this._lastZIndex = 0;
        this._handlingClick = false;
        this._groupList = [];
        this._domGroups = [];
        this._domGroups_small = [];


        for (i in baseLayers) {
            ///for each layer in baselayers array 
            for (var j in baseLayers[i].layers) {

                ////referencing the private method __addLayerToObject: function(layer, name, group, overlay)
                //// if false attach a radiobutton to div
                this._addLayerToObject(baseLayers[i].layers[j], j, baseLayers[i], false);
            }
        }

        for (i in overlays) {
            ///for each layer in overlays array 
            for (var j in overlays[i].layers) {
                ////referencing the private method __addLayerToObject: function(layer, name, group, overlay)
                //// if true attach a checkbox to div
                this._addLayerToObject(overlays[i].layers[j], j, overlays[i], true);
            }
        }

    },



    onAdd: function() {
        console.log("############## onAdd ####################################################################################")
        //// this method returns an HTMLElement.

        ////creates the _container/_section/_form html elements
        this._initLayout();
        // return this._container;

        this._update();

        ////returns the _container html element created from the above two methods
        return this._container;
    },


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  PRIVATE FUNCTIONS  ///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////// associated with initialize //////////////////////////////////////////////////////////////////////////////////////////////////
    _addLayerToObject: function(layer, name, group, overlay) {
        console.log('---------------------------  _addLayerToObject:   ------------------------------------------------------')
        ////This function is referenced from initialize: function(baseLayers, overlays, options)
        ////It builds the "this" object (object of objects????) in here and label and attach key value to them to destinguish what group they are in


        ////Returns the unique ID of an object, assigning it one if it doesn't have it.
        var id = L.Util.stamp(layer);
        
        console.log(id)
        //// add key/values to layer objecy in the "this" object
        this._layers[id] = {
            layer: layer,
            name: name,
            legend:url_obj[name],
            overlay: overlay
        };

        console.log(id)
        console.log('typeof this._layers:', typeof this._layers )
        console.log('this:',this)


        ////add key/values to the group array
        if (group) {
            //// get the groupID value //////////////////////////
            var groupId = this._groupList.indexOf(group);
            console.log('groupId---------------', groupId)

            // if groupID is -1 then do stuff below
            if (groupId === -1) {
                for (g in this._groupList) {
                    if (this._groupList[g].groupName == group.groupName) {
                        groupId = g;
                        break;
                    }
                }
            }

            if (groupId === -1) {
                ////get 
                groupId = this._groupList.push(group) - 1;
            }
            ////////////////////////////////////////////////////////////

            this._layers[id].group = {
                name: group.groupName, ////get the value from the array in script.js
                id: groupId, ///get the value from the code above
                expanded: group.expanded  ////get the value from the array in script.js
            };
        }

            ////this makes sure that the overlay layers are ALWAYS on top of the baselayers
            if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }

    },


    _initLayout: function() {

        //// associated public function: onAdd() 

        ////Description:
        ////Creates an HTML element with tagName, sets its class to className, and optionally appends it to container element.
        ////creates the _container/_section/_form html elements
        ////creates the element hierarchy
        ////uses the DomUtil.create Utility function to work with the DOM tree.
          
        console.log('---------------------------  _initLayout:   ------------------------------------------------------')



        ////questions:
        /// 1) -why have to use "this" in this function?
        
        /////this creates the element hierarchy
        ////////// used the DomUtil.create Utility function to work with the DOM tree.
        ///-----Creates an HTML element with tagName, sets its class to className, and optionally appends it to container element.  

        //// ------------   FORM   --------------------------------
        ////append a from element to the "this" object
        var form = this._form = L.DomUtil.create('form');


        
        //// ------------   SECTION    --------------------------------
        ////create section element and append form to it then added to the map div using the leaflet method
        // var section = document.createElement('section');   <------------this does the same as the line below
        var section = L.DomUtil.create('section');
        // attach classname to element
        section.className = 'ac-container ' + className + '-list';

        ///append form to section
        section.appendChild(form);


        //// ------------   CONTAINER    --------------------------------
        //////Create the box that holds the panels and add it to the map div using the leaflet method
        var className = 'leaflet-control-layers',
        container = this._container = L.DomUtil.create('div', className);

        // console.log('this:', this)
        // console.log('this._container:-------------------------------------------------------------------------------', this._container)


        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        ///append section to container
        container.appendChild(section);
    },





    /////this is essentially an "iterator" function that loops through the layer array in the "this" object
    _update: function() {
         console.log('---------------------------  _update:   ------------------------------------------------------')
        if (!this._container) {
            return;
        }

        ///////create an empty 
        this._layerControlInputs = [];

        var baseLayersPresent = false,
            overlaysPresent = false,
            i,
            obj;


        ////for each layer in the "this" object run the addItem function.  Note each layer has an associated url with it
        for (i in this._layers) {
            obj = this._layers[i]; /////this is an important object each layer added in the script fucntion is its own unique object

            ////// call the large function below sending the layer to it as an argument0
            this._addItem(obj); 


            /////not sure what these do??????????????
            overlaysPresent = overlaysPresent || obj.overlay;
            baseLayersPresent = baseLayersPresent || !obj.overlay;
        }

    },





    // _addItem: function(obj) {
    //     console.log('---------------------------  _addItem:   ------------------------------------------------------')
    //     console.log('obj---', obj) //// this is the dictionary object from above
        

    //     var groupContainer_small = document.createElement('div'),  ///create an empty div element
    //         input,   //// declare and empty variable to be filled later
    //         checked = this._map.hasLayer(obj.layer),  ///checked if box is declared true in main script

    //         id = 'ac_layer_input_' + obj.layer._leaflet_id, ////create id for div
    //         container; ///declare and empty variable to be filled later
        
    //     console.log('checked------yo---------------------yo--------------------',checked)
        



    //     ///get rid of this code if I can!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //     if (obj.overlay) {
    //         input = document.createElement('input');
    //         input.type = 'checkbox';
    //         input.className = 'leaflet-control-layers-selector menu form-check-input';
    //         input.defaultChecked = checked;
    //         groupContainer_small.className = "menu-item-checkbox";
    //         input.id = id;
        
   
    //     } else {
    //         input = this._createRadioElement('leaflet-base-layers', checked);
    //         groupContainer_small.className = "menu-item-radio";
    //         input.id = id;
    //     }


    //     ////  _layerControlInputs is an empty array
    //     this._layerControlInputs.push(input);
    //     input.layerId = L.Util.stamp(obj.layer);


        //////BIG METHOD explore this first!!!!!!!!!!!!!!!!!!!!!!!
    _addItem: function(obj) {

        console.log('obj---', obj) //// this is the dictionary object created above
        var groupContainer_small = document.createElement('div'),  ///create an empty div element
            input,   //// declare and empty variable to be filled later
            checked = this._map.hasLayer(obj.layer),  ///checked if box is declared true in main script
            id = 'ac_layer_input_' + obj.layer._leaflet_id, ////create id for div
            container; ///declare and empty variable to be filled later
        


        console.log('checked', checked)
        console.log('input', input)



        console.log('obj.overlay', obj.overlay)
        ////add check boxes to object
        if (obj.overlay) {
            console.log(id)
            input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'leaflet-control-layers-selector';
            input.defaultChecked = checked;

            groupContainer_small.className = "menu-item-checkbox";
            input.id = id;
        ////add radio buttons to object
        } else {
            input = this._createRadioElement('leaflet-base-layers', checked);
            groupContainer_small.className = "menu-item-radio";
            input.id = id;
        }




        ////  _layerControlInputs is an empty array
        this._layerControlInputs.push(input);
        input.layerId = L.Util.stamp(obj.layer);

        ////add layer to map with click!!

        console.log('input555555555555555555555555555555555555555555555555555',input)
        L.DomEvent.on(input, 'click', this._onInputClick, this);

        ////create label object for checkboxes
        var name = document.createElement('label');
        name.innerHTML = '<label for="' + id + '">' + obj.name + '</label>';

        

        groupContainer_small.appendChild(input);
        groupContainer_small.appendChild(name);



        ////keep----describe
        var s_expanded = checked ? ' checked = "true" ' : '';

        ////add download/info icons to the appropriate div element
        if (obj.group.id === 1){
            // inputSpans = '<span class = "info_circle" id="' + obj.name + '"></span><span class = "download"></span>';
            // inputLabel = '<label for="' + id + '">' + obj.name + '</label>';
            // groupContainer_small.innerHTML = inputLabel

            // inputElement = '<input id="ac' + obj.group.id + '" name="accordion-12" class="menu" ' + s_expanded + s_type_exclusive + '/>';  <---- don't need this because BOTH are checkboxes now
            inputElement = '<input id="' + id + '" name="accordion-12" class="leaflet-control-layers-selector menu form-check-input" ' + s_expanded + ' type="checkbox"/>';
            inputLabel = '<label for="' + id + '">' + obj.name + '</label>';

            groupContainer_small.className = "menu-item-checkbox";
            groupContainer_small.innerHTML = inputElement + inputLabel;
        }

        if (obj.group.id === 0){
            // groupContainer_small.innerHTML = '<label for="' + id + '">' + obj.name + '</label>';
            inputElement = '<input id="' + id + '" name="leaflet-base-layers" "leaflet-control-layers-selector" ' + s_expanded + ' type="radio"/>';
            inputLabel = '<label for="' + id + '">' + obj.name + '</label>';

            groupContainer_small.className = "menu-item-radio";
            groupContainer_small.innerHTML = inputElement + inputLabel;
        }
        
        // console.log('input------------------bottom', input)
        // /// append the label to the div 
        // groupContainer_small.appendChild(input);
        // groupContainer_small.appendChild(name);



                ////engage the checkboxes so they are added to the map graphic  <---- important line of code
        L.DomEvent.on(groupContainer_small, 'click', this._onInputClick, this);

        ////add the object to the approprate container
        if (obj.overlay) {
            container = this._overlaysList;
        } else {
            container = this._baseLayersList;
        }




        var groupContainer = this._domGroups[obj.group.id];
       console.log('obj.group.id------------------------>', obj.group.id)
 

        console.log('groupContainer----------------------------->', groupContainer)

        ////// leaflet-control-accordion-layers-1 ////////////////////////////////////////////////
        if (!groupContainer) {
            groupContainer = document.createElement('div');
            groupContainer.id = 'leaflet-control-accordion-layers-' + obj.group.id;

            // verify if group is expanded
            console.log('obj.group.expanded----------------ooooooooooooooooooooo', obj.group.expanded)
            var s_expanded = obj.group.expanded ? ' checked = "true" ' : '';

            // verify if type is exclusive  <---- don't need this because BOTH are checkboxes now
            // var s_type_exclusive = this.options.exclusive ? ' type="radio" ' : ' type="checkbox" ';



            /// create article stuff /////////////////////////////////////////////////////////////
            
            article = document.createElement('article');

            if(obj.group.name === 'Base Maps'){article.className = 'ac-marge';}
            else{article.className = 'ac-large';}
            

            //////////////////////////////////////////////////////////////////////////////////////


            // inputElement = '<input id="ac' + obj.group.id + '" name="accordion-12" class="menu" ' + s_expanded + s_type_exclusive + '/>';  <---- don't need this because BOTH are checkboxes now
            inputElement = '<input id="ac' + obj.group.id + '" name="accordion-12" class="menu" ' + s_expanded + ' type="checkbox"/>';
            inputLabel = '<label class="ddd" for="ac' + obj.group.id + '">' + obj.group.name + '</label>';

            groupContainer.innerHTML = inputElement + inputLabel;
            
            ///append article above to groupContainer
            groupContainer.appendChild(article);


            ////append groupContainer to container
            container.appendChild(groupContainer);


            //// NEED THIS
            this._domGroups[obj.group.id] = groupContainer;


            console.log('obj.group.id-------------------------------->', obj.group.id)



        }
            console.log('input.id----------------------------------', input.id)
           


           if(obj.group.id===0){

                console.log('obj.group.id===0---------------------->', groupContainer_small)
               
                groupContainer.getElementsByTagName('article')[0].appendChild(groupContainer_small);

    
            }

            else if(obj.group.id===1){

                console.log('obj.group.id===1------------------------>', groupContainer_small)

                // groupContainer_small  //////
                // inputElement = '<input id="' + input.id + '" name="accordion-3"  class="menu" type="checkbox"/>';
                // inputLabel = '<span class = "square"></span>';
                div_small = document.createElement('div');
                div_small.id = 'leaflet-control-accordion-layers-3';
                // // div_small.innerHTML = inputElement + inputLabel;
                // div_small.innerHTML = inputLabel;

                ////NEW always have to use this !!!!
                console.log('obj---------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', obj)
                div_small = this._createLegend(obj)

                ////article_small //////
                article_small = document.createElement('article');
                article_small.className = 'ac_small';
                article_small.appendChild(div_small);



                groupContainer_small.appendChild(article_small);
                

                //// article  //////
                article.appendChild(groupContainer_small);
    
            }

    },



_createLegend: function(obj) {
    ////need to do it this way because json objects are NOT ordered6uu
    function getColor_irrigation(d) {
        return d === "-9 decrease" ? "#331a00":
               d === "-8" ? "#662506":
               d === "-7" ? "#993404":
               d === "-6" ? "#cc4c02":
               d === "-5" ? "#ec7014":
               d === "-4" ? "#fe9929":
               d === "-3" ? "#fec44f":
               d === "-2" ? "#fee391":
               d === "-1" ? "#fff7bc":
               d === "0 no change" ? "#fff7fb":
               d === "1" ? "#ece7f2":
               d === "2" ? "#d0d1e6":
               d === "3" ? "#a6bddb":
               d === "4" ? "#74a9cf":
               d === "5" ? "#3690c0":
               d === "6" ? "#0570b0":
               d === "7" ? "#045a8d":
               d === "8" ? "#023858":
               d === "9 increase" ? "#000033":
                            "purple";
    }


    div = document.createElement('div');
    div.className = 'legend_squares'
    div.id = 'leaflet-control-accordion-layers-3';


    console.log('this._groupList[1].layers', this._groupList[1].layers)
    console.log(obj.name)
    console.log(obj.legend.legend)


    if(obj.name==='Low capability land'){
        // div.className = 'legend_squares'
        inputLabel = '<i style="background:orange"></i>';
        div.innerHTML = inputLabel;
        return div;
        }
    
    else if(obj.name==='Recently abandoned land'){
        // div.className = 'legend_squares'
        inputLabel = '<i style="background:#045a8d"></i>';
        div.innerHTML = inputLabel;
        return div;
        }

    else if(obj.name==='Formerly irrigated land'){
        labels = ['<strong>Change in irrigation frequency</strong>'];

        for (var i = 0; i < obj.legend.legend.length; i++) {

            console.log('i', i)
            console.log('url_obj.irrigation.legend[i]', obj.legend.legend[i])

        div.innerHTML += 
        labels.push(
            '<i style="background:' + getColor_irrigation(obj.legend.legend[i]) + '"></i> ' +
        (obj.legend.legend[i] ? obj.legend.legend[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
        return div;
        }
    }
 


}); ///////// END OF L.Control.Layers.extend method ////////////////////////////////////////







//////////////////// call the function???method instantiate the class above?????????????? ///////////////////////////////////////////////
L.Control.styledLayerControl = function(baseLayers, overlays, options) {
    return new L.Control.StyledLayerControl(baseLayers, overlays, options);
};
