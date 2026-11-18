/* Source: https://github.com/zveronline/mario (CC BY-NC-SA) */
/* GameStartr/InputWritr/InputWritr.js */
;
/**
 * InputWritr
 * A general utility for automating interactions with user-called events linked
 * with callbacks. Pipe functions are available that take in user input, switch
 * on the event code, and call the appropriate callback. These Pipe functions
 * can be made during runtime; further utilities allow for saving and playback
 * of input histories in JSON format.
 * @example
 * // Creating and using an InputWritr to log keystrokes on the 'a' key.
 * var InputWriter = new InputWritr({
 *     "triggers": {
 *         "onkeydown": {
 *             "65": function () : void {
 *                 console.log("Hello!");
 *             }
 *         }
 *     }
 * });
 * document.body.onkeydown = InputWriter.makePipe("onkeydown", "keyCode");
 * @example
 * // Creating and using an InputWritr to simulate WASD arrow controls.
 * var InputWriter = new InputWritr({
 *     "triggers": {
 *         "aliases": {
 *             "up": [87, 38],    // w, up
 *             "right": [68, 39], // d, right
 *             "down": [83, 40],  // s, down
 *             "left": [65, 37],  // a, left
 *         },
 *         "onkeydown": {
 *             "up": console.log.bind(console, "up"),
 *             "right": console.log.bind(console, "right"),
 *             "down": console.log.bind(console, "down"),
 *             "left": console.log.bind(console, "left"),
 *         }
 *     }
 * });
 * document.body.onkeydown = InputWriter.makePipe("onkeydown", "keyCode");
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var InputWritr = (function () {
    /**
     * Resests the InputWritr.
     *
     * @constructor
     * @param {IInputWritrSettings} settings
     */
    function InputWritr(settings) {
        if (!settings.triggers) {
            throw new Error("No triggers given to InputWritr.");
        }
        this.triggers = settings.triggers;
        // Headless browsers like PhantomJS might not know performance, so 
        // Date.now is used as a backup
        if (typeof settings.getTimestamp === "undefined") {
            if (typeof performance === "undefined") {
                this.getTimestamp = function () {
                    return Date.now();
                };
            }
            else {
                this.getTimestamp = (performance.now || performance.webkitNow || performance.mozNow || performance.msNow || performance.oNow).bind(performance);
            }
        }
        else {
            this.getTimestamp = settings.getTimestamp;
        }
        this.eventInformation = settings.eventInformation;
        this.canTrigger = settings.hasOwnProperty("canTrigger") ? settings.canTrigger : true;
        this.isRecording = settings.hasOwnProperty("isRecording") ? settings.isRecording : true;
        this.history = {};
        this.histories = {
            "length": 0
        };
        this.aliases = {};
        this.addAliases(settings.aliases || {});
        this.keyAliasesToCodes = settings.keyAliasesToCodes || {
            "shift": 16,
            "ctrl": 17,
            "space": 32,
            "left": 37,
            "up": 38,
            "right": 39,
            "down": 40
        };
        this.keyCodesToAliases = settings.keyCodesToAliases || {
            "16": "shift",
            "17": "ctrl",
            "32": "space",
            "37": "left",
            "38": "up",
            "39": "right",
            "40": "down"
        };
    }
    /**
     * Clears the currently tracked inputs history and resets the starting time,
     * and (optionally) saves the current history.
     *
     * @param {Boolean} [keepHistory]   Whether the currently tracked history
     *                                  of inputs should be added to the master
     *                                  Array of histories (defaults to true).
     */
    InputWritr.prototype.restartHistory = function (keepHistory) {
        if (keepHistory === void 0) { keepHistory = true; }
        if (keepHistory) {
            this.saveHistory(this.history);
        }
        this.history = {};
        this.startingTime = this.getTimestamp();
    };
    /* Simple gets
    */
    /**
     * @return {Object} The stored mapping of aliases to values.
     */
    InputWritr.prototype.getAliases = function () {
        return this.aliases;
    };
    /**
     * @return {Object} The stored mapping of aliases to values, with values
     *                  mapped to their equivalent key Strings.
     */
    InputWritr.prototype.getAliasesAsKeyStrings = function () {
        var output = {}, alias;
        for (alias in this.aliases) {
            if (this.aliases.hasOwnProperty(alias)) {
                output[alias] = this.getAliasAsKeyStrings(alias);
            }
        }
        return output;
    };
    /**
     * @param {Mixed} alias   An alias allowed to be passed in, typically a
     *                        character code.
     * @return {String[]}   The mapped key Strings corresponding to that alias,
     *                      typically the human-readable Strings representing
     *                      input names, such as "a" or "left".
     */
    InputWritr.prototype.getAliasAsKeyStrings = function (alias) {
        return this.aliases[alias].map(this.convertAliasToKeyString.bind(this));
    };
    /**
     * @param {Mixed} alias   The alias of an input, typically a character
     *                        code.
     * @return {String} The human-readable String representing the input name,
     *                  such as "a" or "left".
     */
    InputWritr.prototype.convertAliasToKeyString = function (alias) {
        if (alias.constructor === String) {
            return alias;
        }
        if (alias > 96 && alias < 105) {
            return String.fromCharCode(alias - 48);
        }
        if (alias > 64 && alias < 97) {
            return String.fromCharCode(alias);
        }
        return typeof this.keyCodesToAliases[alias] !== "undefined" ? this.keyCodesToAliases[alias] : "?";
    };
    /**
     * @param {Mixed} key   The number code of an input.
     * @return {Number} The machine-usable character code of the input.
     *
     */
    InputWritr.prototype.convertKeyStringToAlias = function (key) {
        if (key.constructor === Number) {
            return key;
        }
        if (key.length === 1) {
            return key.charCodeAt(0) - 32;
        }
        return typeof this.keyAliasesToCodes[key] !== "undefined" ? this.keyAliasesToCodes[key] : -1;
    };
    /**
     * Get function for a single history, either the current or a past one.
     *
     * @param {String} [name]   The identifier for the old history to return. If
     *                          none is provided, the current history is used.
     * @return {Object}   A history of inputs in JSON-friendly form.
     */
    InputWritr.prototype.getHistory = function (name) {
        if (name === void 0) { name = undefined; }
        return arguments.length ? this.histories[name] : history;
    };
    /**
     * @return {Object} All previously stored histories.
     */
    InputWritr.prototype.getHistories = function () {
        return this.histories;
    };
    /**
     * @return {Boolean} Whether this is currently allowing inputs.
     */
    InputWritr.prototype.getCanTrigger = function () {
        return this.canTrigger;
    };
    /**
     * @return {Boolean} Whether this is currently recording allowed inputs.
     */
    InputWritr.prototype.getIsRecording = function () {
        return this.isRecording;
    };
    /* Simple sets
    */
    /**
     * @param {Mixed} canTriggerNew   Whether this is now allowing inputs. This
     *                                may be either a Function (to be evaluated
     *                                on each input) or a general Boolean.
     */
    InputWritr.prototype.setCanTrigger = function (canTriggerNew) {
        if (canTriggerNew.constructor === Boolean) {
            this.canTrigger = function () {
                return canTriggerNew;
            };
        }
        else {
            this.canTrigger = canTriggerNew;
        }
    };
    /**
     * @param {Boolean} isRecordingNew   Whether this is now recording allowed
     *                                   inputs.
     */
    InputWritr.prototype.setIsRecording = function (isRecordingNew) {
        this.isRecording = isRecordingNew;
    };
    /**
     * @param {Mixed} eventInformationNew   A new first argument for event
     *                                      callbacks.
     */
    InputWritr.prototype.setEventInformation = function (eventInformationNew) {
        this.eventInformation = eventInformationNew;
    };
    /* Aliases
    */
    /**
     * Adds a list of values by which an event may be triggered.
     *
     * @param {String} name   The name of the event that is being given
     *                        aliases, such as "left".
     * @param {Array} values   An array of aliases by which the event will also
     *                         be callable.
     */
    InputWritr.prototype.addAliasValues = function (name, values) {
        var triggerName, triggerGroup, i;
        if (!this.aliases.hasOwnProperty(name)) {
            this.aliases[name] = values;
        }
        else {
            this.aliases[name].push.apply(this.aliases[name], values);
        }
        for (triggerName in this.triggers) {
            if (this.triggers.hasOwnProperty(triggerName)) {
                // triggerGroup = { "left": function, ... }, ...
                triggerGroup = this.triggers[triggerName];
                if (triggerGroup.hasOwnProperty(name)) {
                    for (i = 0; i < values.length; i += 1) {
                        triggerGroup[values[i]] = triggerGroup[name];
                    }
                }
            }
        }
    };
    /**
     * Removes a list of values by which an event may be triggered.
     *
     * @param {String} name   The name of the event that is having aliases
     *                        removed, such as "left".
     * @param {Array} values   An array of aliases by which the event will no
     *                         longer be callable.
     */
    InputWritr.prototype.removeAliasValues = function (name, values) {
        var triggerName, triggerGroup, i;
        if (!this.aliases.hasOwnProperty(name)) {
            return;
        }
        for (i = 0; i < values.length; i += 1) {
            this.aliases[name].splice(this.aliases[name].indexOf(values[i], 1));
        }
        for (triggerName in this.triggers) {
            if (this.triggers.hasOwnProperty(triggerName)) {
                // triggerGroup = { "left": function, ... }, ...
                triggerGroup = this.triggers[triggerName];
                if (triggerGroup.hasOwnProperty(name)) {
                    for (i = 0; i < values.length; i += 1) {
                        if (triggerGroup.hasOwnProperty(values[i])) {
                            delete triggerGroup[values[i]];
                        }
                    }
                }
            }
        }
    };
    /**
     * Shortcut to remove old alias values and add new ones in.
     *
     *
     * @param {String} name   The name of the event that is having aliases
     *                        added and removed, such as "left".
     * @param {Array} valuesOld   An array of aliases by which the event will no
     *                            longer be callable.
     * @param {Array} valuesNew   An array of aliases by which the event will
     *                            now be callable.
     */
    InputWritr.prototype.switchAliasValues = function (name, valuesOld, valuesNew) {
        this.removeAliasValues(name, valuesOld);
        this.addAliasValues(name, valuesNew);
    };
    /**
     * Adds a set of alises from an Object containing "name" => [values] pairs.
     *
     * @param {Object} aliasesRaw
     */
    InputWritr.prototype.addAliases = function (aliasesRaw) {
        for (var aliasName in aliasesRaw) {
            if (aliasesRaw.hasOwnProperty(aliasName)) {
                this.addAliasValues(aliasName, aliasesRaw[aliasName]);
            }
        }
    };
    /* Functions
    */
    /**
     * Adds a triggerable event by marking a new callback under the trigger's
     * triggers. Any aliases for the label are also given the callback.
     *
     * @param {String} trigger   The name of the triggered event.
     * @param {Mixed} label   The code within the trigger to call within,
     *                        typically either a character code or an alias.
     * @param {Function} callback   The callback Function to be triggered.
     */
    InputWritr.prototype.addEvent = function (trigger, label, callback) {
        var i;
        if (!this.triggers.hasOwnProperty(trigger)) {
            throw new Error("Unknown trigger requested: '" + trigger + "'.");
        }
        this.triggers[trigger][label] = callback;
        if (this.aliases.hasOwnProperty(label)) {
            for (i = 0; i < this.aliases[label].length; i += 1) {
                this.triggers[trigger][this.aliases[i]] = callback;
            }
        }
    };
    /**
     * Removes a triggerable event by deleting any callbacks under the trigger's
     * triggers. Any aliases for the label are also given the callback.
     *
     * @param {String} trigger   The name of the triggered event.
     * @param {Mixed} label   The code within the trigger to call within,
     *                        typically either a character code or an alias.
     */
    InputWritr.prototype.removeEvent = function (trigger, label) {
        var i;
        if (!this.triggers.hasOwnProperty(trigger)) {
            throw new Error("Unknown trigger requested: '" + trigger + "'.");
        }
        delete this.triggers[trigger][label];
        if (this.aliases.hasOwnProperty(label)) {
            for (i = 0; i < this.aliases[label].length; i += 1) {
                if (this.triggers[trigger][this.aliases[i]]) {
                    delete this.triggers[trigger][this.aliases[i]];
                }
            }
        }
    };
    /**
     * Stores the current history in the histories listing. this.restartHistory
     * is typically called directly after.
     */
    InputWritr.prototype.saveHistory = function (name) {
        if (name === void 0) { name = undefined; }
        this.histories[this.histories.length] = history;
        this.histories.length += 1;
        if (arguments.length) {
            this.histories[name] = history;
        }
    };
    /**
     * Plays back the current history using this.playEvents.
     */
    InputWritr.prototype.playHistory = function () {
        this.playEvents(this.history);
    };
    /**
     * "Plays" back an Array of event information by simulating each keystroke
     * in a new call, timed by setTimeout.
     *
     * @param {Object} events   The events history to play back.
     * @remarks This will execute the same actions in the same order as before,
     *          but the arguments object may be different.
     */
    InputWritr.prototype.playEvents = function (events) {
        var timeouts = {}, time, call;
        for (time in events) {
            if (events.hasOwnProperty(time)) {
                call = this.makeEventCall(events[time]);
                timeouts[time] = setTimeout(call, (Number(time) - this.startingTime) | 0);
            }
        }
    };
    /**
     * Curry utility to create a closure that runs call() when called.
     *
     * @param {Array} info   An array containing [alias, keycode].
     * @return {Function} A closure Function that activates a trigger
     *                    when called.
     */
    InputWritr.prototype.makeEventCall = function (info) {
        return function () {
            this.callEvent(info[0], info[1]);
        };
    };
    /**
     * Primary driver function to run an event. The event is chosen from the
     * triggers object, and called with eventInformation as the input.
     *
     * @param {Function, String} event   The event function (or string alias of
     *                                   it) that will be called.
     * @param {Number} [keycode]   The alias of the event function under
     *                             triggers[event], if event is a String.
     * @param {Event} [sourceEvent]   The raw event that caused the calling Pipe
     *                                to be triggered, such as a MouseEvent.
     * @return {Mixed}
     */
    InputWritr.prototype.callEvent = function (event, keycode, sourceEvent) {
        if (keycode === void 0) { keycode = undefined; }
        if (sourceEvent === void 0) { sourceEvent = undefined; }
        if (this.canTrigger.constructor === Boolean) {
            if (!this.canTrigger) {
                return;
            }
        }
        else if (this.canTrigger.constructor === Function) {
            if (!this.canTrigger(event, keycode)) {
                return;
            }
        }
        if (!event) {
            throw new Error("Blank event given, ignoring it.");
        }
        if (event.constructor === String) {
            event = this.triggers[event][keycode];
        }
        return event(this.eventInformation, sourceEvent);
    };
    /**
     * Creates and returns a function to run a trigger.
     *
     * @param {String} trigger   The label for the Array of functions that the
     *                           pipe function should choose from.
     * @param {String} codeLabel   A mapping String for the alias to get the
     *                             alias from the event.
     * @param {Boolean} [preventDefaults]   Whether the input to the pipe
     *                                       function will be an HTML-style
     *                                       event, where .preventDefault()
     *                                       should be clicked.
     * @return {Function}
     * @example   Creating a function that calls an onKeyUp event, with a given
     *            input's keyCode being used as the codeLabel.
     *            InputWriter.makePipe("onkeyup", "keyCode");
     * @example   Creating a function that calls an onMouseDown event, and
     *            preventDefault of the argument.
     *            InputWriter.makePipe("onmousedown", null, true);
     */
    InputWritr.prototype.makePipe = function (trigger, codeLabel, preventDefaults) {
        if (preventDefaults === void 0) { preventDefaults = undefined; }
        var functions = this.triggers[trigger], InputWriter = this;
        if (!functions) {
            throw new Error("No trigger of label '" + trigger + "' defined.");
        }
        return function Pipe(event) {
            var alias = event[codeLabel];
            // Typical usage means alias will be an event from a key/mouse input
            if (preventDefaults && event.preventDefault instanceof Function) {
                event.preventDefault();
            }
            // If there's a function under that alias, run it
            if (functions.hasOwnProperty(alias)) {
                if (InputWriter.isRecording) {
                    InputWriter.history[InputWriter.getTimestamp() | 0] = [trigger, alias];
                }
                InputWriter.callEvent(functions[alias], alias, event);
            }
        };
    };
    return InputWritr;
})();
;

/* GameStartr/LevelEditr/LevelEditr.js */
/**
 * LevelEditr.js 
 * A GameStartr module to let the user edit levels
 */
