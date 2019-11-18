L.Control.StyledLayerControl = L.Control.Layers.extend({
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
        yo: true,
        group_togglers: {
            show: false,
            labelAll: 'All',
            labelNone: 'None'
        },
        groupDeleteLabel: 'Delete the group'
    },


    initialize: function(baseLayers, overlays, options) {
        //////////////////////////////////////////////////
        ////Create the 'this' object
        /////////////////////////////////////////////////////


        ////calls one private function


        //// take in the arrays form user input in the script.js and assigns to a "this" object
        /////////////is the "this" object empty initially
        //////////// in this section initialize the this object and append key/value pairs to it??
        console.log('______________________start____________________________________________', this)
        console.log("############## initialize #######################################")
        var i,j;
        L.Util.setOptions(this, options);
        this._layerControlInputs = [];
        this._layers = [];
        // console.log('dssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', this._layers)
        this._lastZIndex = 0;
        this._handlingClick = false;
        this._groupList = [];
        this._domGroups = [];

        for (i in baseLayers) {
            ///for each layer in baselayer get 
            console.log('i---------------',i)
            console.log('baseLayers[i].layers', baseLayers[i].layers)
            for (var j in baseLayers[i].layers) {
                console.log('this------------baseLayers-----------------------------', this)
                console.log('j-----------',j)
                console.log('baseLayers[i]-----------',baseLayers[i])   ///// this is the object sent from script.js
                console.log('baseLayers[i].layers[j]-----------',baseLayers[i].layers[j])
                


                ////_addLayer: function(layer, name, group, overlay)
                //// if false attach a radiobutton to div
                this._addLayerToObject(baseLayers[i].layers[j], j, baseLayers[i], false);
            }
        }

        for (i in overlays) {
            console.log('i--------- overlays ------',i)
            for (var j in overlays[i].layers) {
                console.log('this------------overlays---------------------------', this)
                console.log('j------ overlays -----',j)

                ////_addLayer: function(layer, name, group, overlay)
                //// if true attach a checkbox to div
                this._addLayerToObject(overlays[i].layers[j], j, overlays[i], true);
            }
        }

        console.log('_________________________end______________________________________', this)

    },



    onAdd: function() {

        ///Extension methods ---- Every control should extend from L.Control and (re-)implement the following methods.
        ////Should return the container DOM element for the control and add listeners on relevant map events. Called on control.addTo(map).
        //// this method returns an HTMLElement.

        console.log("############## onAdd #######################################")

        console.log('this *******************************>>>>>>>>>>>>>>>>>>>>>>>>>>   overlays', this)
        
        ////this function creates the div elemets and attach class/id to the div
        this._initLayout();

        this._update();

        // map
        //     .on('layeradd', this._onLayerChange, this)
        //     .on('layerremove', this._onLayerChange, this)
        //     .on('zoomend', this._onZoomEnd, this);

        return this._container;
    },

    onRemove: function(map) {
        console.log("############## onRemove #######################################")
        // map
        //     .off('layeradd', this._onLayerChange)
        //     .off('layerremove', this._onLayerChange);
    },


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  PRIVATE FUNCTIONS  ///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    _addLayerToObject: function(layer, name, group, overlay) {
        ////this function is referenced from the initialize: function(baseLayers, overlays, options)
        ////build all the layer object in here and label and attach key value to them to destinguish what group they are in


        ////Returns the unique ID of an object, assigning it one if it doesn't have it.
        var id = L.Util.stamp(layer);

        //// add key/values to layer object in the this object
        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };

        console.log('this._layers', this._layers)
        console.log('this._layers[id]', this._layers[id])


        ///////////////// not sure what the rest of this coe is???????????????????
        if (group) {
            var groupId = this._groupList.indexOf(group);
            console.log('groupId----pppp', groupId)

            // if not find the group search for the name
            if (groupId === -1) {
                for (g in this._groupList) {
                    if (this._groupList[g].groupName == group.groupName) {
                        groupId = g;
                        break;
                    }
                }
            }

            if (groupId === -1) {
                groupId = this._groupList.push(group) - 1;
            }

            this._layers[id].group = {
                name: group.groupName,
                id: groupId,
                expanded: group.expanded,
                removable: group.removable
            };
        }

        if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }
    },


    _initLayout: function() {
        //////////////////////////////////////////////////////
        ////creates the _container/_section/_form
        /////////////////////////////////////////////////////

        console.log('_initLayout -----------9999999999999999999999999999999999999999999999999999this-----------------', this)


        ////questions:
        /// 1) -why have to use "this" in this function?
        
        /////this creates the element arrangement (could do this html as well???)
        ////////// used the DomUtil.create Utility function to work with the DOM tree.  <----- could also use document.createElement() as well
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

        console.log('this:', this)
        console.log('this._container:-------------------------------------------------------------------------------', this._container)


        this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
        this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

        ///append section to container
        container.appendChild(section);
    },



    _update: function() {
        if (!this._container) {
            return;
        }


        ///////////why have this????
        // this._baseLayersList.innerHTML = '';
        // this._overlaysList.innerHTML = '';


        ///////////why have this????
        // this._domGroups.length = 0;



        ///////create an empty 
        this._layerControlInputs = [];

        var baseLayersPresent = false,
            overlaysPresent = false,
            i,
            obj;

        for (i in this._layers) {
            obj = this._layers[i]; /////this is an important object each layer added in the script fucntion is its own unique object
            console.log('i:', i)
            console.log('obj:', obj)
            this._addItem(obj); ////// call the large function below!!!!!!!!!!!!!!!!!!!!!!!
            overlaysPresent = overlaysPresent || obj.overlay;
            baseLayersPresent = baseLayersPresent || !obj.overlay;
        }

    },




