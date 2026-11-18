/* Source: https://github.com/zveronline/mario (CC BY-NC-SA) */
/* GameStartr/EightBittr/EightBittr.js */
/**
 * EightBittr.js
 *
 * An abstract class used exclusively as the parent of GameStartr. EightBittr
 * contains useful functions for manipulating Things that are independent of
 * the required GameStartr modules.
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var EightBittr = (function () {
    /**
     * EightBittr constructor. Settings arguments are used to initialize
     * "constant" values and check for requirements.
     *
     * @constructor
     * @param {IEightBittrSettings} settings
     */
    function EightBittr(settings) {
        if (settings === void 0) { settings = {}; }
        var EightBitter = EightBittr.prototype.ensureCorrectCaller(this), constants = settings.constants, constantsSource = settings.constantsSource || EightBitter, requirements = settings.requirements, i;
        EightBitter.constants = constants;
        if (constants) {
            for (i = 0; i < constants.length; i += 1) {
                EightBitter[constants[i]] = constantsSource[constants[i]];
            }
        }
        EightBitter.requirements = requirements;
        if (requirements) {
            if (requirements.global) {
                if (typeof window !== "undefined") {
                    EightBitter.checkRequirements(window, requirements.global, "global");
                }
            }
            if (requirements.self) {
                EightBitter.checkRequirements(EightBitter, requirements.self, "self");
            }
        }
    }
    /* Resets
    */
    /**
     * Given an associate array of requirement names to the files that should
     * include them, this makes sure each of those requirements is a property of
     * the given Object.
     *
     * @param {Mixed} scope    Generally either the window (for global checks,
     *                         such as utility classes) or an EightBitter.
     * @param {Object} requirements   An associative array of properties to
     *                                check for under scope.
     * @param {String} name   The name referring to scope, printed out in an
     *                        Error if needed.
     */
    EightBittr.prototype.checkRequirements = function (scope, requirements, name) {
        var fails = [], requirement;
        for (requirement in requirements) {
            if (requirements.hasOwnProperty(requirement) && !scope[requirement]) {
                fails.push(requirement);
            }
        }
        // If there was at least one failure added to the fails array, throw
        // an error with each fail split by endlines
        if (fails.length) {
            throw new Error("Missing " + fails.length + " requirement(s) " + "in " + name + ".\n" + fails.map(function (requirement, i) {
                return i + ". " + requirement + ": is the '" + requirements[requirement] + "' file included?";
            }).join("\n"));
        }
    };
    /**
     * Resets the EightBittr by calling all of the named reset member Functions
     * on itself.
     *
     * @param {EightBittr} EightBitter
     * @param {String[]} resets   The ordered Array of reset Functions to be
     *                            called.
     * @param {Object} [customs]   Additional arguments to pass to all reset
     *                             Functions.
     */
    EightBittr.prototype.reset = function (EightBitter, resets, customs) {
        if (customs === void 0) { customs = undefined; }
        var reset, i;
        EightBitter.customs = customs;
        for (i = 0; i < resets.length; i += 1) {
            reset = resets[i];
            if (!EightBitter[reset]) {
                throw new Error(reset + " is missing on a resetting EightBittr.");
            }
            EightBitter[reset](EightBitter, customs);
        }
    };
    /**
     * Resets the EightBittr in a timed manner by calling all the named reset
     * member Functions on itself and adding the time (in milliseconds) along
     * along with the total process time to an Array, which is then returned.
     *
     * @param {EightBittr} EightBitter
     * @param {String[]} resets   The ordered Array of reset Functions to be
     *                            called.
     * @param {Object} [customs]   Additional arguments to pass to all reset
     *                             Functions.
     * @return {String[]}
     */
    EightBittr.prototype.resetTimed = function (EightBitter, resets, customs) {
        var timeStart = performance.now(), times = [], timeEach, i;
        for (i = 0; i < resets.length; i += 1) {
            timeEach = performance.now();
            EightBitter[resets[i]](EightBitter, customs);
            times.push({
                "name": resets[i],
                "time": performance.now() - timeEach
            });
        }
        times.push({
            "name": "resetTimed",
            "time": performance.now() - timeStart
        });
        return times;
    };
    /**
     * EightBittr.get is provided as a shortcut function to make binding member
     * functions, particularily those using "this.unitsize" (where this needs to
     * be an EightBitter, not an external calling object). At the very simplest,
     * this.get(func) acts as a shortcut to this.bind(this, func).
     * In addition, if the name is given as "a.b", EightBitter.followPath will
     * be used on "a.b".split('.') (so EightBitter.prototype[a][b] is returned).
     *
     * @this {EightBittr}
     * @param {Mixed} name   Either the Function itself, or a string of the path
     *                       to the Function (after ".prototype.").
     * @return {Function}   A function, bound to set "this" to the calling
     *                      EightBitter
     */
    EightBittr.prototype.get = function (name) {
        var EightBitter = EightBittr.prototype.ensureCorrectCaller.call(this), func;
        // If name is a string, turn it into a function path, and follow it
        if (name.constructor === String) {
            func = EightBitter.followPathHard(EightBitter, name.split("."), 0);
        }
        else if (name instanceof Array) {
            // If it's already a path (array), follow it
            func = EightBitter.followPathHard(EightBitter, name, 0);
        }
        else {
            // Otherwise func is just name
            func = name;
        }
        // Don't allow func to be undefined or some non-function object
        if (typeof (func) !== "function") {
            throw new Error(name + " is not defined in this EightBitter.");
        }
        // Bind the function to this
        return func.bind(EightBitter);
    };
    /* HTML Functions
    */
    /**
     * Creates and returns a new HTML <canvas> element, with an optional scaling
     * multiplier. Image smoothing is disabled.
     *
     * @param {Number} width   How wide the canvas should be.
     * @param {Number} height   How tall the canvas should be.
     * @param {Number} [scaling]   How much to scale the style of the canvas (by
     *                             default, 1 for not at all).
     * @return {HTMLCanvasElement}
     * @remarks TypeScript does not recognize imageSmoothingEnabled unless
     *          prefixed by "ms", so context is cast to any.
     */
    EightBittr.prototype.createCanvas = function (width, height, scaling) {
        if (scaling === void 0) { scaling = 1; }
        var canvas = document.createElement("canvas"), 
        // context: CanvasRenderingContext2D = canvas.getContext("2d");
        context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        scaling = scaling || 1;
        // Scaling 1 by default, but may be different (e.g. unitsize)
        canvas.style.width = (width * scaling) + "px";
        canvas.style.height = (height * scaling) + "px";
        // For speed's sake, disable image smoothing in all browsers
        if (typeof context.imageSmoothingEnabled !== "undefined") {
            context.imageSmoothingEnabled = false;
        }
        else if (typeof context.webkitImageSmoothingEnabled !== "undefined") {
            context.webkitImageSmoothingEnabled = false;
        }
        else if (typeof context.mozImageSmoothingEnabled !== "undefined") {
            context.mozImageSmoothingEnabled = false;
        }
        else if (typeof context.msImageSmoothingEnabled !== "undefined") {
            context.msImageSmoothingEnabled = false;
        }
        else if (typeof context.oImageSmoothingEnabled !== "undefined") {
            context.oImageSmoothingEnabled = false;
        }
        return canvas;
    };
    /* Physics functions
    */
    /**
     * Shifts a Thing vertically by changing its top and bottom attributes.
     *
     * @param {Thing} thing
     * @param {Number} dy
     */
    EightBittr.prototype.shiftVert = function (thing, dy) {
        thing.top += dy;
        thing.bottom += dy;
    };
    /**
     * Shifts a Thing horizontally by changing its top and bottom attributes.
     *
     * @param {Thing} thing
     * @param {Number} dy
     */
    EightBittr.prototype.shiftHoriz = function (thing, dx) {
        thing.left += dx;
        thing.right += dx;
    };
    /**
     * Sets the top of a Thing to a set number, changing the bottom based on its
     * height and the EightBittr's unisize.
     *
     * @param {Thing} thing
     * @param {Number} top
     */
    EightBittr.prototype.setTop = function (thing, top) {
        thing.top = top;
        thing.bottom = thing.top + thing.height * thing.EightBitter.unitsize;
    };
    /**
     * Sets the right of a Thing to a set number, changing the left based on its
     * width and the EightBittr's unisize.
     *
     * @param {Thing} thing
     * @param {Number} right
     */
    EightBittr.prototype.setRight = function (thing, right) {
        thing.right = right;
        thing.left = thing.right - thing.width * thing.EightBitter.unitsize;
    };
    /**
     * Sets the bottom of a Thing to a set number, changing the top based on its
     * height and the EightBittr's unisize.
     *
     * @param {Thing} thing
     * @param {Number} bottom
     */
    EightBittr.prototype.setBottom = function (thing, bottom) {
        thing.bottom = bottom;
        thing.top = thing.bottom - thing.height * thing.EightBitter.unitsize;
    };
    /**
     * Sets the left of a Thing to a set number, changing the right based on its
     * width and the EightBittr's unisize.
     *
     * @param {Thing} thing
     * @param {Number} left
     */
    EightBittr.prototype.setLeft = function (thing, left) {
        thing.left = left;
        thing.right = thing.left + thing.width * thing.EightBitter.unitsize;
    };
    /**
     * Shifts a Thing so that it is centered on the given x and y.
     *
     * @param {Thing} thing
     * @param {Number} x
     * @param {Number} y
     */
    EightBittr.prototype.setMid = function (thing, x, y) {
        thing.EightBitter.setMidX(thing, x);
        thing.EightBitter.setMidY(thing, y);
    };
    /**
     * Shifts a Thing so that it is horizontally centered on the given x.
     *
     * @param {Thing} thing
     * @param {Number} x
     */
    EightBittr.prototype.setMidX = function (thing, x) {
        thing.EightBitter.setLeft(thing, x + thing.width * thing.EightBitter.unitsize / 2);
    };
    /**
     * Shifts a Thing so that it is vertically centered on the given y.
     *
     * @param {Thing} thing
     * @param {Number} y
     */
    EightBittr.prototype.setMidY = function (thing, y) {
        thing.EightBitter.setTop(thing, y + thing.height * thing.EightBitter.unitsize / 2);
    };
    /**
     * @param {Thing} thing
     * @return {Number} The horizontal midpoint of the Thing.
     */
    EightBittr.prototype.getMidX = function (thing) {
        return thing.left + thing.width * thing.EightBitter.unitsize / 2;
    };
    /**
     * @param {Thing} thing
     * @return {Number} The vertical midpoint of the Thing.
     */
    EightBittr.prototype.getMidY = function (thing) {
        return thing.top + thing.height * thing.EightBitter.unitsize / 2;
    };
    /**
     * Shifts a Thing so that its midpoint is centered on the midpoint of the
     * other Thing.
     *
     * @param {Thing} thing   The Thing to be shifted.
     * @param {Thing} other   The Thing whose midpoint is referenced.
     */
    EightBittr.prototype.setMidObj = function (thing, other) {
        thing.EightBitter.setMidXObj(thing, other);
        thing.EightBitter.setMidYObj(thing, other);
    };
    /**
     * Shifts a Thing so that its horizontal midpoint is centered on the
     * midpoint of the other Thing.
     *
     * @param {Thing} thing   The Thing to be shifted.
     * @param {Thing} other   The Thing whose midpoint is referenced.
     */
    EightBittr.prototype.setMidXObj = function (thing, other) {
        thing.EightBitter.setLeft(thing, thing.EightBitter.getMidX(other) - (thing.width * thing.EightBitter.unitsize / 2));
    };
    /**
     * Shifts a Thing so that its vertical midpoint is centered on the
     * midpoint of the other Thing.
     *
     * @param {Thing} thing   The Thing to be shifted.
     * @param {Thing} other   The Thing whose midpoint is referenced.
     */
    EightBittr.prototype.setMidYObj = function (thing, other) {
        thing.EightBitter.setTop(thing, thing.EightBitter.getMidY(other) - (thing.height * thing.EightBitter.unitsize / 2));
    };
    /**
     * @param {Thing} thing
     * @param {Thing} other
     * @return {Boolean} Whether the first Thing's midpoing is to the left of
     *                   the other's.
     */
    EightBittr.prototype.objectToLeft = function (thing, other) {
        return (thing.EightBitter.getMidX(thing) < thing.EightBitter.getMidX(other));
    };
    /**
     * Shifts a Thing's top up, then sets the bottom (similar to a shiftVert and
     * a setTop combined).
     *
     * @param {Thing} thing
     * @param {Number} dy
     */
    EightBittr.prototype.updateTop = function (thing, dy) {
        // If a dy is provided, move the thing's top that much
        thing.top += dy || 0;
        // Make the thing's bottom dependent on the top
        thing.bottom = thing.top + thing.height * thing.EightBitter.unitsize;
    };
    /**
     * Shifts a Thing's right, then sets the left (similar to a shiftHoriz and a
     * setRight combined).
     *
     * @param {Thing} thing
     * @param {Number} dx
     */
    EightBittr.prototype.updateRight = function (thing, dx) {
        // If a dx is provided, move the thing's right that much
        thing.right += dx || 0;
        // Make the thing's left dependent on the right
        thing.left = thing.right - thing.width * thing.EightBitter.unitsize;
    };
    /**
     * Shifts a Thing's bottom down, then sets the bottom (similar to a
     * shiftVert and a setBottom combined).
     *
     * @param {Thing} thing
     * @param {Number} dy
     */
    EightBittr.prototype.updateBottom = function (thing, dy) {
        // If a dy is provided, move the thing's bottom that much
        thing.bottom += dy || 0;
        // Make the thing's top dependent on the top
        thing.top = thing.bottom - thing.height * thing.EightBitter.unitsize;
    };
    /**
     * Shifts a Thing's left, then sets the right (similar to a shiftHoriz and a
     * setLeft combined).
     *
     * @param {Thing} thing
     * @param {Number} dy
     */
    EightBittr.prototype.updateLeft = function (thing, dx) {
        // If a dx is provided, move the thing's left that much
        thing.left += dx || 0;
        // Make the thing's right dependent on the left
        thing.right = thing.left + thing.width * thing.EightBitter.unitsize;
    };
    /**
     * Shifts a Thing toward a target x, but limits the total distance allowed.
     * Distance is computed as from the Thing's horizontal midpoint.
     *
     * @param {Thing} thing
     * @param {Number} x
     * @param {Number} maxSpeed
     */
    EightBittr.prototype.slideToX = function (thing, x, maxSpeed) {
        var midx = thing.EightBitter.getMidX(thing);
        // If no maxSpeed is provided, assume Infinity (so it doesn't matter)
        maxSpeed = maxSpeed || Infinity;
        // Thing to the left? Slide to the right.
        if (midx < x) {
            thing.EightBitter.shiftHoriz(thing, Math.min(maxSpeed, (x - midx)));
        }
        else {
            // Thing to the right? Slide to the left.
            thing.EightBitter.shiftHoriz(thing, Math.max(-maxSpeed, (x - midx)));
        }
    };
    /**
     * Shifts a Thing toward a target y, but limits the total distance allowed.
     * Distance is computed as from the Thing's vertical midpoint.
     *
     * @param {Thing} thing
     * @param {Number} y
     * @param {Number} maxSpeed
     */
    EightBittr.prototype.slideToY = function (thing, y, maxSpeed) {
        var midy = thing.EightBitter.getMidY(thing);
        // If no maxSpeed is provided, assume Infinity (so it doesn't matter)
        maxSpeed = maxSpeed || Infinity;
        // Thing above? slide down.
        if (midy < y) {
            thing.EightBitter.shiftVert(thing, Math.min(maxSpeed, (y - midy)));
        }
        else {
            // Thing below? Slide up.
            thing.EightBitter.shiftVert(thing, Math.max(-maxSpeed, (y - midy)));
        }
    };
    /* EightBittr utilities
    */
    /**
     * Ensures the current object is an EightBittr by throwing an error if it
     * is not. This should be used for functions in any EightBittr descendants
     * that have to call 'this' to ensure their caller is what the programmer
     * expected it to be.
     *
     * @param {Mixed} current
     */
    EightBittr.prototype.ensureCorrectCaller = function (current) {
        if (!(current instanceof EightBittr)) {
            throw new Error("A function requires the caller ('this') to be the " + "manipulated EightBittr object. Unfortunately, 'this' is a " + typeof (this) + ".");
        }
        return current;
    };
    /* General utilities
    */
    /**
     * "Proliferates" all properties of a donor onto a recipient by copying each
     * of them and recursing onto child Objects. This is a deep copy.
     *
     * @param {Mixed} recipient
     * @param {Mixed} donor
     * @param {Boolean} [noOverride]   Whether pre-existing properties of the
     *                                 recipient should be skipped (defaults to
     *                                 false).
     * @return {Mixed} recipient
     */
    EightBittr.prototype.proliferate = function (recipient, donor, noOverride) {
        if (noOverride === void 0) { noOverride = false; }
        var setting, i;
        for (i in donor) {
            if (donor.hasOwnProperty(i)) {
                // If noOverride, don't override already existing properties
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
        }
        return recipient;
    };
    /**
     * Identical to proliferate, but instead of checking whether the recipient
     * hasOwnProperty on properties, it just checks if they're truthy
     *
     * @param {Mixed} recipient
     * @param {Mixed} donor
     * @param {Boolean} [noOverride]   Whether pre-existing properties of the
     *                                 recipient should be skipped (defaults to
     *                                 false).
     * @return {Mixed} recipient
     * @remarks This may not be good with JSLint, but it works for prototypal
     *          inheritance, since hasOwnProperty only is for the current class
     */
    EightBittr.prototype.proliferateHard = function (recipient, donor, noOverride) {
        if (noOverride === void 0) { noOverride = false; }
        var setting, i;
        for (i in donor) {
            if (donor.hasOwnProperty(i)) {
                // If noOverride, don't override already existing properties
                if (noOverride && recipient[i]) {
                    continue;
                }
                // If it's an object, recurse on a new version of it
                setting = donor[i];
                if (typeof setting === "object") {
                    if (!recipient[i]) {
                        recipient[i] = new setting.constructor();
                    }
                    this.proliferate(recipient[i], setting, noOverride);
                }
                else {
                    // Regular primitives are easy to copy otherwise
                    recipient[i] = setting;
                }
            }
        }
        return recipient;
    };
    /**
     * Identical to proliferate, but tailored for HTML elements because many
     * element attributes don't play nicely with JavaScript Array standards.
     * Looking at you, HTMLCollection!
     *
     * @param {HTMLElement} recipient
     * @param {Any} donor
     * @param {Boolean} [noOverride]
     * @return {HTMLElement}
     */
    EightBittr.prototype.proliferateElement = function (recipient, donor, noOverride) {
        if (noOverride === void 0) { noOverride = false; }
        var setting, i, j;
        for (i in donor) {
            if (donor.hasOwnProperty(i)) {
                // If noOverride, don't override already existing properties
                if (noOverride && recipient.hasOwnProperty(i)) {
                    continue;
                }
                setting = donor[i];
                switch (i) {
                    case "children":
                        if (typeof (setting) !== "undefined") {
                            for (j = 0; j < setting.length; j += 1) {
                                recipient.appendChild(setting[j]);
                            }
                        }
                        break;
                    default:
                        // If it's an object, recurse on a new version of it
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
                        break;
                }
            }
        }
        return recipient;
    };
    /**
     * Creates and returns an HTMLElement of the specified type. Any additional
     * settings Objects may be given to be proliferated onto the Element via
     * proliferateElement.
     *
     * @param {String} type   The tag of the Element to be created.
     * @param {Object} [settings]   Additional settings for the Element, such as
     *                              className or style.
     * @return {HTMLElement}
     */
    EightBittr.prototype.createElement = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var EightBitter = EightBittr.prototype.ensureCorrectCaller(this), element = document.createElement(type || "div"), i;
        for (i = 1; i < arguments.length; i += 1) {
            EightBitter.proliferateElement(element, arguments[i]);
        }
        return element;
    };
    /**
     * Follows a path inside an Object recursively, based on a given path.
     *
     * @param {Mixed} object
     * @param {String[]} path   The ordered names of attributes to descend into.
     * @param {Number} [num]   The starting index in path (by default, 0).
     * @return {Mixed}
     * @remarks This may not be good with JSLint, but it works for prototypal
     *          inheritance, since hasOwnProperty only is for the current class
     */
    EightBittr.prototype.followPathHard = function (object, path, num) {
        if (num === void 0) { num = 0; }
        for (var i = num || 0; i < path.length; i += 1) {
            if (typeof object[path[i]] === "undefined") {
                return undefined;
            }
            else {
                object = object[path[i]];
            }
        }
        return object;
    };
    /**
     * Switches a Thing from one Array to Another using splice and push.
     *
     * @param {Thing} thing
     * @param {Array} arrayOld
     * @param {Array} arrayNew
     */
    EightBittr.prototype.arraySwitch = function (thing, arrayOld, arrayNew) {
        arrayOld.splice(arrayOld.indexOf(thing), 1);
        arrayNew.push(thing);
    };
    /**
     * Sets a Thing's position within an Array to the front by splicing and then
     * unshifting it.
     *
     * @param {Thing} thing
     * @param {Array} array
     */
    EightBittr.prototype.arrayToBeginning = function (thing, array) {
        array.splice(array.indexOf(thing), 1);
        array.unshift(thing);
    };
    /**
     * Sets a Thing's position within an Array to the front by splicing and then
     * pushing it.
     *
     * @param {Thing} thing
     * @param {Array} array
     */
    EightBittr.prototype.arrayToEnd = function (thing, array) {
        array.splice(array.indexOf(thing), 1);
        array.push(thing);
    };
    return EightBittr;
})();
;
;