var LevelEditr = (function (pageStyles) {
    return function LevelEditr(settings) {
        "use strict";
        if (!this || this === window) {
            return new LevelEditr(settings);
        }
        var self = this,
            
            // The container game object to store Thing and map information
            GameStarter,
            
            // The GameStarter's settings before this LevelEditr was enabled
            oldInformation,
            
            // The listings of things that the GUI displays
            things,
            
            // The listing of groups that Things may fall into
            thingGroups,
            
            // The complete list of Things that may be placed
            thingKeys,
            
            // The listings of macros that the GUI displays
            macros,
            
            // The default string name of the map
            mapNameDefault,
            
            // The default integer time of the map
            mapTimeDefault,
            
            // The default string setting of the map's areas
            mapSettingDefault,
            
            // The default string entry of the map's locations
            mapEntryDefault,
            
            // The starting object used as a default template for new maps
            mapDefault,
            
            // An Object containing the display's HTML elements
            display,
            
            // The current mode of editing as a string, such as "Build" or "Play"
            currentMode,
            
            // The current mode of click as a string, such as "Thing" or "Macro"
            currentClickMode,
            
            // What size "blocks" placed Things should snap to
            blocksize,
            
            // An associative array of horizontal rulers to be placed in editing
            lines,
            
            // A function to beautify text given to the map displayer, such as js_beautify
            beautifier,
            
            // The currently selected Thing to be placed
            currentThings,
            
            // The type string of the currently selected thing, such as "Koopa"
            currentType,
            
            // The current arguments for currentThings, such as { "smart": true }
            currentArgs,
            
            // Whether the pageStyle styles have been added to the page
            pageStylesAdded,
            
            // A key to use in dropdowns to should indicate an undefined value
            keyUndefined;
        
        /**
         * 
         */
        self.reset = function (settings) {
            GameStarter = settings.GameStarter;
            things = settings.things;
            thingGroups = settings.thingGroups;
            thingKeys = settings.thingKeys;
            macros = settings.macros;
            beautifier = settings.beautifier;
            mapNameDefault = settings.mapNameDefault || "New Map";
            mapTimeDefault = settings.mapTimeDefault || Infinity;
            mapSettingDefault = settings.mapSettingDefault || "";
            mapEntryDefault = settings.mapEntryDefault || "";
            mapDefault = settings.mapDefault || {};
            blocksize = settings.blocksize || 1;
            keyUndefined = settings.keyUndefined || "-none-";
            
            currentThings = [];
            currentMode = "Build";
            currentClickMode = "Thing";
        };
        
        
        /* State resets
        */
        
        /**
         * 
         */
        self.enable = function () {
            oldInformation = {
                "map": GameStarter.MapsHandler.getMapName(),
            };
            
            clearAllThings();
            resetDisplay();
            
            GameStarter.InputWriter.setCanTrigger(false);
            
            setCurrentMode("Build");
            
            setTextareaValue(stringifySmart(mapDefault), true);
            resetDisplayMap();
            disableThing(GameStarter.player);
            
            if (!pageStylesAdded) {
                GameStarter.addPageStyles(pageStyles);
                pageStylesAdded = true;
            }
        };
        
        /**
         * 
         */
        self.disable = function () {
            if (display) {
                GameStarter.container.removeChild(display["container"]);
                display = undefined;
                GameStarter.InputWriter.setCanTrigger(true);
                GameStarter.setMap(oldInformation["map"]);
            }
        };
        
        /**
         * 
         */
        self.minimize = function () {
            display.minimizer.innerText = "+";
            display.minimizer.onclick = self.maximize;
            display.container.className += " minimized";
        };
        
        /**
         * 
         */
        self.maximize = function () {
            display.minimizer.innerText = "-";
            display.minimizer.onclick = self.minimize;
            
            if (display.container.className.indexOf("minimized") !== -1) {
                display.container.className = display.container.className.replace(/ minimized/g, '');
            }
        };
        
        /**
         * 
         */
        self.startBuilding = function () {
            beautifyTextareaValue();
            setDisplayMap(true);
            GameStarter.InputWriter.setCanTrigger(false);
            setCurrentMode("Build");
            self.maximize();
        };
        
        /**
         * 
         */
        self.startPlaying = function () {
            beautifyTextareaValue();
            setDisplayMap(false);
            GameStarter.InputWriter.setCanTrigger(true);
            setCurrentMode("Play");
            self.minimize();
        };
        
        /**
         * 
         */
        self.downloadCurrentJSON = function () {
            downloadFile(
                getMapName() + ".json",
                display.stringer.textarea.value || ""
            );
        };
        
        /**
         * 
         */
        self.loadCurrentJSON = function () {
            display.sections.inputDummy.click()
        };
        
        /**
         * 
         */
        self.handleUploadStart = function (event) {
            var file, reader;
            
            cancelEvent(event);

            if (event && event.dataTransfer) {
                file = event.dataTransfer.files[0];
            } else {
                file = display.sections.inputDummy.files[0],
                reader = new FileReader();
            }
            
            if (!file) {
                return;
            }
            
            reader = new FileReader();
            reader.onloadend = self.handleUploadCompletion;
            reader.readAsText(file);
        };
        
        function handleDragEnter(event) {
            self.setSectionJSON();
        }
        
        function handleDragOver(event) {
            cancelEvent(event);
        }
        
        function handleDragDrop(event) {
            self.handleUploadStart(event);
        }
        
        /**
         * 
         */
        self.handleUploadCompletion = function (event) {
            self.enable();
            self.setCurrentJSON(event.currentTarget.result);
            self.setSectionJSON();
        }
        
        /**
         * 
         */
        self.setCurrentJSON = function (json) {
            self.startBuilding();
            setTextareaValue(json, true);
            getMapObjectAndTry();
        };
        
        /**
         * 
         */
        function setCurrentMode(mode) {
            currentMode = mode;
        }
        
        /**
         * 
         */
        function setCurrentClickMode(mode, event) {
            currentClickMode = mode;
            
            cancelEvent(event);
        }
        
        /**
         * 
         */
        function setCurrentThing(type, args, x, y) {
            currentType = type;
            currentArgs = args;
            currentThings = [
                {
                    "x": 0,
                    "y": 0,
                    "thing": GameStarter.ObjectMaker.make(
                        currentType, 
                        GameStarter.proliferate({
                            "onThingMake": undefined,
                            "onThingAdd": undefined,
                            "onThingAdded": undefined,
                            "outerok": true
                        }, getNormalizedThingArguments(args))
                    )
                }
            ];
            
            disableThing(currentThings[0]["thing"]);
            GameStarter.addThing(currentThings[0]["thing"], x || 0, y || 0);
        };
        
        function setCurrentMacroThings() {
            var currentThing, i;
            
            for (i = 0; i < currentThings.length; i += 1) {
                currentThing = currentThings[i];
                currentThing.outerok = true;
                
                disableThing(currentThing["thing"]);
                GameStarter.addThing(
                    currentThing["thing"], 
                    currentThing["xloc"] || 0,
                    currentThing["yloc"] || 0
                );
            }
        }
        
        /**
         * 
         */
        function setCurrentArgs() {
            if (currentClickMode === "Thing") {
                setCurrentThing(currentType, getCurrentArgs());
            } else {
                onMacroIconClick(currentType, false, getCurrentArgs());
            }
        }
        
        /* Mouse events
        */
        
        /**
         * 
         */
        function onMouseDownScroller(direction, event) {
            var target = event.target;
            
            target.setAttribute("scrolling", 1);
            
            GameStarter.TimeHandler.addEventInterval(function () {
                if (target.getAttribute("scrolling") != 1) {
                    return true;
                }
                
                if (direction < 0 && GameStarter.MapScreener.left <= 0) {
                    display["scrollers"]["left"].style.opacity = 0;
                    return;
                }
                
                GameStarter.scrollWindow(direction);
                    display["scrollers"]["left"].style.opacity = 1;
            }, 1, Infinity);
        }
        
        /**
         * 
         */
        function onMouseUpScrolling(event) {
            event.target.setAttribute("scrolling", 0);
        }

        
        /**
         * 
         */
        function onMouseMoveEditing(event) {
            var x = event.x || event.clientX || 0,
                y = event.y || event.clientY || 0,
                currentThing, i;
            
            for (i = 0; i < currentThings.length; i += 1) {
                currentThing = currentThings[i];
                
                if (!currentThing["thing"]) {
                    continue;
                }
                
                GameStarter.setLeft(
                    currentThing["thing"], 
                    roundTo(x - GameStarter.container.offsetLeft, blocksize) 
                            + (currentThing.left || 0) * GameStarter.unitsize
                );
                GameStarter.setTop(
                    currentThing["thing"], 
                    roundTo(y - GameStarter.container.offsetTop, blocksize) 
                            - (currentThing.top || 0) * GameStarter.unitsize
                );
            }
        }
        
        /**
         * 
         */
        function onClickEditingThing(event) {
            if (currentMode !== "Build") {
                return;
            }
            
            var x = roundTo(event.x || event.clientX || 0, blocksize),
                y = roundTo(event.y || event.clientY || 0, blocksize),
                thing;
            
            if (!currentThings.length || !addMapCreationThing(x, y)) {
                return;
            }
            
            onClickEditingGenericAdd(x, y, currentType, currentArgs);
        }
        
        /**
         * 
         */
        function onClickEditingMacro(event) {
            if (currentMode !== "Build") {
                return;
            }
            
            var x = roundTo(event.x || event.clientX || 0, blocksize),
                y = roundTo(event.y || event.clientY || 0, blocksize),
                currentThing, i;
            
            // killCurrentThings();
            
            if (!currentThings.length || !addMapCreationMacro(x, y)) {
                return;
            }
            
            for (i = 0; i < currentThings.length; i += 1) {
                currentThing = currentThings[i];
                // debugger;
                onClickEditingGenericAdd(
                    x + (currentThing["left"] || 0) * GameStarter.unitsize,
                    y - (currentThing["top"] || 0) * GameStarter.unitsize,
                    currentThing["thing"].title || currentThing["title"],
                    currentThing["reference"]
                );
                
            }
        }
        
        /**
         * 
         */
        function onClickEditingGenericAdd(x, y, type, args) {
            var thing = GameStarter.ObjectMaker.make(type, GameStarter.proliferate({
                "onThingMake": undefined,
                "onThingAdd": undefined,
                "onThingAdded": undefined,
                "movement": undefined
            }, getNormalizedThingArguments(args)));
            
            if (currentMode === "Build") {
                disableThing(thing, .7);
            }
            
            GameStarter.addThing(
                thing,
                roundTo(x - GameStarter.container.offsetLeft, blocksize),
                roundTo(y - GameStarter.container.offsetTop, blocksize)
            );
        }
        
        /**
         * 
         */
        function onThingIconClick(title, event) {
            var x = event.x || event.clientX || 0,
                y = event.y || event.clientY || 0,
                target = event.target.nodeName === "DIV"
                    ? event.target : event.target.parentNode,
                i;
            
            killCurrentThings();
            
            setTimeout(function () {
                setCurrentThing(title, getCurrentArgs(), x, y);
            });
            
            cancelEvent(event);
            
            setVisualOptions(target.name, false, target.options);
        }
        
        /**
         * 
         */
        function onMacroIconClick(title, description, options) {
            if (description) {
                setVisualOptions(title, description, options);
            }
            
            var map = getMapObject(),
                i;
            
            if (!map) {
                return;
            }
            
            currentThings = [];
            GameStarter.MapsCreator.analyzePreMacro(
                GameStarter.proliferate({
                    "macro": title
                }, getCurrentArgs()),
                createPrethingsHolder(currentThings),
                getCurrentAreaObject(map),
                map
            );
            
            currentType = title;
            setCurrentMacroThings();
        }
        
        /**
         * 
         */
        function createPrethingsHolder(object) {
            var output = {};
            
            thingGroups.forEach(function (group) {
                output[group] = object;
            });
            
            return output;
        }
        
        /**
         * 
         */
        function getCurrentArgs() {
            var args = {},
                container = display["sections"]["ClickToPlace"]["VisualOptions"],
                children = container.getElementsByClassName("VisualOptionsList"),
                child, labeler, valuer, value, i;
                
            if (children.length != 0) {
                children = children[0].children;
                
                for (i = 0; i < children.length; i += 1) {
                    child = children[i];
                    labeler = child.getElementsByClassName("VisualOptionLabel")[0];
                    valuer = child.getElementsByClassName("VisualOptionValue")[0];

                    switch (valuer["data:type"]) {
                        case "Boolean":
                            value = valuer.value === "true" ? true : false;
                            break;
                        case "Number":
                            value = (Number(valuer.value) || 0) * (Number(valuer.getAttribute("data:mod")) || 1);
                            break;
                        default:
                            value = valuer.value;
                            break;
                    }

                    if (value !== keyUndefined) {
                        args[labeler.textContent] = value;
                    }
                }
            }
            
            return args;
        }
        
        
        /* Map manipulations
        */
        
        /**
         * 
         */
        function setMapName() {
            var name = getMapName(),
                map = getMapObject();
            
            if (map && map.name != name) {
                map.name = name;
                display["namer"].value = name;
                setTextareaValue(stringifySmart(map), true);
                GameStarter.StatsHolder.set("world", name)
            }
        }
        
        /**
         * 
         * 
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                             of the GUI (true), or from the Raw JSON 
         *                             section (false).
         */
        function setMapTime(fromGui) {
            var map = getMapObject(),
                time;
            
            if (!map) {
                return;
            }
            
            if (fromGui) {
                time = display["sections"]["MapSettings"]["Time"].value;
                map.time = time;
            } else {
                time = map.time;
                display["sections"]["MapSettings"]["Time"].value = time;
            }
            
            setTextareaValue(stringifySmart(map), true);
            GameStarter.StatsHolder.set("time", time)
            GameStarter.TimeHandler.cancelAllEvents();
        }
        
        
        /**
         * 
         * 
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                             of the GUI (true), or from the Raw JSON 
         *                             section (false).
         */
        function setMapSetting(fromGui) {
            var map = getMapObject(),
                area, setting;
            
            if (!map) {
                return;
            }
            
            area = getCurrentAreaObject(map);
            if (fromGui) {
                setting = display["sections"]["MapSettings"]["Setting"]["Primary"].value;
                if (display["sections"]["MapSettings"]["Setting"]["Secondary"].value) {
                    setting += " " + display["sections"]["MapSettings"]["Setting"]["Secondary"].value;
                }
                if (display["sections"]["MapSettings"]["Setting"]["Tertiary"].value) {
                    setting += " " + display["sections"]["MapSettings"]["Setting"]["Tertiary"].value;
                }
                area.setting = setting;
            } else {
                setting = area.setting.split(" ");
                display["sections"]["MapSettings"]["Setting"]["Primary"].value = setting[0];
                display["sections"]["MapSettings"]["Setting"]["Secondary"].value = setting[1];
                display["sections"]["MapSettings"]["Setting"]["Tertiary"].value = setting[2];
            }
            
            setTextareaValue(stringifySmart(map), true);
            setDisplayMap(true);
        }
        
        /**
         * 
         */
        function setLocationArea() {
            var map = getMapObject();
            
            if (!map) {
                return;
            }
            
            var location = getCurrentLocationObject(map);
            
            location["area"] = getCurrentArea();
            
            setTextareaValue(stringifySmart(map), true);
            setDisplayMap(true);
        }
        
        /**
         * 
         * 
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                             of the GUI (true), or from the Raw JSON 
         *                             section (false).
         */
        function setMapLocation(fromGui) {
            var map = getMapObject();
            
            if (!map) {
                return;
            }
            
            setTextareaValue(stringifySmart(map), true);
            setDisplayMap(true);
        }
        
        /**
         * 
         * 
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                             of the GUI (true), or from the Raw JSON 
         *                             section (false).
         */
        function setMapEntry(fromGui) {
            var map = getMapObject(),
                location, entry;
            
            if (!map) {
                return;
            }
            
            location = getCurrentLocationObject(map);
            if (fromGui) {
                entry = display["sections"]["MapSettings"]["Entry"].value;
                location.entry = entry;
            } else {
                entry = area.location;
                display["sections"]["MapSettings"]["Entry"].value = entry;
            }
            
            setTextareaValue(stringifySmart(map), true);
            setDisplayMap(true);
        }
        
        /**
         * 
         * 
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                             of the GUI (true), or from the Raw JSON 
         *                             section (false).
         */
        function setCurrentLocation(fromGui) {
            var map = getMapObject(),
                location;
            
            if (!map) {
                return;
            }
            
            location = getCurrentLocationObject(map);
            if (fromGui) {
                display["sections"]["MapSettings"]["Area"].value = location.area || 0;
            } else {
                
            }
            
            setTextareaValue(stringifySmart(map), true);
            setDisplayMap(true);
        }
        
        /**
         * 
         */
        function addLocationToMap() {
            var name = display["sections"]["MapSettings"]["Location"].options.length,
                map = getMapObject();
            
            if (!map) {
                return;
            }
            
            map.locations[name] = {
                "entry": mapEntryDefault
            };
            
            resetAllVisualOptionSelects("VisualOptionLocation", Object.keys(map.locations));
            
            setTextareaValue(stringifySmart(map), true);
            setDisplayMap(true);
        }
        
        /**
         * 
         */
        function addAreaToMap() {
            var name = display["sections"]["MapSettings"]["Area"].options.length,
                map = getMapObject();
            
            if (!map) {
                return;
            }
            
            map.areas[name] = {
                "setting": mapSettingDefault,
                "creation": []
            };
            
            resetAllVisualOptionSelects("VisualOptionArea", Object.keys(map.areas));
            
            setTextareaValue(stringifySmart(map), true);
            setDisplayMap(true);
        }
        
        function resetAllVisualOptionSelects(className, options) {
            var map = getMapObject(),
                elements = display.container.getElementsByClassName(className),
                attributes = {
                    "children": options.map(function (option) {
                        return new Option(option, option);
                    })
                },
                elements, element, value, i;
            
            if (!map) {
                return;
            }
            
            for (i = 0; i < elements.length; i += 1) {
                element = elements[i];
                value = element.value;
                
                element.textContent = "";
                GameStarter.proliferateElement(element, attributes);
                element.value = value;
            }
        }
        
        function getMapObject() {
            try {
                var map = parseSmart(display.stringer.textarea.value);
                display.stringer.messenger.textContent = "";
                display.namer.value = map.name || mapNameDefault;
                return map;
            }
            catch (error) {
                self.setSectionJSON();
                display.stringer.messenger.textContent = error.message;
                return undefined;
            }
        }
        
        function getMapObjectAndTry() {
            var mapName = getMapName() + "::Temporary",
                mapRaw = getMapObject();
            
            if (!mapRaw) {
                return false;
            }
            
            try {
                GameStarter.MapsCreator.storeMap(mapName, mapRaw);
                GameStarter.MapsCreator.getMap(mapName);
                setDisplayMap(true);
            } catch (error) {
                display.stringer.messenger.textContent = error.message;
                return false;
            }
        }
        
        function getCurrentArea() {
            return display["sections"]["MapSettings"]["Area"].value;
        }
        
        function getCurrentAreaObject(map) {
            if (typeof(map) === "undefined") {
                map = getMapObject();
            }
            
            var location = getCurrentLocation();
            
            return map.areas[map.locations[location].area || 0];
        }
        
        function getCurrentLocation() {
            return display["sections"]["MapSettings"]["Location"].value;
        }
        
        function getCurrentLocationObject(map) {
            return map.locations[getCurrentLocation()];
        }
        
        function addMapCreationThing(x, y) {
            var mapObject = getMapObject(),
                thingRaw = GameStarter.proliferate({
                    "thing": currentType,
                    "x": getNormalizedX(x) + (GameStarter.MapScreener.left / GameStarter.unitsize),
                    "y": getNormalizedY(y)
                }, currentArgs);
            
            if (!mapObject) {
                return false;
            }
            
            mapObject.areas[getCurrentArea()].creation.push(thingRaw);
            
            setTextareaValue(stringifySmart(mapObject), true);
            
            return true;
        }
        
        function addMapCreationMacro(x, y) {
            var mapObject = getMapObject(),
                macroRaw = GameStarter.proliferate({
                    "macro": currentType,
                    "x": getNormalizedX(x) + (GameStarter.MapScreener.left / GameStarter.unitsize),
                    "y": getNormalizedY(y)
                }, getCurrentArgs());
            
            if (!mapObject) {
                return false;
            }
            
            mapObject.areas[getCurrentArea()].creation.push(macroRaw);
            
            setTextareaValue(stringifySmart(mapObject), true);
            
            return true;
        }
        
        
        /* HTML manipulations
        */
        
        function resetDisplay() {
            if (display) {
                GameStarter.container.removeChild(display.container);
            }
            
            display = {
                "container": undefined,
                "scrollers": {
                    "container": undefined,
                    "left": undefined,
                    "right": undefined
                },
                "gui": undefined,
                "namer": undefined,
                "minimizer": undefined,
                "stringer": {
                    "textarea": undefined,
                    "messenger": undefined
                },
                "sections": {
                    "ClickToPlace": {
                        "container": undefined,
                        "Things": undefined,
                        "Macros": undefined,
                        "VisualSummary": undefined,
                        "VisualOptions": undefined,
                    },
                    "MapSettings": {
                        "container": undefined,
                        "Time": undefined,
                        "Setting": {
                            "Primary": undefined,
                            "Secondary": undefined,
                            "Tertiary": undefined
                        },
                        "Location": undefined,
                        "Entry": undefined
                    },
                    "JSON": undefined,
                    "buttons": {
                        "ClickToPlace": {
                            "container": undefined,
                            "Things": undefined,
                            "Macros": undefined
                        },
                        "MapSettings": undefined,
                        "JSON": undefined
                    }
                }
            };
            
            display["container"] = GameStarter.createElement("div", {
                "className": "LevelEditor",
                "onclick": cancelEvent,
                "ondragenter": handleDragEnter,
                "ondragover": handleDragOver,
                "ondrop": handleDragDrop,
                "children": [
                    display["scrollers"]["container"] = GameStarter.createElement("div", {
                        "className": "EditorScrollers",
                        "onmousemove": onMouseMoveEditing,
                        "onclick": onClickEditingThing,
                        "children": [
                            display["scrollers"]["left"] = GameStarter.createElement("div", {
                                "className": "EditorScroller EditorScrollerLeft",
                                "onmousedown": onMouseDownScroller.bind(undefined, -GameStarter.unitsize * 2),
                                "onmouseup": onMouseUpScrolling,
                                "onmouseout": onMouseUpScrolling,
                                "onclick": cancelEvent,
                                "innerText": "<",
                                "style": {
                                    "paddingTop": GameStarter.MapScreener.height / 2 - 35 + "px",
                                    "fontSize": "70px",
                                    "opacity": 0
                                }
                            }),
                            display["scrollers"]["right"] = GameStarter.createElement("div", {
                                "className": "EditorScroller EditorScrollerRight",
                                "onmousedown": onMouseDownScroller.bind(undefined, GameStarter.unitsize * 2),
                                "onmouseup": onMouseUpScrolling,
                                "onmouseout": onMouseUpScrolling,
                                "onclick": cancelEvent,
                                "innerText": ">",
                                "style": {
                                    "paddingTop": GameStarter.MapScreener.height / 2 - 35 + "px",
                                    "fontSize": "70px"
                                }
                            })
                        ]
                    }),
                    display["gui"] = GameStarter.createElement("div", {
                        "className": "EditorGui",
                        "children": [
                            GameStarter.createElement("div", {
                                "className": "EditorHead",
                                "children": [
                                    GameStarter.createElement("div", {
                                        "className": "EditorNameContainer",
                                        "children": [
                                            display["namer"] = GameStarter.createElement("input", {
                                                "className": "EditorNameInput",
                                                "type": "text",
                                                "placeholder": mapNameDefault,
                                                "value": mapNameDefault,
                                                "onkeyup": setMapName,
                                                "onchange": setMapName
                                            })
                                        ]
                                    }),
                                    display["minimizer"] = GameStarter.createElement("div", {
                                        "className": "EditorHeadButton EditorMinimizer",
                                        "onclick": self.minimize,
                                        "textContent": "-"
                                    }),
                                    GameStarter.createElement("div", {
                                        "className": "EditorHeadButton EditorCloser",
                                        "textContent": "X",
                                        "onclick": self.disable
                                    })
                                ]
                            }),
                            GameStarter.createElement("div", {
                                "className": "EditorSectionChoosers",
                                "onclick": cancelEvent,
                                "children": [
                                    display["sections"]["buttons"]["ClickToPlace"]["container"] = GameStarter.createElement("div", {
                                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                                        "style": {
                                            "background": "white"
                                        },
                                        "textContent": "Visual",
                                        "onclick": self.setSectionClickToPlace,
                                    }),
                                    display["sections"]["buttons"]["MapSettings"] = GameStarter.createElement("div", {
                                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                                        "style": {
                                            "background": "gray"
                                        },
                                        "textContent": "Map",
                                        "onclick": self.setSectionMapSettings,
                                    }),
                                    display["sections"]["buttons"]["JSON"] = GameStarter.createElement("div", {
                                        "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                                        "style": {
                                            "background": "gray"
                                        },
                                        "textContent": "JSON",
                                        "onclick": self.setSectionJSON
                                    })
                                ]
                            }),
                            display["sections"]["ClickToPlace"]["container"] = GameStarter.createElement("div", {
                                "className": "EditorOptionsList EditorSectionMain",
                                "onclick": cancelEvent,
                                "style": {
                                    "display": "block"
                                },
                                "children": [
                                    GameStarter.createElement("div", {
                                        "className": "EditorSubOptionsListsMenu",
                                        "children": [
                                            display["sections"]["buttons"]["ClickToPlace"]["Things"] = GameStarter.createElement("div", {
                                                "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                                                "textContent": "Things",
                                                "onclick": self.setSectionClickToPlaceThings,
                                                "style": {
                                                    "background": "#CCC"
                                                }
                                            }),
                                            display["sections"]["buttons"]["ClickToPlace"]["Macros"] = GameStarter.createElement("div", {
                                                "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                                                "textContent": "Macros",
                                                "onclick": self.setSectionClickToPlaceMacros,
                                                "style": {
                                                    "background": "#777"
                                                }
                                            })
                                        ]
                                    }),
                                    display["sections"]["ClickToPlace"]["Things"] = GameStarter.createElement("div", {
                                        "className": "EditorSectionSecondary EditorOptions EditorOptions-Things",
                                        "style": {
                                            "display": "block"
                                        },
                                        "children": (function () {
                                                var containers = Object.keys(things).map(function (key) {
                                                    var children = Object.keys(things[key]).map(function (title) {
                                                        var thing = GameStarter.ObjectMaker.make(title),
                                                            container = GameStarter.createElement("div", {
                                                                "className": "EditorListOption",
                                                                "name": title,
                                                                "options": things[key][title],
                                                                "children": [thing.canvas],
                                                                "onclick": onThingIconClick.bind(
                                                                    undefined,
                                                                    title
                                                                )
                                                            }),
                                                            sizeMax = 70,
                                                            widthThing = thing.width * GameStarter.unitsize,
                                                            heightThing = thing.height * GameStarter.unitsize,
                                                            widthDiff = (sizeMax - widthThing) / 2, 
                                                            heightDiff = (sizeMax - heightThing) / 2;
                                                        
                                                        thing.canvas.style.top = heightDiff + "px";
                                                        thing.canvas.style.right = widthDiff + "px";
                                                        thing.canvas.style.bottom = heightDiff + "px";
                                                        thing.canvas.style.left = widthDiff + "px";
                                                        
                                                        GameStarter.PixelDrawer.setThingSprite(thing);
                                                        
                                                        return container;                                        
                                                    });
                                                    
                                                    return GameStarter.createElement("div", {
                                                        "className": "EditorOptionContainer",
                                                        "style": {
                                                            "display": "none"
                                                        },
                                                        "children": children
                                                    });
                                                }),
                                                selectedIndex = 0,
                                                switcher = createSelect(Object.keys(things), {
                                                    "className": "EditorOptionContainerSwitchers",
                                                    "onchange": function () {
                                                        containers[selectedIndex + 1].style.display = "none";
                                                        containers[switcher.selectedIndex + 1].style.display = "block";
                                                        selectedIndex = switcher.selectedIndex;
                                                    }
                                                });
                                                
                                                containers[0].style.display = "block";
                                                containers.unshift(switcher);
                                                
                                            return containers;
                                        })()
                                    }),
                                    display["sections"]["ClickToPlace"]["Macros"] = GameStarter.createElement("div", {
                                        "className": "EditorSectionSecondary EditorOptions EditorOptions-Macros",
                                        "style": {
                                            "display": "none"
                                        },
                                        "children": Object.keys(macros).map(function (key) {
                                            var macro = macros[key];
                                            return GameStarter.createElement("div", {
                                                "className": "EditorOptionContainer",
                                                "children": [
                                                    GameStarter.createElement("div", {
                                                        "className": "EditorOptionTitle EditorMenuOption",
                                                        "textContent": key,
                                                        "onclick": onMacroIconClick.bind(
                                                            undefined,
                                                            key,
                                                            macro["description"],
                                                            macro["options"]
                                                        )
                                                    })
                                                ]
                                            })
                                        })
                                    })
                                ]
                            }),
                            display["sections"]["MapSettings"]["container"] = GameStarter.createElement("div", {
                                "className": "EditorMapSettings EditorSectionMain",
                                "onclick": cancelEvent,
                                "style": {
                                    "display": "none"
                                },
                                "children": [
                                    GameStarter.createElement("div", {
                                        "className": "EditorMapSettingsSubGroup",
                                        "children": [
                                            GameStarter.createElement("label", {
                                                "textContent": "Current Location"
                                            }),
                                            display["sections"]["MapSettings"]["Location"] = createSelect([
                                                0
                                            ], {
                                                "className": "VisualOptionLocation",
                                                "onchange": setCurrentLocation.bind(undefined, true)
                                            })
                                        ]
                                    }),
                                    GameStarter.createElement("div", {
                                        "className": "EditorMapSettingsGroup",
                                        "children": [
                                            GameStarter.createElement("h4", {
                                                "textContent": "Map"
                                            }),
                                            GameStarter.createElement("div", {
                                                "className": "EditorMapSettingsSubGroup",
                                                "children": [
                                                    GameStarter.createElement("label", {
                                                        "className": "EditorMapSettingsLabel",
                                                        "textContent": "Time"
                                                    }),
                                                    display["sections"]["MapSettings"]["Time"] = createSelect([
                                                        "100", "200", "300", "400", "500", "1000", "2000", "Infinity"
                                                    ], {
                                                        "value": "Infinity",
                                                        "onchange": setMapTime.bind(undefined, true)
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    GameStarter.createElement("div", {
                                        "className": "EditorMapSettingsGroup",
                                        "children": [
                                            GameStarter.createElement("h4", {
                                                "textContent": "Location"
                                            }),
                                            GameStarter.createElement("div", {
                                                "className": "EditorMapSettingsSubGroup",
                                                "children": [
                                                    GameStarter.createElement("label", {
                                                        "textContent": "Area"
                                                    }),
                                                    display["sections"]["MapSettings"]["Area"] = createSelect([
                                                        0
                                                    ], {
                                                        "className": "VisualOptionArea",
                                                        "onchange": setLocationArea.bind(undefined, true)
                                                    })
                                                ]
                                            }),
                                            GameStarter.createElement("div", {
                                                "className": "EditorMapSettingsSubGroup",
                                                "children": [
                                                    GameStarter.createElement("label", {
                                                        "textContent": "Setting"
                                                    }),
                                                    display["sections"]["MapSettings"]["Setting"]["Primary"] = createSelect([
                                                        "Overworld", "Underworld", "Underwater", "Castle"
                                                    ], {
                                                        "onchange": setMapSetting.bind(undefined, true)
                                                    }),
                                                    display["sections"]["MapSettings"]["Setting"]["Secondary"] = createSelect([
                                                        "", "Night", "Underwater", "Alt"
                                                    ], {
                                                        "onchange": setMapSetting.bind(undefined, true)
                                                    }),
                                                    display["sections"]["MapSettings"]["Setting"]["Tertiary"] = createSelect([
                                                        "", "Night", "Underwater", "Alt"
                                                    ], {
                                                        "onchange": setMapSetting.bind(undefined, true)
                                                    })
                                                ]
                                            }),
                                            GameStarter.createElement("div", {
                                                "className": "EditorMapSettingsSubGroup",
                                                "children": [
                                                    GameStarter.createElement("label", {
                                                        "textContent": "Entrance"
                                                    }),
                                                    display["sections"]["MapSettings"]["Entry"] = createSelect([
                                                        "Plain", "Normal", "Castle", "PipeVertical", "PipeHorizontal"
                                                    ], {
                                                        "onchange": setMapEntry.bind(undefined, true)
                                                    }),
                                                ]
                                            })
                                        ]
                                    }),
                                    GameStarter.createElement("div", {
                                        "className": "EditorMenuOption",
                                        "textContent": "+ Add Area",
                                        "onclick": addAreaToMap
                                    }),
                                    GameStarter.createElement("div", {
                                        "className": "EditorMenuOption",
                                        "textContent": "+ Add Location",
                                        "onclick": addLocationToMap
                                    })
                                ]
                            }),
                            display["sections"]["JSON"] = GameStarter.createElement("div", {
                                "className": "EditorJSON EditorSectionMain",
                                "onclick": cancelEvent,
                                "style": {
                                    "display": "none"
                                },
                                "children": [
                                    display["stringer"]["textarea"] = GameStarter.createElement("textarea", {
                                        "className": "EditorJSONInput",
                                        "spellcheck": false,
                                        "onkeyup": getMapObjectAndTry,
                                        "onchange": getMapObjectAndTry
                                    }),
                                    display["stringer"]["messenger"] = GameStarter.createElement("div", {
                                        "className": "EditorJSONInfo"
                                    })
                                ]
                            }),
                            display["sections"]["ClickToPlace"]["VisualSummary"] = GameStarter.createElement("div", {
                                "className": "EditorVisualSummary",
                                "onclick": cancelEvent,
                            }),
                            display["sections"]["ClickToPlace"]["VisualOptions"] = GameStarter.createElement("div", {
                                "className": "EditorVisualOptions",
                                "onclick": cancelEvent,
                                "textContent": "Click an icon to view options.",
                                "style": {
                                    "display": "block"
                                }
                            }),
                            GameStarter.createElement("div", {
                                "className": "EditorMenu",
                                "onclick": cancelEvent,
                                "children": (function (actions) {
                                    return Object.keys(actions).map(function (key) {
                                        return GameStarter.createElement("div", {
                                            "className": "EditorMenuOption EditorMenuOptionFifth EditorMenuOption-" + key,
                                            "textContent": key,
                                            "onclick": actions[key][0],
                                            "children": actions[key][1]
                                        });
                                    });
                                })({
                                    "Build": [self.startBuilding],
                                    "Play": [self.startPlaying],
                                    "Save": [self.downloadCurrentJSON],
                                    "Load": [
                                        self.loadCurrentJSON,
                                        display["sections"]["inputDummy"] = GameStarter.createElement("input", {
                                            "type": "file",
                                            "style": {
                                                "display": "none"
                                            },
                                            "onchange": self.handleUploadStart
                                        })
                                    ],
                                    "Reset": [resetDisplayMap]
                                })
                            })
                        ]
                    })
                ]
            });
            
            GameStarter.container.insertBefore(
                display.container, 
                GameStarter.container.children[0]
            );
        }
        
        /**
         * 
         */
        self.setSectionClickToPlace = function () {
            display.sections.ClickToPlace.VisualOptions.style.display = "block";
            display.sections.ClickToPlace.container.style.display = "block";
            display.sections.MapSettings.container.style.display = "none";
            display.sections.JSON.style.display = "none";
            display.sections.buttons.ClickToPlace.container.style.backgroundColor = "white";
            display.sections.buttons.MapSettings.style.background = "gray";
            display.sections.buttons.JSON.style.background = "gray";
        }
        
        /**
         * 
         */
        self.setSectionMapSettings = function () {
            display.sections.ClickToPlace.VisualOptions.style.display = "none";
            display.sections.ClickToPlace.container.style.display = "none";
            display.sections.MapSettings.container.style.display = "block";
            display.sections.JSON.style.display = "none";
            display.sections.buttons.ClickToPlace.container.style.background = "gray";
            display.sections.buttons.MapSettings.style.background = "white";
            display.sections.buttons.JSON.style.background = "gray";
        }
        
        /**
         * 
         */
        self.setSectionJSON = function () {
            display.sections.ClickToPlace.VisualOptions.style.display = "none";
            display.sections.ClickToPlace.container.style.display = "none";
            display.sections.MapSettings.container.style.display = "none";
            display.sections.JSON.style.display = "block";
            display.sections.buttons.ClickToPlace.container.style.background = "gray";
            display.sections.buttons.MapSettings.style.background = "gray";
            display.sections.buttons.JSON.style.background = "white";
        }
        
        /**
         * 
         */
        self.setSectionClickToPlaceThings = function (event) {
            setCurrentClickMode("Thing", event);
            display.gui.onclick = onClickEditingThing;
            display.scrollers.container.onclick = onClickEditingThing;
            display.sections.ClickToPlace.VisualOptions.style.display = "block";
            display.sections.ClickToPlace.Things.style.display = "block";
            display.sections.ClickToPlace.Macros.style.display = "none";
            display.sections.buttons.ClickToPlace.Things.style.background = "#CCC";
            display.sections.buttons.ClickToPlace.Macros.style.background = "#777";
        }
        
        /**
         * 
         */
        self.setSectionClickToPlaceMacros = function (event) {
            setCurrentClickMode("Macro", event);
            display.gui.onclick = onClickEditingMacro;
            display.scrollers.container.onclick = onClickEditingMacro;
            display.sections.ClickToPlace.VisualOptions.style.display = "block";
            display.sections.ClickToPlace.Things.style.display = "none";
            display.sections.ClickToPlace.Macros.style.display = "block";
            display.sections.buttons.ClickToPlace.Things.style.background = "#777";
            display.sections.buttons.ClickToPlace.Macros.style.background = "#CCC";
        }
        
        /**
         * 
         */
        function setTextareaValue(value, doBeautify) {
            if (doBeautify) {
                display.stringer.textarea.value = beautifier(value);
            } else {
                display.stringer.textarea.value = value;
            }
        }
        
        /** 
         * 
         */
        function beautifyTextareaValue() {
            display.stringer.textarea.value = beautifier(display.stringer.textarea.value);
        }
        
        /**
         * 
         */
        function setVisualOptions(name, description, options) {
            var visual = display["sections"]["ClickToPlace"]["VisualOptions"];
            
            visual.textContent = "";
            
            visual.appendChild(GameStarter.createElement("h3", {
                "className": "VisualOptionName",
                "textContent": name
            }));
            
            if (description) {
                visual.appendChild(GameStarter.createElement("div", {
                    "className": "VisualOptionDescription",
                    "textContent": description
                }));
            }
            
            if (options) {
                visual.appendChild(GameStarter.createElement("div", {
                    "className": "VisualOptionsList",
                    "children": Object.keys(options).map(function (key) {
                        return GameStarter.createElement("div", {
                            "className": "VisualOption",
                            "children": [
                                GameStarter.createElement("div", {
                                    "className": "VisualOptionLabel",
                                    "textContent": key
                                }),
                                createVisualOption(options[key])
                            ]
                        });
                    })
                }));
            }
            
            display["sections"]["ClickToPlace"]["VisualSummary"].textContent = name;
        }
        
        /**
         * 
         */
        function createVisualOption(option) {
            switch (option.constructor) {
                case Number:
                    option = {
                        "type": "Number",
                        "mod": option
                    };
                    break;
                
                case String:
                    option = {
                        "type": option
                    };
                    break;
                
                case Array:
                    option = {
                        "type": "Select",
                        "options": option
                    };
                    break;
            }

            switch (option.type) {
                case "Boolean":
                    return createSelect([
                        "false", "true"
                    ], {
                        "className": "VisualOptionValue",
                        "data:type": "Boolean",
                        "onchange": setCurrentArgs
                    });
                
                case "Number":
                    return GameStarter.createElement("div", {
                        "className": "VisualOptionHolder",
                        "children": (function () {
                            var modReal = option["mod"] || 1,
                                input = GameStarter.createElement("input", {
                                    "type": "Number",
                                    "data:type": "Number",
                                    "value": (option["value"] === undefined) ? 1 : option["value"]
                                }, {
                                    "className": "VisualOptionValue modReal" + modReal,
                                    "onchange": setCurrentArgs
                                }),
                                children = [input];
                            
                            input.setAttribute("data:mod", modReal);
                            
                            if (option["Infinite"]) {
                                var valueOld,
                                    infinite = createSelect(["Number", "Infinite"], {
                                        "className": "VisualOptionInfiniter",
                                        "onchange": function () {
                                            if (infinite.value === "Number") {
                                                input.type = "Number";
                                                input.disabled = false;
                                                
                                                input.value = valueOld;
                                                input.onchange();
                                            } else {
                                                input.type = "Text";
                                                input.disabled = true;
                                                
                                                valueOld = input.value;
                                                input.value = Infinity;
                                                input.onchange();
                                            }
                                        }
                                    });
                                
                                if (option["value"] === Infinity) {
                                    infinite.value = "Infinite";
                                    infinite.onchange();
                                }
                                
                                children.push(infinite);
                            }
                            
                            if (modReal > 1) {
                                children.push(GameStarter.createElement("div", {
                                    "className": "VisualOptionRecommendation",
                                    "textContent": "x" + option["mod"]
                                }));
                            }
                            
                            return children;
                        })()
                    });

                case "Select":
                    return createSelect(option["options"], {
                        "className": "VisualOptionValue",
                        "data:type": "Boolean",
                        "onchange": setCurrentArgs
                    });

                case "String":
                    return createSelect(option["options"], {
                        "className": "VisualOptionValue",
                        "data:type": "String",
                        "onchange": setCurrentArgs
                    });

                case "Location":
                    var map = getMapObject(),
                        locations;
                    
                    if (!map) {
                        return GameStarter.createElement("div", {
                            "className": "VisualOptionValue VisualOptionLocation EditorComplaint",
                            "text": "Fix map compilation to get locations!"
                        });
                    }
                    
                    locations = Object.keys(map.locations);
                    locations.unshift(keyUndefined);
                    return createSelect(locations, {
                        "className": "VisualOptionValue VisualOptionLocation",
                        "data-type": "Number"
                    });
                
                case "Area":
                    var map = getMapObject(),
                        areas;
                    
                    if (!map) {
                        return GameStarter.createElement("div", {
                            "className": "VisualOptionValue VisualOptionArea EditorComplaint",
                            "text": "Fix map compilation to get areas!"
                        });
                    }
                    
                    areas = Object.keys(map.areas);
                    areas.ushift(keyUndefined);
                    return createSelect(areas, {
                        "className": "VisualOptionValue VisualOptionArea",
                        "data-type": "Number",
                        "onchange": setCurrentArgs
                    });
                
                case "Everything":
                    return createSelect(thingKeys, {
                        "className": "VisualOptionValue VisualOptionEverything",
                        "data-type": "String",
                        "onchange": setCurrentArgs
                    });
                
                default:
                    return GameStarter.createElement("div", {
                        "className": "EditorComplaint",
                        "textContent": "Unknown type requested: " + option.type
                    });
            }
        }
        
        /**
         * 
         */
        function resetDisplayMap() {
            setTextareaValue(stringifySmart(mapDefault), true);
            setDisplayMap(true);
            GameStarter.InputWriter.setCanTrigger(false);
        }
        
        /**
         * 
         */
        function setDisplayMap(doDisableThings) {
            var value = display.stringer.textarea.value,
                mapName = getMapName(),
                testObject, 
                testMap,
                map;
            
            try {
                testObject = parseSmart(value);
                setTextareaValue(display.stringer.textarea.value);
            } catch (error) {
                self.setSectionJSON();
                display.stringer.messenger.textContent = error.message;
                return;
            }
            
            try {
                GameStarter.MapsCreator.storeMap(mapName, testObject);
                map = GameStarter.MapsCreator.getMap(mapName);
            } catch (error) {
                self.setSectionJSON();
                display.stringer.messenger.textContent = error.message;
                return;
            }
            
            display.stringer.messenger.textContent = "";
            setTextareaValue(display.stringer.textarea.value);
            GameStarter.setMap(mapName, getCurrentLocation());
            
            if (doDisableThings) {
                disableAllThings();
            }
        }
        
        /**
         * 
         */
        function getMapName() {
            return display.namer.value || mapNameDefault;
        }
        
        
        /* Utility functions
        */
        
        /**
         * 
         */
        function roundTo(number, rounding) {
            return Math.round(number / rounding) * rounding;
        }
        
        /**
         * 
         */
        var stringifySmart = (function (replacer) {
            return function(text) {
                return JSON.stringify(text, replacer);
            }
        })(function (key, value) {
            if (value !== value) {
                return "NaN";
            } else if (value === Infinity) {
                return "Infinity";
            } else if (value === -Infinity) {
                return "-Infinity";
            } else {
                return value;
            }
        });
        
        /**
         * 
         */
        var parseSmart = (function (replacer) {
            return function(text) {
                return JSON.parse(text, replacer);
            }
        })(function (key, value) {
            if (value === "NaN") {
                return NaN;
            } else if (value === "Infinity") {
                return Infinity;
            } else if (value === "-Infinity") {
                return -Infinity;
            } else {
                return value;
            }
        });
        
        /**
         * 
         */
        function disableThing(thing, opacity) {
            thing.movement = undefined;
            thing.onThingMake = undefined;
            thing.onThingAdd = undefined;
            thing.onThingAdded = undefined;
            thing.nofall = true;
            thing.nocollide = true;
            thing.xvel = 0;
            thing.yvel = 0;
            thing.opacity = typeof opacity === "undefined" ? .49 : opacity;
        }
        
        /**
         * 
         */
        function disableAllThings() {
            GameStarter.GroupHolder.getCharacterGroup().forEach(function (thing) {
                disableThing(thing);
            });
            GameStarter.StatsHolder.set("time", Infinity)
        }
        
        /**
         * 
         */
        function clearAllThings() {
            var groups = GameStarter.GroupHolder.getGroups(),
                group, i, j;
            
            for (i in groups) {
                for (j in groups[i]) {
                    GameStarter.killNormal(groups[i][j]);
                }
            }
        }
        
        /**
         * 
         */
        function getNormalizedX(raw) {
            return raw / GameStarter.unitsize;
        }
        
        /**
         * 
         */
        function getNormalizedY(raw) {
            return GameStarter.MapScreener.floor - (raw / GameStarter.unitsize) + GameStarter.unitsize * 3; // Why +3?
        }
        
        /**
         * 
         */
        function getNormalizedThingArguments(args) {
            var argsNormal = GameStarter.proliferate({}, args);
            
            if (argsNormal["height"] === Infinity) {
                argsNormal["height"] = GameStarter.MapScreener.height;
            }
            if (argsNormal["width"] === Infinity) {
                argsNormal["width"] = GameStarter.MapScreener.width;
            }
            
            return argsNormal;
        }
        
        /**
         * 
         */
        function createSelect(options, attributes) {
            var select = GameStarter.createElement("select", attributes),
                i;
            
            for (i = 0; i < options.length; i += 1) {
                select.appendChild(GameStarter.createElement("option", {
                    "value": options[i],
                    "textContent": options[i]
                }));
            }
            
            if (typeof attributes.value !== "undefined") {
                select.value = attributes.value;
            }
            
            return select;
        }
        
        /**
         * 
         */
        function downloadFile(name, content) {
            var link = document.createElement('a');
            link.setAttribute('download', name);
            link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(content));
            display.container.appendChild(link);
            link.click();
            display.container.removeChild(link);
            return link;
        }
        
        /**
         * 
         */
        function killCurrentThings() {
            for (var i = 0; i < currentThings.length - 1; i += 1) {
                GameStarter.killNormal(currentThings[i].thing);
            }
        }
        
        /**
         * 
         */
        function cancelEvent(event) {
            if (!event) {
                return;
            }
            
            if (typeof event.preventDefault === "function") {
                event.preventDefault();
            }
            
            if (typeof event.stopPropagation === "function") {
                event.stopPropagation();
            }
            
            event.cancelBubble = true;
        }
        
        self.reset(settings || {});
    }
})({
    ".LevelEditor": {
        "position": "absolute",
        "top": "0",
        "right": "0",
        "bottom": "0",
        "left": "0"
    },
    ".LevelEditor h4": {
        "margin": "14px 0 7px 0"
    },
    ".LevelEditor select, .LevelEditor input": {
        "margin": "7px",
        "padding": "3px 7px",
        "font-size": "1.17em"
    },
    // EditorGUI & EditorScrollers
    ".LevelEditor .EditorGui": {
        "position": "absolute",
        "top": "0",
        "right": "0",
        "bottom": "0",
        "width": "50%",
        "background": "rgba(0, 7, 14, .84)",
        "overflow": "hidden",
        "user-select": "none",
        "box-sizing": "border-box",
        "z-index": "70",
        "transition": "117ms all"
    },
    ".LevelEditor .EditorScrollers": {
        "position": "absolute",
        "top": "0",
        "right": "50%",
        "bottom": "0",
        "left": "0",
        "transition": "117ms all"
    },
    ".EditorScroller": {
        "position": "absolute",
        "width": "70px",
        "height": "101%",
        "cursor": "pointer",
        "box-sizing": "border-box",
        "text-align": "center",
        "transition": "280ms opacity"
    },
    ".EditorScrollerRight": {
        "right": "0"
    },
    ".EditorScrollerLeft": {
        "left": "0"
    },
    ".LevelEditor.minimized .EditorGui": {
        "width": "117px"
    },
    ".LevelEditor.minimized .EditorScrollers": {
        "right": "117px",
        "padding-right": "117px"
    },
    // EditorHead
    ".LevelEditor .EditorHead": {
        "position": "relative",
        "height": "35px"
    },
    ".LevelEditor .EditorHead .EditorNameContainer": {
        "position": "absolute",
        "top": "1px",
        "right": "73px",
        "left": "2px",
        "height": "35px"
    },
    ".LevelEditor .EditorHead .EditorNameInput": {
        "display": "block",
        "margin": "0",
        "padding": "3px 7px",
        "width": "100%",
        "background": "white",
        "border": "1px solid black",
        "font-size": "1.4em",
        "box-sizing": "border-box"
    },
    ".LevelEditor .EditorHead .EditorHeadButton": {
        "position": "absolute",
        "top": "2px",
        "width": "32px",
        "height": "32px",
        "background": "rgb(35,35,35)",
        "border": "1px solid silver",
        "box-sizing": "border-box",
        "text-align": "center",
        "padding-top": "7px",
        "cursor": "pointer"
    },
    ".LevelEditor .EditorHead .EditorMinimizer": {
        "right": "38px"
    },
    ".LevelEditor .EditorHead .EditorCloser": {
        "right": "3px"
    },
    // EditorSectionChoosers
    ".LevelEditor .EditorSectionChooser": {
        "width": "50%",
        "box-sizing": "border-box",
        "height": "35px",
        "background": "white",
        "border": "3px solid black",
        "color": "black",
        "cursor": "pointer"
    },
    ".LevelEditor .EditorSectionChooser.Inactive": {
        "background": "gray"
    },
    ".LevelEditor.minimized .EditorSectionChoosers": {
        "opacity": "0"
    },
    // EditorSectionMain
    ".LevelEditor .EditorSectionMain": {
        "position": "absolute",
        "top": "70px",
        "right": "0",
        "bottom": "49px",
        "left": "0",
        "overflow-y": "auto"
    },
    ".LevelEditor .EditorSectionSecondary": {
        "position": "absolute",
        "top": "35px",
        "right": "248px",
        "bottom": "0px",
        "left": "0",
        "overflow-y": "auto"
    },
    // EditorJSON
    ".LevelEditor .EditorJSON": {
        "font-family": "Courier"
    },
    ".LevelEditor .EditorJSONInput": {
        "display": "block",
        "width": "100%",
        "height": "84%",
        "background": "rgba(0, 3, 7, .91)",
        "color": "rgba(255, 245, 245, .91)",
        "box-sizing": "border-box",
        "overflow-y": "auto",
        "resize": "none"
    },
    ".LevelEditor .EditorJSONInfo": {
        "height": "1.75em",
        "padding": "3px 7px"
    },
    ".LevelEditor.minimized .EditorJSON": {
        "opacity": "0"
    },
    // EditorOptions
    ".LevelEditor .EditorOptions, .LevelEditor .EditorOptionContainer": {
        "padding-left": "3px",
        "clear": "both",
        "min-width": "98px"
    },
    ".LevelEditor.minimized .EditorOptionsList": {
        "opacity": "0"
    },
    ".LevelEditor .EditorListOption": {
        "position": "relative",
        "float": "left",
        "margin": "0 7px 7px 0",
        "width": "70px",
        "height": "70px",
        "background": "black",
        "border": "white",
        "overflow": "hidden",
        "cursor": "pointer"
    },
    ".LevelEditor .EditorListOption canvas": {
        "position": "absolute"
    },
    // EditorVisualOptions
    ".LevelEditor .EditorVisualSummary": {
        "margin": "42px 7px",
        "opacity": "0",
        "transition": "117ms opacity"
    },
    ".LevelEditor.minimized .EditorVisualSummary": {
        "opacity": "0"
    },
    ".LevelEditor .EditorVisualOptions": {
        "position": "absolute",
        "top": "0",
        "right": "21px",
        "top": "119px",
        "bottom": "42px",
        "padding": "7px 11px",
        "width": "210px",
        "border": "1px solid silver",
        "border-width": "1px 0 0 1px",
        "overflow-x": "visible",
        "overflow-y": "auto",
        "opacity": "1",
        "box-sizing": "border-box",
        "transition": "117ms opacity"
    },
    ".LevelEditor.minimized .EditorVisualOptions": {
        "left": "100%"
    },
    ".LevelEditor .EditorVisualOptions .VisualOption": {
        "padding": "14px 0"
    },
    ".LevelEditor .EditorVisualOptions .VisualOptionName": {
        "margin": "3px 0 7px 0"
    },
    ".LevelEditor .EditorVisualOptions .VisualOptionDescription": {
        "padding-bottom": "14px"
    },
    ".LevelEditor .EditorVisualOptions .VisualOptionValue": {
        "max-width": "117px"
    },
    ".LevelEditor .EditorVisualOptions .VisualOptionInfiniter, .LevelEditor .EditorVisualOptions .VisualOptionRecommendation": {
        "display": "inline"
    },
    // EditorMenu
    ".LevelEditor .EditorMenu": {
        "position": "absolute",
        "right": "0",
        "bottom": "0",
        "left": "0"
    },
    ".LevelEditor .EditorMenuOption": {
        "display": "inline-block",
        "padding": "7px 14px",
        "background": "white",
        "border": "3px solid black",
        "box-sizing": "border-box",
        "color": "black",
        "text-align": "center",
        "overflow": "hidden",
        "cursor": "pointer"
    },
    ".LevelEditor.minimized .EditorMenuOption:not(:first-of-type)": {
        "display": "none"
    },
    ".LevelEditor.minimized .EditorMenuOption:first-of-type": {
        "width": "auto"
    },
    ".LevelEditor .EditorMenuOption:hover": {
        "opacity": ".91"
    },
    ".LevelEditor .EditorMenuOption.EditorMenuOptionHalf": {
        "width": "50%"
    },
    ".LevelEditor .EditorMenuOption.EditorMenuOptionThird": {
        "width": "33%"
    },
    ".LevelEditor .EditorMenuOption.EditorMenuOptionFifth": {
        "width": "20%"
    },
    // EditorMapSettings
    ".LevelEditor .EditorMapSettingsGroup": {
        "padding-left": "7px"
    },
    ".LevelEditor .EditorMapSettingsSubGroup": {
        "padding-left": "14px"
    },
    ".LevelEditor.minimized .EditorMapSettings": {
        "opacity": "0"
    }
});
;

/* GameStartr/LevelEditr/beautify.js */
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy       !jslint_happy
            ---------------------------------
            function ()        function ()

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

    space_before_conditional (default true) - should the space before conditional statement be added, "if (true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
                be preserved if it were present.

    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });

*/

(function () {

    var acorn = {};
    (function (exports) {
      // This section of code is taken from acorn.
      //
      // Acorn was written by Marijn Haverbeke and released under an MIT
      // license. The Unicode regexps (for identifiers and whitespace) were
      // taken from [Esprima](http://esprima.org) by Ariya Hidayat.
      //
      // Git repositories for Acorn are available at
      //
      //     http://marijnhaverbeke.nl/git/acorn
      //     https://github.com/marijnh/acorn.git

      // ## Character categories

      // Big ugly regular expressions that match characters in the
      // whitespace, identifier, and identifier-start categories. These
      // are only applied when a character is found to actually have a
      // code point above 128.

      var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
      var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
      var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
      var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
      var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

      // Whether a single character denotes a newline.

      var newline = /[\n\r\u2028\u2029]/;

      // Matches a whole line break (where CRLF is considered a single
      // line break). Used to count lines.

      var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

      // Test whether a given character code starts an identifier.

      var isIdentifierStart = exports.isIdentifierStart = function(code) {
        if (code < 65) return code === 36;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123)return true;
        return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
      };

      // Test whether a given character is part of an identifier.

      var isIdentifierChar = exports.isIdentifierChar = function(code) {
        if (code < 48) return code === 36;
        if (code < 58) return true;
        if (code < 65) return false;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123)return true;
        return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
      };
    })(acorn);

    function js_beautify(js_source_text, options) {
        "use strict";
        var beautifier = new Beautifier(js_source_text, options);
        return beautifier.beautify();
    }

    function Beautifier(js_source_text, options) {
        "use strict";
        var input, output_lines;
        var token_text, token_type, last_type, last_last_text, indent_string;
        var flags, previous_flags, flag_store;
        var whitespace, wordchar, punct, parser_pos, line_starters, reserved_words, digits;
        var prefix;
        var input_wanted_newline;
        var output_space_before_token;
        var input_length, n_newlines, whitespace_before_token;
        var handlers, MODE, opt;
        var preindent_string = '';



        whitespace = "\n\r\t ".split('');
        wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
        digits = '0123456789'.split('');

        punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! ~ , : ? ^ ^= |= :: =>';
        punct += ' <%= <% %> <?= <? ?>'; // try to be a good boy and try not to break the markup language identifiers
        punct = punct.split(' ');

        // words which should always start on new line.
        line_starters = 'continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,yield'.split(',');
        reserved_words = line_starters.concat(['do', 'in', 'else', 'get', 'set', 'new', 'catch', 'finally', 'typeof']);


        MODE = {
            BlockStatement: 'BlockStatement', // 'BLOCK'
            Statement: 'Statement', // 'STATEMENT'
            ObjectLiteral: 'ObjectLiteral', // 'OBJECT',
            ArrayLiteral: 'ArrayLiteral', //'[EXPRESSION]',
            ForInitializer: 'ForInitializer', //'(FOR-EXPRESSION)',
            Conditional: 'Conditional', //'(COND-EXPRESSION)',
            Expression: 'Expression' //'(EXPRESSION)'
        };

        handlers = {
            'TK_START_EXPR': handle_start_expr,
            'TK_END_EXPR': handle_end_expr,
            'TK_START_BLOCK': handle_start_block,
            'TK_END_BLOCK': handle_end_block,
            'TK_WORD': handle_word,
            'TK_RESERVED': handle_word,
            'TK_SEMICOLON': handle_semicolon,
            'TK_STRING': handle_string,
            'TK_EQUALS': handle_equals,
            'TK_OPERATOR': handle_operator,
            'TK_COMMA': handle_comma,
            'TK_BLOCK_COMMENT': handle_block_comment,
            'TKInLINE_COMMENT': handleInline_comment,
            'TK_COMMENT': handle_comment,
            'TK_DOT': handle_dot,
            'TK_UNKNOWN': handle_unknown
        };

        function create_flags(flags_base, mode) {
            var nextIndent_level = 0;
            if (flags_base) {
                nextIndent_level = flags_base.indentation_level;
                if (!justAdded_newline() &&
                    flags_base.lineIndent_level > nextIndent_level) {
                    nextIndent_level = flags_base.lineIndent_level;
                }
            }

            var next_flags = {
                mode: mode,
                parent: flags_base,
                last_text: flags_base ? flags_base.last_text : '', // last token text
                last_word: flags_base ? flags_base.last_word : '', // last 'TK_WORD' passed
                declaration_statement: false,
                declaration_assignment: false,
                in_html_comment: false,
                multiline_frame: false,
                if_block: false,
                else_block: false,
                do_block: false,
                do_while: false,
                in_case_statement: false, // switch (..){ INSIDE HERE }
                in_case: false, // we're on the exact line with "case 0:"
                case_body: false, // the indented case-action block
                indentation_level: nextIndent_level,
                lineIndent_level: flags_base ? flags_base.lineIndent_level : nextIndent_level,
                start_lineIndex: output_lines.length,
                had_comment: false,
                ternary_depth: 0
            };
            return next_flags;
        }

        // Using object instead of string to allow for later expansion of info about each line

        function createOutput_line() {
            return {
                text: []
            };
        }

        // Some interpreters have unexpected results with foo = baz || bar;
        options = options ? options : {};
        opt = {};

        // compatibility
        if (options.spaceAfter_anon_function !== undefined && options.jslint_happy === undefined) {
            options.jslint_happy = options.spaceAfter_anon_function;
        }
        if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
            opt.brace_style = options.braces_on_own_line ? "expand" : "collapse";
        }
        opt.brace_style = options.brace_style ? options.brace_style : (opt.brace_style ? opt.brace_style : "collapse");

        // graceful handling of deprecated option
        if (opt.brace_style === "expand-strict") {
            opt.brace_style = "expand";
        }


        opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
        opt.indent_char = options.indent_char ? options.indent_char : ' ';
        opt.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
        opt.break_chained_methods = (options.break_chained_methods === undefined) ? false : options.break_chained_methods;
        opt.max_preserve_newlines = (options.max_preserve_newlines === undefined) ? 0 : parseInt(options.max_preserve_newlines, 10);
        opt.spaceIn_paren = (options.spaceIn_paren === undefined) ? false : options.spaceIn_paren;
        opt.spaceIn_empty_paren = (options.spaceIn_empty_paren === undefined) ? false : options.spaceIn_empty_paren;
        opt.jslint_happy = (options.jslint_happy === undefined) ? false : options.jslint_happy;
        opt.keep_arrayIndentation = (options.keep_arrayIndentation === undefined) ? false : options.keep_arrayIndentation;
        opt.space_before_conditional = (options.space_before_conditional === undefined) ? true : options.space_before_conditional;
        opt.unescape_strings = (options.unescape_strings === undefined) ? false : options.unescape_strings;
        opt.wrap_line_length = (options.wrap_line_length === undefined) ? 0 : parseInt(options.wrap_line_length, 10);
        opt.e4x = (options.e4x === undefined) ? false : options.e4x;

        if (options.indent_with_tabs){
            opt.indent_char = '\t';
            opt.indent_size = 1;
        }

        //----------------------------------
        indent_string = '';
        while (opt.indent_size > 0) {
            indent_string += opt.indent_char;
            opt.indent_size -= 1;
        }

        while (js_source_text && (js_source_text.charAt(0) === ' ' || js_source_text.charAt(0) === '\t')) {
            preindent_string += js_source_text.charAt(0);
            js_source_text = js_source_text.substring(1);
        }
        input = js_source_text;
        // cache the source's length.
        input_length = js_source_text.length;

        last_type = 'TK_START_BLOCK'; // last token type
        last_last_text = ''; // pre-last token text
        output_lines = [createOutput_line()];
        output_space_before_token = false;
        whitespace_before_token = [];

        // Stack of parsing/formatting states, including MODE.
        // We tokenize, parse, and output in an almost purely a forward-only stream of token input
        // and formatted output.  This makes the beautifier less accurate than full parsers
        // but also far more tolerant of syntax errors.
        //
        // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
        // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
        // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
        // most full parsers would die, but the beautifier gracefully falls back to
        // MODE.BlockStatement and continues on.
        flag_store = [];
        set_mode(MODE.BlockStatement);

        parser_pos = 0;

        this.beautify = function () {
            /*jshint onevar:true */
            var t, i, keep_whitespace, sweet_code;

            while (true) {
                t = get_next_token();
                token_text = t[0];
                token_type = t[1];

                if (token_type === 'TK_EOF') {
                    // Unwind any open statements
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    break;
                }

                keep_whitespace = opt.keep_arrayIndentation && is_array(flags.mode);
                input_wanted_newline = n_newlines > 0;

                if (keep_whitespace) {
                    for (i = 0; i < n_newlines; i += 1) {
                        print_newline(i > 0);
                    }
                } else {
                    if (opt.max_preserve_newlines && n_newlines > opt.max_preserve_newlines) {
                        n_newlines = opt.max_preserve_newlines;
                    }

                    if (opt.preserve_newlines) {
                        if (n_newlines > 1) {
                            print_newline();
                            for (i = 1; i < n_newlines; i += 1) {
                                print_newline(true);
                            }
                        }
                    }
                }

                handlers[token_type]();

                // The cleanest handling of inline comments is to treat them as though they aren't there.
                // Just continue formatting and the behavior should be logical.
                // Also ignore unknown tokens.  Again, this should result in better behavior.
                if (token_type !== 'TKInLINE_COMMENT' && token_type !== 'TK_COMMENT' &&
                    token_type !== 'TK_BLOCK_COMMENT' && token_type !== 'TK_UNKNOWN') {
                    last_last_text = flags.last_text;
                    last_type = token_type;
                    flags.last_text = token_text;
                }
                flags.had_comment = (token_type === 'TKInLINE_COMMENT' || token_type === 'TK_COMMENT'
                    || token_type === 'TK_BLOCK_COMMENT');
            }


            sweet_code = output_lines[0].text.join('');
            for (var lineIndex = 1; lineIndex < output_lines.length; lineIndex++) {
                sweet_code += '\n' + output_lines[lineIndex].text.join('');
            }
            sweet_code = sweet_code.replace(/[\r\n ]+$/, '');
            return sweet_code;
        };

        function trimOutput(eat_newlines) {
            eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;

            if (output_lines.length) {
                trimOutput_line(output_lines[output_lines.length - 1], eat_newlines);

                while (eat_newlines && output_lines.length > 1 &&
                    output_lines[output_lines.length - 1].text.length === 0) {
                    output_lines.pop();
                    trimOutput_line(output_lines[output_lines.length - 1], eat_newlines);
                }
            }
        }

        function trimOutput_line(line) {
            while (line.text.length &&
                (line.text[line.text.length - 1] === ' ' ||
                    line.text[line.text.length - 1] === indent_string ||
                    line.text[line.text.length - 1] === preindent_string)) {
                line.text.pop();
            }
        }

        function trim(s) {
            return s.replace(/^\s+|\s+$/g, '');
        }

        // we could use just string.split, but
        // IE doesn't like returning empty strings

        function split_newlines(s) {
            //return s.split(/\x0d\x0a|\x0a/);

            s = s.replace(/\x0d/g, '');
            var out = [],
                idx = s.indexOf("\n");
            while (idx !== -1) {
                out.push(s.substring(0, idx));
                s = s.substring(idx + 1);
                idx = s.indexOf("\n");
            }
            if (s.length) {
                out.push(s);
            }
            return out;
        }

        function justAdded_newline() {
            var line = output_lines[output_lines.length - 1];
            return line.text.length === 0;
        }

        function justAdded_blankline() {
            if (justAdded_newline()) {
                if (output_lines.length === 1) {
                    return true; // start of the file and newline = blank
                }

                var line = output_lines[output_lines.length - 2];
                return line.text.length === 0;
            }
            return false;
        }

        function allow_wrap_or_preserved_newline(force_linewrap) {
            force_linewrap = (force_linewrap === undefined) ? false : force_linewrap;
            if (opt.wrap_line_length && !force_linewrap) {
                var line = output_lines[output_lines.length - 1];
                var proposed_line_length = 0;
                // never wrap the first token of a line.
                if (line.text.length > 0) {
                    proposed_line_length = line.text.join('').length + token_text.length +
                        (output_space_before_token ? 1 : 0);
                    if (proposed_line_length >= opt.wrap_line_length) {
                        force_linewrap = true;
                    }
                }
            }
            if (((opt.preserve_newlines && input_wanted_newline) || force_linewrap) && !justAdded_newline()) {
                print_newline(false, true);

            }
        }

        function print_newline(force_newline, preserve_statement_flags) {
            output_space_before_token = false;

            if (!preserve_statement_flags) {
                if (flags.last_text !== ';' && flags.last_text !== ',' && flags.last_text !== '=' && last_type !== 'TK_OPERATOR') {
                    while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                        restore_mode();
                    }
                }
            }

            if (output_lines.length === 1 && justAdded_newline()) {
                return; // no newline on start of file
            }

            if (force_newline || !justAdded_newline()) {
                flags.multiline_frame = true;
                output_lines.push(createOutput_line());
            }
        }

        function print_token_lineIndentation() {
            if (justAdded_newline()) {
                var line = output_lines[output_lines.length - 1];
                if (opt.keep_arrayIndentation && is_array(flags.mode) && input_wanted_newline) {
                    // prevent removing of this whitespace as redundant
                    line.text.push('');
                    for (var i = 0; i < whitespace_before_token.length; i += 1) {
                        line.text.push(whitespace_before_token[i]);
                    }
                } else {
                    if (preindent_string) {
                        line.text.push(preindent_string);
                    }

                    printIndent_string(flags.indentation_level);
                }
            }
        }

        function printIndent_string(level) {
            // Never indent your first output indent at the start of the file
            if (output_lines.length > 1) {
                var line = output_lines[output_lines.length - 1];

                flags.lineIndent_level = level;
                for (var i = 0; i < level; i += 1) {
                    line.text.push(indent_string);
                }
            }
        }

        function print_token_space_before() {
            var line = output_lines[output_lines.length - 1];
            if (output_space_before_token && line.text.length) {
                var lastOutput = line.text[line.text.length - 1];
                if (lastOutput !== ' ' && lastOutput !== indent_string) { // prevent occassional duplicate space
                    line.text.push(' ');
                }
            }
        }

        function print_token(printable_token) {
            printable_token = printable_token || token_text;
            print_token_lineIndentation();
            print_token_space_before();
            output_space_before_token = false;
            output_lines[output_lines.length - 1].text.push(printable_token);
        }

        function indent() {
            flags.indentation_level += 1;
        }

        function deindent() {
            if (flags.indentation_level > 0 &&
                ((!flags.parent) || flags.indentation_level > flags.parent.indentation_level))
                flags.indentation_level -= 1;
        }

        function remove_redundantIndentation(frame) {
            // This implementation is effective but has some issues:
            //     - less than great performance due to array splicing
            //     - can cause line wrap to happen too soon due to indent removal
            //           after wrap points are calculated
            // These issues are minor compared to ugly indentation.

            if (frame.multiline_frame) return;

            // remove one indent from each line inside this section
            var index = frame.start_lineIndex;
            var spliceIndex = 0;
            var line;

            while (index < output_lines.length) {
                line = output_lines[index];
                index++;

                // skip empty lines
                if (line.text.length === 0) {
                    continue;
                }

                // skip the preindent string if present
                if (preindent_string && line.text[0] === preindent_string) {
                    spliceIndex = 1;
                } else {
                    spliceIndex = 0;
                }

                // remove one indent, if present
                if (line.text[spliceIndex] === indent_string) {
                    line.text.splice(spliceIndex, 1);
                }
            }
        }

        function set_mode(mode) {
            if (flags) {
                flag_store.push(flags);
                previous_flags = flags;
            } else {
                previous_flags = create_flags(null, mode);
            }

            flags = create_flags(previous_flags, mode);
        }

        function is_array(mode) {
            return mode === MODE.ArrayLiteral;
        }

        function is_expression(mode) {
            return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
        }

        function restore_mode() {
            if (flag_store.length > 0) {
                previous_flags = flags;
                flags = flag_store.pop();
                if (previous_flags.mode === MODE.Statement) {
                    remove_redundantIndentation(previous_flags);
                }
            }
        }

        function start_of_object_property() {
            return flags.parent.mode === MODE.ObjectLiteral && flags.mode === MODE.Statement && flags.last_text === ':' &&
                flags.ternary_depth === 0;
        }

        function start_of_statement() {
            if (
                    (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && token_type === 'TK_WORD') ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'do') ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'return' && !input_wanted_newline) ||
                    (last_type === 'TK_RESERVED' && flags.last_text === 'else' && !(token_type === 'TK_RESERVED' && token_text === 'if')) ||
                    (last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional)) ||
                    (last_type === 'TK_WORD' && flags.mode === MODE.BlockStatement
                        && !flags.in_case
                        && !(token_text === '--' || token_text === '++')
                        && token_type !== 'TK_WORD' && token_type !== 'TK_RESERVED') ||
                    (flags.mode === MODE.ObjectLiteral && flags.last_text === ':' && flags.ternary_depth === 0)

                ) {

                set_mode(MODE.Statement);
                indent();

                if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && token_type === 'TK_WORD') {
                    flags.declaration_statement = true;
                }

                // Issue #276:
                // If starting a new statement with [if, for, while, do], push to a new line.
                // if (a) if (b) if (c) d(); else e(); else f();
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline(
                        token_type === 'TK_RESERVED' && in_array(token_text, ['do', 'for', 'if', 'while']));
                }

                return true;
            }
            return false;
        }

        function all_lines_start_with(lines, c) {
            for (var i = 0; i < lines.length; i++) {
                var line = trim(lines[i]);
                if (line.charAt(0) !== c) {
                    return false;
                }
            }
            return true;
        }

        function each_line_matchesIndent(lines, indent) {
            var i = 0,
                len = lines.length,
                line;
            for (; i < len; i++) {
                line = lines[i];
                // allow empty lines to pass through
                if (line && line.indexOf(indent) !== 0) {
                    return false;
                }
            }
            return true;
        }

        function is_special_word(word) {
            return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
        }

        function in_array(what, arr) {
            for (var i = 0; i < arr.length; i += 1) {
                if (arr[i] === what) {
                    return true;
                }
            }
            return false;
        }

        function unescape_string(s) {
            var esc = false,
                out = '',
                pos = 0,
                s_hex = '',
                escaped = 0,
                c;

            while (esc || pos < s.length) {

                c = s.charAt(pos);
                pos++;

                if (esc) {
                    esc = false;
                    if (c === 'x') {
                        // simple hex-escape \x24
                        s_hex = s.substr(pos, 2);
                        pos += 2;
                    } else if (c === 'u') {
                        // unicode-escape, \u2134
                        s_hex = s.substr(pos, 4);
                        pos += 4;
                    } else {
                        // some common escape, e.g \n
                        out += '\\' + c;
                        continue;
                    }
                    if (!s_hex.match(/^[0123456789abcdefABCDEF]+$/)) {
                        // some weird escaping, bail out,
                        // leaving whole string intact
                        return s;
                    }

                    escaped = parseInt(s_hex, 16);

                    if (escaped >= 0x00 && escaped < 0x20) {
                        // leave 0x00...0x1f escaped
                        if (c === 'x') {
                            out += '\\x' + s_hex;
                        } else {
                            out += '\\u' + s_hex;
                        }
                        continue;
                    } else if (escaped === 0x22 || escaped === 0x27 || escaped === 0x5c) {
                        // single-quote, apostrophe, backslash - escape these
                        out += '\\' + String.fromCharCode(escaped);
                    } else if (c === 'x' && escaped > 0x7e && escaped <= 0xff) {
                        // we bail out on \x7f..\xff,
                        // leaving whole string escaped,
                        // as it's probably completely binary
                        return s;
                    } else {
                        out += String.fromCharCode(escaped);
                    }
                } else if (c === '\\') {
                    esc = true;
                } else {
                    out += c;
                }
            }
            return out;
        }

        function is_next(find) {
            var local_pos = parser_pos;
            var c = input.charAt(local_pos);
            while (in_array(c, whitespace) && c !== find) {
                local_pos++;
                if (local_pos >= input_length) {
                    return false;
                }
                c = input.charAt(local_pos);
            }
            return c === find;
        }

        function get_next_token() {
            var i, resulting_string;

            n_newlines = 0;

            if (parser_pos >= input_length) {
                return ['', 'TK_EOF'];
            }

            input_wanted_newline = false;
            whitespace_before_token = [];

            var c = input.charAt(parser_pos);
            parser_pos += 1;

            while (in_array(c, whitespace)) {

                if (c === '\n') {
                    n_newlines += 1;
                    whitespace_before_token = [];
                } else if (n_newlines) {
                    if (c === indent_string) {
                        whitespace_before_token.push(indent_string);
                    } else if (c !== '\r') {
                        whitespace_before_token.push(' ');
                    }
                }

                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;
            }

            // NOTE: because beautifier doesn't fully parse, it doesn't use acorn.isIdentifierStart.
            // It just treats all identifiers and numbers and such the same.
            if (acorn.isIdentifierChar(input.charCodeAt(parser_pos-1))) {
                if (parser_pos < input_length) {
                    while (acorn.isIdentifierChar(input.charCodeAt(parser_pos))) {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos === input_length) {
                            break;
                        }
                    }
                }

                // small and surprisingly unugly hack for 1E-10 representation
                if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === '-' || input.charAt(parser_pos) === '+')) {

                    var sign = input.charAt(parser_pos);
                    parser_pos += 1;

                    var t = get_next_token();
                    c += sign + t[0];
                    return [c, 'TK_WORD'];
                }

                if (!(last_type === 'TK_DOT' ||
                        (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['set', 'get'])))
                    && in_array(c, reserved_words)) {
                    if (c === 'in') { // hack for 'in' operator
                        return [c, 'TK_OPERATOR'];
                    }
                    return [c, 'TK_RESERVED'];
                }
                return [c, 'TK_WORD'];
            }

            if (c === '(' || c === '[') {
                return [c, 'TK_START_EXPR'];
            }

            if (c === ')' || c === ']') {
                return [c, 'TK_END_EXPR'];
            }

            if (c === '{') {
                return [c, 'TK_START_BLOCK'];
            }

            if (c === '}') {
                return [c, 'TK_END_BLOCK'];
            }

            if (c === ';') {
                return [c, 'TK_SEMICOLON'];
            }

            if (c === '/') {
                var comment = '';
                // peek for comment /* ... */
                var inline_comment = true;
                if (input.charAt(parser_pos) === '*') {
                    parser_pos += 1;
                    if (parser_pos < input_length) {
                        while (parser_pos < input_length && !(input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/')) {
                            c = input.charAt(parser_pos);
                            comment += c;
                            if (c === "\n" || c === "\r") {
                                inline_comment = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                break;
                            }
                        }
                    }
                    parser_pos += 2;
                    if (inline_comment && n_newlines === 0) {
                        return ['/*' + comment + '*/', 'TKInLINE_COMMENT'];
                    } else {
                        return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                    }
                }
                // peek for comment // ...
                if (input.charAt(parser_pos) === '/') {
                    comment = c;
                    while (input.charAt(parser_pos) !== '\r' && input.charAt(parser_pos) !== '\n') {
                        comment += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            break;
                        }
                    }
                    return [comment, 'TK_COMMENT'];
                }

            }


            if (c === '`' || c === "'" || c === '"' || // string
                (
                    (c === '/') || // regexp
                    (opt.e4x && c === "<" && input.slice(parser_pos - 1).match(/^<([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*\/?\s*>/)) // xml
                ) && ( // regex and xml can only appear in specific locations during parsing
                    (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) ||
                    (last_type === 'TK_END_EXPR' && in_array(previous_flags.mode, [MODE.Conditional, MODE.ForInitializer])) ||
                    (in_array(last_type, ['TK_COMMENT', 'TK_START_EXPR', 'TK_START_BLOCK',
                        'TK_END_BLOCK', 'TK_OPERATOR', 'TK_EQUALS', 'TK_EOF', 'TK_SEMICOLON', 'TK_COMMA'
                    ]))
                )) {

                var sep = c,
                    esc = false,
                    has_char_escapes = false;

                resulting_string = c;

                if (parser_pos < input_length) {
                    if (sep === '/') {
                        //
                        // handle regexp
                        //
                        var in_char_class = false;
                        while (esc || in_char_class || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (!esc) {
                                esc = input.charAt(parser_pos) === '\\';
                                if (input.charAt(parser_pos) === '[') {
                                    in_char_class = true;
                                } else if (input.charAt(parser_pos) === ']') {
                                    in_char_class = false;
                                }
                            } else {
                                esc = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }
                    } else if (opt.e4x && sep === '<') {
                        //
                        // handle e4x xml literals
                        //
                        var xmlRegExp = /<(\/?)([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*(\/?)\s*>/g;
                        var xmlStr = input.slice(parser_pos - 1);
                        var match = xmlRegExp.exec(xmlStr);
                        if (match && match.index === 0) {
                            var rootTag = match[2];
                            var depth = 0;
                            while (match) {
                                var isEndTag = !! match[1];
                                var tagName = match[2];
                                var isSingletonTag = ( !! match[match.length - 1]) || (tagName.slice(0, 8) === "![CDATA[");
                                if (tagName === rootTag && !isSingletonTag) {
                                    if (isEndTag) {
                                        --depth;
                                    } else {
                                        ++depth;
                                    }
                                }
                                if (depth <= 0) {
                                    break;
                                }
                                match = xmlRegExp.exec(xmlStr);
                            }
                            var xmlLength = match ? match.index + match[0].length : xmlStr.length;
                            parser_pos += xmlLength - 1;
                            return [xmlStr.slice(0, xmlLength), "TK_STRING"];
                        }
                    } else {
                        //
                        // handle string
                        //
                        while (esc || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (esc) {
                                if (input.charAt(parser_pos) === 'x' || input.charAt(parser_pos) === 'u') {
                                    has_char_escapes = true;
                                }
                                esc = false;
                            } else {
                                esc = input.charAt(parser_pos) === '\\';
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }

                    }
                }

                parser_pos += 1;
                resulting_string += sep;

                if (has_char_escapes && opt.unescape_strings) {
                    resulting_string = unescape_string(resulting_string);
                }

                if (sep === '/') {
                    // regexps may have modifiers /regexp/MOD , so fetch those, too
                    while (parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar)) {
                        resulting_string += input.charAt(parser_pos);
                        parser_pos += 1;
                    }
                }
                return [resulting_string, 'TK_STRING'];
            }

            if (c === '#') {


                if (output_lines.length === 1 && output_lines[0].text.length === 0 &&
                    input.charAt(parser_pos) === '!') {
                    // shebang
                    resulting_string = c;
                    while (parser_pos < input_length && c !== '\n') {
                        c = input.charAt(parser_pos);
                        resulting_string += c;
                        parser_pos += 1;
                    }
                    return [trim(resulting_string) + '\n', 'TK_UNKNOWN'];
                }



                // Spidermonkey-specific sharp variables for circular references
                // https://developer.mozilla.org/En/SharpVariablesIn_JavaScript
                // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
                var sharp = '#';
                if (parser_pos < input_length && in_array(input.charAt(parser_pos), digits)) {
                    do {
                        c = input.charAt(parser_pos);
                        sharp += c;
                        parser_pos += 1;
                    } while (parser_pos < input_length && c !== '#' && c !== '=');
                    if (c === '#') {
                        //
                    } else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
                        sharp += '[]';
                        parser_pos += 2;
                    } else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
                        sharp += '{}';
                        parser_pos += 2;
                    }
                    return [sharp, 'TK_WORD'];
                }
            }

            if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
                parser_pos += 3;
                c = '<!--';
                while (input.charAt(parser_pos) !== '\n' && parser_pos < input_length) {
                    c += input.charAt(parser_pos);
                    parser_pos++;
                }
                flags.in_html_comment = true;
                return [c, 'TK_COMMENT'];
            }

            if (c === '-' && flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
                flags.in_html_comment = false;
                parser_pos += 2;
                return ['-->', 'TK_COMMENT'];
            }

            if (c === '.') {
                return [c, 'TK_DOT'];
            }

            if (in_array(c, punct)) {
                while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }

                if (c === ',') {
                    return [c, 'TK_COMMA'];
                } else if (c === '=') {
                    return [c, 'TK_EQUALS'];
                } else {
                    return [c, 'TK_OPERATOR'];
                }
            }

            return [c, 'TK_UNKNOWN'];
        }

        function handle_start_expr() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            var next_mode = MODE.Expression;
            if (token_text === '[') {

                if (last_type === 'TK_WORD' || flags.last_text === ')') {
                    // this is array index specifier, break immediately
                    // a[x], fn()[x]
                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, line_starters)) {
                        output_space_before_token = true;
                    }
                    set_mode(next_mode);
                    print_token();
                    indent();
                    if (opt.spaceIn_paren) {
                        output_space_before_token = true;
                    }
                    return;
                }

                next_mode = MODE.ArrayLiteral;
                if (is_array(flags.mode)) {
                    if (flags.last_text === '[' ||
                        (flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}'))) {
                        // ], [ goes to new line
                        // }, [ goes to new line
                        if (!opt.keep_arrayIndentation) {
                            print_newline();
                        }
                    }
                }

            } else {
                if (last_type === 'TK_RESERVED' && flags.last_text === 'for') {
                    next_mode = MODE.ForInitializer;
                } else if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['if', 'while'])) {
                    next_mode = MODE.Conditional;
                } else {
                    // next_mode = MODE.Expression;
                }
            }

            if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
                print_newline();
            } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
                // TODO: Consider whether forcing this is required.  Review failing tests when removed.
                allow_wrap_or_preserved_newline(input_wanted_newline);
                // do nothing on (( and )( and ][ and ]( and .(
            } else if (!(last_type === 'TK_RESERVED' && token_text === '(') && last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                output_space_before_token = true;
            } else if ((last_type === 'TK_RESERVED' && (flags.last_word === 'function' || flags.last_word === 'typeof')) ||
                (flags.last_text === '*' && last_last_text === 'function')) {
                // function () vs function ()
                if (opt.jslint_happy) {
                    output_space_before_token = true;
                }
            } else if (last_type === 'TK_RESERVED' && (in_array(flags.last_text, line_starters) || flags.last_text === 'catch')) {
                if (opt.space_before_conditional) {
                    output_space_before_token = true;
                }
            }

            // Support of this kind of newline preservation.
            // a = (b &&
            //     (c || d));
            if (token_text === '(') {
                if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                    if (!start_of_object_property()) {
                        allow_wrap_or_preserved_newline();
                    }
                }
            }

            set_mode(next_mode);
            print_token();
            if (opt.spaceIn_paren) {
                output_space_before_token = true;
            }

            // In all cases, if we newline while inside an expression it should be indented.
            indent();
        }

        function handle_end_expr() {
            // statements inside expressions are not valid syntax, but...
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }

            if (flags.multiline_frame) {
                allow_wrap_or_preserved_newline(token_text === ']' && is_array(flags.mode) && !opt.keep_arrayIndentation);
            }

            if (opt.spaceIn_paren) {
                if (last_type === 'TK_START_EXPR' && ! opt.spaceIn_empty_paren) {
                    // () [] no inner space in empty parens like these, ever, ref #320
                    trimOutput();
                    output_space_before_token = false;
                } else {
                    output_space_before_token = true;
                }
            }
            if (token_text === ']' && opt.keep_arrayIndentation) {
                print_token();
                restore_mode();
            } else {
                restore_mode();
                print_token();
            }
            remove_redundantIndentation(previous_flags);

            // do {} while () // no statement required after
            if (flags.do_while && previous_flags.mode === MODE.Conditional) {
                previous_flags.mode = MODE.Expression;
                flags.do_block = false;
                flags.do_while = false;

            }
        }

        function handle_start_block() {
            set_mode(MODE.BlockStatement);

            var empty_braces = is_next('}');
            var empty_anonymous_function = empty_braces && flags.last_word === 'function' &&
                last_type === 'TK_END_EXPR';

            if (opt.brace_style === "expand") {
                if (last_type !== 'TK_OPERATOR' &&
                    (empty_anonymous_function ||
                        last_type === 'TK_EQUALS' ||
                        (last_type === 'TK_RESERVED' && is_special_word(flags.last_text) && flags.last_text !== 'else'))) {
                    output_space_before_token = true;
                } else {
                    print_newline(false, true);
                }
            } else { // collapse
                if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                    if (last_type === 'TK_START_BLOCK') {
                        print_newline();
                    } else {
                        output_space_before_token = true;
                    }
                } else {
                    // if TK_OPERATOR or TK_START_EXPR
                    if (is_array(previous_flags.mode) && flags.last_text === ',') {
                        if (last_last_text === '}') {
                            // }, { in array context
                            output_space_before_token = true;
                        } else {
                            print_newline(); // [a, b, c, {
                        }
                    }
                }
            }
            print_token();
            indent();
        }

        function handle_end_block() {
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }
            var empty_braces = last_type === 'TK_START_BLOCK';

            if (opt.brace_style === "expand") {
                if (!empty_braces) {
                    print_newline();
                }
            } else {
                // skip {}
                if (!empty_braces) {
                    if (is_array(flags.mode) && opt.keep_arrayIndentation) {
                        // we REALLY need a newline here, but newliner would skip that
                        opt.keep_arrayIndentation = false;
                        print_newline();
                        opt.keep_arrayIndentation = true;

                    } else {
                        print_newline();
                    }
                }
            }
            restore_mode();
            print_token();
        }

        function handle_word() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            } else if (input_wanted_newline && !is_expression(flags.mode) &&
                (last_type !== 'TK_OPERATOR' || (flags.last_text === '--' || flags.last_text === '++')) &&
                last_type !== 'TK_EQUALS' &&
                (opt.preserve_newlines || !(last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const', 'set', 'get'])))) {

                print_newline();
            }

            if (flags.do_block && !flags.do_while) {
                if (token_type === 'TK_RESERVED' && token_text === 'while') {
                    // do {} ## while ()
                    output_space_before_token = true;
                    print_token();
                    output_space_before_token = true;
                    flags.do_while = true;
                    return;
                } else {
                    // do {} should always have while as the next word.
                    // if we don't see the expected while, recover
                    print_newline();
                    flags.do_block = false;
                }
            }

            // if may be followed by else, or not
            // Bare/inline ifs are tricky
            // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
            if (flags.if_block) {
                if (!flags.else_block && (token_type === 'TK_RESERVED' && token_text === 'else')) {
                    flags.else_block = true;
                } else {
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    flags.if_block = false;
                    flags.else_block = false;
                }
            }

            if (token_type === 'TK_RESERVED' && (token_text === 'case' || (token_text === 'default' && flags.in_case_statement))) {
                print_newline();
                if (flags.case_body || opt.jslint_happy) {
                    // switch cases following one another
                    deindent();
                    flags.case_body = false;
                }
                print_token();
                flags.in_case = true;
                flags.in_case_statement = true;
                return;
            }

            if (token_type === 'TK_RESERVED' && token_text === 'function') {
                if (in_array(flags.last_text, ['}', ';']) || (justAdded_newline() && ! in_array(flags.last_text, ['[', '{', ':', '=', ',']))) {
                    // make sure there is a nice clean space of at least one blank line
                    // before a new function definition
                    if ( ! justAdded_blankline() && ! flags.had_comment) {
                        print_newline();
                        print_newline(true);
                    }
                }
                if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set', 'new', 'return'])) {
                        output_space_before_token = true;
                    } else {
                        print_newline();
                    }
                } else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
                    // foo = function
                    output_space_before_token = true;
                } else if (is_expression(flags.mode)) {
                    // (function
                } else {
                    print_newline();
                }
            }

            if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            }

            if (token_type === 'TK_RESERVED' && token_text === 'function') {
                print_token();
                flags.last_word = token_text;
                return;
            }

            prefix = 'NONE';

            if (last_type === 'TK_END_BLOCK') {
                if (!(token_type === 'TK_RESERVED' && in_array(token_text, ['else', 'catch', 'finally']))) {
                    prefix = 'NEWLINE';
                } else {
                    if (opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                        prefix = 'NEWLINE';
                    } else {
                        prefix = 'SPACE';
                        output_space_before_token = true;
                    }
                }
            } else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
                // TODO: Should this be for STATEMENT as well?
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_STRING') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' ||
                (flags.last_text === '*' && last_last_text === 'function')) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_START_BLOCK') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_END_EXPR') {
                output_space_before_token = true;
                prefix = 'NEWLINE';
            }

            if (token_type === 'TK_RESERVED' && in_array(token_text, line_starters) && flags.last_text !== ')') {
                if (flags.last_text === 'else') {
                    prefix = 'SPACE';
                } else {
                    prefix = 'NEWLINE';
                }

            }

            if (token_type === 'TK_RESERVED' && in_array(token_text, ['else', 'catch', 'finally'])) {
                if (last_type !== 'TK_END_BLOCK' || opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                    print_newline();
                } else {
                    trimOutput(true);
                    var line = output_lines[output_lines.length - 1];
                    // If we trimmed and there's something other than a close block before us
                    // put a newline back in.  Handles '} // comment' scenario.
                    if (line.text[line.text.length - 1] !== '}') {
                        print_newline();
                    }
                    output_space_before_token = true;
                }
            } else if (prefix === 'NEWLINE') {
                if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                    // no newline between 'return nnn'
                    output_space_before_token = true;
                } else if (last_type !== 'TK_END_EXPR') {
                    if ((last_type !== 'TK_START_EXPR' || !(token_type === 'TK_RESERVED' && in_array(token_text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
                        // no need to force newline on 'var': for (var x = 0...)
                        if (token_type === 'TK_RESERVED' && token_text === 'if' && flags.last_word === 'else' && flags.last_text !== '{') {
                            // no newline for } else if {
                            output_space_before_token = true;
                        } else {
                            print_newline();
                        }
                    }
                } else if (token_type === 'TK_RESERVED' && in_array(token_text, line_starters) && flags.last_text !== ')') {
                    print_newline();
                }
            } else if (is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
                print_newline(); // }, in lists get a newline treatment
            } else if (prefix === 'SPACE') {
                output_space_before_token = true;
            }
            print_token();
            flags.last_word = token_text;

            if (token_type === 'TK_RESERVED' && token_text === 'do') {
                flags.do_block = true;
            }

            if (token_type === 'TK_RESERVED' && token_text === 'if') {
                flags.if_block = true;
            }
        }

        function handle_semicolon() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // Semicolon can be the start (and end) of a statement
                output_space_before_token = false;
            }
            while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                restore_mode();
            }
            print_token();
            if (flags.mode === MODE.ObjectLiteral) {
                // if we're in OBJECT mode and see a semicolon, its invalid syntax
                // recover back to treating this as a BLOCK
                flags.mode = MODE.BlockStatement;
            }
        }

        function handle_string() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // One difference - strings want at least a space before
                output_space_before_token = true;
            } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
                output_space_before_token = true;
            } else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            } else {
                print_newline();
            }
            print_token();
        }

        function handle_equals() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            if (flags.declaration_statement) {
                // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                flags.declaration_assignment = true;
            }
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }

        function handle_comma() {
            if (flags.declaration_statement) {
                if (is_expression(flags.parent.mode)) {
                    // do not break on comma, for (var a = 1, b = 2)
                    flags.declaration_assignment = false;
                }

                print_token();

                if (flags.declaration_assignment) {
                    flags.declaration_assignment = false;
                    print_newline(false, true);
                } else {
                    output_space_before_token = true;
                }
                return;
            }

            print_token();
            if (flags.mode === MODE.ObjectLiteral ||
                (flags.mode === MODE.Statement && flags.parent.mode === MODE.ObjectLiteral)) {
                if (flags.mode === MODE.Statement) {
                    restore_mode();
                }
                print_newline();
            } else {
                // EXPR or DO_BLOCK
                output_space_before_token = true;
            }

        }

        function handle_operator() {
            // Check if this is a BlockStatement that should be treated as a ObjectLiteral
            if (token_text === ':' && flags.mode === MODE.BlockStatement &&
                    last_last_text === '{' &&
                    (last_type === 'TK_WORD' || last_type === 'TK_RESERVED')){
                flags.mode = MODE.ObjectLiteral;
            }

            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            var space_before = true;
            var spaceAfter = true;
            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                // "return" had a special handling in TK_WORD. Now we need to return the favor
                output_space_before_token = true;
                print_token();
                return;
            }

            // hack for actionscript's import .*;
            if (token_text === '*' && last_type === 'TK_DOT' && !last_last_text.match(/^\d+$/)) {
                print_token();
                return;
            }

            if (token_text === ':' && flags.in_case) {
                flags.case_body = true;
                indent();
                print_token();
                print_newline();
                flags.in_case = false;
                return;
            }

            if (token_text === '::') {
                // no spaces around exotic namespacing syntax operator
                print_token();
                return;
            }

            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
            // if there is a newline between -- or ++ and anything else we should preserve it.
            if (input_wanted_newline && (token_text === '--' || token_text === '++')) {
                print_newline(false, true);
            }

            // Allow line wrapping between operators
            if (last_type === 'TK_OPERATOR') {
                allow_wrap_or_preserved_newline();
            }

            if (in_array(token_text, ['--', '++', '!', '~']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(flags.last_text, line_starters) || flags.last_text === ','))) {
                // unary operators (and binary +/- pretending to be unary) special cases

                space_before = false;
                spaceAfter = false;

                if (flags.last_text === ';' && is_expression(flags.mode)) {
                    // for (;; ++i)
                    //        ^^^
                    space_before = true;
                }

                if (last_type === 'TK_RESERVED' || last_type === 'TK_END_EXPR') {
                    space_before = true;
                }

                if ((flags.mode === MODE.BlockStatement || flags.mode === MODE.Statement) && (flags.last_text === '{' || flags.last_text === ';')) {
                    // { foo; --i }
                    // foo(); --bar;
                    print_newline();
                }
            } else if (token_text === ':') {
                if (flags.ternary_depth === 0) {
                    if (flags.mode === MODE.BlockStatement) {
                        flags.mode = MODE.ObjectLiteral;
                    }
                    space_before = false;
                } else {
                    flags.ternary_depth -= 1;
                }
            } else if (token_text === '?') {
                flags.ternary_depth += 1;
            } else if (token_text === '*' && last_type === 'TK_RESERVED' && flags.last_text === 'function') {
                space_before = false;
                spaceAfter = false;
            }
            output_space_before_token = output_space_before_token || space_before;
            print_token();
            output_space_before_token = spaceAfter;
        }

        function handle_block_comment() {
            var lines = split_newlines(token_text);
            var j; // iterator for this case
            var javadoc = false;
            var starless = false;
            var lastIndent = whitespace_before_token.join('');
            var lastIndentLength = lastIndent.length;

            // block comment starts with a new line
            print_newline(false, true);
            if (lines.length > 1) {
                if (all_lines_start_with(lines.slice(1), '*')) {
                    javadoc = true;
                }
                else if (each_line_matchesIndent(lines.slice(1), lastIndent)) {
                    starless = true;
                }
            }

            // first line always indented
            print_token(lines[0]);
            for (j = 1; j < lines.length; j++) {
                print_newline(false, true);
                if (javadoc) {
                    // javadoc: reformat and re-indent
                    print_token(' ' + trim(lines[j]));
                } else if (starless && lines[j].length > lastIndentLength) {
                    // starless: re-indent non-empty content, avoiding trim
                    print_token(lines[j].substring(lastIndentLength));
                } else {
                    // normal comments output raw
                    output_lines[output_lines.length - 1].text.push(lines[j]);
                }
            }

            // for comments of more than one line, make sure there's a new line after
            print_newline(false, true);
        }

        function handleInline_comment() {
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }

        function handle_comment() {
            if (input_wanted_newline) {
                print_newline(false, true);
            } else {
                trimOutput(true);
            }

            output_space_before_token = true;
            print_token();
            print_newline(false, true);
        }

        function handle_dot() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
                output_space_before_token = true;
            } else {
                // allow preserved newlines before dots in general
                // force newlines on dots after close paren when break_chained - for bar().baz()
                allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
            }

            print_token();
        }

        function handle_unknown() {
            print_token();

            if (token_text[token_text.length - 1] === '\n') {
                print_newline();
            }
        }
    }


    if (typeof define === "function" && define.amd) {
        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
        define([], function () {
            return { js_beautify: js_beautify };
        });
    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var js_beautify = require("beautify").js_beautify`.
        exports.js_beautify = js_beautify;
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.js_beautify = js_beautify;
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.js_beautify = js_beautify;
    }

}());
;

/* GameStartr/NumberMakr/NumberMakr.js */
/**
 * NumberMakr.js
 *
 * An updated version of the traditional MersenneTwister JavaScript class by
 * Sean McCullough (2010), based on code by Takuji Nishimura and Makoto
 * Matsumoto (1997 - 2002).
 *
 * For the 2010 code, see https://gist.github.com/banksean/300494.
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over each other's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var statePeriod = new MersenneTwister();
  var randomNumber = statePeriod.random();
  
  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var statePeriod = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/
/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(keyInitial, keyLength).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER
   OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~statePeriod-mat/stateVector/emt.html
   email: statePeriod-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
var NumberMakr = (function () {
    /**
     * Resets the NumberMakr.
     *
     * @constructor
     * @param {Number/Array} [seed]   A starting seed used to initialize. This
     *                                can be a Number or Array; the appropriate
     *                                resetFrom Function will be called.
     * @param {Number} [stateLength]   How long the state vector will be.
     * @param {Number} [statePeriod]   How long the state period will be.
     * @param {Number} [matrixA]   A constant mask to generate the matrixAMagic
     *                             Array of [0, some number]
     * @param {Number} [maskUpper]   An upper mask to binary-and on (the most
     *                               significant w-r bits).
     * @param {Number} [maskLower]   A lower mask to binary-and on (the least
     *                               significant r bits).
     */
    function NumberMakr(settings) {
        if (settings === void 0) { settings = {}; }
        this.stateLength = settings.stateLength || 624;
        this.statePeriod = settings.statePeriod || 397;
        this.matrixA = settings.matrixA || 0x9908b0df;
        this.maskUpper = settings.maskUpper || 0x80000000;
        this.maskLower = settings.maskLower || 0x7fffffff;
        this.stateVector = new Array(this.stateLength);
        this.stateIndex = this.stateLength + 1;
        this.matrixAMagic = new Array(0x0, this.matrixA);
        this.resetFromSeed(settings.seed || new Date().getTime());
    }
    /* Simple gets
    */
    /**
     * @return {Mixed} The starting seed used to initialize.
     */
    NumberMakr.prototype.getSeed = function () {
        return this.seed;
    };
    /**
     * @return {Number} THe length of the state vector.
     */
    NumberMakr.prototype.getStateLength = function () {
        return this.stateLength;
    };
    /**
     * @return {Number} THe length of the state vector.
     */
    NumberMakr.prototype.getStatePeriod = function () {
        return this.statePeriod;
    };
    /**
     * @return {Number} THe length of the state vector.
     */
    NumberMakr.prototype.getMatrixA = function () {
        return this.matrixA;
    };
    /**
     * @return {Number} THe length of the state vector.
     */
    NumberMakr.prototype.getMaskUpper = function () {
        return this.maskUpper;
    };
    /**
     * @return {Number} THe length of the state vector.
     */
    NumberMakr.prototype.getMaskLower = function () {
        return this.maskLower;
    };
    /* Resets
    */
    /**
     * Initializes state from a Number.
     *
     * @param {Number} [seedNew]   Defaults to the previously set seed.
     */
    NumberMakr.prototype.resetFromSeed = function (seedNew) {
        if (seedNew === void 0) { seedNew = 0; }
        var s;
        this.stateVector[0] = seedNew >>> 0;
        for (this.stateIndex = 1; this.stateIndex < this.stateLength; this.stateIndex += 1) {
            s = this.stateVector[this.stateIndex - 1] ^ (this.stateVector[this.stateIndex - 1] >>> 30);
            this.stateVector[this.stateIndex] = ((((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.stateIndex) >>> 0;
        }
        this.seed = seedNew;
    };
    /**
     * Initializes state from an Array.
     *
     * @param {Number[]} keyInitial
     * @param {Number} [keyLength]   The length of keyInitial (defaults to the
     *                                actual keyInitial.length).
     * @remarks   There was a slight change for C++, 2004/2/26.
     */
    NumberMakr.prototype.resetFromArray = function (keyInitial, keyLength) {
        if (keyLength === void 0) { keyLength = keyInitial.length; }
        var i = 1, j = 0, k, s;
        this.resetFromSeed(19650218);
        if (typeof (keyLength) === "undefined") {
            keyLength = keyInitial.length;
        }
        k = this.stateLength > keyLength ? this.stateLength : keyLength;
        while (k > 0) {
            s = this.stateVector[i - 1] ^ (this.stateVector[i - 1] >>> 30);
            this.stateVector[i] = (this.stateVector[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)) + keyInitial[j] + j) >>> 0;
            i += 1;
            j += 1;
            if (i >= this.stateLength) {
                this.stateVector[0] = this.stateVector[this.stateLength - 1];
                i = 1;
            }
            if (j >= keyLength) {
                j = 0;
            }
        }
        for (k = this.stateLength - 1; k; k -= 1) {
            s = this.stateVector[i - 1] ^ (this.stateVector[i - 1] >>> 30);
            this.stateVector[i] = ((this.stateVector[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i) >>> 0;
            i += 1;
            if (i >= this.stateLength) {
                this.stateVector[0] = this.stateVector[this.stateLength - 1];
                i = 1;
            }
        }
        this.stateVector[0] = 0x80000000;
        this.seed = keyInitial;
    };
    /* Random number generation
    */
    /**
     * @return {Number} Random Number in [0,0xffffffff].
     */
    NumberMakr.prototype.randomInt32 = function () {
        var y, kk;
        if (this.stateIndex >= this.stateLength) {
            if (this.stateIndex === this.stateLength + 1) {
                this.resetFromSeed(5489);
            }
            for (kk = 0; kk < this.stateLength - this.statePeriod; kk += 1) {
                y = (this.stateVector[kk] & this.maskUpper) | (this.stateVector[kk + 1] & this.maskLower);
                this.stateVector[kk] = this.stateVector[kk + this.statePeriod] ^ (y >>> 1) ^ this.matrixAMagic[y & 0x1];
            }
            for (; kk < this.stateLength - 1; kk += 1) {
                y = (this.stateVector[kk] & this.maskUpper) | (this.stateVector[kk + 1] & this.maskLower);
                this.stateVector[kk] = this.stateVector[kk + (this.statePeriod - this.stateLength)] ^ (y >>> 1) ^ this.matrixAMagic[y & 0x1];
            }
            y = (this.stateVector[this.stateLength - 1] & this.maskUpper) | (this.stateVector[0] & this.maskLower);
            this.stateVector[this.stateLength - 1] = this.stateVector[this.statePeriod - 1] ^ (y >>> 1) ^ this.matrixAMagic[y & 0x1];
            this.stateIndex = 0;
        }
        y = this.stateVector[this.stateIndex];
        this.stateIndex += 1;
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);
        return y >>> 0;
    };
    /**
     * @return {Number} Random number in [0,1).
     * @remarks Divided by 2^32.
     */
    NumberMakr.prototype.random = function () {
        return this.randomInt32() * (1.0 / 4294967296.0);
    };
    /**
     * @return {Number} Random Number in [0,0x7fffffff].
     */
    NumberMakr.prototype.randomInt31 = function () {
        return this.randomInt32() >>> 1;
    };
    /* Real number generators (due to Isaku Wada, 2002/01/09)
    */
    /**
     * @return {Number} Random real Number in [0,1].
     * @remarks Divided by 2 ^ 32 - 1.
     */
    NumberMakr.prototype.randomReal1 = function () {
        return this.randomInt32() * (1.0 / 4294967295.0);
    };
    /**
     * @return {Number} Random real Number in (0,1).
     * @remarks Divided by 2 ^ 32.
     */
    NumberMakr.prototype.randomReal3 = function () {
        return (this.randomInt32() + 0.5) * (1.0 / 4294967296.0);
    };
    /**
     * @return {Number} Random real Number in [0,1) with 53-bit resolution.
     */
    NumberMakr.prototype.randomReal53Bit = function () {
        var a = this.randomInt32() >>> 5, b = this.randomInt32() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    };
    /* Ranged Number generators
    */
    /**
     * @param {Number} max
     * @return {Number} Random Number in [0,max).
     */
    NumberMakr.prototype.randomUnder = function (max) {
        return this.random() * max;
    };
    /**
     * @param {Number} min
     * @param {Number} max
     * @return {Number} Random Number in [min,max).
     */
    NumberMakr.prototype.randomWithin = function (min, max) {
        return this.randomUnder(max - min) + min;
    };
    /* Ranged integer generators
    */
    /**
     * @param {Number} max
     * @return {Number} Random integer in [0,max).
     */
    NumberMakr.prototype.randomInt = function (max) {
        return this.randomUnder(max) | 0;
    };
    /**
     * @param {Number} min
     * @param {Number} max
     * @return {Number} Random integer in [min,max).
     */
    NumberMakr.prototype.randomIntWithin = function (min, max) {
        return (this.randomUnder(max - min) + min) | 0;
    };
    /**
     * @return {Boolean} Either true or false, with 50% probability of each.
     */
    NumberMakr.prototype.randomBoolean = function () {
        return this.randomInt(2) === 1;
    };
    /**
     * @param {Number} probability   How likely the returned Boolean will be
     *                               true, in [0, 1]. Greater than 1 is counted
     *                               as 1.
     *
     * @return {Boolean} Either true or false, with the probability of true
     *                   equal to the given probability.
     */
    NumberMakr.prototype.randomBooleanProbability = function (probability) {
        return this.random() < probability;
    };
    /**
     * @param {Number} numerator   The numerator of a fraction.
     * @param {Number} denominator   The denominator of a fraction.
     * @return {Boolean} Either true or false, with a probability equal to the
     *                   given fraction.
     */
    NumberMakr.prototype.randomBooleanFraction = function (numerator, denominator) {
        return this.random() <= (numerator / denominator);
    };
    /**
     * @param {Array} array
     * @return {Number} A random index, from 0 to the given Array's length
     */
    NumberMakr.prototype.randomArrayIndex = function (array) {
        return this.randomIntWithin(0, array.length);
    };
    /**
     * @param {Array} array
     * @return {Mixed} A random element from within the given Array.
     */
    NumberMakr.prototype.randomArrayMember = function (array) {
        return array[this.randomArrayIndex(array)];
    };
    return NumberMakr;
})();
;

/* GameStartr/MapsCreatr/MapsCreatr.js */
/**
 * ObjectMakr
 *
 * An Abstract Factory for JavaScript classes that automates the process of
 * setting constructors' prototypal inheritance. A sketch of class inheritance
 * and a listing of properties for each class is taken in, and dynamically
 * accessible function constructors are made available.
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var ObjectMakr = (function () {
    /**
     * Resets the ObjectMakr.
     *
     * @constructor
     *
     * @param {Object} inheritance   The sketch of class inheritance, keyed by
     *                               name.
     * @param {Object} properties   Type properties for each Function.
     * @param {Boolean} [doPropertiesFull]   Whether a full property mapping
     *                                       should be made for each type (by
     *                                       default, false).
     * @param {Mixed} [indexMap]   Alternative aliases for properties as
     *                              shorthand.
     * @param {String} [onMake]   A String index for each generated Object's
     *                            Function to be run when made.
     */
    function ObjectMakr(settings) {
        if (typeof settings.inheritance === "undefined") {
            throw new Error("No inheritance mapping given to ObjectMakr.");
        }
        this.inheritance = settings.inheritance;
        this.properties = settings.properties || {};
        this.doPropertiesFull = settings.doPropertiesFull;
        this.indexMap = settings.indexMap;
        this.onMake = settings.onMake;
        this.functions = {};
        if (this.doPropertiesFull) {
            this.propertiesFull = {};
        }
        if (this.indexMap) {
            this.processProperties(this.properties);
        }
        this.processFunctions(this.inheritance, Object, "Object");
    }
    /* Simple gets
    */
    /**
     * @return {Object} The complete inheritance mapping Object.
     */
    ObjectMakr.prototype.getInheritance = function () {
        return this.inheritance;
    };
    /**
     * @return {Object} The complete properties mapping Object.
     */
    ObjectMakr.prototype.getProperties = function () {
        return this.properties;
    };
    /**
     * @return {Object} The properties Object for a particular class.
     */
    ObjectMakr.prototype.getPropertiesOf = function (title) {
        return this.properties[title];
    };
    /**
     * @return {Object} The full properties Object, if doPropertiesFull is on.
     */
    ObjectMakr.prototype.getFullProperties = function () {
        return this.propertiesFull;
    };
    /**
     * @return {Object} The full properties Object for a particular class, if
     *                  doPropertiesFull is on.
     */
    ObjectMakr.prototype.getFullPropertiesOf = function (title) {
        return this.doPropertiesFull ? this.propertiesFull[title] : undefined;
    };
    /**
     * @return {Object} The full mapping of class constructors.
     */
    ObjectMakr.prototype.getFunctions = function () {
        return this.functions;
    };
    /**
     * @param {String} type   The name of a class to retrieve.
     * @return {Function}   The constructor for the given class.
     */
    ObjectMakr.prototype.getFunction = function (type) {
        return this.functions[type];
    };
    /**
     * @param {String} type   The name of a class to check for.
     * @return {Boolean} Whether that class exists.
     */
    ObjectMakr.prototype.hasFunction = function (type) {
        return this.functions.hasOwnProperty(type);
    };
    /**
     * @return {Mixed} The optional mapping of indices.
     */
    ObjectMakr.prototype.getIndexMap = function () {
        return this.indexMap;
    };
    /* Core usage
    */
    /**
     * Creates a new instance of the given type and returns it.
     * If desired, any settings are applied to it (deep copy using proliferate).
     * @param {String} type   The type for which a new object of is being made.
     * @param {Objetct} [settings]   Additional attributes to add to the newly
     *                               created Object.
     * @return {Mixed}
     */
    ObjectMakr.prototype.make = function (type, settings) {
        var output;
        // Make sure the type actually exists in functions
        if (!this.functions.hasOwnProperty(type)) {
            throw new Error("Unknown type given to ObjectMakr: " + type);
        }
        // Create the new object, copying any given settings
        output = new this.functions[type]();
        if (settings) {
            this.proliferate(output, settings);
        }
        // onMake triggers are handled respecting doPropertiesFull.
        if (this.onMake && output[this.onMake]) {
            if (this.doPropertiesFull) {
                output[this.onMake](output, type, this.properties[type], this.propertiesFull[type]);
            }
            else {
                output[this.onMake](output, type, this.properties[type], this.functions[type].prototype);
            }
        }
        return output;
    };
    /* Core parsing
    */
    /**
     * Parser that calls processPropertyArray on all properties given as arrays
     * @param {Object} properties   The object of function properties
     * @remarks Only call this if indexMap is given as an array
     */
    ObjectMakr.prototype.processProperties = function (properties) {
        var name;
        for (name in properties) {
            if (this.properties.hasOwnProperty(name)) {
                // If it's an array, replace it with a mapped version
                if (this.properties[name] instanceof Array) {
                    this.properties[name] = this.processPropertyArray(this.properties[name]);
                }
            }
        }
    };
    /**
     * Creates an output properties object with the mapping shown in indexMap
     * @param {Array} properties   An array with indiced versions of properties
     * @example indexMap = ["width", "height"];
     *          properties = [7, 14];
     *          output = processPropertyArray(properties);
     *          // output is now { "width": 7, "height": 14 }
     */
    ObjectMakr.prototype.processPropertyArray = function (properties) {
        var output = {}, i;
        for (i = properties.length - 1; i >= 0; --i) {
            output[this.indexMap[i]] = properties[i];
        }
        return output;
    };
    /**
     * Recursive parser to generate each function, starting from the base.
     * @param {Object} base   An object whose keys are the names of functions to
     *                        made, and whose values are objects whose keys are
     *                        for children that inherit from these functions
     * @param {Function} parent   The parent function of the functions about to
     *                            be made
     * @param {String} parentName   The name of the parent Function to be
     *                              inherited from.
     * @remarks This may use eval, which is evil and almost never a good idea,
     *          but here it's the only way to make functions with dynamic names.
     */
    ObjectMakr.prototype.processFunctions = function (base, parent, parentName) {
        var name, ref;
        for (name in base) {
            if (base.hasOwnProperty(name)) {
                this.functions[name] = new Function();
                // This sets the function as inheriting from the parent
                this.functions[name].prototype = new parent();
                this.functions[name].prototype.constructor = this.functions[name];
                for (ref in this.properties[name]) {
                    if (this.properties[name].hasOwnProperty(ref)) {
                        this.functions[name].prototype[ref] = this.properties[name][ref];
                    }
                }
                // If the entire property tree is being mapped, copy everything
                // from both this and its parent to its equivalent
                if (this.doPropertiesFull) {
                    this.propertiesFull[name] = {};
                    if (parentName) {
                        for (ref in this.propertiesFull[parentName]) {
                            if (this.propertiesFull[parentName].hasOwnProperty(ref)) {
                                this.propertiesFull[name][ref] = this.propertiesFull[parentName][ref];
                            }
                        }
                    }
                    for (ref in this.properties[name]) {
                        if (this.properties[name].hasOwnProperty(ref)) {
                            this.propertiesFull[name][ref] = this.properties[name][ref];
                        }
                    }
                }
                this.processFunctions(base[name], this.functions[name], name);
            }
        }
    };
    /* Utilities
    */
    /**
     * Proliferates all members of the donor to the recipient recursively. This
     * is therefore a deep copy.
     * @param {Object} recipient   An object receiving the donor's members.
     * @param {Object} donor   An object whose members are copied to recipient.
     * @param {Boolean} noOverride   If recipient properties may be overriden.
     */
    ObjectMakr.prototype.proliferate = function (recipient, donor, noOverride) {
        if (noOverride === void 0) { noOverride = false; }
        var setting, i;
        for (i in donor) {
            // If noOverride is specified, don't override if it already exists
            if (noOverride && recipient.hasOwnProperty(i)) {
                continue;
            }
            // If it's an object, recurse on a new version of it
            setting = donor[i];
            if (typeof setting === "object") {
                if (!recipient.hasOwnProperty(i)) {
                    recipient[i] = new setting.constructor();
                }
                this.proliferate(recipient[i], setting, noOverride);
            }
            else {
                // Regular primitives are easy to copy otherwise
                recipient[i] = setting;
            }
        }
        return recipient;
    };
    return ObjectMakr;
})();
/// <reference path="ObjectMakr/ObjectMakr.ts" />
/// <reference path="Thing.d.ts" />
/**
 * Basic storage container for a single Thing to be stored in an Area's
 * PreThings member. A PreThing stores an actual Thing along with basic
 * sizing and positioning information, so that a MapsHandler may accurately
 * spawn or unspawn it as needed.
 */
var PreThing = (function () {
    /**
     * @param {Thing} thing   The Thing, freshly created by ObjectMaker.make.
     * @param {PreThingSettings} reference   The creation Object instruction
     *                                        used to create the Thing.
     */
    function PreThing(thing, reference, ObjectMaker) {
        this.thing = thing;
        this.title = thing.title;
        this.reference = reference;
        this.spawned = false;
        this.left = reference.x || 0;
        this.top = reference.y || 0;
        this.right = this.left + (reference.width || ObjectMaker.getFullPropertiesOf(this.title).width);
        this.bottom = this.top + (reference.height || ObjectMaker.getFullPropertiesOf(this.title).height);
        if (reference.position) {
            this.position = reference.position;
        }
    }
    return PreThing;
})();
/**
 * MapsCreatr.js
 *
 * Storage container and lazy loader for GameStarter maps that is the back-end
 * counterpart to MapsHandlr. Maps are created with their custom Location and
 * Area members, which are initialized the first time the map is retrieved.
 * Areas contain a "creation" Object[] detailing the instructions on creating
 * that Area's "PreThing" objects, which store Things along with basic position
 * information.
 *
 * In short, a Map contains a set of Areas, each of which knows its size and the
 * steps to create its contents. Each Map also contains a set of Locations,
 * which are entry points into one Area each.
 *
 * See Schema.txt for the minimum recommended format for Maps, Locations,
 * Areas, and creation commands.
 *
 * @example
 * // Creating and using a MapsCreatr to store a very simple Map.
 * var MapsCreator = new MapsCreatr({
 *         "ObjectMaker": new ObjectMakr({
 *             "doPropertiesFull": true,
 *             "inheritance": {
 *                 "Map": {},
 *                 "Area": {},
 *                 "Location": {},
 *                 "Thing": {
 *                     "SomeThing": {}
 *                 }
 *             },
 *             "properties": {
 *                 "SomeThing": {
 *                     "title": "SomeThing",
 *                     "groupType": "Thing",
 *                     "width": 7,
 *                     "height": 7
 *                 }
 *             }
 *         }),
 *         "groupTypes": ["Thing"],
 *         "maps": {
 *             "MyFirstMap": {
 *                 "locations": [
 *                     { "area": 0, "entry": "Normal" }
 *                 ],
 *                 "areas": [{
 *                     "creation": [
 *                         { "thing": "SomeThing", "x": 3, "y": 4 }
 *                     ]
 *                 }]
 *             }
 *         }
 *     }),
 *     map = MapsCreator.getMap("MyFirstMap");
 *
 * // Map { locations: Array[1], areas: Array[1], areasRaw: Array[1], ... }
 * console.log(map);
 *
 * // Area { creation: Array[1], map: Map, name: "0", boundaries: Object, ... }
 * console.log(map.areas[0]);
 *
 * // Object { thing: "SomeThing", x: 3, y: 4 }
 * console.log(map.areas[0].creation[0]);
 *
 * @example
 * // Creating and using a MapsCreatr to store a simple Map with a macro and
 * // look at what will be created when it's used.
 * var MapsCreator = new MapsCreatr({
 *         "ObjectMaker": new ObjectMakr({
 *             "doPropertiesFull": true,
 *             "inheritance": {
 *                 "Map": {},
 *                 "Area": {},
 *                 "Location": {},
 *                 "Thing": {
 *                     "SomeThing": {}
 *                 }
 *             },
 *             "properties": {
 *                 "SomeThing": {
 *                     "title": "SomeThing",
 *                     "groupType": "Thing",
 *                     "width": 7,
 *                     "height": 7
 *                 }
 *             }
 *         }),
 *         "groupTypes": ["Thing"],
 *         "macros": {
 *             "Fill": function (reference) {
 *                 var output = [],
 *                     thing = reference.thing,
 *                     between = reference.between || 10,
 *                     times = reference.times || 1,
 *                     x = reference.x || 0,
 *                     y = reference.y || 0;
 *
 *                 while (times > 0) {
 *                     output.push({
 *                         "thing": reference.thing,
 *                         "x": x,
 *                         "y": y
 *                     });
 *                     x += between;
 *                     times -= 1;
 *                 }
 *
 *                 return output;
 *             }
 *         },
 *         "maps": {
 *             "MyFirstMap": {
 *                 "locations": [
 *                     { "area": 0, "entry": "Normal" }
 *                 ],
 *                 "areas": [{
 *                     "creation": [
 *                         { "macro": "Fill", "thing": "SomeThing", "times": 7, "x": 3, "y": 4 }
 *                     ]
 *                 }]
 *             }
 *         }
 *     }),
 *     map = MapsCreator.getMap("MyFirstMap"),
 *     prethings = MapsCreator.getPreThings(map.areas[0]);
 *
 * // Object {Thing: Object}
 * console.log(prethings);
 *
 * // Object { xInc: Array[7], xDec: Array[7], yInc: Array[7], yDec: ... }
 * console.log(prethings.Thing);
 *
 * // [PreThing, PreThing, PreThing, PreThing, PreThing, PreThing, PreThing]
 * console.log(prethings.Thing.xInc);
 *
 * // PreThing { thing: SomeThing, title: "SomeThing", reference: Object, ... }
 * console.log(prethings.Thing.xInc[0]);
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var MapsCreatr = (function () {
    /**
     * Resets the MapsCreatr.
     *
     * @constructor
     * @param {IMapsCreatrSettings} settings
     */
    function MapsCreatr(settings) {
        if (!settings) {
            throw new Error("No settings given to MapsCreatr.");
        }
        // Maps and Things are created using an ObjectMaker factory
        if (!settings.ObjectMaker) {
            throw new Error("No ObjectMakr given to MapsCreatr.");
        }
        this.ObjectMaker = settings.ObjectMaker;
        if (typeof this.ObjectMaker.getFullProperties() === "undefined") {
            throw new Error("MapsCreatr's ObjectMaker must store full properties.");
        }
        // At least one group type name should be defined for PreThing output
        if (!settings.groupTypes) {
            throw new Error("No groupTypes given to MapsCreatr.");
        }
        this.groupTypes = settings.groupTypes;
        this.keyGroupType = settings.keyGroupType || "groupType";
        this.keyEntrance = settings.keyEntrance || "entrance";
        this.macros = settings.macros || {};
        this.scope = settings.scope || this;
        this.entrances = settings.entrances;
        this.requireEntrance = settings.requireEntrance;
        this.maps = {};
        if (settings.maps) {
            this.storeMaps(settings.maps);
        }
    }
    /* Simple gets
    */
    /**
     * @return {ObjectMakr}   The internal ObjectMakr.
     */
    MapsCreatr.prototype.getObjectMaker = function () {
        return this.ObjectMaker;
    };
    /**
     * @return {String[]}   The allowed group types.
     */
    MapsCreatr.prototype.getGroupTypes = function () {
        return this.groupTypes;
    };
    /**
     * @return {String}   The key under which Things are to store their group.
     */
    MapsCreatr.prototype.getKeyGroupType = function () {
        return this.keyGroupType;
    };
    /**
     * @return {String}   The key under which Things declare themselves an entrance.
     */
    MapsCreatr.prototype.getKeyEntrance = function () {
        return this.keyEntrance;
    };
    /**
     * @return {Object}   The allowed macro Functions.
     */
    MapsCreatr.prototype.getMacros = function () {
        return this.macros;
    };
    /**
     * @return {Mixed}   The scope to give as a last parameter to macros.
     */
    MapsCreatr.prototype.getScope = function () {
        return this.scope;
    };
    /**
     * @return {Boolean} Whether Locations must have an entrance Function.
     */
    MapsCreatr.prototype.getRequireEntrance = function () {
        return this.requireEntrance;
    };
    /**
     * @return {Object}   The Object storing maps, keyed by name.
     */
    MapsCreatr.prototype.getMaps = function () {
        return this.maps;
    };
    /**
     * Simple getter for a map under the maps container. If the map has not been
     * initialized (had its areas and locations set), that is done here as lazy
     * loading.
     *
     * @param {Mixed} name   A key to find the map under. This will typically be
     *                       a String.
     * @return {Map}
     */
    MapsCreatr.prototype.getMap = function (name) {
        var map = this.maps[name];
        if (!map) {
            throw new Error("No map found under: " + name);
        }
        if (!map.initialized) {
            // Set the one-to-many Map->Area relationships within the Map
            this.setMapAreas(map);
            // Set the one-to-many Area->Location relationships within the Map
            this.setMapLocations(map);
            map.initialized = true;
        }
        return map;
    };
    /**
     * Creates and stores a set of new maps based on the key/value pairs in a
     * given Object. These will be stored as maps by their string keys via
     * this.storeMap.
     *
     * @param {Object} maps   An Object containing a set of key/map pairs to
     *                       store as maps.
     * @return {Object}   The newly created maps object.
     */
    MapsCreatr.prototype.storeMaps = function (maps) {
        for (var i in maps) {
            if (maps.hasOwnProperty(i)) {
                this.storeMap(i, maps[i]);
            }
        }
    };
    /**
     * Creates and stores a new map. The internal ObjectMaker factory is used to
     * auto-generate it based on a given settings object. The actual loading of
     * Areas and Locations is deferred to this.getMap.
     *
     * @param {Mixed} name   A name under which the map should be stored,
     *                       commonly a String or Array.
     * @param {Object} settings   An Object containing arguments to be sent to
     *                            the ObjectMakr being used as a Maps factory.
     * @return {Map}   The newly created Map.
     */
    MapsCreatr.prototype.storeMap = function (name, settings) {
        if (!name) {
            throw new Error("Maps cannot be created with no name.");
        }
        var map = this.ObjectMaker.make("Map", settings);
        if (!map.areas) {
            throw new Error("Maps cannot be used with no areas: " + name);
        }
        if (!map.locations) {
            throw new Error("Maps cannot be used with no locations: " + name);
        }
        this.maps[name] = map;
        return map;
    };
    /* Area setup (PreThing analysis)
    */
    /**
     * Given a Area, this processes and returns the PreThings that are to
     * inhabit the Area per its creation instructions.
     *
     * Each reference (which is a JSON object taken from an Area's .creation
     * Array) is an instruction to this script to switch to a location, push
     * some number of PreThings to the PreThings object via a predefined macro,
     * or push a single PreThing to the PreThings object.
     *
     * Once those PreThing objects are obtained, they are filtered for validity
     * (e.g. location setter commands are irrelevant after a single use), and
     * sorted on .xloc and .yloc.
     *
     * @param {Area} area
     * @return {Object}   An associative array of PreThing containers. The keys
     *                    will be the unique group types of all the allowed
     *                    Thing groups, which will be stored in the parent
     *                    EightBittr's GroupHoldr. Each container stores Arrays
     *                    of the PreThings sorted by .xloc and .yloc in both
     *                    increasing and decreasing order.
     */
    MapsCreatr.prototype.getPreThings = function (area) {
        var map = area.map, creation = area.creation, prethings = this.fromKeys(this.groupTypes), i;
        this.xloc = 0;
        this.yloc = 0;
        area.collections = {};
        for (i = 0; i < creation.length; i += 1) {
            this.analyzePreSwitch(creation[i], prethings, area, map);
        }
        return this.processPreThingsArrays(prethings);
    };
    /**
     * PreThing switcher: Given a JSON representation of a PreThing, this
     * determines what to do with it. It may be a location setter (to switch the
     * x- and y- location offset), a macro (to repeat some number of actions),
     * or a raw PreThing.
     * Any modifications done in a called function will be to push some number
     * of PreThings to their respective group in the output PreThings Object.
     *
     * @param {Object} reference   A JSON mapping of some number of PreThings.
     * @param {Object} PreThings   An associative array of PreThing Arrays,
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    MapsCreatr.prototype.analyzePreSwitch = function (reference, prethings, area, map) {
        // Case: macro (unless it's undefined)
        if (reference.macro) {
            return this.analyzePreMacro(reference, prethings, area, map);
        }
        else {
            // Case: default (a regular PreThing)
            return this.analyzePreThing(reference, prethings, area, map);
        }
    };
    /**
     * PreThing case: Macro instruction. This calls the macro on the same input,
     * captures the output, and recursively repeats the analyzePreSwitch driver
     * function on the output(s).
     *
     * @param {Object} reference   A JSON mapping of some number of PreThings.
     * @param {Object} PreThings   An associative array of PreThing Arrays,
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    MapsCreatr.prototype.analyzePreMacro = function (reference, prethings, area, map) {
        var macro = this.macros[reference.macro], outputs, i;
        if (!macro) {
            console.warn("A non-existent macro is referenced. It will be ignored:", macro, reference, prethings, area, map);
            return;
        }
        // Avoid modifying the original macro by creating a new object in its
        // place, while submissively proliferating any default macro settings
        outputs = macro(reference, prethings, area, map, this.scope);
        // If there is any output, recurse on all components of it, Array or not
        if (outputs) {
            if (outputs instanceof Array) {
                for (i = 0; i < outputs.length; i += 1) {
                    this.analyzePreSwitch(outputs[i], prethings, area, map);
                }
            }
            else {
                this.analyzePreSwitch(outputs, prethings, area, map);
            }
        }
        return outputs;
    };
    /**
     * Macro case: PreThing instruction. This creates a PreThing from the
     * given reference and adds it to its respective group in PreThings (based
     * on the PreThing's [keyGroupType] variable).
     *
     * @param {Object} reference   A JSON mapping of some number of PreThings.
     * @param {Object} PreThings   An associative array of PreThing Arrays,
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    MapsCreatr.prototype.analyzePreThing = function (reference, prethings, area, map) {
        var title = reference.thing, thing, prething;
        if (!this.ObjectMaker.hasFunction(title)) {
            console.warn("A non-existent Thing type is referenced. It will be ignored:", title, reference, prethings, area, map);
            return;
        }
        prething = new PreThing(this.ObjectMaker.make(title, reference), reference, this.ObjectMaker);
        thing = prething.thing;
        if (!prething.thing[this.keyGroupType]) {
            console.warn("A Thing does not contain a " + this.keyGroupType + ". It will be ignored:", prething, "\n", arguments);
            return;
        }
        if (this.groupTypes.indexOf(prething.thing[this.keyGroupType]) === -1) {
            console.warn("A Thing contains an unknown " + this.keyGroupType + ". It will be ignored:", thing[this.keyGroupType], prething, reference, prethings, area, map);
            return;
        }
        prethings[prething.thing[this.keyGroupType]].push(prething);
        if (!thing.noBoundaryStretch && area.boundaries) {
            this.stretchAreaBoundaries(prething, area);
        }
        // If a Thing is an entrance, then the location it is an entrance to 
        // must know it and its position. Note that this will have to be changed
        // for Pokemon/Zelda style games.
        if (thing[this.keyEntrance] !== undefined && typeof thing[this.keyEntrance] !== "object") {
            if (typeof map.locations[thing[this.keyEntrance]] !== "undefined") {
                if (typeof map.locations[thing[this.keyEntrance]].xloc === "undefined") {
                    map.locations[thing[this.keyEntrance]].xloc = prething.left;
                }
                if (typeof map.locations[thing[this.keyEntrance]].yloc === "undefined") {
                    map.locations[thing[this.keyEntrance]].yloc = prething.top;
                }
                map.locations[thing[this.keyEntrance]].entrance = prething.thing;
            }
        }
        if (reference.collectionName && area.collections) {
            this.ensureThingCollection(prething, reference.collectionName, reference.collectionKey, area);
        }
        return prething;
    };
    /**
     * Converts the raw area settings in a Map into Area objects.
     *
     * These areas are typically stored as an Array or Object inside the Map
     * containing some number of attribute keys (such as "settings") along with
     * an Array under "Creation" that stores some number of commands for
     * populating that area in MapsHandlr::spawnMap.
     *
     * @param {Map} map
     */
    MapsCreatr.prototype.setMapAreas = function (map) {
        var areasRaw = map.areas, locationsRaw = map.locations, 
        // The parsed containers should be the same types as the originals
        areasParsed = new areasRaw.constructor(), locationsParsed = new locationsRaw.constructor(), area, location, i;
        for (i in areasRaw) {
            if (areasRaw.hasOwnProperty(i)) {
                area = this.ObjectMaker.make("Area", areasRaw[i]);
                areasParsed[i] = area;
                area.map = map;
                area.name = i;
                area.boundaries = {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                };
            }
        }
        for (i in locationsRaw) {
            if (locationsRaw.hasOwnProperty(i)) {
                location = this.ObjectMaker.make("Location", locationsRaw[i]);
                locationsParsed[i] = location;
                location.entryRaw = locationsRaw[i].entry;
                location.name = i;
                location.area = locationsRaw[i].area || 0;
                if (this.requireEntrance) {
                    if (!this.entrances.hasOwnProperty(location.entryRaw)) {
                        throw new Error("Location " + i + " has unknown entry string: " + location.entryRaw);
                    }
                }
                if (this.entrances && location.entryRaw) {
                    location.entry = this.entrances[location.entryRaw];
                }
                else if (location.entry && location.entry.constructor === String) {
                    location.entry = this.entrances[String(location.entry)];
                }
                console.log("Location", i, location);
                if (!location.entry) {
                    throw new Error("sup");
                }
            }
        }
        // Store the output object in the Map, and keep the raw settings for the
        // sake of debugging / user interest
        map.areas = areasParsed;
        map.areasRaw = areasRaw;
        map.locations = locationsParsed;
        map.locationsRaw = locationsRaw;
    };
    /**
     * Converts the raw location settings in a Map into Location objects.
     *
     * These locations typically have very little information, generally just a
     * container Area, x-location, y-location, and spawning function.
     *
     * @param {Map} map
     */
    MapsCreatr.prototype.setMapLocations = function (map) {
        var locsRaw = map.locations, 
        // The parsed container should be the same type as the original
        locsParsed = new locsRaw.constructor(), location, i;
        for (i in locsRaw) {
            if (locsRaw.hasOwnProperty(i)) {
                location = this.ObjectMaker.make("Location", locsRaw[i]);
                locsParsed[i] = location;
                // The area should be an object reference, under the Map's areas
                location.area = map.areas[locsRaw[i].area || 0];
                if (!locsParsed[i].area) {
                    throw new Error("Location " + i + " references an invalid area:" + locsRaw[i].area);
                }
            }
        }
        // Store the output object in the Map, and keep the old settings for the
        // sake of debugging / user interest
        map.locations = locsParsed;
        map.locationsRaw = locsRaw;
    };
    /**
     * "Stretches" an Area's boundaries based on a PreThing. For each direction,
     * if the PreThing has a more extreme version of it (higher top, etc.), the
     * boundary is updated.
     *
     * @param {PreThing} prething
     * @param {Area} area
     */
    MapsCreatr.prototype.stretchAreaBoundaries = function (prething, area) {
        var boundaries = area.boundaries;
        boundaries.top = Math.min(prething.top, boundaries.top);
        boundaries.right = Math.max(prething.right, boundaries.right);
        boundaries.bottom = Math.max(prething.bottom, boundaries.bottom);
        boundaries.left = Math.min(prething.left, boundaries.left);
    };
    /**
     * Adds a Thing to the specified collection in the Map's Area.
     *
     * @param {PreThing} prething
     * @param {String} collectionName
     * @param {String} collectionKey
     * @param {Area} area
     */
    MapsCreatr.prototype.ensureThingCollection = function (prething, collectionName, collectionKey, area) {
        var thing = prething.thing, collection = area.collections[collectionName];
        if (!collection) {
            collection = area.collections[collectionName] = {};
        }
        thing.collection = collection;
        collection[collectionKey] = thing;
    };
    /**
     * Creates an Object wrapper around a PreThings Object with versions of
     * each child PreThing[]sorted by xloc and yloc, in increasing and
     * decreasing order.
     *
     * @param {Object} prethings
     * @return {Object} A PreThing wrapper with the keys "xInc", "xDec",
     *                  "yInc", and "yDec".
     */
    MapsCreatr.prototype.processPreThingsArrays = function (prethings) {
        var scope = this, output = {}, i;
        for (i in prethings) {
            if (prethings.hasOwnProperty(i)) {
                var children = prethings[i], array = {
                    "xInc": this.getArraySorted(children, this.sortPreThingsXInc),
                    "xDec": this.getArraySorted(children, this.sortPreThingsXDec),
                    "yInc": this.getArraySorted(children, this.sortPreThingsYInc),
                    "yDec": this.getArraySorted(children, this.sortPreThingsYDec)
                };
                // Adding in a "push" lambda allows MapsCreatr to interact with
                // this using the same .push syntax as Arrays.
                array.push = (function (prething) {
                    scope.addArraySorted(this.xInc, prething, scope.sortPreThingsXInc);
                    scope.addArraySorted(this.xDec, prething, scope.sortPreThingsXDec);
                    scope.addArraySorted(this.yInc, prething, scope.sortPreThingsYInc);
                    scope.addArraySorted(this.yDec, prething, scope.sortPreThingsYDec);
                }).bind(array);
                output[i] = array;
            }
        }
        return output;
    };
    /* Utilities
    */
    /**
     * Creates an Object pre-populated with one key for each of the Strings in
     * the input Array, each pointing to a new Array.
     *
     * @param {String[]} arr
     * @return {Object}
     * @remarks This is a rough opposite of Object.keys, which takes in an
     *          Object and returns an Array of Strings.
     */
    MapsCreatr.prototype.fromKeys = function (arr) {
        var output = {}, i;
        for (i = 0; i < arr.length; i += 1) {
            output[arr[i]] = [];
        }
        return output;
    };
    /**
     * Returns a shallow copy of an Array, in sorted order based on a given
     * sorter Function.
     *
     * @param {Array} array
     * @param {Function} sorter
     * @
     */
    MapsCreatr.prototype.getArraySorted = function (array, sorter) {
        var copy = array.slice();
        copy.sort(sorter);
        return copy;
    };
    /**
     * Adds an element into an Array using a sorter Function.
     *
     * @param {Array} array
     * @param {Mixed} element
     * @param {Function} sorter   A Function that returns the difference between
     *                            two elements (for example, a Numbers sorter
     *                            given (a,b) would return a - b).
     */
    MapsCreatr.prototype.addArraySorted = function (array, element, sorter) {
        var lower = 0, upper = array.length, index;
        while (lower !== upper) {
            index = ((lower + upper) / 2) | 0;
            // Case: element is less than the index
            if (sorter(element, array[index]) < 0) {
                upper = index;
            }
            else {
                // Case: element is higher than the index
                lower = index + 1;
            }
        }
        if (lower === upper) {
            array.splice(lower, 0, element);
            return;
        }
    };
    /**
     * Sorter for PreThings that results in increasing horizontal order.
     *
     * @param {PreThing} a
     * @param {PreThing} b
     */
    MapsCreatr.prototype.sortPreThingsXInc = function (a, b) {
        return a.left === b.left ? a.top - b.top : a.left - b.left;
    };
    /**
     * Sorter for PreThings that results in decreasing horizontal order.
     *
     * @param {PreThing} a
     * @param {PreThing} b
     */
    MapsCreatr.prototype.sortPreThingsXDec = function (a, b) {
        return b.right === a.right ? b.bottom - a.bottom : b.right - a.right;
    };
    /**
     * Sorter for PreThings that results in increasing vertical order.
     *
     * @param {PreThing} a
     * @param {PreThing} b
     */
    MapsCreatr.prototype.sortPreThingsYInc = function (a, b) {
        return a.top === b.top ? a.left - b.left : a.top - b.top;
    };
    /**
     * Sorter for PreThings that results in decreasing vertical order.
     *
     * @param {PreThing} a
     * @param {PreThing} b
     */
    MapsCreatr.prototype.sortPreThingsYDec = function (a, b) {
        return b.bottom === a.bottom ? b.right - a.right : b.bottom - a.bottom;
    };
    return MapsCreatr;
})();
;

/* GameStartr/MapScreenr/MapScreenr.js */
/**
 * MapScreenr.js
 * 
 * A simple container for Map attributes given by switching to an Area within 
 * that map. A bounding box of the current viewport is kept, along with any 
 * other information desired.
 * 
 * MapScreenr is the closest thing GameStartr projects have to a "global"
 * variable depository, where miscellaneous variables may be stored.
 * 
 * @example
 * // Creating and using a MapScreenr to emulate a simple screen.
 * var MapScreener = new MapScreenr({
 *     "width": 640,
 *     "height": 480
 * });
 * MapScreener.clearScreen();
 * 
 * // [0, 640, 480, 0]
 * console.log([
 *     MapScreener.top, MapScreener.right, MapScreener.bottom, MapScreener.left
 * ]);
 * 
 * @example
 * // Creating and using a MapScreenr to store screen information. 
 * var MapScreener = new MapScreenr({
 *     "width": 640,
 *     "height": 480,
 *     "variables": {
 *         "pixels": function () {
 *             return this.width * this.height;
 *         },
 *         "resolution": function () {
 *             return this.width / this.height;
 *         }
 *     }
 * });
 * MapScreener.clearScreen();
 * 
 * // 307200 "pixels at" 1.3333333333333333
 * console.log(MapScreener.pixels, "pixels at", MapScreener.resolution);
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function MapScreenr(settings) {
    "use strict";
    if (!this || this === window) {
        return new MapScreenr(settings);
    }
    var self = this,
        
        // A listing of variable Functions to be calculated on screen resets.
        variables,
        
        // Arguments to be passed into variable computation Functions.
        variableArgs;
    
    /**
     * Resets the MapScreenr. All members of the settings argument are copied
     * to the MapScreenr itself, though only width and height are required.
     * 
     * @param {Number} width   How wide the MapScreenr must be.
     * @param {Number} height   How high the MapScreenr must be.
     * @param {Object} [variables]   Functions representing variables that
     *                               should be re-computed on screen change,
     *                               keyed by what variable they return the 
     *                               value of.
     * @param {Array} [variableArgs]   Arguments to be passed to variables.
     */
    self.reset = function (settings) {
        for (var name in settings) {
            if (settings.hasOwnProperty(name)) {
                self[name] = settings[name];
            }
        }
        
        variables = settings.variables || {};
        variableArgs = settings.variableArgs || [];

        if (typeof self.width === "undefined") {
            throw new Error("MapScreenr needs to know its width.");
        }

        if (typeof self.height === "undefined") {
            throw new Error("MapScreenr needs to know its height.");
        }
    }
    
    
    /* State changes
    */
    
    /**
     * Completely clears the MapScreenr for use in a new Area. Positioning is
     * reset to (0,0) and user-configured variables are recalculated.
     */
    self.clearScreen = function () {
        self.left = 0;
        self.top = 0;
        self.right = self.width;
        self.bottom = self.height;
        
        setMiddleX();
        setMiddleY();
        
        self.setVariables();
    };
    
    /**
     * Computes middleX as the midpoint between left and right.
     */
    function setMiddleX() {
        self.middleX = (self.left + self.right) / 2;
    }
    
    /**
     * Computes middleY as the midpoint between top and bottom.
     */
    function setMiddleY() {
        self.middleY = (self.top + self.bottom) / 2;
    }
    
    /**
     * Runs all variable Functions with variableArgs to recalculate their 
     * values.
     */
    self.setVariables = function () {
        for (var i in variables) {
            self[i] = variables[i].apply(self, variableArgs);
        }
    }
    
    
    /* Element shifting
    */
    
    /**
     * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
     * 
     * @param {Number} dx
     * @param {Number} dy
     */
    self.shift = function(dx, dy) {
        if (dx) {
            self.shiftX(dx);
        }
        
        if (dy) {
            self.shiftY(dy);
        }
    };
    
    /**
     * Shifts the MapScreenr horizontally by changing left and right by the dx.
     * 
     * @param {Number} dx
     */
    self.shiftX = function(dx) {
        self.left += dx;
        self.right += dx;
    };
    
    /**
     * Shifts the MapScreenr vertically by changing top and bottom by the dy.
     * 
     * @param {Number} dy
     */
    self.shiftY = function(dy) {
        self.top += dy;
        self.bottom += dy;
    };
    

    self.reset(settings || {});
}
;

/* GameStartr/MapsHandlr/MapsHandlr.js */
/**
 * ObjectMakr
 *
 * An Abstract Factory for JavaScript classes that automates the process of
 * setting constructors' prototypal inheritance. A sketch of class inheritance
 * and a listing of properties for each class is taken in, and dynamically
 * accessible function constructors are made available.
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var ObjectMakr = (function () {
    /**
     * Resets the ObjectMakr.
     *
     * @constructor
     *
     * @param {Object} inheritance   The sketch of class inheritance, keyed by
     *                               name.
     * @param {Object} properties   Type properties for each Function.
     * @param {Boolean} [doPropertiesFull]   Whether a full property mapping
     *                                       should be made for each type (by
     *                                       default, false).
     * @param {Mixed} [indexMap]   Alternative aliases for properties as
     *                              shorthand.
     * @param {String} [onMake]   A String index for each generated Object's
     *                            Function to be run when made.
     */
    function ObjectMakr(settings) {
        if (typeof settings.inheritance === "undefined") {
            throw new Error("No inheritance mapping given to ObjectMakr.");
        }
        this.inheritance = settings.inheritance;
        this.properties = settings.properties || {};
        this.doPropertiesFull = settings.doPropertiesFull;
        this.indexMap = settings.indexMap;
        this.onMake = settings.onMake;
        this.functions = {};
        if (this.doPropertiesFull) {
            this.propertiesFull = {};
        }
        if (this.indexMap) {
            this.processProperties(this.properties);
        }
        this.processFunctions(this.inheritance, Object, "Object");
    }
    /* Simple gets
    */
    /**
     * @return {Object} The complete inheritance mapping Object.
     */
    ObjectMakr.prototype.getInheritance = function () {
        return this.inheritance;
    };
    /**
     * @return {Object} The complete properties mapping Object.
     */
    ObjectMakr.prototype.getProperties = function () {
        return this.properties;
    };
    /**
     * @return {Object} The properties Object for a particular class.
     */
    ObjectMakr.prototype.getPropertiesOf = function (title) {
        return this.properties[title];
    };
    /**
     * @return {Object} The full properties Object, if doPropertiesFull is on.
     */
    ObjectMakr.prototype.getFullProperties = function () {
        return this.propertiesFull;
    };
    /**
     * @return {Object} The full properties Object for a particular class, if
     *                  doPropertiesFull is on.
     */
    ObjectMakr.prototype.getFullPropertiesOf = function (title) {
        return this.doPropertiesFull ? this.propertiesFull[title] : undefined;
    };
    /**
     * @return {Object} The full mapping of class constructors.
     */
    ObjectMakr.prototype.getFunctions = function () {
        return this.functions;
    };
    /**
     * @param {String} type   The name of a class to retrieve.
     * @return {Function}   The constructor for the given class.
     */
    ObjectMakr.prototype.getFunction = function (type) {
        return this.functions[type];
    };
    /**
     * @param {String} type   The name of a class to check for.
     * @return {Boolean} Whether that class exists.
     */
    ObjectMakr.prototype.hasFunction = function (type) {
        return this.functions.hasOwnProperty(type);
    };
    /**
     * @return {Mixed} The optional mapping of indices.
     */
    ObjectMakr.prototype.getIndexMap = function () {
        return this.indexMap;
    };
    /* Core usage
    */
    /**
     * Creates a new instance of the given type and returns it.
     * If desired, any settings are applied to it (deep copy using proliferate).
     * @param {String} type   The type for which a new object of is being made.
     * @param {Objetct} [settings]   Additional attributes to add to the newly
     *                               created Object.
     * @return {Mixed}
     */
    ObjectMakr.prototype.make = function (type, settings) {
        var output;
        // Make sure the type actually exists in functions
        if (!this.functions.hasOwnProperty(type)) {
            throw new Error("Unknown type given to ObjectMakr: " + type);
        }
        // Create the new object, copying any given settings
        output = new this.functions[type]();
        if (settings) {
            this.proliferate(output, settings);
        }
        // onMake triggers are handled respecting doPropertiesFull.
        if (this.onMake && output[this.onMake]) {
            if (this.doPropertiesFull) {
                output[this.onMake](output, type, this.properties[type], this.propertiesFull[type]);
            }
            else {
                output[this.onMake](output, type, this.properties[type], this.functions[type].prototype);
            }
        }
        return output;
    };
    /* Core parsing
    */
    /**
     * Parser that calls processPropertyArray on all properties given as arrays
     * @param {Object} properties   The object of function properties
     * @remarks Only call this if indexMap is given as an array
     */
    ObjectMakr.prototype.processProperties = function (properties) {
        var name;
        for (name in properties) {
            if (this.properties.hasOwnProperty(name)) {
                // If it's an array, replace it with a mapped version
                if (this.properties[name] instanceof Array) {
                    this.properties[name] = this.processPropertyArray(this.properties[name]);
                }
            }
        }
    };
    /**
     * Creates an output properties object with the mapping shown in indexMap
     * @param {Array} properties   An array with indiced versions of properties
     * @example indexMap = ["width", "height"];
     *          properties = [7, 14];
     *          output = processPropertyArray(properties);
     *          // output is now { "width": 7, "height": 14 }
     */
    ObjectMakr.prototype.processPropertyArray = function (properties) {
        var output = {}, i;
        for (i = properties.length - 1; i >= 0; --i) {
            output[this.indexMap[i]] = properties[i];
        }
        return output;
    };
    /**
     * Recursive parser to generate each function, starting from the base.
     * @param {Object} base   An object whose keys are the names of functions to
     *                        made, and whose values are objects whose keys are
     *                        for children that inherit from these functions
     * @param {Function} parent   The parent function of the functions about to
     *                            be made
     * @param {String} parentName   The name of the parent Function to be
     *                              inherited from.
     * @remarks This may use eval, which is evil and almost never a good idea,
     *          but here it's the only way to make functions with dynamic names.
     */
    ObjectMakr.prototype.processFunctions = function (base, parent, parentName) {
        var name, ref;
        for (name in base) {
            if (base.hasOwnProperty(name)) {
                this.functions[name] = new Function();
                // This sets the function as inheriting from the parent
                this.functions[name].prototype = new parent();
                this.functions[name].prototype.constructor = this.functions[name];
                for (ref in this.properties[name]) {
                    if (this.properties[name].hasOwnProperty(ref)) {
                        this.functions[name].prototype[ref] = this.properties[name][ref];
                    }
                }
                // If the entire property tree is being mapped, copy everything
                // from both this and its parent to its equivalent
                if (this.doPropertiesFull) {
                    this.propertiesFull[name] = {};
                    if (parentName) {
                        for (ref in this.propertiesFull[parentName]) {
                            if (this.propertiesFull[parentName].hasOwnProperty(ref)) {
                                this.propertiesFull[name][ref] = this.propertiesFull[parentName][ref];
                            }
                        }
                    }
                    for (ref in this.properties[name]) {
                        if (this.properties[name].hasOwnProperty(ref)) {
                            this.propertiesFull[name][ref] = this.properties[name][ref];
                        }
                    }
                }
                this.processFunctions(base[name], this.functions[name], name);
            }
        }
    };
    /* Utilities
    */
    /**
     * Proliferates all members of the donor to the recipient recursively. This
     * is therefore a deep copy.
     * @param {Object} recipient   An object receiving the donor's members.
     * @param {Object} donor   An object whose members are copied to recipient.
     * @param {Boolean} noOverride   If recipient properties may be overriden.
     */
    ObjectMakr.prototype.proliferate = function (recipient, donor, noOverride) {
        if (noOverride === void 0) { noOverride = false; }
        var setting, i;
        for (i in donor) {
            // If noOverride is specified, don't override if it already exists
            if (noOverride && recipient.hasOwnProperty(i)) {
                continue;
            }
            // If it's an object, recurse on a new version of it
            setting = donor[i];
            if (typeof setting === "object") {
                if (!recipient.hasOwnProperty(i)) {
                    recipient[i] = new setting.constructor();
                }
                this.proliferate(recipient[i], setting, noOverride);
            }
            else {
                // Regular primitives are easy to copy otherwise
                recipient[i] = setting;
            }
        }
        return recipient;
    };
    return ObjectMakr;
})();
/// <reference path="ObjectMakr/ObjectMakr.ts" />
/// <reference path="MapsCreatrObjects.d.ts" />
/**
 * Basic storage container for a single Thing to be stored in an Area's
 * PreThings member. A PreThing stores an actual Thing along with basic
 * sizing and positioning information, so that a MapsHandler may accurately
 * spawn or unspawn it as needed.
 */
var PreThing = (function () {
    /**
     * @param {Thing} thing   The Thing, freshly created by ObjectMaker.make.
     * @param {PreThingSettings} reference   The creation Object instruction
     *                                        used to create the Thing.
     */
    function PreThing(thing, reference, ObjectMaker) {
        this.thing = thing;
        this.title = thing.title;
        this.reference = reference;
        this.spawned = false;
        this.left = reference.x || 0;
        this.top = reference.y || 0;
        this.right = this.left + (reference.width || ObjectMaker.getFullPropertiesOf(this.title).width);
        this.bottom = this.top + (reference.height || ObjectMaker.getFullPropertiesOf(this.title).height);
        if (reference.position) {
            this.position = reference.position;
        }
    }
    return PreThing;
})();
/**
 * MapsCreatr.js
 *
 * Storage container and lazy loader for GameStarter maps that is the back-end
 * counterpart to MapsHandlr. Maps are created with their custom Location and
 * Area members, which are initialized the first time the map is retrieved.
 * Areas contain a "creation" Object[] detailing the instructions on creating
 * that Area's "PreThing" objects, which store Things along with basic position
 * information.
 *
 * In short, a Map contains a set of Areas, each of which knows its size and the
 * steps to create its contents. Each Map also contains a set of Locations,
 * which are entry points into one Area each.
 *
 * See Schema.txt for the minimum recommended format for Maps, Locations,
 * Areas, and creation commands.
 *
 * @example
 * // Creating and using a MapsCreatr to store a very simple Map.
 * var MapsCreator = new MapsCreatr({
 *         "ObjectMaker": new ObjectMakr({
 *             "doPropertiesFull": true,
 *             "inheritance": {
 *                 "Map": {},
 *                 "Area": {},
 *                 "Location": {},
 *                 "Thing": {
 *                     "SomeThing": {}
 *                 }
 *             },
 *             "properties": {
 *                 "SomeThing": {
 *                     "title": "SomeThing",
 *                     "groupType": "Thing",
 *                     "width": 7,
 *                     "height": 7
 *                 }
 *             }
 *         }),
 *         "groupTypes": ["Thing"],
 *         "maps": {
 *             "MyFirstMap": {
 *                 "locations": [
 *                     { "area": 0, "entry": "Normal" }
 *                 ],
 *                 "areas": [{
 *                     "creation": [
 *                         { "thing": "SomeThing", "x": 3, "y": 4 }
 *                     ]
 *                 }]
 *             }
 *         }
 *     }),
 *     map = MapsCreator.getMap("MyFirstMap");
 *
 * // Map { locations: Array[1], areas: Array[1], areasRaw: Array[1], ... }
 * console.log(map);
 *
 * // Area { creation: Array[1], map: Map, name: "0", boundaries: Object, ... }
 * console.log(map.areas[0]);
 *
 * // Object { thing: "SomeThing", x: 3, y: 4 }
 * console.log(map.areas[0].creation[0]);
 *
 * @example
 * // Creating and using a MapsCreatr to store a simple Map with a macro and
 * // look at what will be created when it's used.
 * var MapsCreator = new MapsCreatr({
 *         "ObjectMaker": new ObjectMakr({
 *             "doPropertiesFull": true,
 *             "inheritance": {
 *                 "Map": {},
 *                 "Area": {},
 *                 "Location": {},
 *                 "Thing": {
 *                     "SomeThing": {}
 *                 }
 *             },
 *             "properties": {
 *                 "SomeThing": {
 *                     "title": "SomeThing",
 *                     "groupType": "Thing",
 *                     "width": 7,
 *                     "height": 7
 *                 }
 *             }
 *         }),
 *         "groupTypes": ["Thing"],
 *         "macros": {
 *             "Fill": function (reference) {
 *                 var output = [],
 *                     thing = reference.thing,
 *                     between = reference.between || 10,
 *                     times = reference.times || 1,
 *                     x = reference.x || 0,
 *                     y = reference.y || 0;
 *
 *                 while (times > 0) {
 *                     output.push({
 *                         "thing": reference.thing,
 *                         "x": x,
 *                         "y": y
 *                     });
 *                     x += between;
 *                     times -= 1;
 *                 }
 *
 *                 return output;
 *             }
 *         },
 *         "maps": {
 *             "MyFirstMap": {
 *                 "locations": [
 *                     { "area": 0, "entry": "Normal" }
 *                 ],
 *                 "areas": [{
 *                     "creation": [
 *                         { "macro": "Fill", "thing": "SomeThing", "times": 7, "x": 3, "y": 4 }
 *                     ]
 *                 }]
 *             }
 *         }
 *     }),
 *     map = MapsCreator.getMap("MyFirstMap"),
 *     prethings = MapsCreator.getPreThings(map.areas[0]);
 *
 * // Object {Thing: Object}
 * console.log(prethings);
 *
 * // Object { xInc: Array[7], xDec: Array[7], yInc: Array[7], yDec: ... }
 * console.log(prethings.Thing);
 *
 * // [PreThing, PreThing, PreThing, PreThing, PreThing, PreThing, PreThing]
 * console.log(prethings.Thing.xInc);
 *
 * // PreThing { thing: SomeThing, title: "SomeThing", reference: Object, ... }
 * console.log(prethings.Thing.xInc[0]);
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var MapsCreatr = (function () {
    /**
     * Resets the MapsCreatr.
     *
     * @constructor
     * @param {IMapsCreatrSettings} settings
     */
    function MapsCreatr(settings) {
        if (!settings) {
            throw new Error("No settings given to MapsCreatr.");
        }
        // Maps and Things are created using an ObjectMaker factory
        if (!settings.ObjectMaker) {
            throw new Error("No ObjectMakr given to MapsCreatr.");
        }
        this.ObjectMaker = settings.ObjectMaker;
        if (typeof this.ObjectMaker.getFullProperties() === "undefined") {
            throw new Error("MapsCreatr's ObjectMaker must store full properties.");
        }
        // At least one group type name should be defined for PreThing output
        if (!settings.groupTypes) {
            throw new Error("No groupTypes given to MapsCreatr.");
        }
        this.groupTypes = settings.groupTypes;
        this.keyGroupType = settings.keyGroupType || "groupType";
        this.keyEntrance = settings.keyEntrance || "entrance";
        this.macros = settings.macros || {};
        this.scope = settings.scope || this;
        this.entrances = settings.entrances;
        this.requireEntrance = settings.requireEntrance;
        this.maps = {};
        if (settings.maps) {
            this.storeMaps(settings.maps);
        }
    }
    /* Simple gets
    */
    /**
     * @return {ObjectMakr}   The internal ObjectMakr.
     */
    MapsCreatr.prototype.getObjectMaker = function () {
        return this.ObjectMaker;
    };
    /**
     * @return {String[]}   The allowed group types.
     */
    MapsCreatr.prototype.getGroupTypes = function () {
        return this.groupTypes;
    };
    /**
     * @return {String}   The key under which Things are to store their group.
     */
    MapsCreatr.prototype.getKeyGroupType = function () {
        return this.keyGroupType;
    };
    /**
     * @return {String}   The key under which Things declare themselves an entrance.
     */
    MapsCreatr.prototype.getKeyEntrance = function () {
        return this.keyEntrance;
    };
    /**
     * @return {Object}   The allowed macro Functions.
     */
    MapsCreatr.prototype.getMacros = function () {
        return this.macros;
    };
    /**
     * @return {Mixed}   The scope to give as a last parameter to macros.
     */
    MapsCreatr.prototype.getScope = function () {
        return this.scope;
    };
    /**
     * @return {Boolean} Whether Locations must have an entrance Function.
     */
    MapsCreatr.prototype.getRequireEntrance = function () {
        return this.requireEntrance;
    };
    /**
     * @return {Object}   The Object storing maps, keyed by name.
     */
    MapsCreatr.prototype.getMaps = function () {
        return this.maps;
    };
    /**
     * Simple getter for a map under the maps container. If the map has not been
     * initialized (had its areas and locations set), that is done here as lazy
     * loading.
     *
     * @param {Mixed} name   A key to find the map under. This will typically be
     *                       a String.
     * @return {Map}
     */
    MapsCreatr.prototype.getMap = function (name) {
        var map = this.maps[name];
        if (!map) {
            throw new Error("No map found under: " + name);
        }
        if (!map.initialized) {
            // Set the one-to-many Map->Area relationships within the Map
            this.setMapAreas(map);
            // Set the one-to-many Area->Location relationships within the Map
            this.setMapLocations(map);
            map.initialized = true;
        }
        return map;
    };
    /**
     * Creates and stores a set of new maps based on the key/value pairs in a
     * given Object. These will be stored as maps by their string keys via
     * this.storeMap.
     *
     * @param {Object} maps   An Object containing a set of key/map pairs to
     *                       store as maps.
     * @return {Object}   The newly created maps object.
     */
    MapsCreatr.prototype.storeMaps = function (maps) {
        for (var i in maps) {
            if (maps.hasOwnProperty(i)) {
                this.storeMap(i, maps[i]);
            }
        }
    };
    /**
     * Creates and stores a new map. The internal ObjectMaker factory is used to
     * auto-generate it based on a given settings object. The actual loading of
     * Areas and Locations is deferred to this.getMap.
     *
     * @param {Mixed} name   A name under which the map should be stored,
     *                       commonly a String or Array.
     * @param {Object} settings   An Object containing arguments to be sent to
     *                            the ObjectMakr being used as a Maps factory.
     * @return {Map}   The newly created Map.
     */
    MapsCreatr.prototype.storeMap = function (name, settings) {
        if (!name) {
            throw new Error("Maps cannot be created with no name.");
        }
        var map = this.ObjectMaker.make("Map", settings);
        if (!map.areas) {
            throw new Error("Maps cannot be used with no areas: " + name);
        }
        if (!map.locations) {
            throw new Error("Maps cannot be used with no locations: " + name);
        }
        this.maps[name] = map;
        return map;
    };
    /* Area setup (PreThing analysis)
    */
    /**
     * Given a Area, this processes and returns the PreThings that are to
     * inhabit the Area per its creation instructions.
     *
     * Each reference (which is a JSON object taken from an Area's .creation
     * Array) is an instruction to this script to switch to a location, push
     * some number of PreThings to the PreThings object via a predefined macro,
     * or push a single PreThing to the PreThings object.
     *
     * Once those PreThing objects are obtained, they are filtered for validity
     * (e.g. location setter commands are irrelevant after a single use), and
     * sorted on .xloc and .yloc.
     *
     * @param {Area} area
     * @return {Object}   An associative array of PreThing containers. The keys
     *                    will be the unique group types of all the allowed
     *                    Thing groups, which will be stored in the parent
     *                    EightBittr's GroupHoldr. Each container stores Arrays
     *                    of the PreThings sorted by .xloc and .yloc in both
     *                    increasing and decreasing order.
     */
    MapsCreatr.prototype.getPreThings = function (area) {
        var map = area.map, creation = area.creation, prethings = this.fromKeys(this.groupTypes), i;
        this.xloc = 0;
        this.yloc = 0;
        area.collections = {};
        for (i = 0; i < creation.length; i += 1) {
            this.analyzePreSwitch(creation[i], prethings, area, map);
        }
        return this.processPreThingsArrays(prethings);
    };
    /**
     * PreThing switcher: Given a JSON representation of a PreThing, this
     * determines what to do with it. It may be a location setter (to switch the
     * x- and y- location offset), a macro (to repeat some number of actions),
     * or a raw PreThing.
     * Any modifications done in a called function will be to push some number
     * of PreThings to their respective group in the output PreThings Object.
     *
     * @param {Object} reference   A JSON mapping of some number of PreThings.
     * @param {Object} PreThings   An associative array of PreThing Arrays,
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    MapsCreatr.prototype.analyzePreSwitch = function (reference, prethings, area, map) {
        // Case: macro (unless it's undefined)
        if (reference.macro) {
            return this.analyzePreMacro(reference, prethings, area, map);
        }
        else {
            // Case: default (a regular PreThing)
            return this.analyzePreThing(reference, prethings, area, map);
        }
    };
    /**
     * PreThing case: Macro instruction. This calls the macro on the same input,
     * captures the output, and recursively repeats the analyzePreSwitch driver
     * function on the output(s).
     *
     * @param {Object} reference   A JSON mapping of some number of PreThings.
     * @param {Object} PreThings   An associative array of PreThing Arrays,
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    MapsCreatr.prototype.analyzePreMacro = function (reference, prethings, area, map) {
        var macro = this.macros[reference.macro], outputs, i;
        if (!macro) {
            console.warn("A non-existent macro is referenced. It will be ignored:", macro, reference, prethings, area, map);
            return;
        }
        // Avoid modifying the original macro by creating a new object in its
        // place, while submissively proliferating any default macro settings
        outputs = macro(reference, prethings, area, map, this.scope);
        // If there is any output, recurse on all components of it, Array or not
        if (outputs) {
            if (outputs instanceof Array) {
                for (i = 0; i < outputs.length; i += 1) {
                    this.analyzePreSwitch(outputs[i], prethings, area, map);
                }
            }
            else {
                this.analyzePreSwitch(outputs, prethings, area, map);
            }
        }
        return outputs;
    };
    /**
     * Macro case: PreThing instruction. This creates a PreThing from the
     * given reference and adds it to its respective group in PreThings (based
     * on the PreThing's [keyGroupType] variable).
     *
     * @param {Object} reference   A JSON mapping of some number of PreThings.
     * @param {Object} PreThings   An associative array of PreThing Arrays,
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    MapsCreatr.prototype.analyzePreThing = function (reference, prethings, area, map) {
        var title = reference.thing, thing, prething;
        if (!this.ObjectMaker.hasFunction(title)) {
            console.warn("A non-existent Thing type is referenced. It will be ignored:", title, reference, prethings, area, map);
            return;
        }
        prething = new PreThing(this.ObjectMaker.make(title, reference), reference, this.ObjectMaker);
        thing = prething.thing;
        if (!prething.thing[this.keyGroupType]) {
            console.warn("A Thing does not contain a " + this.keyGroupType + ". It will be ignored:", prething, "\n", arguments);
            return;
        }
        if (this.groupTypes.indexOf(prething.thing[this.keyGroupType]) === -1) {
            console.warn("A Thing contains an unknown " + this.keyGroupType + ". It will be ignored:", thing[this.keyGroupType], prething, reference, prethings, area, map);
            return;
        }
        prethings[prething.thing[this.keyGroupType]].push(prething);
        if (!thing.noBoundaryStretch && area.boundaries) {
            this.stretchAreaBoundaries(prething, area);
        }
        // If a Thing is an entrance, then the location it is an entrance to 
        // must know it and its position. Note that this will have to be changed
        // for Pokemon/Zelda style games.
        if (thing[this.keyEntrance] !== undefined && typeof thing[this.keyEntrance] !== "object") {
            if (typeof map.locations[thing[this.keyEntrance]] !== "undefined") {
                if (typeof map.locations[thing[this.keyEntrance]].xloc === "undefined") {
                    map.locations[thing[this.keyEntrance]].xloc = prething.left;
                }
                if (typeof map.locations[thing[this.keyEntrance]].yloc === "undefined") {
                    map.locations[thing[this.keyEntrance]].yloc = prething.top;
                }
                map.locations[thing[this.keyEntrance]].entrance = prething.thing;
            }
        }
        if (reference.collectionName && area.collections) {
            this.ensureThingCollection(prething, reference.collectionName, reference.collectionKey, area);
        }
        return prething;
    };
    /**
     * Converts the raw area settings in a Map into Area objects.
     *
     * These areas are typically stored as an Array or Object inside the Map
     * containing some number of attribute keys (such as "settings") along with
     * an Array under "Creation" that stores some number of commands for
     * populating that area in MapsHandlr::spawnMap.
     *
     * @param {Map} map
     */
    MapsCreatr.prototype.setMapAreas = function (map) {
        var areasRaw = map.areas, locationsRaw = map.locations, 
        // The parsed containers should be the same types as the originals
        areasParsed = new areasRaw.constructor(), locationsParsed = new locationsRaw.constructor(), area, location, i;
        for (i in areasRaw) {
            if (areasRaw.hasOwnProperty(i)) {
                area = this.ObjectMaker.make("Area", areasRaw[i]);
                areasParsed[i] = area;
                area.map = map;
                area.name = i;
                area.boundaries = {
                    "top": 0,
                    "right": 0,
                    "bottom": 0,
                    "left": 0
                };
            }
        }
        for (i in locationsRaw) {
            if (locationsRaw.hasOwnProperty(i)) {
                location = this.ObjectMaker.make("Location", locationsRaw[i]);
                locationsParsed[i] = location;
                location.entryRaw = locationsRaw[i].entry;
                location.name = i;
                location.area = locationsRaw[i].area || 0;
                if (this.requireEntrance) {
                    if (!this.entrances.hasOwnProperty(location.entryRaw)) {
                        throw new Error("Location " + i + " has unknown entry string: " + location.entryRaw);
                    }
                }
                if (this.entrances && location.entryRaw) {
                    location.entry = this.entrances[location.entryRaw];
                }
                else if (location.entry && location.entry.constructor === String) {
                    location.entry = this.entrances[String(location.entry)];
                }
            }
        }
        // Store the output object in the Map, and keep the raw settings for the
        // sake of debugging / user interest
        map.areas = areasParsed;
        map.areasRaw = areasRaw;
        map.locations = locationsParsed;
        map.locationsRaw = locationsRaw;
    };
    /**
     * Converts the raw location settings in a Map into Location objects.
     *
     * These locations typically have very little information, generally just a
     * container Area, x-location, y-location, and spawning function.
     *
     * @param {Map} map
     */
    MapsCreatr.prototype.setMapLocations = function (map) {
        var locsRaw = map.locations, 
        // The parsed container should be the same type as the original
        locsParsed = new locsRaw.constructor(), location, i;
        for (i in locsRaw) {
            if (locsRaw.hasOwnProperty(i)) {
                location = this.ObjectMaker.make("Location", locsRaw[i]);
                locsParsed[i] = location;
                // The area should be an object reference, under the Map's areas
                location.area = map.areas[locsRaw[i].area || 0];
                if (!locsParsed[i].area) {
                    throw new Error("Location " + i + " references an invalid area:" + locsRaw[i].area);
                }
            }
        }
        // Store the output object in the Map, and keep the old settings for the
        // sake of debugging / user interest
        map.locations = locsParsed;
        map.locationsRaw = locsRaw;
    };
    /**
     * "Stretches" an Area's boundaries based on a PreThing. For each direction,
     * if the PreThing has a more extreme version of it (higher top, etc.), the
     * boundary is updated.
     *
     * @param {PreThing} prething
     * @param {Area} area
     */
    MapsCreatr.prototype.stretchAreaBoundaries = function (prething, area) {
        var boundaries = area.boundaries;
        boundaries.top = Math.min(prething.top, boundaries.top);
        boundaries.right = Math.max(prething.right, boundaries.right);
        boundaries.bottom = Math.max(prething.bottom, boundaries.bottom);
        boundaries.left = Math.min(prething.left, boundaries.left);
    };
    /**
     * Adds a Thing to the specified collection in the Map's Area.
     *
     * @param {PreThing} prething
     * @param {String} collectionName
     * @param {String} collectionKey
     * @param {Area} area
     */
    MapsCreatr.prototype.ensureThingCollection = function (prething, collectionName, collectionKey, area) {
        var thing = prething.thing, collection = area.collections[collectionName];
        if (!collection) {
            collection = area.collections[collectionName] = {};
        }
        thing.collection = collection;
        collection[collectionKey] = thing;
    };
    /**
     * Creates an Object wrapper around a PreThings Object with versions of
     * each child PreThing[]sorted by xloc and yloc, in increasing and
     * decreasing order.
     *
     * @param {Object} prethings
     * @return {Object} A PreThing wrapper with the keys "xInc", "xDec",
     *                  "yInc", and "yDec".
     */
    MapsCreatr.prototype.processPreThingsArrays = function (prethings) {
        var scope = this, output = {}, i;
        for (i in prethings) {
            if (prethings.hasOwnProperty(i)) {
                var children = prethings[i], array = {
                    "xInc": this.getArraySorted(children, this.sortPreThingsXInc),
                    "xDec": this.getArraySorted(children, this.sortPreThingsXDec),
                    "yInc": this.getArraySorted(children, this.sortPreThingsYInc),
                    "yDec": this.getArraySorted(children, this.sortPreThingsYDec)
                };
                // Adding in a "push" lambda allows MapsCreatr to interact with
                // this using the same .push syntax as Arrays.
                array.push = (function (prething) {
                    scope.addArraySorted(this.xInc, prething, scope.sortPreThingsXInc);
                    scope.addArraySorted(this.xDec, prething, scope.sortPreThingsXDec);
                    scope.addArraySorted(this.yInc, prething, scope.sortPreThingsYInc);
                    scope.addArraySorted(this.yDec, prething, scope.sortPreThingsYDec);
                }).bind(array);
                output[i] = array;
            }
        }
        return output;
    };
    /* Utilities
    */
    /**
     * Creates an Object pre-populated with one key for each of the Strings in
     * the input Array, each pointing to a new Array.
     *
     * @param {String[]} arr
     * @return {Object}
     * @remarks This is a rough opposite of Object.keys, which takes in an
     *          Object and returns an Array of Strings.
     */
    MapsCreatr.prototype.fromKeys = function (arr) {
        var output = {}, i;
        for (i = 0; i < arr.length; i += 1) {
            output[arr[i]] = [];
        }
        return output;
    };
    /**
     * Returns a shallow copy of an Array, in sorted order based on a given
     * sorter Function.
     *
     * @param {Array} array
     * @param {Function} sorter
     * @
     */
    MapsCreatr.prototype.getArraySorted = function (array, sorter) {
        var copy = array.slice();
        copy.sort(sorter);
        return copy;
    };
    /**
     * Adds an element into an Array using a sorter Function.
     *
     * @param {Array} array
     * @param {Mixed} element
     * @param {Function} sorter   A Function that returns the difference between
     *                            two elements (for example, a Numbers sorter
     *                            given (a,b) would return a - b).
     */
    MapsCreatr.prototype.addArraySorted = function (array, element, sorter) {
        var lower = 0, upper = array.length, index;
        while (lower !== upper) {
            index = ((lower + upper) / 2) | 0;
            // Case: element is less than the index
            if (sorter(element, array[index]) < 0) {
                upper = index;
            }
            else {
                // Case: element is higher than the index
                lower = index + 1;
            }
        }
        if (lower === upper) {
            array.splice(lower, 0, element);
            return;
        }
    };
    /**
     * Sorter for PreThings that results in increasing horizontal order.
     *
     * @param {PreThing} a
     * @param {PreThing} b
     */
    MapsCreatr.prototype.sortPreThingsXInc = function (a, b) {
        return a.left === b.left ? a.top - b.top : a.left - b.left;
    };
    /**
     * Sorter for PreThings that results in decreasing horizontal order.
     *
     * @param {PreThing} a
     * @param {PreThing} b
     */
    MapsCreatr.prototype.sortPreThingsXDec = function (a, b) {
        return b.right === a.right ? b.bottom - a.bottom : b.right - a.right;
    };
    /**
     * Sorter for PreThings that results in increasing vertical order.
     *
     * @param {PreThing} a
     * @param {PreThing} b
     */
    MapsCreatr.prototype.sortPreThingsYInc = function (a, b) {
        return a.top === b.top ? a.left - b.left : a.top - b.top;
    };
    /**
     * Sorter for PreThings that results in decreasing vertical order.
     *
     * @param {PreThing} a
     * @param {PreThing} b
     */
    MapsCreatr.prototype.sortPreThingsYDec = function (a, b) {
        return b.bottom === a.bottom ? b.right - a.right : b.bottom - a.bottom;
    };
    return MapsCreatr;
})();
/**
 * MapScreenr.js
 *
 * A simple container for Map attributes given by switching to an Area within
 * that map. A bounding box of the current viewport is kept, along with any
 * other information desired.
 *
 * MapScreenr is the closest thing GameStartr projects have to a "global"
 * variable depository, where miscellaneous variables may be stored.
 *
 * @example
 * // Creating and using a MapScreenr to emulate a simple screen.
 * var MapScreener = new MapScreenr({
 *     "width": 640,
 *     "height": 480
 * });
 * MapScreener.clearScreen();
 *
 * // [0, 640, 480, 0]
 * console.log([
 *     MapScreener.top, MapScreener.right, MapScreener.bottom, MapScreener.left
 * ]);
 *
 * @example
 * // Creating and using a MapScreenr to store screen information.
 * var MapScreener = new MapScreenr({
 *     "width": 640,
 *     "height": 480,
 *     "variables": {
 *         "pixels": function () {
 *             return this.width * this.height;
 *         },
 *         "resolution": function () {
 *             return this.width / this.height;
 *         }
 *     }
 * });
 * MapScreener.clearScreen();
 *
 * // 307200 "pixels at" 1.3333333333333333
 * console.log(MapScreener.pixels, "pixels at", MapScreener.resolution);
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var MapScreenr = (function () {
    /**
     * Resets the MapScreenr. All members of the settings argument are copied
     * to the MapScreenr itself, though only width and height are required.
     */
    function MapScreenr(settings) {
        var name;
        if (typeof settings.width === "undefined") {
            throw new Error("No width given to MapScreenr.");
        }
        if (typeof settings.height === "undefined") {
            throw new Error("No height given to MapScreenr.");
        }
        for (name in settings) {
            if (settings.hasOwnProperty(name)) {
                this[name] = settings[name];
            }
        }
        this.variables = settings.variables || {};
        this.variableArgs = settings.variableArgs || [];
    }
    /* State changes
    */
    /**
     * Completely clears the MapScreenr for use in a new Area. Positioning is
     * reset to (0,0) and user-configured variables are recalculated.
     */
    MapScreenr.prototype.clearScreen = function () {
        this.left = 0;
        this.top = 0;
        this.right = this.width;
        this.bottom = this.height;
        this.setMiddleX();
        this.setMiddleY();
        this.setVariables();
    };
    /**
     * Computes middleX as the midpoint between left and right.
     */
    MapScreenr.prototype.setMiddleX = function () {
        this.middleX = (this.left + this.right) / 2;
    };
    /**
     * Computes middleY as the midpoint between top and bottom.
     */
    MapScreenr.prototype.setMiddleY = function () {
        this.middleY = (this.top + this.bottom) / 2;
    };
    /**
     * Runs all variable Functions with variableArgs to recalculate their
     * values.
     */
    MapScreenr.prototype.setVariables = function () {
        for (var i in this.variables) {
            if (this.variables.hasOwnProperty(i)) {
                this[i] = this.variables[i].apply(this, this.variableArgs);
            }
        }
    };
    /* Element shifting
    */
    /**
     * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
     *
     * @param {Number} dx
     * @param {Number} dy
     */
    MapScreenr.prototype.shift = function (dx, dy) {
        if (dx) {
            this.shiftX(dx);
        }
        if (dy) {
            this.shiftY(dy);
        }
    };
    /**
     * Shifts the MapScreenr horizontally by changing left and right by the dx.
     *
     * @param {Number} dx
     */
    MapScreenr.prototype.shiftX = function (dx) {
        this.left += dx;
        this.right += dx;
    };
    /**
     * Shifts the MapScreenr vertically by changing top and bottom by the dy.
     *
     * @param {Number} dy
     */
    MapScreenr.prototype.shiftY = function (dy) {
        this.top += dy;
        this.bottom += dy;
    };
    return MapScreenr;
})();
/// <reference path="MapsCreatr/MapsCreatr.ts" />
/// <reference path="MapsCreatr/MapsCreatrObjects.d.ts" />
/// <reference path="MapScreenr/MapScreenr.ts" />
/**
 * MapsHandlr.js
 *
 * Map manipulator and spawner for GameStarter maps that is the front-end
 * counterpart to MapsCreatr. PreThing listings are loaded from Maps stored in a
 * MapsCreatr and added or removed from user input. Area properties are given to
 * a MapScreenr when a new Area is loaded.
 *
 * Examples are not available for MapsHandlr, as the required code would be very
 * substantial. Instead see GameStartr.js and its map manipulation code.
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var MapsHandlr = (function () {
    /**
     * @param {IMapsHandlrSettings} settings
     */
    function MapsHandlr(settings) {
        if (!settings) {
            throw new Error("No settings given to MapsHandlr.");
        }
        // Maps themselves should have been created in the MapsCreator object
        if (!settings.MapsCreator) {
            throw new Error("No MapsCreator provided to MapsHandlr.");
        }
        this.MapsCreator = settings.MapsCreator;
        // Map/Area attributes will need to be stored in a MapScreenr object
        if (!settings.MapScreener) {
            throw new Error("No MapScreener provided to MapsHandlr.");
        }
        this.MapScreener = settings.MapScreener;
        this.onSpawn = settings.onSpawn;
        this.onUnspawn = settings.onUnspawn;
        this.screenAttributes = settings.screenAttributes || [];
        this.stretchAdd = settings.stretchAdd;
        this.afterAdd = settings.afterAdd;
    }
    /* Simple gets
    */
    /**
     * @return {MapsCreatr}   The internal MapsCreator.
     */
    MapsHandlr.prototype.getMapsCreator = function () {
        return this.MapsCreator;
    };
    /**
     * @return {MapScreenr}   The internal MapScreener.
     */
    MapsHandlr.prototype.getMapScreener = function () {
        return this.MapScreener;
    };
    /**
     * @return {String[]}   The attribute names to be copied to MapScreener.
     */
    MapsHandlr.prototype.getScreenAttributes = function () {
        return this.screenAttributes;
    };
    /**
     * @return {String}   The key by which the current Map is indexed.
     */
    MapsHandlr.prototype.getMapName = function () {
        return this.mapName;
    };
    /**
     * Gets the map listed under the given name. If no name is provided, the
     * mapCurrent is returned instead.
     *
     * @param {String} [name]   An optional key to find the map under.
     * @return {Map}
     */
    MapsHandlr.prototype.getMap = function (name) {
        if (name === void 0) { name = undefined; }
        if (typeof name !== "undefined") {
            return this.MapsCreator.getMap(name);
        }
        else {
            return this.mapCurrent;
        }
    };
    /**
     * Simple getter pipe to the internal MapsCreator.getMaps() function.
     *
     * @return {Object<Map>}   A listing of maps, keyed by their names.
     */
    MapsHandlr.prototype.getMaps = function () {
        return this.MapsCreator.getMaps();
    };
    /**
     * @return {Area} The current Area.
     */
    MapsHandlr.prototype.getArea = function () {
        return this.areaCurrent;
    };
    /**
     * @return {String} The name of the current Area.
     */
    MapsHandlr.prototype.getAreaName = function () {
        return this.areaCurrent.name;
    };
    /**
     * @param {String} location   The key of the Location to return.
     * @return {Location} A Location within the current Map.
     */
    MapsHandlr.prototype.getLocation = function (location) {
        return this.areaCurrent.map.locations[location];
    };
    /**
     * Simple getter function for the internal prethings object. This will be
     * undefined before the first call to setMap.
     *
     * @return {Object} A listing of the current area's Prethings.
     */
    MapsHandlr.prototype.getPreThings = function () {
        return this.prethings;
    };
    /* Map / location setting
    */
    /**
     * Sets the currently manipulated Map in the handler to be the one under a
     * given name. Note that this will do very little unless a location is
     * provided.
     *
     * @param {String} name   A key to find the map under.
     * @param {Mixed} [location]   An optional key for a location to immediately
     *                              start the map in (if not provided, ignored).
     *
     */
    MapsHandlr.prototype.setMap = function (name, location) {
        if (location === void 0) { location = undefined; }
        // Get the newly current map from this.getMap normally
        this.mapCurrent = this.getMap(name);
        if (!this.mapCurrent) {
            throw new Error("Unknown Map in setMap: '" + name + "'.");
        }
        this.mapName = name;
        // Most of the work is done by setLocation (by default, the map's first)
        if (arguments.length > 1) {
            this.setLocation(location);
        }
        return this.mapCurrent;
    };
    /**
     * Goes to a particular location in the given map. Area attributes are
     * copied to the MapScreener, PreThings are loaded, and stretches and afters
     * are checked.
     *
     * @param {String} name   The key of the Location to start in.
     */
    MapsHandlr.prototype.setLocation = function (name) {
        var location, attribute, i;
        // Query the location from the current map and ensure it exists
        location = this.mapCurrent.locations[name];
        if (!location) {
            throw new Error("Unknown location in setLocation: '" + name + "'.");
        }
        // Since the location is valid, mark it as current (with its area)
        this.locationCurrent = location;
        this.areaCurrent = location.area;
        this.areaCurrent.boundaries = {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
        };
        for (i = 0; i < this.screenAttributes.length; i += 1) {
            attribute = this.screenAttributes[i];
            this.MapScreener[attribute] = this.areaCurrent[attribute];
        }
        // Reset the prethings object, enabling it to be used as a fresh start
        // for the new Area/Location placements
        this.prethings = this.MapsCreator.getPreThings(location.area);
        // Optional: set stretch commands
        if (this.areaCurrent.stretches) {
            this.setStretches(this.areaCurrent.stretches);
        }
        else {
            this.stretches = undefined;
        }
        // Optional: set after commands
        if (this.areaCurrent.afters) {
            this.setAfters(this.areaCurrent.afters);
        }
        else {
            this.afters = undefined;
        }
    };
    /**
     * Applies the stretchAdd Function to each given "stretch" command and
     * stores the commands in stretches.
     *
     * @param {Object[]} stretchesRaw
     */
    MapsHandlr.prototype.setStretches = function (stretchesRaw) {
        this.stretches = stretchesRaw;
        this.stretches.forEach(this.stretchAdd);
    };
    /**
     * Applies the afterAdd Function to each given "after" command and stores
     * the commands in afters.
     *
     * @param {Object[]} aftersRaw
     */
    MapsHandlr.prototype.setAfters = function (aftersRaw) {
        this.afters = aftersRaw;
        this.afters.forEach(this.afterAdd);
    };
    /**
     * Calls onSpawn on every PreThing touched by the given bounding box,
     * determined in order of the given direction. This is a simple wrapper
     * around applySpawnAction that also gives it true as the status.
     *
     * @param {String} direction   The direction by which to order PreThings:
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to spawn within.
     * @param {Number} right   The right-most bound to spawn within.
     * @param {Number} bottom    The bottom-most bound to spawn within.
     * @param {Number} left    The left-most bound to spawn within.
     */
    MapsHandlr.prototype.spawnMap = function (direction, top, right, bottom, left) {
        if (this.onSpawn) {
            this.applySpawnAction(this.onSpawn, true, direction, top, right, bottom, left);
        }
    };
    /**
     * Calls onUnspawn on every PreThing touched by the given bounding box,
     * determined in order of the given direction. This is a simple wrapper
     * around applySpawnAction that also gives it false as the status.
     *
     * @param {String} direction   The direction by which to order PreThings:
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to spawn within.
     * @param {Number} right   The right-most bound to spawn within.
     * @param {Number} bottom    The bottom-most bound to spawn within.
     * @param {Number} left    The left-most bound to spawn within.
     */
    MapsHandlr.prototype.unspawnMap = function (direction, top, right, bottom, left) {
        if (this.onUnspawn) {
            this.applySpawnAction(this.onUnspawn, false, direction, top, right, bottom, left);
        }
    };
    /**
     * Calls onUnspawn on every PreThing touched by the given bounding box,
     * determined in order of the given direction. This is used both to spawn
     * and un-spawn PreThings, such as during QuadsKeepr shifting. The given
     * status is used as a filter: all PreThings that already have the status
     * (generally true or false as spawned or unspawned, respectively) will have
     * the callback called on them.
     *
     * @param {Function} callback   The callback to be run whenever a matching
     *                              matching PreThing is found.
     * @param {Boolean} status   The spawn status to match PreThings against.
     *                           Only PreThings with .spawned === status will
     *                           have the callback applied to them.
     * @param {String} direction   The direction by which to order PreThings:
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @todo This will almost certainly present problems when different
     *       directions are used. For Pokemon/Zelda style games, the system
     *       will probably need to be adapted to use a Quadrants approach
     *       instead of plain Arrays.
     */
    MapsHandlr.prototype.applySpawnAction = function (callback, status, direction, top, right, bottom, left) {
        var name, group, prething, mid, start, end, i;
        for (name in this.prethings) {
            if (!this.prethings.hasOwnProperty(name)) {
                continue;
            }
            // Don't bother trying to spawn the group if it has no members
            group = this.prethings[name][direction];
            if (group.length === 0) {
                continue;
            }
            // Find the start and end points within the PreThings Array
            // Ex. if direction="xInc", go from .left >= left to .left <= right
            mid = (group.length / 2) | 0;
            start = this.findPreThingsSpawnStart(direction, group, mid, top, right, bottom, left);
            end = this.findPreThingsSpawnEnd(direction, group, mid, top, right, bottom, left);
            for (i = start; i <= end; i += 1) {
                prething = group[i];
                // For example: if status is true (spawned), don't spawn again
                if (prething.spawned !== status) {
                    prething.spawned = status;
                    callback(prething);
                }
            }
        }
    };
    /**
     * Finds the index from which PreThings should stop having an action
     * applied to them in applySpawnAction. This is less efficient than the
     * unused version below, but is more reliable for slightly unsorted groups.
     *
     * @param {String} direction   The direction by which to order PreThings:
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {PreThing[]} group   The group to find a PreThing index within.
     * @param {Number} mid   The middle of the group. This is currently unused.
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @return {Number}
     */
    MapsHandlr.prototype.findPreThingsSpawnStart = function (direction, group, mid, top, right, bottom, left) {
        var directionKey = MapsHandlr.directionKeys[direction], directionEnd = this.getDirectionEnd(directionKey, top, right, bottom, left), i;
        for (i = 0; i < group.length; i += 1) {
            if (group[i][directionKey] >= directionEnd) {
                return i;
            }
        }
        return i;
    };
    /**
     * Finds the index from which PreThings should stop having an action
     * applied to them in applySpawnAction. This is less efficient than the
     * unused version below, but is more reliable for slightly unsorted groups.
     *
     * @param {String} direction   The direction by which to order PreThings:
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {PreThing[]} group   The group to find a PreThing index within.
     * @param {Number} mid   The middle of the group. This is currently unused.
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @return {Number}
     */
    MapsHandlr.prototype.findPreThingsSpawnEnd = function (direction, group, mid, top, right, bottom, left) {
        var directionKey = MapsHandlr.directionKeys[direction], directionKeyOpposite = MapsHandlr.directionKeys[MapsHandlr.directionOpposites[direction]], directionEnd = this.getDirectionEnd(directionKeyOpposite, top, right, bottom, left), i;
        for (i = group.length - 1; i >= 0; i -= 1) {
            if (group[i][directionKey] <= directionEnd) {
                return i;
            }
        }
        return i;
    };
    /**
     * Conditionally returns a measurement based on what direction String is
     * given. This is useful for generically finding boundaries when the
     * direction isn't known, such as in findPreThingsSpawnStart and -End.
     *
     * @param {String} direction   The direction by which to order PreThings:
     *                             "xInc", "xDec", "yInc", or "yDec".
     * @param {Number} top   The upper-most bound to apply within.
     * @param {Number} right   The right-most bound to apply within.
     * @param {Number} bottom    The bottom-most bound to apply within.
     * @param {Number} left    The left-most bound to apply within.
     * @return {Number} top, right, bottom, or left, depending on direction.
     */
    MapsHandlr.prototype.getDirectionEnd = function (directionKey, top, right, bottom, left) {
        switch (directionKey) {
            case "top":
                return top;
            case "right":
                return right;
            case "bottom":
                return bottom;
            case "left":
                return left;
            default:
                throw new Error("Unknown directionKey: " + directionKey);
        }
    };
    // Directional equivalents for converting from directions to keys
    MapsHandlr.directionKeys = {
        "xInc": "left",
        "xDec": "right",
        "yInc": "top",
        "yDec": "bottom"
    };
    // Opposite directions for when finding descending order Arrays
    MapsHandlr.directionOpposites = {
        "xInc": "xDec",
        "xDec": "xInc",
        "yInc": "yDec",
        "yDec": "yInc"
    };
    return MapsHandlr;
})();
;