////// last method /////////////////////////////////
    _addItem: function(obj) {

        console.log('obj---', obj) //// this is the dictionary object created above
        var label = document.createElement('div'),  ///create an empty div element
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

            label.className = "menu-item-checkbox";
            input.id = id;
        ////add radio buttons to object
        } else {
            input = this._createRadioElement('leaflet-base-layers', checked);
            label.className = "menu-item-radio";
            input.id = id;
        }




        ////  _layerControlInputs is an empty array
        this._layerControlInputs.push(input);
        input.layerId = L.Util.stamp(obj.layer);

        ////add layer to map with click!!
        L.DomEvent.on(input, 'click', this._onInputClick, this);

        ////create label object for checkboxes
        var name = document.createElement('label');
        name.innerHTML = '<label for="' + id + '">' + obj.name + '</label>';

        console.log(input)

        label.appendChild(input);
        label.appendChild(name);


        if (obj.overlay) {
            container = this._overlaysList;
        } else {
            container = this._baseLayersList;
        }

        var groupContainer = this._domGroups[obj.group.id];

        if (!groupContainer) {
            console.log('pre interaction method (I think)')

            groupContainer = document.createElement('div');
            groupContainer.id = 'leaflet-control-accordion-layers-' + obj.group.id;

            // verify if group is expanded
            var s_expanded = obj.group.expanded ? ' checked = "true" ' : '';

            // verify if type is exclusive
            var s_type_exclusive = this.options.exclusive ? ' type="radio" ' : ' type="checkbox" ';

            inputElement = '<input id="ac' + obj.group.id + '" name="accordion-12" class="menu" ' + s_expanded + s_type_exclusive + '/>';
            inputLabel = '<label for="ac' + obj.group.id + '">' + obj.group.name + '</label>';

            article = document.createElement('article');
            article.className = 'ac-large';
            article.appendChild(label);

            // process options of ac-large css class - to options.group_maxHeight property
            if (this.options.group_maxHeight) {
                article.style.maxHeight = this.options.group_maxHeight;
            }

            groupContainer.innerHTML = inputElement + inputLabel;
            groupContainer.appendChild(article);

            // Link to toggle all layers  
            if (obj.overlay && this.options.group_togglers.show) {

                // Toggler container
                var togglerContainer = L.DomUtil.create('div', 'group-toggle-container', groupContainer);

                // Link All
                var linkAll = L.DomUtil.create('a', 'group-toggle-all', togglerContainer);
                linkAll.href = '#';
                linkAll.title = this.options.group_togglers.labelAll;
                linkAll.innerHTML = this.options.group_togglers.labelAll;
                linkAll.setAttribute("data-group-name", obj.group.name);

                if (L.Browser.touch) {
                    L.DomEvent
                        .on(linkAll, 'click', L.DomEvent.stop)
                        .on(linkAll, 'click', this._onSelectGroup, this);
                } else {
                    L.DomEvent
                        .on(linkAll, 'click', L.DomEvent.stop)
                        .on(linkAll, 'focus', this._onSelectGroup, this);
                }

                // Separator
                var separator = L.DomUtil.create('span', 'group-toggle-divider', togglerContainer);
                separator.innerHTML = ' / ';

                // Link none
                var linkNone = L.DomUtil.create('a', 'group-toggle-none', togglerContainer);
                linkNone.href = '#';
                linkNone.title = this.options.group_togglers.labelNone;
                linkNone.innerHTML = this.options.group_togglers.labelNone;
                linkNone.setAttribute("data-group-name", obj.group.name);

                if (L.Browser.touch) {
                    L.DomEvent
                        .on(linkNone, 'click', L.DomEvent.stop)
                        .on(linkNone, 'click', this._onUnSelectGroup, this);
                } else {
                    L.DomEvent
                        .on(linkNone, 'click', L.DomEvent.stop)
                        .on(linkNone, 'focus', this._onUnSelectGroup, this);
                }

                if (obj.overlay && this.options.group_togglers.show && obj.group.removable) {
                    // Separator
                    var separator = L.DomUtil.create('span', 'group-toggle-divider', togglerContainer);
                    separator.innerHTML = ' / ';
                }

                if (obj.group.removable) {
                    // Link delete group
                    var linkRemove = L.DomUtil.create('a', 'group-toggle-none', togglerContainer);
                    linkRemove.href = '#';
                    linkRemove.title = this.options.groupDeleteLabel;
                    linkRemove.innerHTML = this.options.groupDeleteLabel;
                    linkRemove.setAttribute("data-group-name", obj.group.name);

                }

            }

            container.appendChild(groupContainer);

            this._domGroups[obj.group.id] = groupContainer;
        } else {
            console.log("dsdsd")
            groupContainer.getElementsByTagName('article')[0].appendChild(label);
        }


        return label;
    },

}); ///////// END OF L.Control.Layers.extend method ////////////////////////////////////////







//////////////////// call the function???method instantiate the class above?????????????? ///////////////////////////////////////////////
L.Control.styledLayerControl = function(baseLayers, overlays, options) {
    return new L.Control.StyledLayerControl(baseLayers, overlays, options);
};