/* GameStartr/GameStartr.js */
/**
 * GameStartr.js
 * 
 * An abstract class used as a base for creating sprite-based 2D games. Utility
 * functions and an expansive skeleton are available for a child class to make
 * us of, particular with physics manipulations, graphics rendering, and reset
 * functions based around the 19 required modules.
 * 
 * Descendent classes of GameStartr must put their settings in their prototype
 * under settings. Reset Functions below list their required file names.
 * 
 * The following member attributes of child classes are required:
 * gameStart {Function}
 * onGamePlay {Function}
 * onGamePause {Function}
 * canInputsTrigger {Function}
 * setMap {Function} 
 * setLocation {Function}
 */
var GameStartr = (function (EightBittr) {
    "use strict";

    // Use an EightBittr as the class parent, with EightBittr's constructor
    var EightBitterProto = new EightBittr();

    /**
     * 
     */
    function GameStartr(customs) {
        if (typeof customs === "undefined") {
            customs = {};
        }

        if (typeof this.settings === "undefined") {
            this.settings = {};
        }
        
        EightBittr.call(this, {
            "customs": customs,
            "constantsSource": customs.constantsSource,
            "constants": customs.constants,
            "requirements": {
                "global": {
                    "AudioPlayr": "src/AudioPlayr/AudioPlayr.js",
                    "ChangeLinr": "src/ChangeLinr/ChangeLinr.js",
                    "FPSAnalyzr": "src/FPSAnalyzr/FPSAnalyzr.js",
                    "GamesRunnr": "src/GamesRunnr/GamesRunnr.js",
                    "GroupHoldr": "src/GroupHoldr/GroupHoldr.js",
                    "InputWritr": "src/InputWritr/InputWritr.js",
                    "LevelEditr": "src/LevelEditr/LevelEditr.js",
                    "NumberMakr": "src/NumberMakr/NumberMakr.js",
                    "MapScreenr": "src/MapScreenr/MapScreenr.js",
                    "MapsHandlr": "src/MapsHandlr/MapsHandlr.js",
                    "ModAttachr": "src/ModAttachr/ModAttachr.js",
                    "ObjectMakr": "src/ObjectMakr/ObjectMakr.js",
                    "PixelDrawr": "src/PixelDrawr/PixelDrawr.js",
                    "PixelRendr": "src/PixelRendr/PixelRendr.js",
                    "QuadsKeepr": "src/QuadsKeepr/QuadsKeepr.js",
                    "StatsHoldr": "src/StatsHoldr/StatsHoldr.js",
                    "StringFilr": "src/StringFilr/StringFilr.js",
                    "ThingHittr": "src/ThingHittr/ThingHittr.js",
                    "TimeHandlr": "src/TimeHandlr/TimeHandlr.js"
                }
            }
        });
    }

    GameStartr.prototype = EightBitterProto;

    // Subsequent settings will be stored in GameStartr.prototype.settings
    EightBitterProto.settings = {};
    EightBitterProto.resets = [
        "resetObjectMaker",
        "resetPixelRender",
        "resetTimeHandler",
        "resetAudioPlayer",
        "resetQuadsKeeper",
        "resetGamesRunner",
        "resetStatsHolder",
        "resetGroupHolder",
        "resetThingHitter",
        "resetMapScreener",
        "resetPixelDrawer",
        "resetNumberMaker",
        "resetMapsCreator",
        "resetMapsHandler",
        "resetInputWriter",
        "resetLevelEditor",
        "resetWorldSeeder",
        "resetModAttacher",
        "startModAttacher",
        "resetContainer"
    ];


    /* Resets
    */

    /**
     * Resets the EightBittr by calling the parent EightBittr.prototype.reset.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function reset(EightBitter, customs) {
        EightBittr.prototype.reset(EightBitter, EightBitter.resets, customs);
    };

    /**
     * Resets the EightBittr and records the time by calling the parent 
     * EightBittr.prototype.resetTimed.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @return {Array} How long each reset Function took followed by the entire
     * operation, in milliseconds.
     */
    function resetTimed(EightBitter, customs) {
        return EightBittr.prototype.resetTimed(
            EightBitter, EightBitter.resets, customs
        );
    };

    /**
     * Sets self.ObjectMaker.
     * 
     * Because many Thing functions require access to other FSM modules, each is
     * given a reference to this container FSM via properties.Thing.EightBitter. 
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ObjectMakr (src/ObjectMakr/ObjectMakr.js)
     *                          objects.js (settings/objects.js)
     */
    function resetObjectMaker(EightBitter, customs) {
        EightBitter.ObjectMaker = new ObjectMakr(EightBitter.proliferate({
            "properties": {
                "Quadrant": {
                    "EightBitter": EightBitter
                },
                "Thing": {
                    "EightBitter": EightBitter
                }
            }
        }, EightBitter.settings.objects));
    }

    /**
     * Sets self.QuadsKeeper.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): QuadsKeepr (src/QuadsKeepr/QuadsKeepr.js)
     *                          quadrants.js (settings/quadrants.js)
     */
    function resetQuadsKeeper(EightBitter, customs) {
        var quadrantWidth = customs.width / (EightBitter.settings.quadrants.numCols - 3),
            quadrantHeight = customs.height / (EightBitter.settings.quadrants.numRows - 2);

        EightBitter.QuadsKeeper = new QuadsKeepr(EightBitter.proliferate({
            "ObjectMaker": EightBitter.ObjectMaker,
            "createCanvas": EightBitter.createCanvas,
            "quadrantWidth": quadrantWidth,
            "quadrantHeight": quadrantHeight,
            "startLeft": -quadrantWidth,
            "startHeight": -quadrantHeight,
            "onAdd": EightBitter.onAreaSpawn.bind(EightBitter, EightBitter),
            "onRemove": EightBitter.onAreaUnspawn.bind(EightBitter, EightBitter),
        }, EightBitter.settings.quadrants));
    }

    /**
     * Sets self.PixelRender.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): PixelRendr (src/PixelRendr/PixelRendr.js)
     *                          sprites.js (settings/sprites.js)
     */
    function resetPixelRender(EightBitter, customs) {
        EightBitter.PixelRender = new PixelRendr(EightBitter.proliferate({
            "QuadsKeeper": EightBitter.QuadsKeeper,
            "unitsize": EightBitter.unitsize,
            "scale": EightBitter.scale
        }, EightBitter.settings.sprites));
    }

    /**
     * Sets self.PixelDrawer.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): PixelDrawr (src/PixelDrawr/PixelDrawr.js)
     *                          renderer.js (settings/renderer.js)
     */
    function resetPixelDrawer(EightBitter, customs) {
        EightBitter.PixelDrawer = new PixelDrawr(EightBitter.proliferate({
            "PixelRender": EightBitter.PixelRender,
            "MapScreener": EightBitter.MapScreener,
            "createCanvas": EightBitter.createCanvas,
            "unitsize": EightBitter.unitsize,
            "innerWidth": customs.width,
            "generateObjectKey": EightBitter.generateObjectKey
        }, EightBitter.settings.renderer));
    }

    /**
     * Sets EightBitter.TimeHandler.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): TimeHandlr (src/TimeHandlr/TimeHandlr.js)
     *                          events.js (settings/events.js)
     */
    function resetTimeHandler(EightBitter, customs) {
        EightBitter.TimeHandler = new TimeHandlr(EightBitter.proliferate({
            "classAdd": EightBitter.addClass,
            "classRemove": EightBitter.removeClass
        }, EightBitter.settings.events));
    }

    /**
     * Sets self.AudioPlayer.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): AudioPlayr (src/AudioPlayr/AudioPlayr.js)
     *                          audio.js (settings/audio.js)
     */
    function resetAudioPlayer(EightBitter, customs) {
        EightBitter.AudioPlayer = new AudioPlayr(EightBitter.proliferate({
            "statistics": {
                "proliferate": EightBitter.proliferate
            }
        }, EightBitter.settings.audio));
    }

    /**
     * Sets self.GamesRunner.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): GamesRunnr (src/GamesRunnr/GamesRunnr.js)
     *                          runner.js (settings/runner.js)
     */
    function resetGamesRunner(EightBitter, customs) {
        EightBitter.GamesRunner = new GamesRunnr(EightBitter.proliferate({
            "scope": EightBitter,
            "onPlay": EightBitter.onGamePlay.bind(EightBitter, EightBitter),
            "onPause": EightBitter.onGamePause.bind(EightBitter, EightBitter)
        }, EightBitter.settings.runner));
    }

    /**
     * Sets self.StatsHolder.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): StatsHoldr (src/StatsHoldr/StatsHoldr.js)
     *                          statistics.js (settings/statistics.js)
     */
    function resetStatsHolder(EightBitter, customs) {
        EightBitter.StatsHolder = new StatsHoldr(EightBitter.proliferate({
            "callbackArgs": [EightBitter],
            "proliferate": EightBitter.proliferate,
            "createElement": EightBitter.createElement
        }, EightBitter.settings.statistics));
    }

    /**
     * Sets self.GroupHolder.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): GroupHoldr (src/ThingHittr/GroupHoldr.js)
     *                          groups.js (settings/groups.js)
     */
    function resetGroupHolder(EightBitter, customs) {
        EightBitter.GroupHolder = new GroupHoldr(EightBitter.settings.groups);
    }

    /**
     * Sets self.ThingHitter.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ThingHittr (src/ThingHittr/ThingHittr.js)
     *                          collisions.js (settings/collisions.js)
     */
    function resetThingHitter(EightBitter, customs) {
        EightBitter.ThingHitter = new ThingHittr(EightBitter.proliferate({
            "scope": EightBitter
        }, EightBitter.settings.collisions));
    }

    /**
     * Sets self.MapScreener.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MapScreenr (src/MapScreenr/MapScreenr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapScreener(EightBitter, customs) {
        EightBitter.MapScreener = new MapScreenr({
            "EightBitter": EightBitter,
            "unitsize": EightBitter.unitsize,
            "width": customs.width,
            "height": customs.height,
            "variableArgs": [EightBitter],
            "variables": EightBitter.settings.maps.screenVariables
        });
    }

    /**
     * Sets self.NumberMaker.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): NumberMaker (src/NumberMakr/NumberMakr.js)
     */
    function resetNumberMaker(EightBitter, customs) {
        EightBitter.NumberMaker = new NumberMakr();
    }

    /**
     * Sets self.MapCreator.
     * 
     * @param {EightBittr} EightBitter
     * @remarks Requirement(s): MapCreatr (src/MapCreatr/MapCreatr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsCreator(EightBitter, customs) {
        EightBitter.MapsCreator = new MapsCreatr({
            "ObjectMaker": EightBitter.ObjectMaker,
            "groupTypes": EightBitter.settings.maps.groupTypes,
            "macros": EightBitter.settings.maps.macros,
            "entrances": EightBitter.settings.maps.entrances,
            "maps": EightBitter.settings.maps.library,
            "scope": EightBitter
        });
    }

    /**
     * Sets self.MapsHandler.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MapsHandlr (src/MapsHandlr/MapsHandlr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsHandler(EightBitter, customs) {
        EightBitter.MapsHandler = new MapsHandlr({
            "MapsCreator": EightBitter.MapsCreator,
            "MapScreener": EightBitter.MapScreener,
            "screenAttributes": EightBitter.settings.maps.screenAttributes,
            "onSpawn": EightBitter.settings.maps.onSpawn
        });
    }

    /**
     * Sets self.InputWriter.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): InputWritr (src/InputWritr/InputWritr.js)
     *                          input.js (settings/input.js)
     */
    function resetInputWriter(EightBitter, customs) {
        EightBitter.InputWriter = new InputWritr(EightBitter.proliferate({
            "canTrigger": EightBitter.canInputsTrigger.bind(EightBitter, EightBitter)
        }, EightBitter.settings.input.InputWritrArgs));
    }

    /**
     * Sets self.LevelEditor.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): LevelEditr (src/LevelEditr/LevelEditr.js)
     *                          editor.js (settings/editor.js)
     */
    function resetLevelEditor(EightBitter, customs) {
        EightBitter.LevelEditor = new LevelEditr(EightBitter.proliferate({
            "GameStarter": EightBitter,
            "beautifier": js_beautify // Eventually there will be a custom beautifier... maybe
        }, EightBitter.settings.editor));
    }

    /**
     * Sets self.WorldSeeder.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): WorldSeedr (src/WorldSeedr/WorldSeedr.js)
     *                          generator.js (settings/generator.js)
     */
    function resetWorldSeeder(EightBitter, customs) {
        EightBitter.WorldSeeder = new WorldSeedr(EightBitter.proliferate({
            "random": EightBitter.NumberMaker.random.bind(EightBitter.NumberMaker),
            "onPlacement": EightBitter.mapPlaceRandomCommands.bind(EightBitter, EightBitter)
        }, EightBitter.settings.generator));
    }

    /**
     * Sets self.ModAttacher.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ModAttachr (src/ModAttachr/ModAttachr.js)
     *                          mods.js (settings/mods.js)
     */
    function resetModAttacher(EightBitter, customs) {
        EightBitter.ModAttacher = new ModAttachr(EightBitter.proliferate({
            "scopeDefault": EightBitter,
        }, EightBitter.settings.mods));
    }

    /** 
     * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
     * is fired.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function startModAttacher(EightBitter, customs) {
        var mods = customs.mods,
            i;

        if (mods) {
            for (i in mods) {
                if (mods[i]) {
                    EightBitter.ModAttacher.enableMod(i);
                }
            }
        }

        EightBitter.ModAttacher.fireEvent("onReady", EightBitter, EightBitter);
    }

    /**
     * Resets the parent HTML container. Width and height are set by customs, 
     * and canvas and StatsHolder container elements are added.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function resetContainer(EightBitter, customs) {
        EightBitter.container = EightBitter.createElement("div", {
            "className": "EightBitter",
            "style": EightBitter.proliferate({
                "position": "relative",
                "width": customs.width + "px",
                "height": customs.height + "px"
            }, customs.style)
        });

        EightBitter.canvas = EightBitter.createCanvas(customs.width, customs.height);
        EightBitter.PixelDrawer.setCanvas(EightBitter.canvas);

        EightBitter.container.appendChild(EightBitter.canvas);
    }


    /* Global manipulations
    */

    /**
     * Scrolls the game window by shifting all Things and checking for quadrant
     * refreshes.
     * 
     * @this {EightBittr}
     * @param {Number} dx   How far to scroll horizontally.
     * @param {Number} [dy]   How far to scroll vertically.
     */
    function scrollWindow(dx, dy) {
        var EightBitter =  EightBittr.prototype.ensureCorrectCaller(this);

        dx = dx | 0;
        dy = dy | 0;

        if (!dx && !dy) {
            return;
        }

        EightBitter.MapScreener.shift(dx, dy);
        EightBitter.shiftAll(-dx, -dy);

        EightBitter.QuadsKeeper.shiftQuadrants(-dx, -dy);
    }

    /**
     * Scrolls everything but a single Thing.
     * 
     * 
     * @this {EightBittr}
     * @param {Thing} thing
     * @param {Number} dx   How far to scroll horizontally.
     * @param {Number} [dy]   How far to scroll vertically.
     */
    function scrollThing(thing, dx, dy) {
        var saveleft = thing.left,
            savetop = thing.top;

        thing.EightBitter.scrollWindow(dx, dy);
        thing.EightBitter.setLeft(thing, saveleft);
        thing.EightBitter.setTop(thing, savetop);
    }

    /**
     * Spawns all Things within a given area that should be there. 
     * 
     * @param {EightBittr} EightBitter
     * @param {String} direction
     * @param {Number} top
     * @param {Number} right
     * @param {Number} bottom
     * @param {Number} left
     * @remarks This is generally called by a QuadsKeepr during a screen update.
     */
    function onAreaSpawn(EightBitter, direction, top, right, bottom, left) {
        EightBitter.MapsHandler.spawnMap(
            direction,
            (top + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (right + EightBitter.MapScreener.left) / EightBitter.unitsize,
            (bottom + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (left + EightBitter.MapScreener.left) / EightBitter.unitsize
        );
    }

    /**
     * "Unspawns" all Things within a given area that should be gone by marking
     * their PreThings as not in game.
     * 
     * @param {EightBittr} EightBitter
     * @param {String} direction
     * @param {Number} top
     * @param {Number} right
     * @param {Number} bottom
     * @param {Number} left
     * @remarks This is generally called by a QuadsKeepr during a screen update.
     */
    function onAreaUnspawn(EightBitter, direction, top, right, bottom, left) {
        EightBitter.MapsHandler.unspawnMap(
            direction,
            (top + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (right + EightBitter.MapScreener.left) / EightBitter.unitsize,
            (bottom + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (left + EightBitter.MapScreener.left) / EightBitter.unitsize
        );
    }

    /**
     * Adds a new Thing to the game at a given position, relative to the top
     * left corner of the screen. 
     * 
     * @param {Mixed} thing   What type of Thing to add. This may be a String of
     *                        the class title, an Array containing the String
     *                        and an Object of settings, or an actual Thing.
     * @param {Number} [left]   Defaults to 0.
     * @param {Number} [top]   Defaults to 0.
     */
    function addThing(thing, left, top) {
        if (typeof (thing) === "string" || thing instanceof String) {
            thing = this.ObjectMaker.make(thing);
        } else if (thing.constructor === Array) {
            thing = this.ObjectMaker.make.apply(this.ObjectMaker, thing);
        }

        if (arguments.length > 2) {
            thing.EightBitter.setLeft(thing, left);
            thing.EightBitter.setTop(thing, top);
        } else if (arguments.length > 1) {
            thing.EightBitter.setLeft(thing, left);
        }

        thing.EightBitter.updateSize(thing);

        thing.EightBitter.GroupHolder.getFunctions().add[thing.groupType](thing);
        thing.placed = true;

        // This will typically be a TimeHandler.cycleClass call
        if (thing.onThingAdd) {
            thing.onThingAdd(thing);
        }

        thing.EightBitter.PixelDrawer.setThingSprite(thing);

        // This will typically be a spawn* call
        if (thing.onThingAdded) {
            thing.onThingAdded(thing);
        }

        thing.EightBitter.ModAttacher.fireEvent("onAddThing", thing, left, top);

        return thing;
    }

    /**
     * Processes a Thing so that it is ready to be placed in gameplay. There are
     * a lot of steps here: width and height must be set with defaults and given
     * to spritewidth and spriteheight, a quadrants Array must be given, the 
     * sprite must be set, attributes and onThingMake called upon, and initial
     * class cycles and flipping set.
     * 
     * @param {Thing} thing
     * @param {String} type   What type Thing this is (the name of the class).
     * @param {Object} [settings]   Additional settings to be given to the 
     *                              Thing.
     * @param {Object} defaults   The default settings for the Thing's class.
     * @remarks This is generally called as the onMake call in an ObjectMakr.
     */
    function thingProcess(thing, type, settings, defaults) {
        // If the Thing doesn't specify its own title, use the type by default
        thing.title = thing.title || type;

        // If a width/height is provided but no spritewidth/height,
        // use the default spritewidth/height
        if (thing.width && !thing.spritewidth) {
            thing.spritewidth = defaults.spritewidth || defaults.width;
        }
        if (thing.height && !thing.spriteheight) {
            thing.spriteheight = defaults.spriteheight || defaults.height;
        }

        // "Infinity" height refers to objects that reach exactly to the bottom
        if (thing.height === "Infinity") {
            thing.height = thing.EightBitter.getAbsoluteHeight(thing.y) / thing.EightBitter.unitsize;
        }

        // Each thing has at least 4 maximum quadrants (for the QuadsKeepr)
        var maxquads = 4,
            num;
        num = Math.floor(
            thing.width * (
                thing.EightBitter.unitsize / thing.EightBitter.QuadsKeeper.getQuadrantWidth()
            )
        );
        if (num > 0) {
            maxquads += ((num + 1) * maxquads / 2);
        }
        num = Math.floor(
            thing.height * (
                thing.EightBitter.unitsize / thing.EightBitter.QuadsKeeper.getQuadrantHeight()
            )
        );
        if (num > 0) {
            maxquads += ((num + 1) * maxquads / 2);
        }
        thing.maxquads = maxquads;
        thing.quadrants = new Array(maxquads);

        // Basic sprite information
        thing.spritewidth = thing.spritewidth || thing.width;
        thing.spriteheight = thing.spriteheight || thing.height;

        // Sprite sizing
        thing.spritewidthpixels = thing.spritewidth * thing.EightBitter.unitsize;
        thing.spriteheightpixels = thing.spriteheight * thing.EightBitter.unitsize;

        // Canvas, context, imageData
        thing.canvas = thing.EightBitter.createCanvas(
            thing.spritewidthpixels, thing.spriteheightpixels
        );
        thing.context = thing.canvas.getContext("2d");
        thing.imageData = thing.context.getImageData(
            0, 0, thing.spritewidthpixels, thing.spriteheightpixels
        );

        if (thing.opacity !== 1) {
            thing.EightBitter.setOpacity(thing, thing.opacity);
        }

        // Attributes, such as Koopa.smart
        if (thing.attributes) {
            thingProcessAttributes(thing, thing.attributes);
        }

        // Important custom functions
        if (thing.onThingMake) {
            thing.onThingMake(thing, settings);
        }

        // Initial class / sprite setting
        thing.EightBitter.setSize(thing, thing.width, thing.height);
        thing.EightBitter.setClassInitial(thing, thing.name || thing.title);

        // Sprite cycles
        var cycle;
        if (cycle = thing.spriteCycle) {
            thing.EightBitter.TimeHandler.addClassCycle(
                thing, cycle[0], cycle[1] || null, cycle[2] || null
            );
        }
        if (cycle = thing.spriteCycleSynched) {
            thing.EightBitter.TimeHandler.addClassCycleSynched(
                thing, cycle[0], cycle[1] || null, cycle[2] || null
            );
        }

        // flipHoriz and flipVert initially 
        if (thing.flipHoriz) {
            thing.EightBitter.flipHoriz(thing);
        }
        if (thing.flipVert) {
            thing.EightBitter.flipVert(thing);
        }

        // Mods!
        thing.EightBitter.ModAttacher.fireEvent(
            "onThingMake", thing.EightBitter, thing, type, settings, defaults
        );
    }

    /**
     * Processes additional Thing attributes. For each attribute the Thing's
     * class says it may have, if it has it, the attribute's key is appeneded to
     * the Thing's name and the attribute value proliferated onto the Thing.
     * 
     * @param {Thing} thing
     * @param {Object} attributes
     */
    function thingProcessAttributes(thing, attributes) {
        var attribute;

        // For each listing in the attributes...
        for (attribute in attributes) {
            // If the thing has that attribute as true:
            if (thing[attribute]) {
                // Add the extra options
                thing.EightBitter.proliferate(thing, attributes[attribute]);
                
                // Also add a marking to the name, which will go into the className
                if (thing.name) {
                    thing.name += ' ' + attribute;
                } else {
                    thing.name = thing.title + ' ' + attribute;
                }
            }
        }
    }

    /**
     * Runs through commands generated by a WorldSeedr and evaluates all of 
     * to create PreThings via MapsCreator.analyzePreSwitch. 
     * 
     * @param {EightBittr} EightBitter
     * @param {Object[]} generatedCommands   The commands generated by a
     *                                       WorldSeedr.generateFull call.
     */
    function mapPlaceRandomCommands(EightBitter, generatedCommands) {
        var MapsCreator = EightBitter.MapsCreator,
            MapsHandler = EightBitter.MapsHandler,
            prethings = MapsHandler.getPreThings(),
            area = MapsHandler.getArea(),
            map = MapsHandler.getMap(),
            command, output, i;

        for (i = 0; i < generatedCommands.length; i += 1) {
            command = generatedCommands[i];

            output = {
                "thing": command.title,
                "x": command.left,
                "y": command.top
            };

            if (command.arguments) {
                EightBitter.proliferateHard(output, command.arguments, true);
            }

            MapsCreator.analyzePreSwitch(output, prethings, area, map);
        }
    }


    /* Physics & similar
    */

    /** 
     * Sets a Thing's "changed" flag to true, which indicates to the PixelDrawr
     * to redraw the Thing and its quadrant.
     * 
     * @param {Thing} thing
     */
    function markChanged(thing) {
        thing.changed = true;
    }

    /**
     * Shifts a Thing vertically using the EightBittr utility, and marks the
     * Thing as having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dy
     * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
     *                                 changed (by default, false).
     */
    function shiftVert(thing, dy, notChanged) {
        EightBittr.prototype.shiftVert(thing, dy);

        if (!notChanged) {
            thing.EightBitter.markChanged(thing);
        }
    }

    /**
     * Shifts a Thing horizontally using the EightBittr utility, and marks the
     * Thing as having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dx
     * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
     *                                 changed (by default, false).
     */
    function shiftHoriz(thing, dx, notChanged) {
        EightBittr.prototype.shiftHoriz(thing, dx);

        if (!notChanged) {
            thing.EightBitter.markChanged(thing);
        }
    }

    /**
     * Sets a Thing's top using the EightBittr utility, and marks the Thing as
     * having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} top
     */
    function setTop(thing, top) {
        EightBittr.prototype.setTop(thing, top);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Sets a Thing's right using the EightBittr utility, and marks the Thing as
     * having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} right
     */
    function setRight(thing, right) {
        EightBittr.prototype.setRight(thing, right);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Sets a Thing's bottom using the EightBittr utility, and marks the Thing
     * as having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} bottom
     */
    function setBottom(thing, bottom) {
        EightBittr.prototype.setBottom(thing, bottom);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Sets a Thing's left using the EightBittr utility, and marks the Thing
     * as having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} left
     */
    function setLeft(thing, left) {
        EightBittr.prototype.setLeft(thing, left);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Shifts a thing both horizontally and vertically. If the Thing marks 
     * itself as having a parallax effect (parallaxHoriz or parallaxVert), that
     * proportion of movement is respected (.5 = half, etc.).
     * 
     * @param {Thing} thing
     * @param {Number} dx
     * @param {Number} dy
     * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
     *                                 changed (by default, false).
     */
    function shiftBoth(thing, dx, dy, notChanged) {
        dx = dx || 0;
        dy = dy || 0;

        if (!thing.noshiftx) {
            if (thing.parallaxHoriz) {
                thing.EightBitter.shiftHoriz(
                    thing, thing.parallaxHoriz * dx, notChanged
                );
            } else {
                thing.EightBitter.shiftHoriz(thing, dx, notChanged);
            }
        }

        if (!thing.noshifty) {
            if (thing.parallaxVert) {
                thing.EightBitter.shiftVert(
                    thing, thing.parallaxVert * dy, notChanged
                );
            } else {
                thing.EightBitter.shiftVert(thing, dy, notChanged);
            }
        }
    }

    /**
     * Calls shiftBoth on all members of an Array.
     * 
     * @param {Number} dx
     * @param {Number} dy
     * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
     *                                 changed (by default, false).
     */
    function shiftThings(things, dx, dy, notChanged) {
        for (var i = things.length - 1; i >= 0; i -= 1) {
            things[i].EightBitter.shiftBoth(things[i], dx, dy, notChanged);
        }
    }

    /**
     * Calls shiftBoth on all groups in the calling EightBittr's GroupHoldr.
     * 
     * @this {EightBittr}
     * @param {Number} dx
     * @param {Number} dy
     */
    function shiftAll(dx, dy) {
        var EightBitter =  EightBittr.prototype.ensureCorrectCaller(this);
        EightBitter.GroupHolder.callAll(
            EightBitter, EightBitter.shiftThings, dx, dy, true
        );
    }

    /**
     * Sets the width and unitwidth of a Thing, and optionally updates the
     * Thing's spritewidth and spritewidth pixels, and/or calls updateSize.
     * The thing is marked as having changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} width
     * @param {Boolean} [updateSprite]   Whether to update the Thing's
     *                                   spritewidth and spritewidthpixels (by
     *                                   default, false).
     * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
     *                                 (by default, false).
     */
    function setWidth(thing, width, updateSprite, updateSize) {
        thing.width = width;
        thing.unitwidth = width * thing.EightBitter.unitsize;

        if (updateSprite) {
            thing.spritewidth = width;
            thing.spritewidthpixels = width * thing.EightBitter.unitsize;
        }

        if (updateSize) {
            thing.EightBitter.updateSize(thing);
        }

        thing.EightBitter.markChanged(thing);
    }

    /**
     * Sets the height and unitheight of a Thing, and optionally updates the
     * Thing's spriteheight and spriteheight pixels, and/or calls updateSize.
     * The thing is marked as having changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} height
     * @param {Boolean} [updateSprite]   Whether to update the Thing's
     *                                   spriteheight and spriteheightpixels (by
     *                                   default, false).
     * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
     *                                 (by default, false).
     */
    function setHeight(thing, height, updateSprite, updateSize) {
        thing.height = height;
        thing.unitheight = height * thing.EightBitter.unitsize;

        if (updateSprite) {
            thing.spriteheight = height;
            thing.spriteheightpixels = height * thing.EightBitter.unitsize;
        }

        if (updateSize) {
            thing.EightBitter.updateSize(thing);
        }

        thing.EightBitter.markChanged(thing);
    }

    /**
     * Utility to call both setWidth and setHeight on a Thing.
     * 
     * @param {Thing} thing
     * @param {Number} width
     * @param {Number} height
     * @param {Boolean} [updateSprite]   Whether to update the Thing's
     *                                   spritewidth, spriteheight, 
     *                                   spritewidthpixels, and
     *                                   spritspriteheightpixels (by default,
     *                                   false).
     * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
     *                                 (by default, false).
     */
    function setSize(thing, width, height, updateSprite, updateSize) {
        thing.EightBitter.setWidth(thing, width, updateSprite, updateSize);
        thing.EightBitter.setHeight(thing, height, updateSprite, updateSize);
    }

    /**
     * Shifts a Thing horizontally by its xvel and vertically by its yvel, using
     * shiftHoriz and shiftVert.
     * 
     * @param {Thing} thing
     */
    function updatePosition(thing) {
        thing.EightBitter.shiftHoriz(thing, thing.xvel);
        thing.EightBitter.shiftVert(thing, thing.yvel);
    }

    /**
     * Completely updates the size measurements of a Thing. That means the
     * unitwidth, unitheight, spritewidthpixels, spriteheightpixels, and
     * spriteheightpixels attributes. The Thing's sprite is then updated by the
     * PixelDrawer, and its appearance is marked as changed.
     * 
     * @param {Thing} thing
     */
    function updateSize(thing) {
        thing.unitwidth = thing.width * thing.EightBitter.unitsize;
        thing.unitheight = thing.height * thing.EightBitter.unitsize;
        thing.spritewidthpixels = thing.spritewidth * thing.EightBitter.unitsize;
        thing.spriteheightpixels = thing.spriteheight * thing.EightBitter.unitsize;

        thing.canvas.width = thing.spritewidthpixels;
        thing.canvas.height = thing.spriteheightpixels;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);

        thing.EightBitter.markChanged(thing);
    }

    /**
     * Reduces a Thing's width by pushing back its right and decreasing its 
     * width. It is marked as changed in appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dx
     * @param {Boolean} [updateSize]   Whether to also call updateSize on the 
     *                                 Thing (by default, false).
     */
    function reduceWidth(thing, dx, see) {
        thing.right -= dx;
        thing.width -= dx / thing.EightBitter.unitsize;

        if (see) {
            thing.EightBitter.updateSize(thing);
        } else {
            thing.EightBitter.markChanged(thing);
        }
    }

    /**
     * Reduces a Thing's height by pushing down its top and decreasing its 
     * height. It is marked as changed in appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dy
     * @param {Boolean} [updateSize]   Whether to also call updateSize on the 
     *                                 Thing (by default, false).
     */
    function reduceHeight(thing, dy, updateSize) {
        thing.top += dy;
        thing.height -= dy / thing.EightBitter.unitsize;

        if (updateSize) {
            thing.EightBitter.updateSize(thing);
        } else {
            thing.EightBitter.markChanged(thing);
        }
    }

    /**
     * Reduces a Thing's height by pushing down its top and decreasing its 
     * height. It is marked as changed in appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dy
     * @param {Boolean} [updateSize]   Whether to also call updateSize on the 
     *                                 Thing (by default, false).
     */
    function increaseHeight(thing, dy) {
        thing.top -= dy;
        thing.height += dy / thing.EightBitter.unitsize;
        thing.unitheight = thing.height * thing.EightBitter.unitsize;
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Increases a Thing's width by pushing forward its right and decreasing its 
     * width. It is marked as changed in appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dx
     * @param {Boolean} [updateSize]   Whether to also call updateSize on the 
     *                                 Thing (by default, false).
     */
    function increaseWidth(thing, dx) {
        thing.right += dx;
        thing.width += dx / thing.EightBitter.unitsize;
        thing.unitwidth = thing.width * thing.EightBitter.unitsize;
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Completely pauses a Thing by setting its velocities to zero and disabling
     * it from falling, colliding, or moving. Its old attributes for those are
     * saved so thingResumeVelocity may restore them.
     * 
     * @param {Thing} thing
     * @param {Boolean} [keepMovement]   Whether to keep movement instead of
     *                                   wiping it (by default, false).
     */
    function thingPauseVelocity(thing, keepMovement) {
        thing.xvelOld = thing.xvel || 0;
        thing.yvelOld = thing.yvel || 0;

        thing.nofallOld = thing.nofall || false;
        thing.nocollideOld = thing.nocollide || false;
        thing.movementOld = thing.movement || thing.movementOld;

        thing.nofall = thing.nocollide = true;
        thing.xvel = thing.yvel = false;

        if (!keepMovement) {
            thing.movement = undefined;
        }
    }

    /**
     * Resumes a Thing's velocity and movements after they were paused by
     * thingPauseVelocity.
     * 
     * @param {Thing} thing
     * @param {Boolean} [noVelocity]   Whether to skip restoring the Thing's
     *                                 velocity (by default, false).
     */
    function thingResumeVelocity(thing, noVelocity) {
        if (!noVelocity) {
            thing.xvel = thing.xvelOld || 0;
            thing.yvel = thing.yvelOld || 0;
        }

        thing.movement = thing.movementOld || thing.movement;
        thing.nofall = thing.nofallOld || false;
        thing.nocollide = thing.nocollideOld || false;
    }


    /* Appearance utilities
    */

    /**
     * Generates a key for a Thing based off the current area and the Thing's
     * basic attributes. This key should be used for PixelRender.get calls, to
     * cache the Thing's sprite.
     * 
     * @param {Thing} thing
     * @return {String} A key that to identify the Thing's sprite.
     */
    function generateObjectKey(thing) {
        return thing.EightBitter.MapsHandler.getArea().setting
                + ' ' + thing.groupType + ' '
                + thing.title + ' ' + thing.className;
    }

    /**
     * Sets the class of a Thing, sets the new sprite for it, and marks it as 
     * having changed appearance. The class is stored in the Thing's internal
     * .className attribute.
     * 
     * @param {Thing} thing
     * @param {String} string   The new internal .className for the Thing.
     */
    function setClass(thing, string) {
        thing.className = string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * A version of setClass to be used before the Thing's sprite attributes
     * have been set. This just sets the internal .className.
     * 
     * @param {Thing} thing
     * @param {String} string
     */
    function setClassInitial(thing, string) {
        thing.className = string;
    }

    /**
     * Adds a string to a Thing's class after a ' ', updates the Thing's 
     * sprite, and marks it as having changed appearance.
     * 
     * @param {Thing} thing
     * @param {String} string
     */
    function addClass(thing, string) {
        thing.className += " " + string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Adds multiple strings to a Thing's class after a ' ', updates the Thing's 
     * sprite, and marks it as having changed appearance. Strings may be given 
     * as Arrays or Strings; Strings will be split on ' '. Any number of 
     * additional arguments may be given.
     * 
     * @param {Thing} thing
     * @param {Mixed} string
     */
    function addClasses(thing) {
        var strings, arr, i, j;
        for (i = 1; i < arguments.length; i += 1) {
            arr = arguments[i];

            if (!(arr instanceof Array)) {
                arr = arr.split(' ');
            }

            for (j = arr.length - 1; j >= 0; j -= 1) {
                thing.EightBitter.addClass(thing, arr[j]);
            }
        }
    }

    /**
     * Removes a string from a Thing's class, updates the Thing's sprite, and
     * marks it as having changed appearance.
     * 
     * @param {Thing} thing
     * @param {String} string
     */
    function removeClass(thing, string) {
        if (!string) {
            return;
        }
        if (string.indexOf(" ") !== -1) {
            thing.EightBitter.removeClasses(thing, string);
        }
        thing.className = thing.className.replace(new RegExp(" " + string, "gm"), "");
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
    }

    /**
     * Removes multiple strings from a Thing's class, updates the Thing's 
     * sprite, and marks it as having changed appearance. Strings may be given 
     * as Arrays or Strings; Strings will be split on ' '. Any number of 
     * additional arguments may be given.
     * 
     * @param {Thing} thing
     * @param {Mixed} string
     */
    function removeClasses(thing) {
        var strings, arr, i, j;
        for (i = 1; i < arguments.length; ++i) {
            arr = arguments[i];
            if (!(arr instanceof Array)) {
                arr = arr.split(" ");
            }

            for (j = arr.length - 1; j >= 0; --j) {
                thing.EightBitter.removeClass(thing, arr[j]);
            }
        }
    }

    /**
     * @param {Thing} thing
     * @param {String} string
     * @return {Boolean} Whether the Thing's class contains the String.
     */
    function hasClass(thing, string) {
        return thing.className.indexOf(string) !== -1;
    }

    /**
     * Removes the first class from a Thing and adds the second. All typical
     * sprite updates are called.
     * 
     * @param {Thing} thing
     * @param {String} stringOut
     * @param {String} stringIn
     */
    function switchClass(thing, stringOut, stringIn) {
        thing.EightBitter.removeClass(thing, stringOut);
        thing.EightBitter.addClass(thing, stringIn);
    }

    /**
     * Marks a Thing as being flipped horizontally by setting its .flipHoriz
     * attribute to true and giving it a "flipped" class.
     * 
     * @param {Thing}
     */
    function flipHoriz(thing) {
        thing.flipHoriz = true;
        thing.EightBitter.addClass(thing, "flipped");
    }

    /**
     * Marks a Thing as being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     * 
     * @param {Thing}
     */
    function flipVert(thing) {
        thing.flipVert = true;
        thing.EightBitter.addClass(thing, "flip-vert");
    }

    /**
     * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
     * attribute to false and giving it a "flipped" class.
     * 
     * @param {Thing}
     */
    function unflipHoriz(thing) {
        thing.flipHoriz = false;
        thing.EightBitter.removeClass(thing, "flipped");
    }

    /**
     * Marks a Thing as not being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     * 
     * @param {Thing}
     */
    function unflipVert(thing) {
        thing.flipVert = false;
        thing.EightBitter.removeClass(thing, "flip-vert");
    }

    /**
     * Sets the opacity of the Thing and marks its appearance as changed.
     * 
     * @param {Thing} thing
     * @param {Number} opacity   A number in [0,1].
     */
    function setOpacity(thing, opacity) {
        thing.opacity = opacity;
        thing.EightBitter.markChanged(thing);
    }


    /* Miscellaneous utilities
    */

    /**
     * Removes a Thing from an Array using Array.splice. If the thing has an 
     * onDelete, that is called.
     * 
     * @param {Thing} thing
     * @param {Array} array
     * @param {Number} [location]   The index of the Thing in the Array, for
     *                              speed's sake (by default, it is found
     *                              using Array.indexOf).
     */
    function arrayDeleteThing(thing, array, location) {
        if (typeof location === "undefined") {
            location = array.indexOf(thing);
            if (location === -1) {
                return;
            }
        }

        array.splice(location, 1);

        if (typeof (thing.onDelete) === "function") {
            thing.onDelete(thing);
        }
    }

    /**
     * Takes a snapshot of the current screen canvas by simulating a click event
     * on a dummy link.
     * 
     * @param {String} [name]   A name for the image to be saved as (by default,
     *                          "FullScreenMario Screenshot").
     * @param {String} [format]   A format for the image to be saved as (by
     *                            default, "png").
     * @remarks For security concerns, browsers won't allow this unless it's
     *          called within a callback of a genuine user-triggered event.
     */
    function takeScreenshot(name, format) {
        var EightBitter =  EightBittr.prototype.ensureCorrectCaller(this),
            format = "image/png",
            link = EightBitter.createElement("a", {
                "download": (
                        name || (EightBitter.settings.ui.globalName + " Screenshot")
                    ) + "." + format.split("/")[1],
                "href": EightBitter.canvas.toDataURL(format)
                    .replace(format, "image/octet-stream")
            });

        link.click();
    }

    /**
     * 
     */
    function addPageStyles(styles) {
        var EightBitter =  EightBittr.prototype.ensureCorrectCaller(this),
            sheet = EightBitter.createElement("style", {
                "type": "text/css"
            }),
            compiled = "", i, j;

        for (i in styles) {
            compiled += i + " { \r\n";
            for (j in styles[i]) {
                compiled += "  " + j + ": " + styles[i][j] + ";\r\n"
            }
            compiled += "}\r\n";
        }

        if (sheet.styleSheet) {
            sheet.styleSheet.cssText = compiled;
        } else {
            sheet.appendChild(document.createTextNode(compiled));
        }

        document.querySelector("head").appendChild(sheet);
    }


    EightBitterProto.proliferateHard(EightBitterProto, {
        // Resets
        "reset": reset,
        "resetTimed": resetTimed,
        "resetObjectMaker": resetObjectMaker,
        "resetQuadsKeeper": resetQuadsKeeper,
        "resetPixelRender": resetPixelRender,
        "resetTimeHandler": resetTimeHandler,
        "resetAudioPlayer": resetAudioPlayer,
        "resetGamesRunner": resetGamesRunner,
        "resetStatsHolder": resetStatsHolder,
        "resetGroupHolder": resetGroupHolder,
        "resetThingHitter": resetThingHitter,
        "resetMapScreener": resetMapScreener,
        "resetPixelDrawer": resetPixelDrawer,
        "resetNumberMaker": resetNumberMaker,
        "resetMapsCreator": resetMapsCreator,
        "resetMapsHandler": resetMapsHandler,
        "resetInputWriter": resetInputWriter,
        "resetLevelEditor": resetLevelEditor,
        "resetWorldSeeder": resetWorldSeeder,
        "resetModAttacher": resetModAttacher,
        "startModAttacher": startModAttacher,
        "resetContainer": resetContainer,
        // Global manipulations
        "scrollWindow": scrollWindow,
        "scrollThing": scrollThing,
        "onAreaSpawn": onAreaSpawn,
        "onAreaUnspawn": onAreaUnspawn,
        "addThing": addThing,
        "thingProcess": thingProcess,
        "thingProcessAttributes": thingProcessAttributes,
        "mapPlaceRandomCommands": mapPlaceRandomCommands,
        // Physics & similar
        "markChanged": markChanged,
        "shiftVert": shiftVert,
        "shiftHoriz": shiftHoriz,
        "setTop": setTop,
        "setRight": setRight,
        "setBottom": setBottom,
        "setLeft": setLeft,
        "shiftBoth": shiftBoth,
        "shiftThings": shiftThings,
        "shiftAll": shiftAll,
        "setWidth": setWidth,
        "setHeight": setHeight,
        "setSize": setSize,
        "updatePosition": updatePosition,
        "updateSize": updateSize,
        "reduceWidth": reduceWidth,
        "reduceHeight": reduceHeight,
        "increaseWidth": increaseWidth,
        "increaseHeight": increaseHeight,
        "thingPauseVelocity": thingPauseVelocity,
        "thingResumeVelocity": thingResumeVelocity,
        // Appearance utilities
        "generateObjectKey": generateObjectKey,
        "setClass": setClass,
        "setClassInitial": setClassInitial,
        "addClass": addClass,
        "addClasses": addClasses,
        "removeClass": removeClass,
        "removeClasses": removeClasses,
        "hasClass": hasClass,
        "switchClass": switchClass,
        "flipHoriz": flipHoriz,
        "flipVert": flipVert,
        "unflipHoriz": unflipHoriz,
        "unflipVert": unflipVert,
        "setOpacity": setOpacity,
        // Miscellaneous utilities
        "arrayDeleteThing": arrayDeleteThing,
        "takeScreenshot": takeScreenshot,
        "addPageStyles": addPageStyles
    });

    return GameStartr;
})(EightBittr);
;

/* GameStartr/AudioPlayr/AudioPlayr.js */
var StatsValue = (function () {
    /**
     * Creates a new StatsValue with the given key and settings. Defaults are given
     * to the value via proliferate before the settings.
     *
     * @constructor
     * @param {StatsHoldr} StatsHolder   The container for this value.
     * @param {String} key   The key to reference this new StatsValue by.
     * @param {IStatsValueSettings} settings   Any optional custom settings.
     */
    function StatsValue(StatsHolder, key, settings) {
        this.StatsHolder = StatsHolder;
        StatsHolder.proliferate(this, StatsHolder.getDefaults());
        StatsHolder.proliferate(this, settings);
        this.key = key;
        if (!this.hasOwnProperty("value")) {
            this.value = this.valueDefault;
        }
        if (this.hasElement) {
            this.element = StatsHolder.createElement(settings.element || "div", {
                className: StatsHolder.getPrefix() + "_value " + key
            });
            this.element.appendChild(StatsHolder.createElement("div", {
                "textContent": key
            }));
            this.element.appendChild(StatsHolder.createElement("div", {
                "textContent": this.value
            }));
        }
        if (this.storeLocally) {
            // If there exists an old version of this property, get it 
            if (StatsHolder.getLocalStorage().hasOwnProperty(StatsHolder.getPrefix() + key)) {
                this.value = this.retrieveLocalStorage();
            }
            else {
                // Otherwise save the new version to memory
                this.updateLocalStorage();
            }
        }
    }
    /**
     * General update Function to be run whenever the internal value is changed.
     * It runs all the trigger, modular, etc. checks, updates the HTML element
     * if there is one, and updates localStorage if needed.
     */
    StatsValue.prototype.update = function () {
        // Mins and maxes must be obeyed before any other considerations
        if (this.hasOwnProperty("minimum") && Number(this.value) <= Number(this.minimum)) {
            this.value = this.minimum;
            if (this.onMinimum) {
                this.onMinimum.apply(this, this.callbackArgs);
            }
        }
        else if (this.hasOwnProperty("maximum") && Number(this.value) <= Number(this.maximum)) {
            this.value = this.maximum;
            if (this.onMaximum) {
                this.onMaximum.apply(this, this.callbackArgs);
            }
        }
        if (this.modularity) {
            this.checkModularity();
        }
        if (this.triggers) {
            this.checkTriggers();
        }
        if (this.hasElement) {
            this.updateElement();
        }
        if (this.storeLocally) {
            this.updateLocalStorage();
        }
    };
    /**
     * Checks if the current value should trigger a callback, and if so calls
     * it.
     *
     * @this {StatsValue}
     */
    StatsValue.prototype.checkTriggers = function () {
        if (this.triggers.hasOwnProperty(this.value)) {
            this.triggers[this.value].apply(this, this.callbackArgs);
        }
    };
    /**
     * Checks if the current value is greater than the modularity (assuming
     * modular is a non-zero Numbers), and if so, continuously reduces value and
     * calls this.onModular.
     *
     * @this {StatsValue}
     */
    StatsValue.prototype.checkModularity = function () {
        if (this.value.constructor !== Number || !this.modularity) {
            return;
        }
        while (this.value >= this.modularity) {
            this.value = Math.max(0, this.value - this.modularity);
            if (this.onModular) {
                this.onModular.apply(this, this.callbackArgs);
            }
        }
    };
    /**
     * Updates the StatsValue's element's second child to be the StatsValue's value.
     *
     * @this {StatsValue}
     */
    StatsValue.prototype.updateElement = function () {
        if (this.StatsHolder.hasDisplayChange(this.value)) {
            this.element.children[1].textContent = this.StatsHolder.getDisplayChange(this.value);
        }
        else {
            this.element.children[1].textContent = this.value;
        }
    };
    /**
     * Retrieves a StatsValue's value from localStorage, making sure not to try to
     * JSON.parse an undefined or null value.
     *
     * @return {Mixed}
     */
    StatsValue.prototype.retrieveLocalStorage = function () {
        var value = localStorage.getItem(this.StatsHolder.getPrefix() + this.key);
        switch (value) {
            case "undefined":
                return undefined;
            case "null":
                return null;
        }
        if (value.constructor !== String) {
            return value;
        }
        return JSON.parse(value);
    };
    /**
     * Stores a StatsValue's value in localStorage under the prefix plus its key.
     *
     * @param {Boolean} [overrideAutoSave]   Whether the policy on saving should
     *                                       be ignored (so saving happens
     *                                       regardless). By default, false.
     */
    StatsValue.prototype.updateLocalStorage = function (overrideAutoSave) {
        if (overrideAutoSave === void 0) { overrideAutoSave = false; }
        if (this.StatsHolder.getAutoSave() || overrideAutoSave) {
            this.StatsHolder.getLocalStorage()[this.StatsHolder.getPrefix() + this.key] = JSON.stringify(this.value);
        }
    };
    return StatsValue;
})();
/**
 * StatsHoldr
 * A versatile container to store and manipulate values in localStorage, and
 * optionally keep an updated HTML container showing these values. Operations
 * such as setting, increasing/decreasing, and default values are all abstracted
 * automatically. StatsValues are stored in memory as well as in localStorage for
 * fast lookups.
 * Each StatsHoldr instance requires proliferate and createElement functions
 * (such as those given by the EightBittr prototype).
 *
 * @example
 * // Creating and using a StatsHoldr to store user statistics.
 * var StatsHolder = new StatsHoldr({
 *     "prefix": "MyStatsHoldr",
 *     "values": {
 *         "bestStage": {
 *             "valueDefault": "Beginning",
 *             "storeLocally": true
 *         },
 *         "bestScore": {
 *             "valueDefault": 0,
 *             "storeLocally": true
 *         }
 *     },
 *     "proliferate": EightBittr.prototype.proliferate,
 *     "createElement": EightBittr.prototype.createElement
 * });
 * StatsHolder.set("bestStage", "Middle");
 * StatsHolder.set("bestScore", 9001);
 * console.log(StatsHolder.get("bestStage")); // "Middle"
 * console.log(StatsHolder.get("bestScore")); // "9001"
 * @example
 * // Creating and using a StatsHoldr to show user statistics in HTML elements.
 * var StatsHolder = new StatsHoldr({
 *     "prefix": "MyStatsHoldr",
 *     "doMakeContainer": true,
 *     "containers": [
 *         ["table", {
 *             "id": "StatsOutside",
 *             "style": {
 *                 "textTransform": "uppercase"
 *             }
 *         }],
 *         ["tr", {
 *             "id": "StatsInside"
 *         }]
 *     ],
 *     "defaults": {
 *         "element": "td"
 *     },
 *     "values": {
 *         "bestStage": {
 *             "valueDefault": "Beginning",
 *             "hasElement": true,
 *             "storeLocally": true
 *         },
 *         "bestScore": {
 *             "valueDefault": 0,
 *             "hasElement": true,
 *             "storeLocally": true
 *         }
 *     },
 *     "proliferate": EightBittr.prototype.proliferate,
 *     "createElement": EightBittr.prototype.createElement
 * });
 * document.body.appendChild(StatsHolder.getContainer());
 * StatsHolder.set("bestStage", "Middle");
 * StatsHolder.set("bestScore", 9001);
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var StatsHoldr = (function () {
    /**
     * Resets the StatsHoldr.
     *
     * @constructor
     * @param {String} prefix   A String prefix to prepend to key names in
     *                          localStorage.
     * @param {Function} proliferate   A Function that takes in a recipient
     *                                 Object and a donor Object, and copies
     *                                 attributes over. Generally given by
     *                                 EightBittr.prototype to minimize
     *                                 duplicate code.
     * @param {Function} createElement   A Function to create an Element of a
     *                                   given String type and apply attributes
     *                                   from subsequent Objects. Generally
     *                                   given by EightBittr.prototype to reduce
     *                                   duplicate code.
     * @param {Object} [values]   The keyed values to be stored, as well as all
     *                            associated information with them. The names of
     *                            values are keys in the values Object.
     * @param {Object} [localStorage]   A substitute for localStorage, generally
     *                                  used as a shim (defaults to window's
     *                                  localStorage, or a new Object if that
     *                                  does not exist).
     * @param {Boolean} [autoSave]   Whether this should save changes to
     *                               localStorage automatically (by default,
     *                               false).
     * @param {Boolean} [doMakeContainer]   Whether an HTML container with
     *                                      children for each value should be
     *                                      made (defaults to false).
     * @param {Object} [defaults]   Default attributes for each value.
     * @param {Array} [callbackArgs]   Arguments to pass via Function.apply to
     *                                 triggered callbacks (defaults to []).
     */
    function StatsHoldr(settings) {
        if (settings === void 0) { settings = {}; }
        var key;
        this.prefix = settings.prefix || "";
        this.autoSave = settings.autoSave;
        this.callbackArgs = settings.callbackArgs || [];
        if (settings.localStorage) {
            this.localStorage = settings.localStorage;
        }
        else if (typeof localStorage === "undefined") {
            this.localStorage = {};
        }
        else {
            this.localStorage = localStorage;
        }
        this.defaults = settings.defaults || {};
        this.displayChanges = settings.displayChanges || {};
        this.values = {};
        if (settings.values) {
            for (key in settings.values) {
                if (settings.values.hasOwnProperty(key)) {
                    this.addStatistic(key, settings.values[key]);
                }
            }
        }
        if (settings.doMakeContainer) {
            this.containersArguments = settings.containersArguments || [
                ["div", {
                    "className": this.prefix + "_container"
                }]
            ];
            this.container = this.makeContainer(settings.containersArguments);
        }
    }
    /* Simple gets
    */
    /**
     * @return {Mixed} The values contained within, keyed by their keys.
     */
    StatsHoldr.prototype.getValues = function () {
        return this.values;
    };
    /**
     * @return {Mixed} Default attributes for values.
     */
    StatsHoldr.prototype.getDefaults = function () {
        return this.defaults;
    };
    /**
     * @return {Mixed} A reference to localStorage or a replacment object.
     */
    StatsHoldr.prototype.getLocalStorage = function () {
        return this.localStorage;
    };
    /**
     * @return {Boolean} Whether this should save changes to localStorage
     *                   automatically.
     */
    StatsHoldr.prototype.getAutoSave = function () {
        return this.autoSave;
    };
    /**
     * @return {String} The prefix to store thigns under in localStorage.
     */
    StatsHoldr.prototype.getPrefix = function () {
        return this.prefix;
    };
    /**
     * @return {HTMLElement} The container HTML element, if it exists.
     */
    StatsHoldr.prototype.getContainer = function () {
        return this.container;
    };
    /**
     * @return {Mixed[][]} The createElement arguments for the HTML container
     *                     elements, outside-to-inside.
     */
    StatsHoldr.prototype.getContainersArguments = function () {
        return this.containersArguments;
    };
    /**
     * @return {Mixed} Any hard-coded changes to element content.
     */
    StatsHoldr.prototype.getDisplayChanges = function () {
        return this.displayChanges;
    };
    /**
     * @return {Mixed[]} Arguments to be passed to triggered events.
     */
    StatsHoldr.prototype.getCallbackArgs = function () {
        return this.callbackArgs;
    };
    /* Retrieval
    */
    /**
     * @return {String[]} The names of all value's keys.
     */
    StatsHoldr.prototype.getKeys = function () {
        return Object.keys(this.values);
    };
    /**
     * @param {String} key   The key for a known value.
     * @return {Mixed} The known value of a key, assuming that key exists.
     */
    StatsHoldr.prototype.get = function (key) {
        this.checkExistence(key);
        return this.values[key].value;
    };
    /**
     * @param {String} key   The key for a known value.
     * @return {Object} The settings for that particular key.
     */
    StatsHoldr.prototype.getObject = function (key) {
        return this.values[key];
    };
    /**
     * @param {String} key   The key for a potentially known value.
     * @return {Boolean} Whether there is a value under that key.
     */
    StatsHoldr.prototype.hasKey = function (key) {
        return this.values.hasOwnProperty(key);
    };
    /**
     * @return {Object} The objects being stored.
     */
    StatsHoldr.prototype.getStatsValues = function () {
        return this.values;
    };
    /**
     * @return {Object} A mapping of key names to the actual values of all
     *                  objects being stored.
     */
    StatsHoldr.prototype.export = function () {
        var output = {}, i;
        for (i in this.values) {
            if (this.values.hasOwnProperty(i)) {
                output[i] = this.values[i].value;
            }
        }
        return output;
    };
    /* StatsValues
    */
    /**
     * Adds a new key & value pair to by linking to a newly created StatsValue.
     *
     * @param {String} key   The key to reference by new StatsValue by.
     * @param {Object} settings   The settings for the new StatsValue.
     * @return {StatsValue} The newly created StatsValue.
     */
    StatsHoldr.prototype.addStatistic = function (key, settings) {
        return this.values[key] = new StatsValue(this, key, settings);
    };
    /* Updating values
    */
    /**
     * Sets the value for the StatsValue under the given key, then updates the StatsValue
     * (including the StatsValue's element and localStorage, if needed).
     *
     * @param {String} key   The key of the StatsValue.
     * @param {Mixed} value   The new value for the StatsValue.
     */
    StatsHoldr.prototype.set = function (key, value) {
        this.checkExistence(key);
        this.values[key].value = value;
        this.values[key].update();
    };
    /**
     * Increases the value for the StatsValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     *
     * @param {String} key   The key of the StatsValue.
     * @param {Mixed} [amount]   The amount to increase by (by default, 1).
     */
    StatsHoldr.prototype.increase = function (key, amount) {
        if (amount === void 0) { amount = 1; }
        this.checkExistence(key);
        this.values[key].value += arguments.length > 1 ? amount : 1;
        this.values[key].update();
    };
    /**
     * Increases the value for the StatsValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     *
     * @param {String} key   The key of the StatsValue.
     * @param {Number} [amount]   The amount to increase by (by default, 1).
     */
    StatsHoldr.prototype.decrease = function (key, amount) {
        if (amount === void 0) { amount = 1; }
        this.checkExistence(key);
        this.values[key].value -= amount;
        this.values[key].update();
    };
    /**
     * Toggles whether a value is 1 or 0.
     *
     * @param {String} key   The key of the StatsValue.
     */
    StatsHoldr.prototype.toggle = function (key) {
        this.checkExistence(key);
        this.values[key].value = this.values[key].value ? 0 : 1;
        this.values[key].update();
    };
    /**
     * Ensures a key exists in values, and throws an Error if it doesn't.
     *
     * @param {String} key
     */
    StatsHoldr.prototype.checkExistence = function (key) {
        if (!this.values.hasOwnProperty(key)) {
            throw new Error("Unknown key given to StatsHoldr: '" + key + "'.");
        }
    };
    /**
     * Manually saves all values to localStorage, ignoring the autoSave flag.
     */
    StatsHoldr.prototype.saveAll = function () {
        for (var key in this.values) {
            if (this.values.hasOwnProperty(key)) {
                this.values[key].updateLocalStorage(true);
            }
        }
    };
    /* HTML helpers
    */
    /**
     * Hides the container Element by setting its visibility to hidden.
     */
    StatsHoldr.prototype.hideContainer = function () {
        this.container.style.visibility = "hidden";
    };
    /**
     * Shows the container Element by setting its visibility to visible.
     */
    StatsHoldr.prototype.displayContainer = function () {
        this.container.style.visibility = "visible";
    };
    /**
     * Creates the container Element, which contains a child for each StatsValue that
     * specifies hasElement to be true.
     *
     * @param {Mixed[][]} containers   An Array representing the Element to be
     *                                 created and the children between it and
     *                                 the contained StatsValues. Each contained
     *                                 Mixed[]  has a String tag name as its
     *                                 first member, followed by any number of
     *                                 Objects to apply via createElement.
     * @return {HTMLElement}
     */
    StatsHoldr.prototype.makeContainer = function (containers) {
        var output = this.createElement.apply(this, containers[0]), current = output, child, key, i;
        for (i = 1; i < containers.length; ++i) {
            child = this.createElement.apply(this, containers[i]);
            current.appendChild(child);
            current = child;
        }
        for (key in this.values) {
            if (this.values[key].hasElement) {
                child.appendChild(this.values[key].element);
            }
        }
        return output;
    };
    /**
     * @return {Boolean} Whether displayChanges has an entry for a particular
     *                   value.
     */
    StatsHoldr.prototype.hasDisplayChange = function (value) {
        return this.displayChanges.hasOwnProperty(value);
    };
    /**
     * @return {String} The displayChanges entry for a particular value.
     */
    StatsHoldr.prototype.getDisplayChange = function (value) {
        return this.displayChanges[value];
    };
    /* Utilities
    */
    StatsHoldr.prototype.createElement = function (tag) {
        if (tag === void 0) { tag = undefined; }
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var element = document.createElement(tag), i;
        for (i = 0; i < args.length; i += 1) {
            this.proliferate(element, args[i]);
        }
        return element;
    };
    StatsHoldr.prototype.proliferate = function (recipient, donor, noOverride) {
        if (noOverride === void 0) { noOverride = false; }
        var setting, i;
        for (i in donor) {
            if (donor.hasOwnProperty(i)) {
                // If noOverride, don't override already existing properties
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
        }
        return recipient;
    };
    return StatsHoldr;
})();
/// <reference path="External/StatsHoldr.ts" />
/**
 * AudioPlayr
 * An audio library to automate preloading and controlled playback of multiple
 * audio tracks, with support for different browsers' preferred file types.
 * Volume and mute status are stored locally using a StatsHoldr, which in turn
 * requires proliferate and createElement functions (such as those given by the
 * EightBittr prototype).
 * @example
 * // Creating and using an AudioPlayr to load and play audio files. The
 * // 'Sounds/Samples/mp3' directory should have Coin.mp3 and Bump.mp3 in it.
 * var AudioPlayer = new AudioPlayr({
 *     "directory": "Sounds",
 *     "fileTypes": ["mp3"],
 *     "statistics": {
 *         "prefix": "MyAudioPlayr",
 *         "proliferate": EightBittr.prototype.proliferate,
 *         "createElement": EightBittr.prototype.createElement,
 *         "values": {
 *             "volume": {
 *                 "valueDefault": 0.5,
 *                 "storeLocally": true
 *             },
 *             "muted": {
 *                 "valueDefault": 0,
 *                 "storeLocally": false
 *             }
 *         }
 *     },
 *     "library": {
 *         "Sounds": [
 *             "Coin",
 *             "Bump"
 *         ]
 *     }
 * });
 * AudioPlayer.play("Coin"); // Returns an <audio> playing Coin.mp3
 * @example
 * // Creating and using an AudioPlayr to load and play audio files. A theme
 * // track is kept looping in the background, and the Coin sound is played
 * // every seven seconds.
 * var AudioPlayer = new AudioPlayr({
 *     "directory": "Sounds",
 *     "fileTypes": ["mp3"],
 *     "statistics": {
 *         "prefix": "MyAudioPlayr",
 *         "proliferate": EightBittr.prototype.proliferate,
 *         "createElement": EightBittr.prototype.createElement,
 *         "values": {
 *             "volume": {
 *                 "valueDefault": 0.5,
 *                 "storeLocally": true
 *             },
 *             "muted": {
 *                 "valueDefault": 0,
 *                 "storeLocally": false
 *             }
 *         }
 *     },
 *     "library": {
 *         "Sounds": [
 *             "Coin"
 *         ],
 *         "Themes": [
 *             "Overworld"
 *         ]
 *     }
 * });
 * AudioPlayer.playTheme("Overworld");
 * setInterval(function () {
 *     AudioPlayer.play("Coin");
 * }, 7000);
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var AudioPlayr = (function () {
    /**
     * Resets the AudioPlayr.
     *
     * @param {IAudioPlayrSettings} settings
     */
    function AudioPlayr(settings) {
        if (typeof settings.library === "undefined") {
            throw new Error("No library given to AudioPlayr.");
        }
        if (typeof settings.directory === "undefined") {
            throw new Error("No directory given to AudioPlayr.");
        }
        if (typeof settings.fileTypes === "undefined") {
            throw new Error("No fileTypes given to AudioPlayr.");
        }
        if (!settings.statistics || !settings.statistics.values) {
            throw new Error("No statistics with values given to AudioPlayr.");
        }
        if (!settings.statistics.values.volume || !settings.statistics.values.muted) {
            throw new Error("Statistics given to AudioPlayr must include volume and muted.");
        }
        this.library = settings.library;
        this.directory = settings.directory;
        this.fileTypes = settings.fileTypes;
        this.getThemeDefault = settings.getThemeDefault || "Theme";
        this.getVolumeLocal = typeof settings.getVolumeLocal === "undefined" ? 1 : settings.getVolumeLocal;
        // Sounds should always start blank
        this.sounds = {};
        // Preload everything!
        this.libraryLoad();
        this.StatsHolder = new StatsHoldr(settings.statistics);
        this.setVolume(this.StatsHolder.get("volume"));
        this.setMuted(this.StatsHolder.get("muted"));
    }
    /* Simple getters
    */
    /**
     * @return {Object} The listing of <audio> Elements, keyed by name.
     */
    AudioPlayr.prototype.getLibrary = function () {
        return this.library;
    };
    /**
     * @return {String[]} The allowed filetypes for audio files.
     */
    AudioPlayr.prototype.getfileTypes = function () {
        return this.fileTypes;
    };
    /**
     * @return {Object} The currently playing <audio> Elements, keyed by name.
     */
    AudioPlayr.prototype.getSounds = function () {
        return this.sounds;
    };
    /**
     * @return {HTMLAudioElement} The current playing theme's <audio> Element.
     */
    AudioPlayr.prototype.getTheme = function () {
        return this.theme;
    };
    /**
     * @return {String} The directory under which all filetype directories are
     *                  to be located.
     */
    AudioPlayr.prototype.getDirectory = function () {
        return this.directory;
    };
    /* Playback modifiers
    */
    /**
     * @return {Number} The current volume, which is a Number in [0,1],
     *                  retrieved by the StatsHoldr.
     */
    AudioPlayr.prototype.getVolume = function () {
        return this.StatsHolder.get("volume");
    };
    /**
     * Sets the current volume. If not muted, all sounds will have their volume
     * updated.
     *
     * @param {Number} volume   A Number in [0,1] to set as the current volume.
     */
    AudioPlayr.prototype.setVolume = function (volume) {
        var i;
        if (!this.getMuted()) {
            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    this.sounds[i].volume = this.sounds[i].volumeReal * volume;
                }
            }
        }
        this.StatsHolder.set("volume", volume);
    };
    /**
     * @return {Boolean} whether this is currently muted.
     */
    AudioPlayr.prototype.getMuted = function () {
        return Boolean(this.StatsHolder.get("muted"));
    };
    /**
     * Calls either setMutedOn or setMutedOff as is appropriate.
     *
     * @param {Boolean} muted   The new status for muted.
     */
    AudioPlayr.prototype.setMuted = function (muted) {
        this.getMuted() ? this.setMutedOn() : this.setMutedOff();
    };
    /**
     * Calls either setMutedOn or setMutedOff to toggle whether this is muted.
     */
    AudioPlayr.prototype.toggleMuted = function () {
        this.setMuted(!this.getMuted());
    };
    /**
     * Sets volume to 0 in all currently playing sounds and stores the muted
     * status as on in the internal StatsHoldr.
     */
    AudioPlayr.prototype.setMutedOn = function () {
        for (var i in this.sounds) {
            if (this.sounds.hasOwnProperty(i)) {
                this.sounds[i].volume = 0;
            }
        }
        this.StatsHolder.set("muted", 1);
    };
    /**
     * Sets sound volumes to their actual volumes and stores the muted status
     * as off in the internal StatsHoldr.
     */
    AudioPlayr.prototype.setMutedOff = function () {
        var volume = this.getVolume(), sound, i;
        for (i in this.sounds) {
            if (this.sounds.hasOwnProperty(i)) {
                sound = this.sounds[i];
                sound.volume = Number(sound.getAttribute("volumeReal")) * volume;
            }
        }
        this.StatsHolder.set("muted", 0);
    };
    /* Other modifiers
    */
    /**
     * @return {Mixed} The Function or Number used as the volume setter for
     *                 "local" sounds.
     */
    AudioPlayr.prototype.getGetVolumeLocal = function () {
        return this.getVolumeLocal;
    };
    /**
     * @param {Mixed} getVolumeLocal   A new Function or Number to use as the
     *                                 volume setter for "local" sounds.
     */
    AudioPlayr.prototype.setGetVolumeLocal = function (getVolumeLocalNew) {
        this.getVolumeLocal = getVolumeLocalNew;
    };
    /**
     * @return {Mixed} The Function or String used to get the default theme for
     *                 playTheme calls.
     */
    AudioPlayr.prototype.getGetThemeDefault = function () {
        return this.getThemeDefault;
    };
    /**
     * @param {Mixed} A new Function or String to use as the source for theme
     *                names in default playTheme calls.
     */
    AudioPlayr.prototype.setGetThemeDefault = function (getThemeDefaultNew) {
        this.getThemeDefault = getThemeDefaultNew;
    };
    /* Playback
    */
    /**
     * @param {String} name   The name of the sound to play.
     *
     * Plays the sound of the given name. Internally, this stops any previously
     * playing sound of that name and starts a new one, with volume set to the
     * current volume and muted status. If the name wasn't previously being
     * played (and therefore a new Element has been created), an event listener
     * is added to delete it from sounds after.
     *
     * @return {HTMLAudioElement} The sound's <audio> element, now playing.
     */
    AudioPlayr.prototype.play = function (name) {
        var sound, used;
        // If the sound isn't yet being played, see if it's in the library
        if (!this.sounds.hasOwnProperty(name)) {
            // If the sound also isn't in the library, it's unknown
            if (!this.library.hasOwnProperty(name)) {
                throw new Error("Unknown name given to AudioPlayr.play: '" + name + "'.");
            }
            sound = this.sounds[name] = this.library[name];
        }
        else {
            sound = this.sounds[name];
        }
        this.soundStop(sound);
        if (this.getMuted()) {
            sound.volume = 0;
        }
        else {
            sound.setAttribute("volumeReal", "1");
            sound.volume = this.getVolume();
        }
        this.playSound(sound);
        used = Number(sound.getAttribute("used"));
        // If this is the song's first play, let it know how to stop
        if (!used) {
            sound.setAttribute("used", String(used + 1));
            sound.addEventListener("ended", this.soundFinish.bind(this, name));
        }
        sound.setAttribute("name", name);
        return sound;
    };
    /**
     * Pauses all currently playing sounds.
     */
    AudioPlayr.prototype.pauseAll = function () {
        for (var i in this.sounds) {
            if (this.sounds.hasOwnProperty(i)) {
                this.sounds[i].pause();
            }
        }
    };
    /**
     * Un-pauses (resumes) all currently paused sounds.
     */
    AudioPlayr.prototype.resumeAll = function () {
        for (var i in this.sounds) {
            if (!this.sounds.hasOwnProperty(i)) {
                continue;
            }
            this.sounds[i].play();
        }
    };
    /**
     * Pauses the currently playing theme, if there is one.
     */
    AudioPlayr.prototype.pauseTheme = function () {
        if (this.theme) {
            this.theme.pause();
        }
    };
    /**
     * Resumes the theme, if there is one and it's paused.
     */
    AudioPlayr.prototype.resumeTheme = function () {
        if (this.theme) {
            this.theme.play();
        }
    };
    /**
     * Stops all sounds and any theme, and removes all references to them.
     */
    AudioPlayr.prototype.clearAll = function () {
        this.pauseAll();
        this.clearTheme();
        this.sounds = {};
    };
    /**
     * Pauses and removes the theme, if there is one.
     */
    AudioPlayr.prototype.clearTheme = function () {
        if (!this.theme) {
            return;
        }
        this.pauseTheme();
        delete this.sounds[this.theme.getAttribute("name")];
        this.theme = undefined;
    };
    /**
     * "Local" version of play that changes the output sound's volume depending
     * on the result of a getVolumeLocal call. This defaults to 1, but may be
     * less. For example, in a video game, sounds further from the viewpoint
     * should have lessened volume.
     *
     * @param {String} name   The name of the sound to play.
     * @param {Mixed} [location]   An argument for getVolumeLocal, if that's a
     *                             Function.
     * @return {HTMLAudioElement} The sound's <audio> element, now playing.
     */
    AudioPlayr.prototype.playLocal = function (name, location) {
        if (location === void 0) { location = undefined; }
        var sound = this.play(name), volumeReal;
        switch (this.getVolumeLocal.constructor) {
            case Function:
                volumeReal = this.getVolumeLocal(location);
                break;
            case Number:
                volumeReal = this.getVolumeLocal;
                break;
            default:
                volumeReal = Number(this.getVolumeLocal) || 1;
                break;
        }
        sound.setAttribute("volumeReal", String(volumeReal));
        if (this.getMuted()) {
            sound.volume = 0;
        }
        else {
            sound.volume = volumeReal * this.getVolume();
        }
        return sound;
    };
    /**
     * Pauses any previously playing theme and starts playback of a new theme
     * sound. This is different from normal sounds in that it normally loops and
     * is controlled by pauseTheme and co. If loop is on and the sound wasn't
     * already playing, an event listener is added for when it ends.
     *
     * @param {String} [name]   The name of the sound to be used as the theme.
     *                          If not provided, getThemeDefault is used to
     *                          provide one.
     * @param {Boolean} [loop]   Whether the theme should always loop (by
     *                           default, true).
     * @return {HTMLAudioElement} The theme's <audio> element, now playing.
     */
    AudioPlayr.prototype.playTheme = function (name, loop) {
        if (name === void 0) { name = undefined; }
        if (loop === void 0) { loop = undefined; }
        this.pauseTheme();
        // Loop defaults to true
        loop = typeof loop !== "undefined" ? loop : true;
        // If name isn't given, use the default getter
        if (typeof (name) === "undefined") {
            switch (this.getThemeDefault.constructor) {
                case Function:
                    name = this.getThemeDefault();
                    break;
                case String:
                    name = this.getThemeDefault;
                    break;
            }
        }
        // If a theme already exists, kill it
        if (typeof this.theme !== "undefined" && this.theme.hasAttribute("name")) {
            delete this.sounds[this.theme.getAttribute("name")];
        }
        this.theme = this.sounds[name] = this.play(name);
        this.theme.loop = loop;
        // If it's used (no repeat), add the event listener to resume theme
        if (this.theme.used === 1) {
            this.theme.addEventListener("ended", this.playTheme);
        }
        return this.theme;
    };
    /**
     * Wrapper around playTheme that plays a sound, then a theme. This is
     * implemented using an event listener on the sound's ending.
     *
     * @param {String} [prefix]    A prefix for the sound? Not sure...
     * @param {String} [name]   The name of the sound to be used as the theme.
     *                          If not provided, getThemeDefault is used to
     *                          provide one.
     * @param {Boolean} [loop]   Whether the theme should always loop (by
     *                           default, false).
     * @return {HTMLAudioElement} The sound's <audio> element, now playing.
     */
    AudioPlayr.prototype.playThemePrefixed = function (prefix, name, loop) {
        if (prefix === void 0) { prefix = undefined; }
        if (name === void 0) { name = undefined; }
        if (loop === void 0) { loop = undefined; }
        var sound = this.play(prefix);
        this.pauseTheme();
        // If name isn't given, use the default getter
        if (typeof (name) === "undefined") {
            switch (this.getThemeDefault.constructor) {
                case Function:
                    name = this.getThemeDefault();
                    break;
                case String:
                    name = this.getThemeDefault;
                    break;
            }
        }
        this.addEventListener(prefix, "ended", this.playTheme.bind(self, prefix + " " + name, loop));
        return sound;
    };
    /* Public utilities
    */
    /**
     * Adds an event listener to a currently playing sound. The sound will keep
     * track of event listeners via an .addedEvents attribute, so they can be
     * cancelled later.
     *
     * @param {String} name   The name of the sound.
     * @param {String} event   The name of the event, such as "ended".
     * @param {Function} callback   The Function to be called by the event.
     */
    AudioPlayr.prototype.addEventListener = function (name, event, callback) {
        var sound = this.library[name];
        if (!sound) {
            throw new Error("Unknown name given to addEventListener: '" + name + "'.");
        }
        if (!sound.addedEvents) {
            sound.addedEvents = {};
        }
        if (!sound.addedEvents[event]) {
            sound.addedEvents[event] = [callback];
        }
        else {
            sound.addedEvents[event].push(callback);
        }
        sound.addEventListener(event, callback);
    };
    /**
     * Clears all events added by this.addEventListener to a sound under a given
     * event.
     *
     * @param {String} name   The name of the sound.
     * @param {String} event   The name of the event, such as "ended".
     */
    AudioPlayr.prototype.removeEventListeners = function (name, event) {
        var sound = this.library[name], events, i;
        if (!sound) {
            throw new Error("Unknown name given to removeEventListeners: '" + name + "'.");
        }
        if (!sound.addedEvents) {
            return;
        }
        events = sound.addedEvents[event];
        if (!events) {
            return;
        }
        for (i = 0; i < events.length; i += 1) {
            sound.removeEventListener(event, events[i]);
        }
        events.length = 0;
    };
    /**
     * Adds an event listener to a sound. If the sound doesn't exist or has
     * finished playing, it's called immediately.
     *
     * @param {String} name   The name of the sound.
     * @param {String} event   The name of the event, such as "onended".
     * @param {Function} callback   The Function to be called by the event.
     */
    AudioPlayr.prototype.addEventImmediate = function (name, event, callback) {
        if (!this.sounds.hasOwnProperty(name) || this.sounds[name].paused) {
            callback();
            return;
        }
        this.sounds[name].addEventListener(event, callback);
    };
    /* Private utilities
    */
    /**
     * Called when a sound has completed to get it out of sounds.
     *
     * @param {String} name   The name of the sound that just finished.
     */
    AudioPlayr.prototype.soundFinish = function (name) {
        if (this.sounds.hasOwnProperty(name)) {
            delete this.sounds[name];
        }
    };
    /**
     * Carefully stops a sound. HTMLAudioElement don't natively have a .stop()
     * function, so this is the shim to do that.
     */
    AudioPlayr.prototype.soundStop = function (sound) {
        sound.pause();
        if (sound.readyState) {
            sound.currentTime = 0;
        }
    };
    /* Private loading / resetting
    */
    /**
     * Loads every sound defined in the library via AJAX. Sounds are loaded
     * into <audio> elements via createAudio and stored in the library.
     */
    AudioPlayr.prototype.libraryLoad = function () {
        var section, name, sectionName, j;
        for (sectionName in this.library) {
            if (!this.library.hasOwnProperty(sectionName)) {
                continue;
            }
            section = this.library[sectionName];
            for (j in section) {
                if (!section.hasOwnProperty(j)) {
                    continue;
                }
                name = section[j];
                // Create the sound and store it in the container
                this.library[name] = this.createAudio(name, sectionName);
            }
        }
    };
    /**
     * Creates an audio element, gives it sources, and starts preloading.
     *
     * @param {String} name
     * @param {String} sectionName
     * @return {HTMLAudioElement}
     */
    AudioPlayr.prototype.createAudio = function (name, sectionName) {
        var sound = document.createElement("audio"), sourceType, child, i;
        for (i = 0; i < this.fileTypes.length; i += 1) {
            sourceType = this.fileTypes[i];
            child = document.createElement("source");
            child.type = "audio/" + sourceType;
            child.src = this.directory + "/" + sectionName + "/" + sourceType + "/" + name + "." + sourceType;
            sound.appendChild(child);
        }
        // This preloads the sound.
        sound.volume = 0;
        sound.setAttribute("volumeReal", "1");
        sound.setAttribute("used", "0");
        this.playSound(sound);
        return sound;
    };
    /**
     * Utility to try to play a sound, which may not be possible in headless
     * environments like PhantomJS.
     *
     * @param {HTMLAudioElement} sound
     * @return {Boolean} Whether the sound was able to play.
     */
    AudioPlayr.prototype.playSound = function (sound) {
        if (sound && sound.play) {
            sound.play();
            return true;
        }
        return false;
    };
    return AudioPlayr;
})();
;

/* GameStartr/ChangeLinr/ChangeLinr.js */
/**
 * ChangeLinr.js
 * A general utility for transforming raw input to processed output. This is
 * done by keeping an Array of transform Functions to process input on.
 * Outcomes for inputs are cached so repeat runs are O(1).
 * @example
 * // Creating and using a ChangeLinr to square numbers.
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *          "square": function (number) {
 *              return number * number;
 *          }
 *      },
 *     "pipeline": ["square"]
 * });
 * console.log(ChangeLiner.process(7), "Test"); // 49
 * console.log(ChangeLiner.getCached("Test")); // 49
 * @example
 * // Creating and using a ChangeLinr to calculate Fibonacci numbers.
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *         "fibonacci": function (number, key, attributes, ChangeLiner) {
 *             if (!number) {
 *                 return 0;
 *             } else if (number === 1) {
 *                 return 1;
 *             }
 *             return ChangeLiner.process(number - 1) + ChangeLiner.process(number - 2);
 *         }
 *     },
 *     "pipeline": ["fibonacci"]
 * });
 * console.log(ChangeLiner.process(7)); // 13
 * console.log(ChangeLiner.getCache()); // {0: 0, 1: 1, ... 6: 8, 7: 13}
 * @example
 * // Creating and using a ChangeLinr to lowercase a string, remove whitespace,
 * // and sum the character codes of the result.
 * var ChangeLiner = new ChangeLinr({
 *     "transforms": {
 *         "toLowerCase": function (string) {
 *             return string.toLowerCase();
 *         },
 *         "removeWhitespace": function (string) {
 *             return string.replace(/\s/g, '');
 *         },
 *         "sum": function (string) {
 *             var total = 0,
 *                 i;
 *             for (i = 0; i < string.length; i += 1) {
 *                 total += string.charCodeAt(i);
 *             }
 *             return total;
 *         }
 *     },
 *     "pipeline": ["toLowerCase", "removeWhitespace", "sum"]
 * });
 * console.log(ChangeLiner.process("Hello world!", "Test")); // 1117
 * console.log(ChangeLiner.getCached("Test")); // 1117
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var ChangeLinr = (function () {
    /**
     * Resets the ChangeLinr.
     * @constructor
     * @param {String[]} pipeline   The ordered pipeline of String names of the
     *                              transforms to call.
     * @param {Object} [transforms]   An Object containing Functions keyed by
     *                                their String name.
     * @param {Boolean} [doMakeCache]   Whether a cache should be constructed
     *                                  from inputs (defaults to true).
     * @param {Boolean} [doUseCache]   Whether the cache should be used to
     *                                 cache outputs (defaults to true).
     * @param {Boolean} [doUseGlobals]   Whether global Functions may be
     *                                   referenced by the pipeline Strings,
     *                                   rather than just ones in transforms
     *                                   (defaults to false).
     */
    function ChangeLinr(settings) {
        var i;
        if (typeof settings.pipeline === "undefined") {
            throw new Error("No pipeline given to ChangeLinr.");
        }
        this.pipeline = settings.pipeline || [];
        if (typeof settings.transforms === "undefined") {
            throw new Error("No transforms given to ChangeLinr.");
        }
        this.transforms = settings.transforms || {};
        this.doMakeCache = typeof settings.doMakeCache === "undefined" ? true : settings.doMakeCache;
        this.doUseCache = typeof settings.doUseCache === "undefined" ? true : settings.doUseCache;
        this.cache = {};
        this.cacheFull = {};
        for (i = 0; i < this.pipeline.length; ++i) {
            // Don't allow null/false transforms
            if (!this.pipeline[i]) {
                throw new Error("Pipe[" + i + "] is invalid.");
            }
            // Make sure each part of the pipeline exists
            if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                    throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") " + "not found in transforms.");
                }
            }
            // Also make sure each part of the pipeline is a Function
            if (!(this.transforms[this.pipeline[i]] instanceof Function)) {
                throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") " + "is not a valid Function from transforms.");
            }
            this.cacheFull[i] = this.cacheFull[this.pipeline[i]] = {};
        }
    }
    /* Simple gets
    */
    /**
     * @return {Object} The cached output of self.process and self.processFull.
     */
    ChangeLinr.prototype.getCache = function () {
        return this.cache;
    };
    /**
     * @param {String} key   The key under which the output was processed
     * @return {Mixed} The cached output filed under the given key.
     */
    ChangeLinr.prototype.getCached = function (key) {
        return this.cache[key];
    };
    /**
     * @return {Object} A complete listing of the cached outputs from all
     *                  processed information, from each pipeline transform.
     */
    ChangeLinr.prototype.getCacheFull = function () {
        return this.cacheFull;
    };
    /**
     * @return {Boolean} Whether the cache object is being kept.
     */
    ChangeLinr.prototype.getDoMakeCache = function () {
        return this.doMakeCache;
    };
    /**
     * @return {Boolean} Whether previously cached output is being used in new
     *                   process requests.
     */
    ChangeLinr.prototype.getDoUseCache = function () {
        return this.doUseCache;
    };
    /* Core processing
    */
    /**
     * Applies a series of transforms to input data. If doMakeCache is on, the
     * outputs of this are stored in cache and cacheFull.
     *
     * @param {Mixed} data   The data to be transformed.
     * @param {String} [key]   They key under which the data is to be stored.
     *                         If needed but not provided, defaults to data.
     * @param {Object} [attributes]   Any extra attributes to be given to the
     *                                transform Functions.
     * @return {Mixed} The final output of the pipeline.
     */
    ChangeLinr.prototype.process = function (data, key, attributes) {
        var i;
        if (typeof key === "undefined" && (this.doMakeCache || this.doUseCache)) {
            key = data;
        }
        // If this keyed input was already processed, get that
        if (this.doUseCache && this.cache.hasOwnProperty(key)) {
            return this.cache[key];
        }
        for (i = 0; i < this.pipeline.length; ++i) {
            data = this.transforms[this.pipeline[i]](data, key, attributes, self);
            if (this.doMakeCache) {
                this.cacheFull[this.pipeline[i]][key] = data;
            }
        }
        if (this.doMakeCache) {
            this.cache[key] = data;
        }
        return data;
    };
    /**
     * A version of self.process that returns the complete output from each
     * pipelined transform Function in an Object.
     *
     * @param {Mixed} data   The data to be transformed.
     * @param {String} [key]   They key under which the data is to be stored.
     *                         If needed but not provided, defaults to data.
     * @param {Object} [attributes]   Any extra attributes to be given to the
     *                                transform Functions.
     * @return {Object} The complete output of the transforms.
     */
    ChangeLinr.prototype.processFull = function (raw, key, attributes) {
        var output = {}, i;
        this.process(raw, key, attributes);
        for (i = 0; i < this.pipeline.length; ++i) {
            output[i] = output[this.pipeline[i]] = this.cacheFull[this.pipeline[i]][key];
        }
        return output;
    };
    return ChangeLinr;
})();
;

/* GameStartr/FPSAnalyzr/FPSAnalyzr.js */
/**
 * FPSAnalyzr.js
 *
 * A general utility for obtaining and analyzing framerate measurements. The
 * most recent measurements are kept up to a certain point (either an infinite
 * number or a set amount). Options for analyzing the data such as getting the
 * mean, median, extremes, etc. are available.
 *
 * @example
 * // Creating and using an FPSAnalyzr to measure setInterval accuracy.
 * var FPSAnalyzer = new FPSAnalyzr();
 * setInterval(FPSAnalyzer.measure.bind(FPSAnalyzer), 1000 / 30);
 * setTimeout(
 *     function () {
 *         console.log("Average FPS:", FPSAnalyzer.getAverage());
 *     },
 *     7000
 * );
 *
 * @example
 * // Creating and using an FPSAnalyzr to look at the 10 most recent FPS
 * // measurements and get the best & worst amounts.
 * var target = 1000 / 30,
 *     numKept = 10,
 *     FPSAnalyzer = new FPSAnalyzr({
 *         "maxKept": numKept
 *     }),
 *     i;
 *
 * for (i = 0; i < numKept; i += 1) {
 *     setTimeout(FPSAnalyzer.measure.bind(FPSAnalyzer), i * target);
 * }
 *
 * setTimeout(
 *     function () {
 *         console.log("Measurements:", FPSAnalyzer.getMeasurements());
 *         console.log("Extremes:", FPSAnalyzer.getExtremes());
 *         console.log("Range:", FPSAnalyzer.getRange());
 *     },
 *     numKept * i * target
 * );
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var FPSAnalyzr = (function () {
    /**
     * Resets the FPSAnalyzr.
     *
     * @constructor
     * @param {Number} [maxKept]   The maximum number of FPS measurements to
     *                             keep. This defaults to 35, and can be a
     *                             Number or Infinity otherwise.
     * @param [Function} getTimestamp   A function used to get an accurate
     *                                  timestamp. By default this is
     *                                  performance.now.
     */
    function FPSAnalyzr(settings) {
        if (settings === void 0) { settings = {}; }
        this.maxKept = settings.maxKept || 35;
        this.numRecorded = 0;
        this.ticker = -1;
        // If maxKept is a Number, make the measurements array that long
        // If it's infinite, make measurements an {} (infinite array)
        this.measurements = isFinite(this.maxKept) ? new Array(this.maxKept) : {};
        // Headless browsers like PhantomJS won't know performance, so Date.now
        // is used as a backup
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
    }
    /* Public interface
    */
    /**
     * Standard public measurement function.
     * Marks the current timestamp as timeCurrent, and adds an FPS measurement
     * if there was a previous timeCurrent.
     *
     * @param {DOMHighResTimeStamp} time   An optional timestamp, without which
     *                                     getTimestamp() is used instead.
     */
    FPSAnalyzr.prototype.measure = function (time) {
        if (time === void 0) { time = this.getTimestamp(); }
        if (this.timeCurrent) {
            this.addFPS(1000 / (time - this.timeCurrent));
        }
        this.timeCurrent = time;
    };
    /**
     * Adds an FPS measurement to measurements, and increments the associated
     * count variables.
     *
     * @param {Number} fps   An FPS calculated as the difference between two
     *                       timestamps.
     */
    FPSAnalyzr.prototype.addFPS = function (fps) {
        this.ticker = (this.ticker += 1) % this.maxKept;
        this.measurements[this.ticker] = fps;
        this.numRecorded += 1;
    };
    /* Gets
    */
    /**
     * @return {Number} The number of FPS measurements to keep.
     */
    FPSAnalyzr.prototype.getMaxKept = function () {
        return this.maxKept;
    };
    /**
     * @return {Number} The actual number of FPS measurements currently known.
     */
    FPSAnalyzr.prototype.getNumRecorded = function () {
        return this.numRecorded;
    };
    /**
     * @return {Number} The most recent performance.now timestamp.
     */
    FPSAnalyzr.prototype.getTimeCurrent = function () {
        return this.timeCurrent;
    };
    /**
     * @return {Number} The current position in measurements.
     */
    FPSAnalyzr.prototype.getTicker = function () {
        return this.ticker;
    };
    /**
     * Get function for a copy of the measurements listing (if the number of
     * measurements is less than the max, that size is used)
     *
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    measurements
     */
    FPSAnalyzr.prototype.getMeasurements = function () {
        var fpsKeptReal = Math.min(this.maxKept, this.numRecorded), copy, i;
        if (isFinite(this.maxKept)) {
            copy = new Array(fpsKeptReal);
        }
        else {
            copy = {};
            copy.length = fpsKeptReal;
        }
        for (i = fpsKeptReal - 1; i >= 0; --i) {
            copy[i] = this.measurements[i];
        }
        return copy;
    };
    /**
     * Get function for a copy of the measurements listing, but with the FPS
     * measurements transformed back into time differences
     *
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    time differences
     */
    FPSAnalyzr.prototype.getDifferences = function () {
        var copy = this.getMeasurements(), i;
        for (i = copy.length - 1; i >= 0; --i) {
            copy[i] = 1000 / copy[i];
        }
        return copy;
    };
    /**
     * @return {Number} The average recorded FPS measurement.
     */
    FPSAnalyzr.prototype.getAverage = function () {
        var total = 0, max = Math.min(this.maxKept, this.numRecorded), i;
        for (i = max - 1; i >= 0; --i) {
            total += this.measurements[i];
        }
        return total / max;
    };
    /**
     * @remarks This is O(n*log(n)), where n is the size of the history,
     *          as it creates a copy of the history and sorts it.
     * @return {Number} The median recorded FPS measurement.
     */
    FPSAnalyzr.prototype.getMedian = function () {
        var copy = this.getMeasurements().sort(), fpsKeptReal = copy.length, fpsKeptHalf = Math.floor(fpsKeptReal / 2);
        if (copy.length % 2 === 0) {
            return copy[fpsKeptHalf];
        }
        else {
            return (copy[fpsKeptHalf - 2] + copy[fpsKeptHalf]) / 2;
        }
    };
    /**
     * @return {Number[]} An Array containing the lowest and highest recorded
     *                    FPS measurements, in that order.
     */
    FPSAnalyzr.prototype.getExtremes = function () {
        var lowest = this.measurements[0], highest = lowest, max = Math.min(this.maxKept, this.numRecorded), fps, i;
        for (i = max - 1; i >= 0; --i) {
            fps = this.measurements[i];
            if (fps > highest) {
                highest = fps;
            }
            else if (fps < lowest) {
                lowest = fps;
            }
        }
        return [lowest, highest];
    };
    /**
     * @return {Number} The range of recorded FPS measurements
     */
    FPSAnalyzr.prototype.getRange = function () {
        var extremes = this.getExtremes();
        return extremes[1] - extremes[0];
    };
    return FPSAnalyzr;
})();
;

/* GameStartr/GamesRunnr/GamesRunnr.js */
/**
 * FPSAnalyzr.js
 *
 * A general utility for obtaining and analyzing framerate measurements. The
 * most recent measurements are kept up to a certain point (either an infinite
 * number or a set amount). Options for analyzing the data such as getting the
 * mean, median, extremes, etc. are available.
 *
 * @example
 * // Creating and using an FPSAnalyzr to measure setInterval accuracy.
 * var FPSAnalyzer = new FPSAnalyzr();
 * setInterval(FPSAnalyzer.measure.bind(FPSAnalyzer), 1000 / 30);
 * setTimeout(
 *     function () {
 *         console.log("Average FPS:", FPSAnalyzer.getAverage());
 *     },
 *     7000
 * );
 *
 * @example
 * // Creating and using an FPSAnalyzr to look at the 10 most recent FPS
 * // measurements and get the best & worst amounts.
 * var target = 1000 / 30,
 *     numKept = 10,
 *     FPSAnalyzer = new FPSAnalyzr({
 *         "maxKept": numKept
 *     }),
 *     i;
 *
 * for (i = 0; i < numKept; i += 1) {
 *     setTimeout(FPSAnalyzer.measure.bind(FPSAnalyzer), i * target);
 * }
 *
 * setTimeout(
 *     function () {
 *         console.log("Measurements:", FPSAnalyzer.getMeasurements());
 *         console.log("Extremes:", FPSAnalyzer.getExtremes());
 *         console.log("Range:", FPSAnalyzer.getRange());
 *     },
 *     numKept * i * target
 * );
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var FPSAnalyzr = (function () {
    /**
     * Resets the FPSAnalyzr.
     *
     * @constructor
     * @param {Number} [maxKept]   The maximum number of FPS measurements to
     *                             keep. This defaults to 35, and can be a
     *                             Number or Infinity otherwise.
     * @param [Function} getTimestamp   A function used to get an accurate
     *                                  timestamp. By default this is
     *                                  performance.now.
     */
    function FPSAnalyzr(settings) {
        if (settings === void 0) { settings = {}; }
        this.maxKept = settings.maxKept || 35;
        this.numRecorded = 0;
        this.ticker = -1;
        // If maxKept is a Number, make the measurements array that long
        // If it's infinite, make measurements an {} (infinite array)
        this.measurements = isFinite(this.maxKept) ? new Array(this.maxKept) : {};
        // Headless browsers like PhantomJS won't know performance, so Date.now
        // is used as a backup
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
    }
    /* Public interface
    */
    /**
     * Standard public measurement function.
     * Marks the current timestamp as timeCurrent, and adds an FPS measurement
     * if there was a previous timeCurrent.
     *
     * @param {DOMHighResTimeStamp} time   An optional timestamp, without which
     *                                     getTimestamp() is used instead.
     */
    FPSAnalyzr.prototype.measure = function (time) {
        if (time === void 0) { time = this.getTimestamp(); }
        if (this.timeCurrent) {
            this.addFPS(1000 / (time - this.timeCurrent));
        }
        this.timeCurrent = time;
    };
    /**
     * Adds an FPS measurement to measurements, and increments the associated
     * count variables.
     *
     * @param {Number} fps   An FPS calculated as the difference between two
     *                       timestamps.
     */
    FPSAnalyzr.prototype.addFPS = function (fps) {
        this.ticker = (this.ticker += 1) % this.maxKept;
        this.measurements[this.ticker] = fps;
        this.numRecorded += 1;
    };
    /* Gets
    */
    /**
     * @return {Number} The number of FPS measurements to keep.
     */
    FPSAnalyzr.prototype.getMaxKept = function () {
        return this.maxKept;
    };
    /**
     * @return {Number} The actual number of FPS measurements currently known.
     */
    FPSAnalyzr.prototype.getNumRecorded = function () {
        return this.numRecorded;
    };
    /**
     * @return {Number} The most recent performance.now timestamp.
     */
    FPSAnalyzr.prototype.getTimeCurrent = function () {
        return this.timeCurrent;
    };
    /**
     * @return {Number} The current position in measurements.
     */
    FPSAnalyzr.prototype.getTicker = function () {
        return this.ticker;
    };
    /**
     * Get function for a copy of the measurements listing (if the number of
     * measurements is less than the max, that size is used)
     *
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    measurements
     */
    FPSAnalyzr.prototype.getMeasurements = function () {
        var fpsKeptReal = Math.min(this.maxKept, this.numRecorded), copy, i;
        if (isFinite(this.maxKept)) {
            copy = new Array(fpsKeptReal);
        }
        else {
            copy = {};
            copy.length = fpsKeptReal;
        }
        for (i = fpsKeptReal - 1; i >= 0; --i) {
            copy[i] = this.measurements[i];
        }
        return copy;
    };
    /**
     * Get function for a copy of the measurements listing, but with the FPS
     * measurements transformed back into time differences
     *
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    time differences
     */
    FPSAnalyzr.prototype.getDifferences = function () {
        var copy = this.getMeasurements(), i;
        for (i = copy.length - 1; i >= 0; --i) {
            copy[i] = 1000 / copy[i];
        }
        return copy;
    };
    /**
     * @return {Number} The average recorded FPS measurement.
     */
    FPSAnalyzr.prototype.getAverage = function () {
        var total = 0, max = Math.min(this.maxKept, this.numRecorded), i;
        for (i = max - 1; i >= 0; --i) {
            total += this.measurements[i];
        }
        return total / max;
    };
    /**
     * @remarks This is O(n*log(n)), where n is the size of the history,
     *          as it creates a copy of the history and sorts it.
     * @return {Number} The median recorded FPS measurement.
     */
    FPSAnalyzr.prototype.getMedian = function () {
        var copy = this.getMeasurements().sort(), fpsKeptReal = copy.length, fpsKeptHalf = Math.floor(fpsKeptReal / 2);
        if (copy.length % 2 === 0) {
            return copy[fpsKeptHalf];
        }
        else {
            return (copy[fpsKeptHalf - 2] + copy[fpsKeptHalf]) / 2;
        }
    };
    /**
     * @return {Number[]} An Array containing the lowest and highest recorded
     *                    FPS measurements, in that order.
     */
    FPSAnalyzr.prototype.getExtremes = function () {
        var lowest = this.measurements[0], highest = lowest, max = Math.min(this.maxKept, this.numRecorded), fps, i;
        for (i = max - 1; i >= 0; --i) {
            fps = this.measurements[i];
            if (fps > highest) {
                highest = fps;
            }
            else if (fps < lowest) {
                lowest = fps;
            }
        }
        return [lowest, highest];
    };
    /**
     * @return {Number} The range of recorded FPS measurements
     */
    FPSAnalyzr.prototype.getRange = function () {
        var extremes = this.getExtremes();
        return extremes[1] - extremes[0];
    };
    return FPSAnalyzr;
})();
/// <reference path="External/FPSAnalyzr/FPSAnalyzr-0.2.0.ts" />
/**
 * GamesRunnr
 * A class to continuously series of "game" Functions. Each game is run in a
 * set order and the group is run as a whole at a particular interval, with a
 * configurable speed. Playback can be triggered manually, or driven by a timer
 * with pause and play hooks. For automated playback, statistics are
 * available via an internal FPSAnalyzer.
 * @example
 * // Creating and using a GamesRunnr to print the screen size every second.
 * var GamesRunner = new GamesRunnr({
 *     "interval": 1000,
 *     "games": [
 *         function () {
 *             console.log("Screen size: " + innerWidth + "x" + innerHeight);
 *         }
 *     ]
 * });
 * GamesRunner.play();
 * @example
 * // Creating and using a GamesRunnr to remove the first member of an Array
 * // and output the remaining members every second until only one is left.
 * var numbers = ['a', 'b', 'c', 'd'],
 *     GamesRunner = new GamesRunnr({
 *         "interval": 1000,
 *         "games": [
 *             numbers.pop.bind(numbers),
 *             console.log.bind(console, numbers),
 *             function () {
 *                 if (numbers.length === 1) {
 *                     GamesRunner.pause();
 *                     console.log("All done!");
 *                 }
 *             }
 *         ]
 *
 *     });
 * GamesRunner.play();
 * // After 1 second:  ['a', 'b', 'c']
 * // After 2 seconds: ['a', 'b']
 * // After 3 seconds: ['a']
 * //                  "All done!"
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var GamesRunnr = (function () {
    /**
     * Resets the GamesRunnr.
     *
     * @param {IGamesRunnrSettings} settings
     */
    function GamesRunnr(settings) {
        var i;
        if (typeof settings.games === "undefined") {
            throw new Error("No games given to GamesRunnr.");
        }
        this.games = settings.games;
        this.interval = settings.interval || 1000 / 60;
        this.speed = settings.speed || 1;
        this.onPause = settings.onPause;
        this.onPlay = settings.onPlay;
        this.callbackArguments = settings.callbackArguments || [this];
        this.FPSAnalyzer = settings.FPSAnalyzer || new FPSAnalyzr();
        this.adjustFramerate = settings.adjustFramerate;
        this.scope = settings.scope || this;
        this.paused = true;
        this.upkeepScheduler = settings.upkeepScheduler || function (handler, timeout) {
            return setTimeout(handler, timeout);
        };
        this.upkeepCanceller = settings.upkeepCanceller || function (handle) {
            clearTimeout(handle);
        };
        this.upkeepBound = this.upkeep.bind(this);
        for (i = 0; i < this.games.length; i += 1) {
            this.games[i] = this.games[i].bind(this.scope);
        }
        this.setIntervalReal();
    }
    /* Gets
    */
    /**
     * @return {FPSAnalyzer} The FPSAnalyzer used in the GamesRunnr.
     */
    GamesRunnr.prototype.getFPSAnalyzer = function () {
        return this.FPSAnalyzer;
    };
    /**
     * @return {Boolean} Whether this is paused.
     */
    GamesRunnr.prototype.getPaused = function () {
        return this.paused;
    };
    /**
     * @return {Function[]} The Array of game Functions.
     */
    GamesRunnr.prototype.getGames = function () {
        return this.games;
    };
    /**
     * @return {Number} The interval between upkeeps.
     */
    GamesRunnr.prototype.getInterval = function () {
        return this.interval;
    };
    /**
     * @return {Number} The speed multiplier being applied to the interval.
     */
    GamesRunnr.prototype.getSpeed = function () {
        return this.speed;
    };
    /**
     * @return {Function} The optional trigger to be called on pause.
     */
    GamesRunnr.prototype.getOnPause = function () {
        return this.onPause;
    };
    /**
     * @return {Function} The optional trigger to be called on play.
     */
    GamesRunnr.prototype.getOnPlay = function () {
        return this.onPlay;
    };
    /**
     * @return {Array} Arguments to be given to the optional trigger Functions.
     */
    GamesRunnr.prototype.getCallbackArguments = function () {
        return this.callbackArguments;
    };
    /**
     * @return {Function} Function used to schedule the next upkeep.
     */
    GamesRunnr.prototype.getUpkeepScheduler = function () {
        return this.upkeepScheduler;
    };
    /**
     * @return {Function} Function used to cancel the next upkeep.
     */
    GamesRunnr.prototype.getUpkeepCanceller = function () {
        return this.upkeepCanceller;
    };
    /* Runtime
    */
    /**
     * Meaty function, run every <interval*speed> milliseconds, to mark an FPS
     * measurement and run every game once.
     */
    GamesRunnr.prototype.upkeep = function () {
        if (this.paused) {
            return;
        }
        // Prevents double upkeeping, in case a new upkeepNext was scheduled.
        this.upkeepCanceller(this.upkeepNext);
        if (this.adjustFramerate) {
            this.upkeepNext = this.upkeepScheduler(this.upkeepBound, this.intervalReal - (this.upkeepTimed() | 0));
        }
        else {
            this.upkeepNext = this.upkeepScheduler(this.upkeepBound, this.intervalReal);
            this.games.forEach(this.run);
        }
        this.FPSAnalyzer.measure();
    };
    /**
     * A utility for this.upkeep that calls the same games.forEach(run), timing
     * the total execution time.
     *
     * @return {Number} The total time spent, in milliseconds.
     */
    GamesRunnr.prototype.upkeepTimed = function () {
        var now = this.FPSAnalyzer.getTimestamp();
        this.games.forEach(this.run);
        return this.FPSAnalyzer.getTimestamp() - now;
    };
    /**
     * Continues execution of this.upkeep by calling it. If an onPlay has been
     * defined, it's called before.
     */
    GamesRunnr.prototype.play = function () {
        if (!this.paused) {
            return;
        }
        this.paused = false;
        if (this.onPlay) {
            this.onPlay(this);
        }
        this.upkeep();
    };
    /**
     * Stops execution of this.upkeep, and cancels the next call. If an onPause
     * has been defined, it's called after.
     */
    GamesRunnr.prototype.pause = function () {
        if (this.paused) {
            return;
        }
        this.paused = true;
        if (this.onPause) {
            this.onPause(this);
        }
        this.upkeepCanceller(this.upkeep);
    };
    /**
     * Calls upkeep a <num or 1> number of times, immediately.
     *
     * @param {Number} [num]   How many times to upkeep, if not 1.
     */
    GamesRunnr.prototype.step = function (times) {
        this.play();
        this.pause();
        if (times > 0) {
            this.step(times - 1);
        }
    };
    /**
     * Toggles whether this is paused, and calls the appropriate Function.
     */
    GamesRunnr.prototype.togglePause = function () {
        this.paused ? this.play() : this.pause();
    };
    /* Games manipulations
    */
    /**
     * Sets the interval between between upkeeps.
     *
     * @param {Number} The new time interval in milliseconds.
     */
    GamesRunnr.prototype.setInterval = function (interval) {
        var intervalReal = Number(interval);
        if (isNaN(intervalReal)) {
            throw new Error("Invalid interval given to setInterval: " + interval);
        }
        this.interval = intervalReal;
        this.setIntervalReal();
    };
    /**
     * Sets the speed multiplier for the interval.
     *
     * @param {Number} The new speed multiplier. 2 will cause interval to be
     *                 twice as fast, and 0.5 will be half as fast.
     */
    GamesRunnr.prototype.setSpeed = function (speed) {
        var speedReal = Number(speed);
        if (isNaN(speedReal)) {
            throw new Error("Invalid speed given to setSpeed: " + speed);
        }
        this.speed = speedReal;
        this.setIntervalReal();
    };
    /* Utilities
    */
    /**
     * Sets the intervalReal variable, which is interval * (inverse of speed).
     */
    GamesRunnr.prototype.setIntervalReal = function () {
        this.intervalReal = (1 / this.speed) * this.interval;
    };
    /**
     * Curry function to fun a given function. Used in games.forEach(game).
     *
     * @param {Function} game
     */
    GamesRunnr.prototype.run = function (game) {
        game();
    };
    return GamesRunnr;
})();
;

/* GameStartr/GroupHoldr/GroupHoldr.js */
/**
 * GroupHoldr.js
 *
 * A general utility to keep Arrays and/or Objects by key names within a
 * container so they can be referenced automatically by those keys. Automation
 * is made easier by more abstraction, such as by automatically generated add,
 * remove, etc. methods.
 *
 * @example
 * // Creating and using a GroupHoldr to store populations of locations.
 * var GroupHolder = new GroupHoldr({
 *     "groupNames": ["Country", "State"],
 *     "groupTypes": "Object"
 * });
 *
 * GroupHolder.addCountry("United States", 316130000);
 * GroupHolder.addCountry("Canada", 35160000);
 * GroupHolder.addState("New York", 19650000);
 *
 * console.log(GroupHolder.getCountry("United States")); // 316,130,000
 *
 * @example
 * // Creating and using a GroupHoldr to hold people by their age group.
 * var GroupHolder = new GroupHoldr({
 *     "groupNames": ["Child", "Adult"],
 *     "groupTypes": "Array"
 * });
 *
 * GroupHolder.addChild("Alex");
 * GroupHolder.addChild("Bob");
 * GroupHolder.getGroup("Adult").push("Carol");
 * GroupHolder.getGroups().Adult.push("Devin");
 *
 * console.log(GroupHolder.getAdultGroup()); // ["Carol", "Devin"]
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
var GroupHoldr = (function () {
    /**
     * Resets the GroupHoldr.
     *
     * @constructor
     * @param {IGroupHoldrSettings} settings
     */
    function GroupHoldr(settings) {
        if (typeof settings === "undefined") {
            throw new Error("No settings given to GroupHoldr.");
        }
        if (typeof settings.groupNames === "undefined") {
            throw new Error("No groupNames given to GroupHoldr.");
        }
        if (typeof settings.groupTypes === "undefined") {
            throw new Error("No groupTypes given to GroupHoldr.");
        }
        // These functions containers are filled in setGroupNames 
        this.functions = {
            "setGroup": {},
            "getGroup": {},
            "set": {},
            "get": {},
            "add": {},
            "delete": {}
        };
        this.setGroupNames(settings.groupNames, settings.groupTypes);
    }
    /* Simple gets
    */
    /**
     * @return {Object} The Object with Object<Function>s for each action
     *                  available on groups.
     */
    GroupHoldr.prototype.getFunctions = function () {
        return this.functions;
    };
    /**
     * @return {Object} The Object storing each of the internal groups.
     */
    GroupHoldr.prototype.getGroups = function () {
        return this.groups;
    };
    /**
     * @param {String} name
     * @return {Mixed} The group of the given name.
     */
    GroupHoldr.prototype.getGroup = function (name) {
        return this.groups[name];
    };
    /**
     * @return {String[]} An Array containing each of the group names.
     */
    GroupHoldr.prototype.getGroupNames = function () {
        return this.groupNames;
    };
    /* Group/ordering manipulators
    */
    /**
     * Deletes a given object from a group by calling Array.splice on
     * the result of Array.indexOf
     *
     * @param {String} groupName   The string name of the group to delete an
     *                              object from.
     * @param {Mixed} value   The object to be deleted from the group.
     */
    GroupHoldr.prototype.deleteObject = function (groupName, value) {
        this.groups[groupName].splice(this.groups[groupName].indexOf(value), 1);
    };
    /**
     * Deletes a given index from a group by calling Array.splice.
     *
     * @param {String} groupName   The string name of the group to delete an
     *                              object from.
     * @param {Number} index   The index to be deleted from the group.
     * @param {Number} [max]   How many elements to delete after that index (if
     *                         falsy, just the first 1).
     */
    GroupHoldr.prototype.deleteIndex = function (groupName, index, max) {
        if (max === void 0) { max = 1; }
        this.groups[groupName].splice(index, max);
    };
    /**
     * Switches an object from groupOld to groupNew by removing it from the
     * old group and adding it to the new. If the new group uses an associative
     * array, a key should be passed in (which defaults to undefined).
     *
     * @param {Mixed} value   The value to be moved from one group to another.
     * @param {String} groupOld   The string name of the value's old group.
     * @param {String} groupNew   The string name of the value's new group.
     * @param {String} [keyNew]   A key for the value to be placed in the new
     *                             group, required only if the group contains an
     *                             associative array.
     */
    GroupHoldr.prototype.switchObjectGroup = function (value, groupOld, groupNew, keyNew) {
        if (keyNew === void 0) { keyNew = undefined; }
        this.deleteObject(groupOld, value);
        this.functions.add[groupNew](value, keyNew);
    };
    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed in an array after scope and func, as in
     * Function.apply's standard.
     *
     * @param {Mixed} scope   An optional scope to call this from (if falsy,
     *                        defaults to this).
     * @param {Function} func   A function to apply to each group.
     * @param {Array} [args]   An optional array of arguments to pass to the
     *                         function after each group.
     */
    GroupHoldr.prototype.applyAll = function (scope, func, args) {
        if (args === void 0) { args = undefined; }
        var i;
        if (!args) {
            args = [undefined];
        }
        else {
            args.unshift(undefined);
        }
        if (!scope) {
            scope = this;
        }
        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            args[0] = this.groups[this.groupNames[i]];
            func.apply(scope, args);
        }
        args.shift();
    };
    /**
     * Calls a function for each member of each group. Extra arguments may be
     * passed in an array after scope and func, as in Function.apply's standard.
     *
     * @param {Mixed} scope   An optional scope to call this from (if falsy,
     *                        defaults to this).
     * @param {Function} func   A function to apply to each group.
     * @param {Array} [args]   An optional array of arguments to pass to the
     *                         function after each group.
     */
    GroupHoldr.prototype.applyOnAll = function (scope, func, args) {
        if (args === void 0) { args = undefined; }
        var group, i, j;
        if (!args) {
            args = [undefined];
        }
        else {
            args.unshift(undefined);
        }
        if (!scope) {
            scope = this;
        }
        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            group = this.groups[this.groupNames[i]];
            if (group instanceof Array) {
                for (j = 0; j < group.length; j += 1) {
                    args[0] = group[j];
                    func.apply(scope, args);
                }
            }
            else {
                for (j in group) {
                    if (group.hasOwnProperty(j)) {
                        args[0] = group[j];
                        func.apply(scope, args);
                    }
                }
            }
        }
    };
    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed after scope and func natively, as in
     * Function.call's standard.
     *
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy,
     *                          defaults to this).
     * @param {Function} func   A function to apply to each group.
     */
    GroupHoldr.prototype.callAll = function (scope, func) {
        var args = Array.prototype.slice.call(arguments, 1), i;
        if (!scope) {
            scope = this;
        }
        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            args[0] = this.groups[this.groupNames[i]];
            func.apply(scope, args);
        }
    };
    /**
     * Calls a function for each member of each group. Extra arguments may be
     * passed after scope and func natively, as in Function.call's standard.
     *
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy,
     *                          defaults to this).
     * @param {Function} func   A function to apply to each group member.
     */
    GroupHoldr.prototype.callOnAll = function (scope, func) {
        var args = Array.prototype.slice.call(arguments, 1), group, i, j;
        if (!scope) {
            scope = this;
        }
        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            group = this.groups[this.groupNames[i]];
            if (group instanceof Array) {
                for (j = 0; j < group.length; j += 1) {
                    args[0] = group[j];
                    func.apply(scope, args);
                }
            }
            else {
                for (j in group) {
                    if (group.hasOwnProperty(j)) {
                        args[0] = group[j];
                        func.apply(scope, args);
                    }
                }
            }
        }
    };
    /**
     * Clears each Array by setting its length to 0.
     */
    GroupHoldr.prototype.clearArrays = function () {
        var group, i;
        for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
            group = this.groups[this.groupNames[i]];
            if (group instanceof Array) {
                group.length = 0;
            }
        }
    };
    /* Core setup logic
    */
    /**
     * Meaty function to reset, given an array of names an object of types
     * Any pre-existing functions are cleared, and new ones are added as
     * member objects and to {functions}.
     *
     * @param {String[]} names   An array of names of groupings to be made
     * @param {Mixed} types   An associative array of the function types of
     *                        the names given in names. This may also be taken
     *                        in as a String, to be converted to an Object.
     */
    GroupHoldr.prototype.setGroupNames = function (names, types) {
        var scope = this, typeFunc, typeName;
        if (!(names instanceof Array)) {
            throw new Error("groupNames is not an Array");
        }
        // If there already were group names, clear them
        if (this.groupNames) {
            this.clearFunctions();
        }
        // Reset the group types and type names, to be filled next
        this.groupNames = names;
        this.groupTypes = {};
        this.groupTypeNames = {};
        // If groupTypes is an object, set custom group types for everything
        if (types.constructor === Object) {
            this.groupNames.forEach(function (name) {
                scope.groupTypes[name] = scope.getTypeFunction(types[name]);
                scope.groupTypeNames[name] = scope.getTypeName(types[name]);
            });
        }
        else {
            // Otherwise assume everything uses the same one, such as from a String
            typeFunc = this.getTypeFunction(types);
            typeName = this.getTypeName(types);
            this.groupNames.forEach(function (name) {
                scope.groupTypes[name] = typeFunc;
                scope.groupTypeNames[name] = typeName;
            });
        }
        // Create the containers, and set the modifying functions
        this.setGroups();
        this.setFunctions();
    };
    /**
     * Removes any pre-existing "set", "get", etc. functions.
     */
    GroupHoldr.prototype.clearFunctions = function () {
        this.groupNames.forEach(function (name) {
            // Delete member variable functions
            delete this["set" + name + "Group"];
            delete this["get" + name + "Group"];
            delete this["set" + name];
            delete this["get" + name];
            delete this["add" + name];
            delete this["delete" + name];
            // Delete functions under .functions by making each type a new {}
            this.functions.setGroup = {};
            this.functions.getGroup = {};
            this.functions.set = {};
            this.functions.get = {};
            this.functions.add = {};
            this.functions.delete = {};
        });
    };
    /**
     * Resets groups to an empty object, and fills it with a new groupType for
     * each name in groupNames
     */
    GroupHoldr.prototype.setGroups = function () {
        var scope = this;
        this.groups = {};
        this.groupNames.forEach(function (name) {
            scope.groups[name] = new scope.groupTypes[name]();
        });
    };
    /**
     * Calls the function setters for each name in groupNames
     * @remarks Those are: createFunction<XYZ>: "Set", "Get", "Add", "Del"
     */
    GroupHoldr.prototype.setFunctions = function () {
        var scope = this;
        this.groupNames.forEach(function (name) {
            scope.createFunctionSetGroup(name);
            scope.createFunctionGetGroup(name);
            scope.createFunctionSet(name);
            scope.createFunctionGet(name);
            scope.createFunctionAdd(name);
            scope.createFunctionDelete(name);
        });
    };
    /* Function generators
    */
    /**
     * Creates a getGroup function under this and functions.getGroup.
     *
     * @param {String} name   The name of the group, from groupNames.
     */
    GroupHoldr.prototype.createFunctionGetGroup = function (name) {
        var scope = this;
        /**
         * @param {String} key   The String key that references the group.
         * @return {Mixed}   The group referenced by the given key.
         */
        this.functions.getGroup[name] = this["get" + name + "Group"] = function () {
            return scope.groups[name];
        };
    };
    /**
     * Creates a setGroup function under this and functions.setGroup.
     *
     * @param {String} name   The name of the group, from groupNames.
     */
    GroupHoldr.prototype.createFunctionSetGroup = function (name) {
        var scope = this;
        /**
         * Sets the value of the group referenced by the name.
         *
         * @param {Mixed} value   The new value for the group, which should be
         *                        the same type as the group (Array or Object).
         */
        this.functions.setGroup[name] = this["set" + name + "Group"] = function (value) {
            scope.groups[name] = value;
        };
    };
    /**
     * Creates a set function under this and functions.set.
     *
     * @param {String} name   The name of the group, from groupNames.
     */
    GroupHoldr.prototype.createFunctionSet = function (name) {
        /**
         * Sets a value contained within the group.
         *
         * @param {Mixed} key   The key referencing the value to obtain. This
         *                      should be a Number if the group is an Array, or
         *                      a String if the group is an Object.
         * @param {Mixed} value
         */
        this.functions.set[name] = this["set" + name] = function (key, value) {
            this.groups[name][key] = value;
        };
    };
    /**
     * Creates a get<type> function under this and functions.get
     *
     * @param {String} name   The name of the group, from groupNames
     */
    GroupHoldr.prototype.createFunctionGet = function (name) {
        /**
         * Gets the value within a group referenced by the given key.
         *
         * @param {Mixed} key   The key referencing the value to obtain. This
         *                      should be a Number if the group is an Array, or
         *                      a String if the group is an Object.
         * @return {Mixed} value
         */
        this.functions.get[name] = this["get" + name] = function (key) {
            return this.groups[name][key];
        };
    };
    /**
     * Creates an add function under this and functions.add.
     *
     * @param {String} name   The name of the group, from groupNames
     */
    GroupHoldr.prototype.createFunctionAdd = function (name) {
        var group = this.groups[name];
        if (this.groupTypes[name] === Object) {
            /**
             * Adds a value to the group, referenced by the given key.
             *
             * @param {String} key   The String key to reference the value to be
             *                       added.
             * @param value
             */
            this.functions.add[name] = this["add" + name] = function (key, value) {
                group[key] = value;
            };
        }
        else {
            /**
             * Adds a value to the group, referenced by the given key.
             *
             * @param {String} value
             */
            this.functions.add[name] = this["add" + name] = function (value) {
                group.push(value);
            };
        }
    };
    /**
     * Creates a del (delete) function under this and functions.delete.
     *
     * @param {String} name   The name of the group, from groupNames
     */
    GroupHoldr.prototype.createFunctionDelete = function (name) {
        var group = this.groups[name];
        if (this.groupTypes[name] === Object) {
            /**
             * Deletes a value from the group, referenced by the given key.
             *
             * @param {String} key   The String key to reference the value to be
             *                       deleted.
             */
            this.functions.delete[name] = this["delete" + name] = function (key) {
                delete group[key];
            };
        }
        else {
            /**
             * Deletes a value from the group, referenced by the given key.
             *
             * @param {Number} key   The String key to reference the value to be
             *                       deleted.
             */
            this.functions.delete[name] = this["delete" + name] = function (key) {
                group.splice(group.indexOf(key), 1);
            };
        }
    };
    /* Utilities
    */
    /**
     * Returns the name of a type specified by a string ("Array" or "Object").
     *
     * @param {String} str   The name of the type. If falsy, defaults to Array
     * @return {String}
     * @remarks The type is determined by the str[0]; if it exists and is "o",
     *          the outcome is "Object", otherwise it's "Array".
     */
    GroupHoldr.prototype.getTypeName = function (str) {
        if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
            return "Object";
        }
        return "Array";
    };
    /**
     * Returns function specified by a string (Array or Object).
     *
     * @param {String} str   The name of the type. If falsy, defaults to Array
     * @return {Function}
     * @remarks The type is determined by the str[0]; if it exists and is "o",
     *          the outcome is Object, otherwise it's Array.
     */
    GroupHoldr.prototype.getTypeFunction = function (str) {
        if (str && str.charAt && str.charAt(0).toLowerCase() === "o") {
            return Object;
        }
        return Array;
    };
    return GroupHoldr;
})();
;
