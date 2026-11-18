/* Source: https://github.com/zveronline/mario (CC BY-NC-SA) */
/* settings/editor.js */
(function (things, macros) {
    FullScreenMario.prototype.settings.editor = {
        "blocksize": FullScreenMario.unitsize * 4,
        "mapDefault": {
            "name": "New Map",
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "creation": [
                        { "macro": "Floor", "x": 0, "y": 0, "width": 128 }
                    ]
                }
            ]
        },
        "mapSettingDefault": "Overworld",
        "mapEntryDefault": "Plain",
        "things": things,
        "thingGroups": ["Text", "Character", "Solid", "Scenery"],
        "thingKeys": (function () {
            var keys = [];
            Object.keys(things).forEach(function (group) {
                keys.push.apply(keys, Object.keys(things[group]));
            });
            return keys;
        })(),
        "macros": macros
    };
    
})({
    "Characters": {
        "Goomba": undefined,
        "Koopa": {
            "smart": "Boolean",
            "jumping": "Boolean",
            "flying": "Boolean"
        },
        "Beetle": undefined,
        "Piranha": {
            "evil": "Boolean"
        },
        "Blooper": undefined,
        "CheepCheep": {
            "smart": "Boolean"
        },
        "Podoboo": undefined,
        "Lakitu": undefined,
        "HammerBro": undefined,
        "Bowser": {
            "contents": {
                "type": "String",
                "options": [
                    "Gooma", "Koopa", "HammerBro", "Bowser"
                ]
            }
        }
    },
    "Items": {
        "Mushroom": undefined,
        "Mushroom1Up": undefined,
        "MushroomDeathly": undefined,
        "FireFlower": undefined,
        "Star": undefined,
        "Shell": {
            "smart": "Boolean"
        },
        "BeetleShell": undefined,
        "Coin": undefined
    },
    "Solids": {
        "Block": {
            "contents": {
                "type": "String",
                "options": [
                    "Coin", "Mushroom", "Star", "Mushroom1Up", "MushroomDeathly"
                ]
            },
            "hidden": "Boolean"
        },
        "Brick": {
            "contents": {
                "type": "String",
                "options": [
                    "", "Coin", "Mushroom", "Star", "Mushroom1Up", "MushroomDeathly"
                ]
            }
        },
        "Pipe": {
            "height": {
                "type": "Number",
                "value": 8,
                "mod": 8,
                "Infinite": true
            }
        },
        "PipeHorizontal": {
            "width": {
                "type": "Number",
                "value": 2,
                "mod": 8
            },
            "transport": "Location"
        },
        "PipeVertical": {
            "height": {
                "type": "Number",
                "value": 2,
                "mod": 8,
                "Infinite": true
            },
            "transport": "Location"
        },
        "Platform": {
            "width": 2
        },
        "Stone": {
            "width": 1,
            "height": {
                "type": "Number",
                "value": 1,
                "Infinite": true
            }
        },
        "Cannon": {
            "height": 1
        },
        "Springboard": undefined,
        "Floor": {
            "width": 8,
            "height": {
                "type": "Number",
                "value": Infinity,
                "Infinite": true
            }
        },
        "CastleBlock": {
            "fireballs": {
                "value": 0,
                "mod": 4
            }
        },
        "CastleBridge": {
            "width": 8
        },
        "Coral": {
            "width": 8,
            "height": 8
        }
    },
    "Scenery": {
        "BrickPlain": undefined,
        "Bush1": undefined,
        "Bush2": undefined,
        "Bush3": undefined,
        "Cloud1": undefined,
        "Cloud2": undefined,
        "Cloud3": undefined,
        "Fence": {
            "width": 8
        },
        "HillSmall": undefined,
        "HillLarge": undefined,
        "PlantSmall": undefined,
        "PlantLarge": undefined,
        "Railing": undefined,
        "Water": undefined
    }
}, {
    "Fill": {
        "description": "Place a bunch of Things at once, as a grid.",
        "options": {
            "thing": "Everything",
            "xnum": 1,
            "ynum": 1,
            "xwidth": 8,
            "ywidth": 8
        }
    },
    "Pattern": {
        "description": "Fill one of the preset Scenery background patterns.",
        "options": {
            "Pattern": [
                "BackRegular", "BackCloud", "BackFence", "BackFenceMin", "BackFenceMin2", "BackFenceMin3"
            ],
            "repeat": "Number"
        }
    },
    "Floor": {
        "description": "Place a floor of infinite height.",
        "options": {
            "width": {
                "type": "Number",
                "value": 8,
                "mod": 4
            }
        }
    },
    "Pipe": {
        "description": "Add a pipe with the option for piranhas and moving to locations.",
        "options": {
            "height": 8,
            "piranha": "Boolean",
            "transport": "Location",
            "entrance": "Location"
        }
    },
    "Tree": {
        "description": "Add a tree to the map.",
        "options": {
            "width": {
                "type": "Number",
                "value": 4,
                "mod": 8
            }
        }
    },
    "Shroom": {
        "function": "macroShroom",
        "description": "Add a mushroom tree to the map.",
        "options": {
            "width": {
                "type": "Number",
                "value": 4,
                "mod": 8
            }
        }
    },
    "Scale": {
        "function": "macroScale",
        "description": "Add two platforms suspended by string to the map.",
        "options": {
            "widthLeft": {
                "type": "Number",
                "value": 6,
                "mod": 4
            },
            "widthRight": {
                "type": "Number",
                "value": 6,
                "mod": 4
            },
            "between": {
                "type": "Number",
                "value": 10,
                "mod": 4
            },
            "dropLeft": {
                "type": "Number",
                "value": 6,
                "mod": 4
            },
            "dropRight": {
                "type": "Number",
                "value": 6,
                "mod": 4
            },
        }
    },
    "Water": {
        "function": "macroWater",
        "description": "Fill water of infinite height.",
        "options": {
            "width": 4
        }
    },
    "CastleSmall": {
        "description": "Add a one-story castle to the map."
    },
    "CastleLarge": {
        "description": "Add a two-story castle to the map."
    },
    "Ceiling": {
        "description": "Add an Underworld-style ceiling of Bricks.",
        "options": {
            "width": "Number"
        }
    },
    "Bridge": {
        "description": "Create a bridge, complete with stone columns.",
        "options": {
            "width": 8,
            "start": "Boolean",
            "end": "Boolean"
        }
    },
    "PlatformGenerator": {
        "description": "Add a columnn of infinitely generated platforms.",
        "options": {
            "width": 8
        }
    },
    "StartInsideCastle": {
        "description": "Add the castle stones similar to typical Castles.",
        "options": {
            "width": 8
        }
    },
    "EndOutsideCastle": {
        "description": "End the map off with an outdoor flag and Castle."
    },
    "EndInsideCastle": {
        "description": "End the map off with an indoor bridge, Bowser, and Toad."
    }
});
;

/* settings/generator.js */
FullScreenMario.prototype.settings.generator = {
    "possibilities": {
        
        /* Overworld
        */
        
        "Overworld": {
            "height": 80,
            "width": 2992,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Known",
                    "title": "ScrollEnabler"
                }, {
                    "type": "Random",
                    "title": "OverworldStart"
                }, {
                    "type": "Random",
                    "title": "OverworldBody"
                }, {
                    "type": "Random",
                    "title": "OverworldEnd"
                }]
            }
        },
        "OverworldStart": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": -8,
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 112
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldScenery"
                }]
            }
        },
        "OverworldBody": {
            "width": 2480,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "children": [{
                    "type": "Random",
                    "title": "OverworldRandomization"
                }, {
                    "type": "Random",
                    "title": "OverworldClouds"
                }]
            }
        },
        "OverworldRandomization": {
            "width": 2480,
            "height": 80,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "OverworldClump"
                }, {
                    "type": "Random",
                    "title": "OverworldSegwaySpotty"
                }, {
                    "type": "Random",
                    "title": "OverworldSegway"
                }, {
                    "type": "Random",
                    "title": "OverworldSegwaySpotty"
                }]
            }
        },
        "OverworldClump": {
            "width": 320,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 60,
                    "type": "Random",
                    "title": "OverworldClumpLand"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "OverworldClumpWater"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "OverworldClumpTrees"
                }]
            }
        },
        "OverworldClumpLand": {
            "width": 160,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "children": [{
                    "type": "Random",
                    "title": "OverworldScenery"
                }, {
                    "type": "Random",
                    "title": "OverworldLandArea"
                }]
            }
        },
        "OverworldLandArea": {
            "width": 160,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 160
                    }
                }, {
                    "type": "Random",
                    "title": "LandObstacleGroup"
                }]
            }
        },
        "OverworldClumpWater": {
            "width": 320,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "children": [{
                    "type": "Random",
                    "title": "Water",
                    "sizing": {
                        "height": 8,
                        "width": 320
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldClumpWaterMain",
                }]
            }
        },
        "OverworldClumpWaterMain": {
            "width": 320,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "OverworldClumpWaterContents"
                }]
            }
        },
        "OverworldClumpWaterContents": {
            "width": 320,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "CheepsStart"
                }, {
                    "type": "Random",
                    "title": "OverworldClumpWaterBridge"
                }, {
                    "type": "Random",
                    "title": "CheepsStop"
                }]
            }
        },
        "OverworldClumpWaterBridge": {
            "width": 320,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": 24,
                "children": [{
                    "type": "Known",
                    "title": "Bridge",
                    "sizing": {
                        "width": 320
                    },
                    "arguments": {
                        "macro": "Bridge",
                        "width": 320,
                        "begin": true,
                        "end": true
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldClumpWaterBridgeBlock"
                }]
            }
        },
        "OverworldClumpWaterBridgeBlock": {
            "width": 320,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "spacing": {
                    "min": 80,
                    "max": 240,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Known",
                    "title": "Block",
                    "arguments": [{
                        "percent": 70,
                        "values": {
                            "contents": "Mushroom"
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "contents": "Star"
                        }
                    }]
                }]
            }
        },
        "OverworldClumpTrees": {
            "width": 320,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 24,
                    "units": 8
                },
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "OverworldTreeLarge"
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "OverworldTreesSmall"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "PlatformGenerator"
                }]
            }
        },
        "OverworldTreesSmall": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 8,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "OverworldTreeSmallShort"
                }, {
                    "type": "Random",
                    "title": "OverworldTreeSmall"
                }]
            }
        },
        "OverworldTreeSmall": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Repeat",
                "limit": 1,
                "direction": "top",
                "spacing": {
                    "min": 32,
                    "max": 88,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "TreeFancy"
                }]
            }
        },
        "OverworldTreeSmallShort": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Known",
                    "title": "Tree",
                    "arguments": {
                        "macro": "Tree",
                        "width": 24
                    }
                }]
            }
        },
        "OverworldTreeLarge": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "OverworldTreeLargeBase"
                }, {
                    "type": "Random",
                    "title": "OverworldTreeSmall"
                }]
            }
        },
        "OverworldTreeLargeBase": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "spacing": [0, 8, 8],
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Known",
                    "title": "Tree",
                    "arguments": {
                        "macro": "Tree",
                        "width": 64
                    }
                }, {
                    "type": "Random",
                    "title": "TreeLargeCoins"
                }]
            }
        },
        
        
        /* Areas Segway floors
        */
        
        "OverworldSegway": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 30,
                    "type": "Random",
                    "title": "OverworldSegwaySpotty"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "OverworldSegwayEnemySpots"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "OverworldSegwayRamps"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "OverworldSegwayWatery"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "OverworldSegwaySpring"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "OverworldSegwayPipeTransit"
                }]
            }
        },
        "OverworldSegwaySpotty": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 60,
                    "type": "Random",
                    "title": "OverworldSegwaySpot",
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "Nothing",
                }]
            }
        },
        "OverworldSegwaySpot": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldSegwaySpotContent"
                }]
            }
        },
        "OverworldSegwaySpotContent": {
            "width": 8,
            "height": 24,
            "contents": {
                "mode": "Random",
                "direction": "top",
                "spacing": 24,
                "children": [{
                    "percent": 90,
                    "type": "Random",
                    "title": "OverworldSegwaySpotScenery"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "KoopaJumping"
                }]
            }
        },
        "OverworldSegwayEnemySpots": {
            "width": 112,
            "height": 24,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "spacing": [{
                    "percent": 60,
                    "value": 0
                }, {
                    "percent": 25,
                    "value": 8
                }, {
                    "percent": 15,
                    "value": 16
                }],
                "children": [{
                    "type": "Random",
                    "title": "OverworldSegwayEnemySpot"
                }]
            }
        },
        "OverworldSegwayEnemySpot": {
            "width": 32,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 32
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldSegwayEnemySpotContent"
                }]
            }
        },
        "OverworldSegwayEnemySpotContent": {
            "width": 32,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 45,
                    "type": "Random",
                    "title": "EnemyEasy"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "LandObstacleGroupVertical"
                }]
            }
        },
        "OverworldSegwayRamps": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "RampUpSmallFloor"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 48
                    }
                }, {
                    "type": "Random",
                    "title": "RampDownSmallFloor"
                }]
            }
        },
        "OverworldSegwayFloating": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "OverworldSegwayFloat"
                }]
            }
        },
        "OverworldSegwayFloat": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "Stone"
                }]
            }
        },
        "OverworldSegwayWatery": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "RampUpSmallFloor"
                }, {
                    "type": "Random",
                    "title": "OverworldSegwayWateryBridge", 
                }, {
                    "type": "Random",
                    "title": "RampDownSmallFloor"
                }]
            }
        },
        "OverworldSegwayWateryBridge": {
            "width": 48,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "Water",
                    "sizing": {
                        "height": 8
                    }
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 24
                    },
                }, {
                    "type": "Random",
                    "title": "Bridge"
                }, {
                    "type": "Random",
                    "title": "OverworldSegwayWateryBridgeTop"
                }]
            }
        },
        "OverworldSegwayWateryBridgeTop": {
            "width": 48,
            "height": 40,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "OverworldSegwayWateryBridgeTopEnemies"
                }, {
                    "type": "Random",
                    "title": "OverworldSegwayWateryBridgeTopSolid"
                }]
            }
        },
        "OverworldSegwayWateryBridgeTopEnemies": {
            "width": 48,
            "height": 16,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "spacing": {
                    "min": 4,
                    "max": 20,
                    "units": 4
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": 16
                }, {
                    "type": "Random",
                    "title": "EnemyEasy"
                }, {
                    "type": "Random",
                    "title": "EnemyEasy"
                }, {
                    "type": "Random",
                    "title": "EnemyEasy"
                }]
            }
        },
        "OverworldSegwayWateryBridgeTopSolid": {
            "width": 48,
            "height": 24,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "spacing": {
                    "min": 0,
                    "max": 24,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "BlockReward"
                }]
            }
        },
        "OverworldSegwaySpring": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "OverworldSegwaySpringLand"
                }, {
                    "type": "Random",
                    "title": "OverworldSegwaySpringGap"
                }]
            }
        },
        "OverworldSegwaySpringLand": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor"
                    }
                }, {
                    "type": "Known",
                    "title": "Springboard"
                }]
            }
        },
        "OverworldSegwaySpringGap": {
            "width": 104,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "spacing": {
                    "min": 48,
                    "max": 80,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "OverworldSegwaySpringReward"
                }]
            }
        },
        "OverworldSegwaySpringReward": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 16,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "type": "Random",
                    "title": "BlockTreasureFloating"
                }]
            }
        },
        "OverworldSegwayPipeTransit": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 112
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldSegwayPipeTransitLand"
                }]
            }
        },
        "OverworldSegwayPipeTransitLand": {
            "width": 104,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "spacing": {
                    "min": 32,
                    "max": 80,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "PipeRandomTransit"
                }]
            }
        },
        
        
        /* General obstacles
        */
        
        "LandObstacleGroup": {
            "width": 160,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 8,
                    "units": 16
                },
                "children": [{
                    "percent": 30,
                    "type": "Random",
                    "title": "LandObstacleGroupDoubleStory"
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "LandObstacleGroupSingleStory"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "LandObstacleGroupVertical"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "LandObstacleGroupPipes"
                }, {
                    "percent": 3,
                    "type": "Random",
                    "title": "LandObstacleGroupPitSmall"
                }, {
                    "percent": 2,
                    "type": "Random",
                    "title": "LandObstacleGroupPitLarge"
                }]
            }
        },
        "LandObstacleGroupEnemies": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": 4,
                "children": [{
                    "percent": 65,
                    "type": "Random",
                    "title": "EnemyEasyScattered"
                }, {
                    "percent": 2,
                    "type": "Random",
                    "title": "EnemyHard"
                }, {
                    "percent": 13,
                    "type": "Random",
                    "title": "LandObstacleGroupVertical"
                }]
            }
        },
        "LandObstacleGroupEnemiesPure": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": {
                    "min": 4,
                    "max": 8,
                    "units": 4
                },
                "children": [{
                    "percent": 90,
                    "type": "Random",
                    "title": "EnemyEasyScattered"
                }, {
                    "percent": 5,
                    "type": "Random",
                    "title": "EnemyHard"
                }]
            }
        },
        "LandObstacleGroupSingleStory": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "LandObstacleGroupSolidsSpotty"
                }, {
                    "type": "Random",
                    "title": "EnemyEasy"
                }]
            }
        },
        "LandObstacleGroupSingleStorySolids": {
            "width": 64,
            "height": 40,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 32
                    }
                }, {
                    "type": "Random",
                    "title": "LandObstacleGroupSolidsSpotty"
                }]
            }
        },
        "LandObstacleGroupDoubleStory": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "LandObstacleGroupDoubleStorySolids"
                }, {
                    "type": "Random",
                    "title": "LandObstacleGroupEnemiesPure"
                }]
            }
        },
        "LandObstacleGroupDoubleStorySolids": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "LandObstacleGroupSolidsPopulated"
                }, {
                    "type": "Random",
                    "title": "LandObstacleGroupSolidsSpotty"
                }]
            }
        },
        "LandObstacleGroupSolidsPopulated": {
            "width": 64,
            "height": 32,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 24
                    }
                }, {
                    "type": "Random",
                    "title": "LandObstacleGroupSolid"
                }, {
                    "type": "Random",
                    "title": "EnemyEasyElevated"
                }]
            }
        },
        "LandObstacleGroupSolids": {
            "width": 64,
            "height": 32,
            "contents": {
                "mode": "Random",
                "snap": "bottom",
                "direction": "right",
                "children": [{
                    "percent": 75,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "Block"
                }]
            }
        },
        "LandObstacleGroupSolidsSpotty": {
            "width": 64,
            "height": 32,
            "contents": {
                "mode": "Random",
                "snap": "bottom",
                "direction": "right",
                "children": [{
                    "percent": 30,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Block"
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "LandObstacleGroupPipes": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "snap": "bottom",
                "direction": "right",
                "children": [{
                    "percent": 80,
                    "type": "Random",
                    "title": "PipeRandom"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "PipeRandomTransit"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "PipeFloating"
                }]
            }
        },
        "LandObstacleGroupVertical": {
            "width": 32,
            "height": 80,
            "contents": {
                "mode": "Random",
                "snap": "bottom",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 8
                },
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "PipeRandom"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "StoneTower"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "CannonTower"
                }]
            }
        },
        "LandObstacleGroupPitSmall": {
            "width": 40,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "StoneTower"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "PitTreasure"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "StoneTower"
                }]
            }
        },
        "LandObstacleGroupPitLarge": {
            "width": 56,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "StoneTower"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 16
                    }
                }, {
                    "type": "Random",
                    "title": "PitTreasure"
                }, {
                    "type": "Random",
                    "title": "EnemyEasy"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "StoneTower"
                }]
            }
        },
        "PitTreasure": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 0,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 32
                    }
                }, {
                    "type": "Random",
                    "title": "BlockTreasure",
                }]
            }
        },
        
        
        /* Underworld
        */
        
        "Underworld": {
            "width": 1520,
            "height": 88,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "left",
                "children": [{
                    "type": "Random",
                    "title": "UnderworldStart"
                }, {
                    "type": "Random",
                    "title": "UnderworldRandomization"
                }, {
                    "type": "Random",
                    "title": "UnderworldPreEnd"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "UnderworldEnd"
                }]
            }
        },
        "UnderworldStart": {
            "width": 128,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": [{
                        "percent": 25,
                        "values": {
                            "macro": "Floor", 
                            "width": 80
                        }
                    }, {
                        "percent": 25,
                        "values": {
                            "macro": "Floor",
                            "width": 96
                        }
                    }, {
                        "percent": 25,
                        "values": {
                            "macro": "Floor",
                            "width": 104
                        }
                    }, {
                        "percent": 25,
                        "values": {
                            "macro": "Floor",
                            "width": 128
                        }
                    }]
                }, {
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "macro": "Fill",
                        "ynum": 11
                    }
                }]
            }
        },
        "UnderworldRandomization": {
            "width": 1512,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "UnderworldLandArea"
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "UnderworldSegway"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "UnderworldLandArea": {
            "width": 160,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 160
                    }
                }, {
                    "type": "Random",
                    "title": "UnderworldObstacleGroup"
                }, {
                    "type": "Random",
                    "title": "Brick", 
                    "sizing": {
                        "width": 160
                    }
                }]
            }
        },
        "UnderworldObstacleGroup": {
            "width": 160,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": [{
                    "percent": 50,
                    "value": 0
                }, {
                    "percent": 30,
                    "value": 8
                }, {
                    "percent": 20,
                    "value": 16
                }],
                "children": [{
                    "percent": 30,
                    "type": "Random",
                    "title": "EnemyEasyScattered"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "UnderworldBricksOverhangs"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "LandObstacleGroupSingleStory"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "LandObstacleGroupVertical"
                }]
            }
        },
        "UnderworldBricksOverhangs": {
            "width": 160,
            "height": 64,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "snap": "bottom",
                "spacing": {
                    "min": 0,
                    "max": 24,
                    "units": 8
                },
                "children": [{
                    "percent": 100,
                    "type": "Random",
                    "title": "UnderworldBricksOverhang"
                }]
            }
        },
        "UnderworldBricksOverhang": {
            "width": 32,
            "height": 64,
            "contents": {
                "mode": "Random",
                "direction": "top",
                "snap": "left",
                "spacing": [{
                    "percent": 40,
                    "value": 0
                }, {
                    "percent": 40,
                    "value": 16
                }, {
                    "percent": 20,
                    "value": 8
                }],
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "UnderworldBrickCluster"
                }, {
                    "percent": 30,
                    "type": "Known",
                    "title": "Coin",
                    "arguments": {
                        "macro": "Fill",
                        "xnum": 4,
                        "xwidth": 8
                    },
                    "sizing": {
                        "width": 32,
                        "height": 16
                    }
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "EnemyEasyScattered",
                }]
            }
        },
        "UnderworldBrickCluster": {
            "width": 32,
            "height": 16,
            "contents": {
                "mode": "Repeat",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "UnderworldBrickRow"
                }]
            }
        },
        "UnderworldBrickRow": {
            "width": 32,
            "height": 8,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 97,
                    "type": "Known",
                    "title": "Brick"
                }, {
                    "percent": 3,
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "contents": "Coin"
                    }
                }]
            }
        },
        "UnderworldSegway": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 30,
                    "type": "Random",
                    "title": "UnderworldSegwaySpotty"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "OverworldSegwayWatery"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "UnderworldSegwayPlatforms"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "OverworldSegwayRamps"
                }]
            }
        },
        "UnderworldSegwaySpotty": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "UnderworldSegwaySpots"
                }, {
                    "type": "Random",
                    "title": "UnderworldBrickCeiling",
                    "sizing": {
                        "width": 112
                    }
                }]
            }
        },
        "UnderworldSegwaySpots": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "UnderworldSegwaySpot",
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "Nothing",
                }]
            }
        },
        "UnderworldSegwaySpot": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": [{
                        "percent": 40,
                        "values": {
                            "macro": "Floor"
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "macro": "Floor",
                            "y": 8
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "macro": "Floor",
                            "y": 16
                        }
                    }]
                }]
            }
        },
        "UnderworldSegwayPlatforms": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 8,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 16
                    }
                }, {
                    "type": "Random",
                    "title": "PlatformGenerator"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "PlatformGenerator"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "UnderworldBrickCeiling": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 88
                    }
                }, {
                    "type": "Random",
                    "title": "Brick"
                }]
            }
        },
        "UnderworldPreEnd": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "left",
                "spacing": 32,
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "OverworldSegwaySpring"
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "PlatformGenerator"
                }]
            }
        },
        
        // OverworldSegwaySpring is 112
        // platgen is 24
        "UnderworldEnd": {
            "width": 480,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Random",
                    "title": "UnderworldEndFloor"
                }, {
                    "type": "Random",
                    "title": "UnderworldEndLand"
                }]
            }
        },
        "UnderworldEndFloor": {
            "width": 480,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Random",
                    "title": "Floor"
                }]
            }
        },
        "UnderworldEndLand": {
            "width": 488,
            "height": 72,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "LakituStop",
                    "sizing": {
                        "width": 0
                    }
                }, {
                    "type": "Random",
                    "title": "UnderworldEndPipeArea"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 64
                    }
                }, {
                    "type": "Random",
                    "title": "RampUpLarge"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 64
                    }
                }, {
                    "type": "Random",
                    "title": "UnderworldEndOutsideCastle"
                }, {
                    "type": "Known",
                    "title": "ScrollBlocker",
                    "sizing": {
                        "width": 0,
                        "height": 0
                    }
                }]
            }
        },
        "UnderworldEndPipeArea": {
            "width": 144,
            "height": 88,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "UnderworldEndPipeFront"
                }, {
                    "type": "Random",
                    "title": "UnderworldEndPipeTransport"
                }, {
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "macro": "Fill",
                        "xnum": 7,
                        "ynum": 11,
                        "yheight": -8
                    }
                }]
            }
        },
        "UnderworldEndPipeFront": {
            "width": 80,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "macro": "Fill",
                        "xnum": 10,
                        "ynum": 3
                    }
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 40
                    }
                }, {
                    "type": "Known",
                    "title": "Block",
                    "arguments": {
                        "hidden": true
                    }
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 24
                    }
                }, {
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "macro": "Fill",
                        "xnum": 10,
                        "ynum": 1
                    }
                }]
            }
        },
        "UnderworldEndPipeTransport": {
            "width": 32,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "right",
                "children": [{
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "macro": "Fill",
                        "xnum": 4,
                        "ynum": 3,
                        "yheight": -8
                    },
                    "sizing": {
                        "height": 24
                    }
                }, {
                    "type": "Known",
                    "title": "PipeCorner",
                    "arguments": {
                        "macro": "PipeCorner",
                        "height": 64,
                        "transport": "Overworld",
                        "scrollEnabler": true,
                        "scrollBlocker": true
                    }
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 40
                    }
                }, {
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "macro": "Fill",
                        "xnum": 2
                    }
                }]
            }
        },
        
        
        /* Sky
        */
        
        "Sky": {
            "width": 1400, // ???
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "left",
                "children": [{
                    "type": "Random",
                    "title": "SkyStart"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "SkyBeforeMain"
                }, {
                    "type": "Random",
                    "title": "SkyMain"
                }, {
                    "type": "Random",
                    "title": "SkyEnd"
                }]
            }
        },
        "SkyStart": {
            "width": 32,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "width": 32
                    },
                    "sizing": {
                        "width": 32
                    }
                }]
            }
        },
        "SkyBeforeMain": {
            "width": 80,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "width": 80
                    },
                    "sizing": {
                        "width": 80
                    }
                }]
            }
        },
        "SkyMain": {
            "width": 560,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "children": [{
                    "type": "Random",
                    "title": "SkyMainLand"
                }, {
                    "type": "Random",
                    "title": "SkyMainTransport"
                }, {
                    "type": "Random",
                    "title": "SkyMainAir"
                }]
            }
        },
        "SkyMainLand": {
            "width": 560,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "width": 560
                    }
                }]
            }
        },
        "SkyMainTransport": {
            "width": 140,
            "height": 40,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 32 
                    }
                }, {
                    "type": "Known",
                    "title": "Platform",
                    "arguments": {
                        "width": 24,
                        "transport": "true"
                    }
                }]
            }
        },
        "SkyMainAir": {
            "width": 560,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "spacing": 8,
                "children": [{
                    "percent": 20,
                    "type": "Random",
                    "title": "SkyCoinsShort"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "SkyCoinsMedium"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "SkyCoinsLong"
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "SkyCoinsStone"
                }]
            }
        },
        "SkyCoinsShort": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 56
                    }
                }, {
                    "type": "Random",
                    "title": "SkyCoinsRow",
                    "stretch": {
                        "width": true
                    }
                }]
            }
        },
        "SkyCoinsMedium": {
            "width": 56,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 56
                    }
                }, {
                    "type": "Random",
                    "title": "SkyCoinsRow",
                    "stretch": {
                        "width": true
                    }
                }]
            }
        },
        "SkyCoinsLong": {
            "width": 128,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 56
                    }
                }, {
                    "type": "Random",
                    "title": "SkyCoinsRow",
                    "stretch": {
                        "width": true
                    }
                }]
            }
        },
        "SkyCoinsRow": {
            "width": 5,
            "height": 7,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "snap": "top",
                "spacing": 3,
                "children": [{
                    "type": "Random",
                    "title": "Coin"
                }]
            }
        },
        "SkyCoinsStone": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                }, {
                    "type": "Random",
                    "title": "SkyCoinsStoneVertical",
                }]
            }
        },
        "SkyCoinsStoneVertical": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 0,
                    "max": 8,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 64
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "arguments": [{
                        "percent": 33,
                        "values": {}
                    }, {
                        "percent": 34,
                        "values": {
                            "width": 16
                        }
                    }, {
                        "percent": 33,
                        "values": {
                            "height": 16
                        }
                    }]
                }]
            }
        },
        "SkyEnd": {
            "width": 320,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "right",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "SkyEndCoins"
                }]
            }
        },
        "SkyEndCoins": {
            "width": 24,
            "height": 7,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "spacing": 3,
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 64
                    }
                }, {
                    "type": "Known",
                    "title": "Coin"
                }, {
                    "type": "Known",
                    "title": "Coin"
                }, {
                    "type": "Known",
                    "title": "Coin"
                }]
            }
        },
        
        
        /* Castle
        */
        
        "Castle": {
            "height": 80,
            "width": 2000,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "CastleStart"
                }, {
                    "type": "Random",
                    "title": "CastleBody"
                }, {
                    "type": "Random",
                    "title": "CastleEnd"
                }]
            }
        },
        "CastleStart": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "StartInsideCastle"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 80
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "height": 24,
                        "width": 112
                    }
                }]
            }
        },
        "CastleBody": {
            "width": 1632,
            "height": 80,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "CastleSegway"
                }, {
                    "type": "Random",
                    "title": "CastleLandArea"
                }, {
                    "type": "Random",
                    "title": "CastleSegway"
                }, {
                    "type": "Random",
                    "title": "CastleLandAreaLarge"
                }]
            }
        },
        "CastleSegway": {
            "width": 168,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "CastleSegwayFloatingGap"
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "CastleSegwayPlatformGap"
                }]
            }
        },
        "CastleSegwayFloatingGap": {
            "width": 168,
            "height": 80,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "CastleSegwayGapSpace"
                }, {
                    "type": "Random",
                    "title": "CastleSegwayGapChunk"
                }]
            }
        },
        "CastleSegwayGapSpace": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "children": [{
                    "type": "Random",
                    "title": "CastleSegwayGapSpaceWater"
                }, {
                    "type": "Random",
                    "title": "CastleSegwayGapSpaceEnemyArea"
                }]
            }
        },
        "CastleSegwayGapSpaceWater": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Water",
                    "sizing": {
                        "width": 24
                    }
                }]
            }
        },
        "CastleSegwayGapSpaceEnemyArea": {
            "width": 24,
            "height": 40,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "snap": "bottom",
                "spacing": [{
                    "percent": 60,
                    "value": 24
                }, {
                    "percent": 15,
                    "value": 0
                }, {
                    "percent": 15,
                    "value": 8
                }, {
                    "percent": 15,
                    "value": 16
                }],
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 0
                    }
                }, {
                    "type": "Random",
                    "title": "Podoboo"
                }]
            }
        },
        "CastleSegwayGapChunk": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 16,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Water",
                    "sizing": {
                        "width": 24
                    }
                }, {
                    "type": "Random",
                    "title": "CastleSegwayGapChunkSolids"
                }, {
                    "type": "Random",
                    "title": "CastleSegwayGapChunkReward"
                }]
            }
        },
        "CastleSegwayGapChunkSolids": {
            "width": 24,
            "height": 8,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "children": [{
                    "percent": 80,
                    "type": "Random",
                    "title": "Stone"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "CastleBlockActive"
                }]
            }
        },
        "CastleSegwayGapChunkReward": {
            "width": 16,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "CastleSegwayGapChunkBlock"
                }]
            }
        },
        "CastleSegwayGapChunkBlock": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "percent": 50,
                    "type": "Known",
                    "title": "Block",
                    "arguments": {
                        "contents": "Mushroom"
                    }
                }]
            }
        },
        "CastleSegwayPlatformGap": {
            "width": 168,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "CastleSegwayPlatformGapBorder"
                }, {
                    "type": "Random",
                    "title": "CastleSegwayPlatformGapPlatforms"
                }, {
                    "type": "Random",
                    "title": "CastleSegwayPlatformGapBorder"
                }]
            }
        },
        "CastleSegwayPlatformGapBorder": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 0,
                    "max": 24,
                    "units": 8
                },
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor"
                    },
                    "sizing": {
                        "height": 32
                    },
                    "stretch": {
                        "width": true
                    }
                }, {
                    "type": "Random",
                    "title": "CastleSegwayPlatformGapBorderCastleBlock"
                }]
            }
        },
        "CastleSegwayPlatformGapBorderCastleBlock": {
            "width": 24,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 0
                    }
                }, {
                    "type": "Random",
                    "title": "CastleBlockActive"
                }]
            }
        },
        "CastleSegwayPlatformGapPlatforms": {
            "width": 120,
            "height": 80,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 16
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "PlatformGenerator"
                }]
            }
        },
        "CastleLandArea": {
            "width": 160,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 100,
                    "type": "Random",
                    "title": "CastleLandTunnel"
                }]
            }
        },
        "CastleLandTunnel": {
            "width": 160,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 160,
                    },
                    "sizing": {
                        "height": 32
                    }
                }, {
                    "type": "Random",
                    "title": "CastleLandTunnelEnemies"
                }, {
                    "type": "Random",
                    "title": "CastleLandTunnelTop"
                }]
            }
        },
        "CastleLandTunnelEnemies": {
            "width": 160,
            "height": 16,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "spacing": [{
                    "percent": 10,
                    "value": 4
                }, {
                    "percent": 15,
                    "value": 8
                }, {
                    "percent": 85,
                    "value": {
                        "min": 32,
                        "max": 64,
                        "units": 8
                    }
                }],
                "children": [{
                    "percent": 70,
                    "type": "Random",
                    "title": "Goomba"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Beetle"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Koopa"
                }]
            }
        },
        "CastleLandTunnelTop": {
            "width": 160,
            "height": 32,
            "contents": {
                "mode": "Certain",
                "direction": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "stretch": {
                        "width": true
                    },
                    "arguments": [{
                        "percent": 33,
                        "values": {
                            "height": 24
                        }
                    }, {
                        "percent": 34,
                        "values": {
                            "height": 32
                        }
                    }, {
                        "percent": 33,
                        "values": {
                            "height": 40
                        }
                    }, ]
                }]
            }
        },
        "CastleLandAreaLarge": {
            "width": 320,
            "height": 80,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "CastleLandAreaChunk"
                }, {
                    "type": "Random",
                    "title": "CastleLandAreaBetween"
                }]
            }
        },
        "CastleLandAreaChunk": {
            "width": 152,
            "height": 80,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "children": [{
                    "percent": 100,
                    "type": "Random",
                    "title": "CastleLandAreaCavern"
                }]
            }
        },
        "CastleLandAreaCavern": {
            "width": 152,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 152,
                    }
                }, {
                    "type": "Random",
                    "title": "CastleLandAreaCavernInside"
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "width": 152
                    }
                }]
            }
        },
        "CastleLandAreaCavernInside": {
            "width": 152,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "spacing": {
                    "min": 8,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "CastleLandAreaCavernInsideTites"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "CastleLandAreaCavernInsideBonus"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 24
                    }
                }]
            }
        },
        "CastleLandAreaCavernInsideTites": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "width": 24
                    }
                }, {
                    "type": "Random",
                    "title": "CastleLandAreaCavernInsideTitesCastleBlock"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 40
                    }
                }, {
                    "type": "Random",
                    "title": "CastleLandAreaCavernInsideTitesCastleBlock"
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "width": 24,
                        "height": 16
                    },
                    "arguments": {
                        "width": 24,
                        "height": 16
                    }
                }]
            }
        },
        "CastleLandAreaCavernInsideTitesCastleBlock": {
            "width": 24,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "CastleBlockActive"
                }]
            }
        },
        "CastleLandAreaCavernInsideBonus": {
            "width": 24,
            "height": 64,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 8,
                    "max": 24,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "CastleLandAreaCavernInsideBonusBlocks"
                }, {
                    "type": "Random",
                    "title": "CastleLandAreaCavernInsideBonusBlocks"
                }]
            }
        },
        "CastleLandAreaCavernInsideBonusBlocks": {
            "width": 24,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Known",
                    "title": "Block",
                    "arguments": [{
                        "percent": 45,
                        "values": {
                            "hidden": true
                        }
                    }, {
                        "percent": 35,
                        "values": {}
                    }, {
                        "percent": 15,
                        "values": {
                            "contents": "Mushroom",
                            "hidden": true
                        }
                    }, {
                        "percent": 5,
                        "values": {
                            "contents": "Mushroom",
                        }
                    }]
                }]
            }
        },
        "CastleLandAreaBetween": {
            "width": 16,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Water",
                    "arguments": {
                        "macro": "Water",
                        "width": 16
                    }
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 83
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "width": 16
                    }
                }]
            }
        },
        "CastleEnd": {
            "width": 256,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "CastlePreEnd"
                }, {
                    "type": "Random",
                    "title": "EndInsideCastle"
                }, {
                    "type": "Random",
                    "title": "Overworld"
                }]
            }
        },
        "CastlePreEnd": {
            "width": 80,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor", 
                    "arguments": {
                        "macro": "Floor",
                        "width": 80
                    }
                }, {
                    "type": "Random",
                    "title": "CastlePreEndBlocks"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 56
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "arguments": [{
                        "percent": 50,
                        "values": {
                            "width": 80,
                            "height": 24
                        }
                    }, {
                        "percent": 50,
                        "values": {
                            "width": 80,
                            "height": 32
                        }
                    }]
                }]
            }
        },
        "CastlePreEndBlocks": {
            "width": 80,
            "height": 24,
            "contents": {
                "mode": "Repeat",
                "direction": "right",
                "snap": "top",
                "spacing": 16,
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "width": 16,
                        "height": 24
                    },
                    "arguments": {
                        "width": 16,
                        "height": 24
                    }
                }]
            }
        },
        
        
        /* Enemy groups
        */
        
        "EnemyEasy": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": [{
                    "percent": 75,
                    "value": 4
                }, {
                    "percent": 25,
                    "value": 8
                }],
                "children": [{
                    "percent": 45,
                    "type": "Random",
                    "title": "Goomba"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "Koopa"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Beetle"
                }]
            }
        },
        "EnemyEasyScattered": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": [{
                    "percent": 45,
                    "value": 8
                }, {
                    "percent": 25,
                    "value": 4
                }, {
                    "percent": 15,
                    "value": 12
                }, {
                    "percent": 15,
                    "value": 16
                }],
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "Goomba"
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "Koopa"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Beetle"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "EnemyEasyElevated": {
            "width": 64,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "spacing": 4,
                "children": [{
                    "percent": 25,
                    "type": "Random",
                    "title": "Goomba"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Koopa"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "Beetle"
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "EnemyHard": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "HammerBro"
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "Blooper"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Lakitu"
                }]
            }
        },
        
        
        /* Solid groups
        */
        
        "SolidSmall": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 80,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Block"
                }]
            }
        },
        "SolidSmallSpotty": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Block"
                }]
            }
        },
        "LandObstacleGroupSolid": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 70,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "Block"
                }]
            }
        },
        "Cannon": {
            "width": 8,
            "height": 32,
            "contents": {
                "mode": "Random",
                "direction": "top",
                "snap": "bottom",
                "spacing": [{
                    "percent": 50,
                    "value": 0
                }, {
                    "percent": 50,
                    "value": 24
                }],
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "CannonMedium"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "CannonSmall"
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "CannonLarge"
                }]    
            }
        },
        "CannonStack": {
            "width": 8,
            "height": 32,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Cannon"
                }, {
                    "type": "Random",
                    "title": "Cannon"
                }]
            }
        },
        "RampUpSmall": {
            "width": 32,
            "height": 32,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Stone"
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 16
                    },
                    "arguments": {
                        "height": 16
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 24
                    },
                    "arguments": {
                        "height": 24
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 32
                    },
                    "arguments": {
                        "height": 32
                    }
                }]
            }
        },
        "RampUpSmallFloor": {
            "width": 32,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 32
                    }
                }, {
                    "type": "Random",
                    "title": "RampUpSmall"
                }]
            }
        },
        "RampUpLarge": {
            "width": 64,
            "height": 64,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Stone"
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 16
                    },
                    "arguments": {
                        "height": 16
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 24
                    },
                    "arguments": {
                        "height": 24
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 32
                    },
                    "arguments": {
                        "height": 32
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 40
                    },
                    "arguments": {
                        "height": 40
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 48
                    },
                    "arguments": {
                        "height": 48
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 56
                    },
                    "arguments": {
                        "height": 56
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 64
                    },
                    "arguments": {
                        "height": 64
                    }
                }]
            }
        },
        "RampUpLargeFloor": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 64
                    }
                }, {
                    "type": "Random",
                    "title": "RampUpLarge"
                }]
            }
        },
        "RampDownSmall": {
            "width": 32,
            "height": 32,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 32
                    },
                    "arguments": {
                        "height": 32
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 24
                    },
                    "arguments": {
                        "height": 24
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 16
                    },
                    "arguments": {
                        "height": 16
                    }
                }, {
                    "type": "Known",
                    "title": "Stone"
                }]
            }
        },
        "RampDownSmallFloor": {
            "width": 32,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 32
                    }
                }, {
                    "type": "Random",
                    "title": "RampDownSmall"
                }]
            }
        },
        "RampDownLarge": {
            "width": 64,
            "height": 64,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 64
                    },
                    "arguments": {
                        "height": 64
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 56
                    },
                    "arguments": {
                        "height": 56
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 48
                    },
                    "arguments": {
                        "height": 48
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 40
                    },
                    "arguments": {
                        "height": 40
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 32
                    },
                    "arguments": {
                        "height": 32
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 24
                    },
                    "arguments": {
                        "height": 24
                    }
                }, {
                    "type": "Known",
                    "title": "Stone",
                    "sizing": {
                        "height": 16
                    },
                    "arguments": {
                        "height": 16
                    }
                }, {
                    "type": "Known",
                    "title": "Stone"
                }]
            }
        },
        "RampDownLargeFloor": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "arguments": {
                        "macro": "Floor",
                        "width": 64
                    }
                }, {
                    "type": "Random",
                    "title": "RampDownLarge"
                }]
            }
        },
        "StoneTower": {
            "width": 8,
            "height": 32,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "percent": 50,
                    "type": "Known",
                    "title": "Stone",
                    "snap": "bottom",
                    "sizing": {
                        "height": 24
                    },
                    "arguments": {
                        "height": 24
                    }
                }, {
                    "percent": 50,
                    "type": "Known",
                    "title": "Stone",
                    "stretch": {
                        "height": true
                    },
                }]
            }
        },
        "StoneTowerLarge": {
            "width": 8,
            "height": 64,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "height": 64
                    },
                    "sizing": {
                        "height": 64
                    }
                }]
            }
        },
        "CannonTower": {
            "width": 24,
            "height": 32,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "Cannon"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        
        /* Scenery groups
        */
        
        "OverworldScenery": {
            "width": 160,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 8
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldLandScenery"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 32
                    }
                }]
            }
        },
        "OverworldLandScenery": {
            "height": 40,
            "width": 160,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "spacing": {
                    "min": -4,
                    "max": 40,
                    "units": 4
                },
                "children": [{
                    "percent": 25,
                    "type": "Random",
                    "title": "HillSmall"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "HillLarge"
                }, {
                    "percent": 12,
                    "type": "Random",
                    "title": "Bush1"
                }, {
                    "percent": 11,
                    "type": "Random",
                    "title": "Bush2"
                }, {
                    "percent": 12,
                    "type": "Random",
                    "title": "Bush3"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "Fence"
                }, {
                    "percent": 5,
                    "type": "Random",
                    "title": "PlantSmall"
                }, {
                    "percent": 5,
                    "type": "Random",
                    "title": "PlantLarge"
                }]
            }
        },
        "OverworldClouds": {
            "height": 56,
            "width": 2528,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "top",
                "spacing": {
                    "min": 16,
                    "max": 80,
                    "units": 8
                },
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "CloudClump1"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "CloudClump2"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "CloudClump3"
                }]
            }
        },
        "CloudClump1": {
            "height": 56,
            "width": 16,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 16,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                }, {
                    "type": "Random",
                    "title": "Cloud1"
                }]
            }
        },
        "CloudClump2": {
            "height": 56,
            "width": 24,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 16,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                }, {
                    "type": "Random",
                    "title": "Cloud2"
                }]
            }
        },
        "CloudClump3": {
            "height": 56,
            "width": 32,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 16,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                }, {
                    "type": "Random",
                    "title": "Cloud3"
                }]
            }
        },
        "Cloud": {
            "width": 32,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "limit": 1,
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "Cloud1"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "Cloud2"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "Cloud3"
                }]
            }
        },
        "OverworldSegwaySpotScenery": {
            "width": 8,
            "height": 23,
            "contents": {
                "mode": "Random",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "percent": 70,
                    "type": "Random",
                    "title": "Nothing",
                    "stretch": {
                        "height": true
                    }
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "PlantSmall"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "PlantLarge"
                }]
            }
        },
        
        
        /* Characters
        */
        
        "Goomba": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Goomba"
                }]
            }
        },
        "Koopa": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "percent": 20,
                    "type": "Known",
                    "title": "Koopa",
                }, {
                    "percent": 40,
                    "type": "Known",
                    "title": "Koopa",
                    "arguments": {
                        "smart": true
                    }
                }, {
                    "percent": 15,
                    "type": "Known",
                    "title": "Koopa",
                    "arguments": {
                        "jumping": true
                    }
                }, {
                    "percent": 25,
                    "type": "Known",
                    "title": "Koopa",
                    "arguments": {
                        "smart": true,
                        "jumping": true
                    }
                }]
            }
        },
        "KoopaJumping": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "percent": 35,
                    "type": "Known",
                    "title": "Koopa",
                    "arguments": {
                        "jumping": true
                    }
                }, {
                    "percent": 65,
                    "type": "Known",
                    "title": "Koopa",
                    "arguments": {
                        "smart": true,
                        "jumping": true
                    }
                }]
            }
        },
        "Beetle": {
            "width": 8,
            "height": 8.5,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Beetle"
                }]
            }
        },
        "HammerBro": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "HammerBro"
                }]
            }
        },
        "Blooper": {
            "width": 8,
            "height": 40,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "type": "Known",
                    "title": "Blooper"
                }]
            }
        },
        "Lakitu": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "right",
                "spacing": 4,
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 0
                    }
                }, {
                    "type": "Known",
                    "title": "Lakitu"
                }]
            }
        },
        "Podoboo": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": -40,
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Known",
                    "title": "Podoboo"
                }]
            }
        },
        
        
        /* Solids
        */
        
        "Brick": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "percent": 85,
                    "type": "Known",
                    "title": "Brick"
                }, {
                    "percent": 10,
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "contents": "Coin"
                    }
                }, {
                    "percent": 5,
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "contents": "Star"
                    }
                }]
            }
        },
        "Block": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "type": "Known",
                    "title": "Block",
                    "arguments": [{
                        "percent": 90,
                        "values": {}
                    }, {
                        "percent": 9,
                        "values": {
                            "contents": "Mushroom"
                        }
                    }, {
                        "percent": 1,
                        "values": {
                            "contents": "Mushroom1Up",
                            "hidden": true
                        }
                    }]
                }]
            }
        },
        "BlockTreasure": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "type": "Known",
                    "title": "Block",
                    "arguments": [{
                        "percent": 35,
                        "values": {
                            "contents": "Mushroom"
                        }
                    }, {
                        "percent": 35,
                        "values": {
                            "contents": "Star"
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "contents": "Mushroom1Up"
                        }
                    }]
                }]
            }
        },
        "BlockTreasureFloating": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "type": "Known",
                    "title": "Block",
                    "arguments": [{
                        "percent": 20,
                        "values": {
                            "contents": "Mushroom"
                        }
                    }, {
                        "percent": 20,
                        "values": {
                            "hidden": true,
                            "contents": "Mushroom"
                        }
                    }, {
                        "percent": 15,
                        "values": {
                            "contents": "Star"
                        }
                    }, {
                        "percent": 15,
                        "values": {
                            "hidden": true,
                            "contents": "Star"
                        }
                    }, {
                        "percent": 20,
                        "values": {
                            "contents": "Mushroom1Up"
                        }
                    }, {
                        "percent": 20,
                        "values": {
                            "hidden": true,
                            "contents": "Mushroom1Up"
                        }
                    }]
                }]
            }
        },
        "BlockReward": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right", 
                "snap": "top",
                "children": [{
                    "type": "Known",
                    "title": "Block",
                    "arguments": [{
                        "percent": 30,
                        "values": {
                            "hidden": true
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "hidden": true,
                            "contents": "Mushroom"
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "hidden": true,
                            "contents": "Star"
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "hidden": true,
                            "contents": "Mushroom1Up"
                        }
                    }]
                }]
            }
        },
        "Bridge": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "direction": "right",
                "children": [{
                    "type": "Known",
                    "title": "Bridge",
                    "stretch": {
                        "width": true
                    },
                    "arguments": {
                        "macro": "Bridge",
                    }
                }]
            }
        },
        "Tree": {
            "width": 24,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Tree",
                    "stretch": {
                        "width": true
                    },
                    "arguments": {
                        "macro": "Tree"
                    }
                }]
            }
        },
        "TreeCoin": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 4
                    }
                }, {
                    "type": "Random",
                    "title": "Coin",
                    "sizing": {
                        "height": 4
                    }
                }]
            }
        },
        "TreeCoins": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "stretch": {
                    "width": true
                },
                "spacing": 4,
                "children": [{
                    "percent": 55,
                    "type": "Random",
                    "title": "TreeCoin"
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "EnemyEasy"
                }]
            }
        },
        "TreeLargeCoins": {
            "width": 64,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "TreeCoins",
                    "sizing": {
                        "width": 56
                    }
                }]
            }
        },
        "TreeFancy": {
            "width": 24,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Tree",
                    "stretch": {
                        "width": true
                    },
                    "arguments": {
                        "macro": "Tree"
                    }
                }, {
                    "type": "Random",
                    "title": "TreeCoins",
                    "stretch": {
                        "width": true
                    }
                }]
            }
        },
        "Coin": {
            "width": 5,
            "height": 7,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Known",
                    "title": "Coin"
                }]
            }
        },
        "PipeRandom": {
            "width": 16,
            "height": 40,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 0
                    }
                }, {
                    "type": "Known",
                    "title": "Pipe",
                    "sizing": {
                        "height": 0
                    },
                    "arguments": [{
                        "percent": 25,
                        "values": {
                            "macro": "Pipe",
                            "piranha": true,
                            "height": 16
                        }
                    }, {
                        "percent": 5,
                        "values": {
                            "macro": "Pipe",
                            "height": 16
                        }
                    }, {
                        "percent": 25,
                        "values": {
                            "macro": "Pipe",
                            "piranha": true,
                            "height": 24
                        }
                    }, {
                        "percent": 5,
                        "values": {
                            "macro": "Pipe",
                            "height": 24
                        }
                    }, {
                        "percent": 20,
                        "values": {
                            "macro": "Pipe",
                            "piranha": true,
                            "height": 32
                        }
                    }, {
                        "percent": 5,
                        "values": {
                            "macro": "Pipe",
                            "height": 32
                        }
                    }, {
                        "percent": 5,
                        "values": {
                            "macro": "Pipe",
                            "piranha": true,
                            "transport": "Underworld",
                            "height": 32
                        }
                    }, {
                        "percent": 5,
                        "values": {
                            "macro": "Pipe",
                            "transport": "Underworld",
                            "height": 32
                        }
                    }, {
                        "percent": 3,
                        "values": {
                            "macro": "Pipe",
                            "piranha": true,
                            "transport": "Underwater",
                            "height": 32
                        }
                    }, {
                        "percent": 2,
                        "values": {
                            "macro": "Pipe",
                            "transport": "Underwater",
                            "height": 32
                        }
                    }]
                }]
            }
        },
        "PipeRandomTransit": {
            "width": 16,
            "height": 40,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Pipe",
                    "sizing": {
                        "height": 0
                    },
                    "arguments": [{
                        "percent": 50,
                        "values": {
                            "macro": "Pipe",
                            "piranha": true,
                            "height": 24,
                            "transport": "Underworld"
                        }
                    }, {
                        "percent": 50,
                        "values": {
                            "macro": "Pipe",
                            "piranha": true,
                            "height": 32,
                            "transport": "Underworld"
                        }
                    }]
                }]
            }
        },
        "PipeFloating": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "spacing": {
                    "min": 8,
                    "max": 32,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "PipeFloatingContents"
                }]
            }
        },
        "PipeFloatingContents": {
            "width": 64,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "PipeFloatingSolid"
                }, {
                    "type": "Random",
                    "title": "PipeFloatingCenter"
                }, {
                    "type": "Random",
                    "title": "PipeFloatingSolid"
                }]
            }
        },
        "PipeFloatingSolid": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 65,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "Block"
                }, ]
            }
        },
        "PipeFloatingCenter": {
            "width": 16,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "Stone",
                    "arguments": {
                        "width": 16
                    }
                }, {
                    "type": "Random",
                    "title": "PipeRandomTransit"
                }]
            }
        },
        "Pipe": {
            "width": 16,
            "height": 32,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Pipe"
                }]
            }
        },
        "PipeHorizontal": {
            "width": 16,
            "height": 16,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "PipeHorizontal"
                }]
            }
        },
        "PipeVertical": {
            "width": 16,
            "height": 16,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "PipeVertical"
                }]
            }
        },
        "PipeCorner": {
            "width": 32,
            "height": 16,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "PipeCorner",
                    "arguments": {
                        "macro": "PipeCorner"
                    }
                }]
            }
        },
        "CannonSmall": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Final",
                    "source": "CannonSmall",
                    "title": "Cannon",
                }]
            }
        },
        "CannonMedium": {
            "width": 8,
            "height": 16,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Final",
                    "source": "CannonMedium",
                    "title": "Cannon",
                    "arguments": {
                        "height": 16
                    }
                }]
            }
        },
        "CannonLarge": {
            "width": 8,
            "height": 24,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Final",
                    "source": "CannonLarge",
                    "title": "Cannon",
                    "arguments": {
                        "height": 24 
                    }
                }]
            }
        },
        "Floor": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "stretch": {
                        "width": true,
                    },
                    "arguments": {
                        "height": "Infinity"
                    }
                }]
            }
        },
        "Springboard": {
            "width": 8,
            "height": 14.5,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Springboard"
                }]
            }
        },
        "Stone": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Stone"
                }]
            }
        },
        "CastleBlock": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "CastleBlock"
                }]
            }
        },
        "CastleBlockActive": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Known",
                    "title": "CastleBlock",
                    "arguments": [{
                        "percent": 30,
                        "values": {}
                    }, {
                        "percent": 30,
                        "values": {
                            "fireballs": 6
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "fireballs": 6,
                            "direction": 1
                        }
                    }, {
                        "percent": 5,
                        "values": {
                            "fireballs": 12
                        }
                    }, {
                        "percent": 5,
                        "values": {
                            "fireballs": 12,
                            "direction": 1
                        }
                    }]
                }]
            }
        },
        
        
        /* Scenery
        */
        
        "Bush1": {
            "width": 16,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Bush1"
                }]
            }
        },
        "Bush2": {
            "width": 24,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Bush2"
                }]
            }
        },
        "Bush3": {
            "width": 32,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Bush3"
                }]
            }
        },
        "Cloud1": {
            "width": 16,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Cloud1"
                }]
            }
        },
        "Cloud2": {
            "width": 24,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Cloud2"
                }]
            }
        },
        "Cloud3": {
            "width": 32,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Cloud3"
                }]
            }
        },
        "Fence": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Fence"
                }]
            }
        },
        "HillSmall": {
            "width": 24,
            "height": 9.5,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "HillSmall"
                }]
            }
        },
        "HillLarge": {
            "width": 40,
            "height": 17.5,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "HillLarge"
                }]
            }
        },
        "PlantSmall": {
            "width": 7,
            "height": 15,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "PlantSmall"
                }]
            }
        },
        "PlantLarge": {
            "width": 8,
            "height": 23,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "PlantLarge"
                }]
            }
        },
        "Water": {
            "width": 4,
            "height": 5,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "direction": "right",
                "children": [{
                    "type": "Known",
                    "title": "Water",
                    "stretch": {
                        "width": true
                    },
                    "arguments": {
                        "macro": "Water",
                    }
                }]
            }
        },
        
        
        /* General macros & helpers
        */
        
        "LakituStop": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "LakituStop",
                    "arguments": {
                        "macro": "LakituStop"
                    }
                }]
            }
        },
        "Platform": {
            "width": 16,
            "height": 4,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Platform",
                    "stretch": {
                        "width": true
                    }
                }]
            }
        },
        "PlatformGenerator": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "PlatformGenerator",
                    "arguments": [{
                        "percent": 25,
                        "values": {
                            "macro": "PlatformGenerator"
                        }
                    }, {
                        "percent": 25,
                        "values": {
                            "macro": "PlatformGenerator",
                            "width": 24
                        }
                    }, {
                        "percent": 25,
                        "values": {
                            "macro": "PlatformGenerator",
                            "direction": -1,
                            "width": 24
                        }
                    }, {
                        "percent": 25,
                        "values": {
                            "macro": "PlatformGenerator",
                            "direction": -1,
                        }
                    }]
                }]
            }
        },
        "OverworldEnd": {
            "width": 288,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "left",
                "children": [{
                    "type": "Random",
                    "title": "OverworldEndFloor"
                }, {
                    "type": "Random",
                    "title": "OverworldEndLand"
                }]
            }
        },
        "OverworldEndFloor": {
            "width": 288,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Random", 
                    "title": "Floor"
                }]
            }
        },
        "OverworldEndLand": {
            "width": 288,
            "height": 64,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "LakituStop"
                }, {
                    "type": "Random", 
                    "title": "RampUpLarge"
                }, {
                    "type": "Random",
                    "title": "StoneTowerLarge"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "width": 64
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldEndOutsideCastle"
                }, {
                    "type": "Random",
                    "title": "ScrollBlocker"
                }]
            }
        },
        "OverworldEndOutsideCastle": {
            "width": 144,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "direction": "right",
                "spacing": -112,
                "children": [{
                    "type": "Random",
                    "title": "EndOutsideCastle"
                }, {
                    "type": "Random",
                    "title": "OverworldEndOutsideCastleScenery"
                }]
            }
        },
        "OverworldEndOutsideCastleScenery": {
            "width": 144,
            "height": 80,
            "contents": {
                "mode": "Multiple",
                "direction": "top",
                "spacing": -8,
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 0
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldScenery"
                }]
            }
        },
        "EndOutsideCastle": {
            "width": 144,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "EndOutsideCastle",
                    "arguments": {
                        "macro": "EndOutsideCastle",
                        "transport": "Castle",
                        "large": true
                    },
                    "sizing": {
                        "height": 0
                    }
                }]
            }
        },
        "UnderworldEndOutsideCastle": {
            "width": 144,
            "Height": 88,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "EndOutsideCastle"
                }]
            }
        },
        "StartInsideCastle": {
            "width": 112,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "StartInsideCastle",
                    "arguments": {
                        "macro": "StartInsideCastle",
                        "width": 112
                    }
                }]
            }
        },
        "EndInsideCastle": {
            "width": 248,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Known",
                    "title": "EndInsideCastle",
                    "arguments": {
                        "macro": "EndInsideCastle",
                        "spawnType": "Bowser",
                        "npc": "Peach",
                        "transport": {
                            "map": "Random",
                            "location": "Overworld"
                        },
                        "topScrollEnabler": true
                    },
                    "sizing": {
                        "height": 8
                    }
                }]
            }
        },
        "CheepsStart": {
            "width": 0,
            "height": 0,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "CheepsStart",
                    "arguments": {
                        "macro": "CheepsStart"
                    }
                }]
            }
        },
        "CheepsStop": {
            "width": 0,
            "height": 0,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "CheepsStop",
                    "arguments": {
                        "macro": "CheepsStop"
                    }
                }]
            }
        },
        "ScrollEnabler": {
            "width": 0,
            "height": 0,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Known",
                    "title": "ScrollEnabler"
                }]
            }
        },
        "ScrollBlocker": {
            "width": 0,
            "height": 0,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Known",
                    "title": "ScrollBlocker"
                }]
            }
        },
        
        
        /* Misc.
        */
        
        "Nothing": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "children": []
            }
        }
    }
};
;

/* settings/groups.js */
FullScreenMario.prototype.settings.groups = {
    "groupNames": ["Solid", "Character", "Scenery", "Text"],
    "groupTypes": "Array",
};
;

/* settings/events.js */
FullScreenMario.prototype.settings.events = {
    "keyOnClassCycleStart": "onThingAdd",
    "keyDoClassCycleStart": "placed",
    "keyCycleCheckValidity": "alive",
    "timingDefault": 9
};
;

/* settings/input.js */
FullScreenMario.prototype.settings.input = {
    "InputWritrArgs": {
        "aliases": {
            // Keyboard aliases
            "left":   [65, 37],     // a,     left
            "right":  [68, 39],     // d,     right
            "up":     [87, 38, 32], // w,     up,    space
            "down":   [83, 40],     // s,     down
            "sprint": [16, 17],     // shift, ctrl
            "pause":  [80],         // p (pause)
            // Mute and Luigi disabled because there's a GUI for them now
            // "mute":   [77],         // m (mute)
            // "l":      [76],         // l (luigi)
            // Mouse aliases
            "rightclick": [3],
        },
        "triggers": {
            "onkeydown": {
                "left": FullScreenMario.prototype.keyDownLeft,
                "right": FullScreenMario.prototype.keyDownRight,
                "up": FullScreenMario.prototype.keyDownUp,
                "down": FullScreenMario.prototype.keyDownDown,
                "sprint": FullScreenMario.prototype.keyDownSprint,
                "pause": FullScreenMario.prototype.keyDownPause,
                "mute": FullScreenMario.prototype.keyDownMute,
            },
            "onkeyup": {
                "left": FullScreenMario.prototype.keyUpLeft,
                "right": FullScreenMario.prototype.keyUpRight,
                "up": FullScreenMario.prototype.keyUpUp,
                "down": FullScreenMario.prototype.keyUpDown,
                "sprint": FullScreenMario.prototype.keyUpSprint,
                "pause": FullScreenMario.prototype.keyUpPause
            },
            "onmousedown": {
                "rightclick": FullScreenMario.prototype.mouseDownRight
            },
            "oncontextmenu": {},
            "ondevicemotion": {
                "devicemotion": FullScreenMario.prototype.deviceMotion
            }
        }
    }
};
;

/* settings/maps.js */
FullScreenMario.prototype.settings.maps = {
    "mapDefault": "1-1",
    "locationDefault": "0",
    "groupTypes": ["Character", "Solid", "Scenery", "Text"],
    "requireEntrance": true,
    "screenAttributes": [
        "gravity",
        "setting",
        "time",
        "underwater",
        "floor",
        "jumpmod",
        "maxyvel",
        "maxyvelinv",
        "notime",
        "nokeys",
        "canscroll"
    ],
    "screenVariables": {
        "bottomDeathDifference": function (EightBitter) {
            return EightBitter.unitsize * 12;
        },
        "bottomPlatformMax": function (EightBitter) {
            var area = EightBitter.MapsHandler.getArea(),
                diff = EightBitter.MapScreener.bottomDeathDifference;
                
            if (!area) {
                return -1;
            }
                
            return (area.floor + diff) * EightBitter.unitsize;
        },
        "gravity": function (EightBitter) {
            var area = EightBitter.MapsHandler.getArea();
            
            if (area && area.underwater) {
                return EightBitter.gravity / 2.8;
            }
            
            return EightBitter.gravity;
        }
    },
    "onSpawn": FullScreenMario.prototype.addPreThing,
    "macros": {
        "Example": FullScreenMario.prototype.macroExample,
        "Fill": FullScreenMario.prototype.macroFillPreThings,
        "Pattern": FullScreenMario.prototype.macroFillPrePattern,
        "Floor": FullScreenMario.prototype.macroFloor,
        "Pipe": FullScreenMario.prototype.macroPipe,
        "PipeCorner": FullScreenMario.prototype.macroPipeCorner,
        "Tree": FullScreenMario.prototype.macroTree,
        "Shroom": FullScreenMario.prototype.macroShroom,
        "Water": FullScreenMario.prototype.macroWater,
        "CastleSmall": FullScreenMario.prototype.macroCastleSmall,
        "CastleLarge": FullScreenMario.prototype.macroCastleLarge,
        "Ceiling": FullScreenMario.prototype.macroCeiling,
        "Bridge": FullScreenMario.prototype.macroBridge,
        "Scale": FullScreenMario.prototype.macroScale,
        "PlatformGenerator": FullScreenMario.prototype.macroPlatformGenerator,
        "WarpWorld": FullScreenMario.prototype.macroWarpWorld,
        "CheepsStart": FullScreenMario.prototype.macroCheepsStart,
        "CheepsStop": FullScreenMario.prototype.macroCheepsStop,
        "BulletBillsStart": FullScreenMario.prototype.macroBulletBillsStart,
        "BulletBillsStop": FullScreenMario.prototype.macroBulletBillsStop,
        "LakituStop": FullScreenMario.prototype.macroLakituStop,
        "StartInsideCastle": FullScreenMario.prototype.macroStartInsideCastle,
        "EndOutsideCastle": FullScreenMario.prototype.macroEndOutsideCastle,
        "EndInsideCastle": FullScreenMario.prototype.macroEndInsideCastle,
        "Section": FullScreenMario.prototype.macroSection,
        "SectionPass": FullScreenMario.prototype.macroSectionPass,
        "SectionFail": FullScreenMario.prototype.macroSectionFail,
        "SectionDecider": FullScreenMario.prototype.macroSectionDecider
    },
    "entrances": {
        "Normal": FullScreenMario.prototype.mapEntranceNormal,
        "Plain": FullScreenMario.prototype.mapEntrancePlain,
        "Castle": FullScreenMario.prototype.mapEntranceCastle,
        "Walking": FullScreenMario.prototype.mapEntranceWalking,
        "Vine": FullScreenMario.prototype.mapEntranceVine,
        "PipeVertical": FullScreenMario.prototype.mapEntrancePipeVertical,
        "PipeHorizontal": FullScreenMario.prototype.mapEntrancePipeHorizontal,
    },
    "patterns": (function (patterns) {
        var pattern,
            i;
        for (i in patterns) {
            if (patterns.hasOwnProperty(i)) {
                pattern = patterns[i];
                if (!pattern.length) {
                    continue;
                }
                
                // Pattern's last array should previously be ["blank", width]
                pattern.width = pattern[pattern.length - 1][1];
                pattern.pop();
            }
        }
        return patterns;
    })({
        "BackRegular": [
            ["HillLarge", 0, 0],
            ["Cloud1", 68, 68],
            ["Bush3", 92, 0],
            ["HillSmall", 128, 0],
            ["Cloud1", 156, 76],
            ["Bush1", 188, 0],
            ["Cloud3", 220, 68],
            ["Cloud2", 292, 76],
            ["Bush2", 332, 0],
            ["Blank", 384]
        ],
        "BackCloud": [
            ["Cloud2", 28, 64],
            ["Cloud1", 76, 32],
            ["Cloud2", 148, 72],
            ["Cloud1", 228, 0],
            ["Cloud1", 284, 32],
            ["Cloud1", 308, 40],
            ["Cloud1", 372, 0],
            ["Blank", 384]
        ],
        "BackFence": [
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 32],
            ["Cloud1", 148, 68],
            ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["PlantLarge", 344, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin": [
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 32],
            ["Cloud1", 148, 68],
            ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin2": [
            ["Cloud2", 4, 68],
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0],
            ["Fence", 128, 0, 16],
            ["Cloud1", 148, 68],
            // ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["PlantLarge", 344, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin3": [
            ["Cloud2", 4, 68],
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 4],
            ["Cloud1", 148, 68],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ]
    }),
    "library": (function (maps) {
        var library = {},
            i;
        
        for (i = 0; i < maps.length; i += 1) {
            library[maps[i].name] = maps[i];
        }
        
        return library;
    })([
        {
            "name": "1-1",
            "locations": [
                  { "entry": "Plain" },
                  { "entry": "PipeVertical" },
                  { "area": 1 },
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackRegular", "repeat": 5 },
                        { "macro": "Floor", "width": 552 },
                        { "thing": "DecorativeBack", "x": 20, "y": 88 },
                        { "thing": "DecorativeDot", "x": 21.5, "y": 46.5 },
                        { "thing": "DecorativeDot", "x": 21.5, "y": 86.5 },
                        { "thing": "CustomText", "x": 20, "y": 36, "texts": [
                            { "text": "MOVE: ARROWS/WASD", "offset": 12 },
                            { "text": "FIRE/SPRINT: SHIFT/CTRL" },
                            { "text": "PAUSE: P/RIGHTCLICK", "offset": 8 } 
                        ]},
                        { "thing": "CustomText", "x": 24.5, "y": 84, "size": "Large", "texts": [
                            { "text": "SUPER" }
                        ]},
                        { "thing": "CustomText", "x": 24.5, "y": 68, "size": "Huge", "texts": [
                            { "text": "MARIO BROS." }
                        ]},
                        { "thing": "DecorativeDot", "x": 105.5, "y": 46.5 },
                        { "thing": "DecorativeDot", "x": 105.5, "y": 86.5 },
                        { "thing": "CustomText", "x": 52, "y": 44, "size": "Colored", "texts": [
                            { "text": "©1985 NINTENDO" }
                        ]},
                        { "thing": "Block", "x": 128, "y": 32 },
                        { "thing": "Brick", "x": 160, "y": 32 },
                        { "thing": "Block", "x": 168, "y": 32, "contents": "Mushroom" },
                        { "thing": "Goomba", "x": 176, "y": 8 },
                        { "thing": "Brick", "x": 176, "y": 32 },
                        { "thing": "Block", "x": 176, "y": 64 },
                        { "thing": "Block", "x": 184, "y": 32 },
                        { "thing": "Brick", "x": 192, "y": 32 },
                        { "macro": "Pipe", "x": 224, "height": 16 },
                        { "macro": "Pipe", "x": 304, "height": 24 },
                        { "thing": "Goomba", "x": 340, "y": 8 },
                        { "macro": "Pipe", "x": 368, "height": 32 },
                        { "thing": "Goomba", "x": 412, "y": 8 },
                        { "thing": "Goomba", "x": 422, "y": 8 },
                        { "macro": "Pipe", "x": 456, "height": 32, "transport": 2 },
                        { "thing": "Block", "x": 512, "y": 40, "contents": "Mushroom1Up", "hidden": true },
                        { "macro": "Floor", "x": 568, "width": 120 },
                        { "thing": "Brick", "x": 616, "y": 32 },
                        { "thing": "Block", "x": 624, "y": 32, "contents": "Mushroom" },
                        { "thing": "Brick", "x": 632, "y": 32 },
                        { "thing": "Brick", "x": 640, "y": 32 },
                        { "thing": "Goomba", "x": 640, "y": 72 },
                        { "thing": "Brick", "x": 648, "y": 64 },
                        { "thing": "Brick", "x": 656, "y": 64 },
                        { "thing": "Goomba", "x": 656, "y": 72 },
                        { "macro": "Fill", "thing": "Brick", "x": 664, "y": 64, "xnum": 5, "xwidth": 8 },
                        { "macro": "Floor", "x": 712, "width": 512 }, 
                        { "macro": "Fill", "thing": "Brick", "x": 728, "y": 64, "xnum": 3, "xwidth": 8 },
                        { "thing": "Brick", "x": 752, "y": 32, "contents": "Coin" },
                        { "thing": "Block", "x": 752, "y": 64 },
                        { "thing": "Goomba", "x": 776, "y": 8 },
                        { "thing": "Goomba", "x": 788, "y": 8 },
                        { "thing": "Brick", "x": 800, "y": 32 },
                        { "thing": "Brick", "x": 808, "y": 32, "contents": "Star" },
                        { "thing": "Block", "x": 848, "y": 32 },
                        { "thing": "Koopa", "x": 856, "y": 12 },
                        { "thing": "Block", "x": 872, "y": 32 },
                        { "thing": "Block", "x": 872, "y": 64, "contents": "Mushroom" },
                        { "thing": "Block", "x": 896, "y": 32 },
                        { "thing": "Goomba", "x": 912, "y": 8 },
                        { "thing": "Goomba", "x": 924, "y": 8 },
                        { "thing": "Brick", "x": 944, "y": 32 },
                        { "macro": "Fill", "thing": "Brick", "x": 968, "y": 64, "xnum": 3, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Goomba", "x": 992, "y": 8, "xnum": 4, "xwidth": 16 },
                        { "thing": "Brick", "x": 1024, "y": 64 },
                        { "thing": "Brick", "x": 1032, "y": 32 },
                        { "thing": "Block", "x": 1032, "y": 64 },
                        { "thing": "Brick", "x": 1040, "y": 32 },
                        { "thing": "Block", "x": 1040, "y": 64 },
                        { "thing": "Brick", "x": 1048, "y": 64 },
                        { "thing": "Stone", "x": 1072, "y": 8 },
                        { "thing": "Stone", "x": 1080, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1088, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1096, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1120, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1128, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1136, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1144, "y": 8 },
                        { "thing": "Stone", "x": 1184, "y": 8 },
                        { "thing": "Stone", "x": 1192, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1200, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1208, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1216, "y": 32, "height": 32 },
                        { "macro": "Floor", "x": 1240, "width": 656 },
                        { "thing": "Stone", "x": 1240, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1248, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1256, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1264, "y": 8 },
                        { "macro": "Pipe", "x": 1304, "height": 16, "entrance": 1 },
                        { "thing": "Brick", "x": 1344, "y": 32 },
                        { "thing": "Brick", "x": 1352, "y": 32 },
                        { "thing": "Block", "x": 1360, "y": 32 },
                        { "thing": "Brick", "x": 1368, "y": 32 },
                        { "thing": "Goomba", "x": 1392, "y": 8 },
                        { "thing": "Goomba", "x": 1404, "y": 8 },
                        { "macro": "Pipe", "x": 1432, "height": 16 },
                        { "thing": "Stone", "x": 1448, "y": 8 },
                        { "thing": "Stone", "x": 1456, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1464, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1472, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1480, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1488, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 1496, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1504, "y": 64, "height": 64, "width": 16 },
                        { "macro": "EndOutsideCastle", "x": 1584, "y": 0, "transport": { "map": "1-2" } }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Ceiling", "x": 32, "width": 56 },
                        { "macro": "Floor", "x": 0, "y": 0, "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "x": 0, "y": 8, "ynum": 11, "yheight": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 8, "xnum": 7, "ynum": 3, "xwidth": 8, "yheight": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 33, "y": 31, "xnum": 7, "ynum": 2, "xwidth": 8, "yheight": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 41, "y": 63, "xnum": 5, "ynum": 1, "xwidth": 8 },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 1, "width": 16 },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }
            ]
        }, {
            "name": "1-2",
            "locations": [
                { "entry": "Walking" }, 
                { "area": 1 },
                { "area": 2 },
                { "area": 1, "entry": "PipeVertical" },
                { "area": 3, "entry": "PipeVertical" }, 
                { "area": 1 }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 1 },
                        { "macro": "Floor", "width": 192 },
                        { "macro": "CastleSmall" },
                        { "thing": "PipeHorizontal", "x": 80, "y": 16, "transport": 1 },
                        { "macro": "Pipe", "x": 96, "height": 32 }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 640 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Ceiling", "x": 48, "width": 664 },
                        { "thing": "Block", "x": 80, "y": 32, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Block", "x": 88, "y": 32, "xnum": 4 },
                        { "thing": "Goomba", "x": 128, "y": 8 },
                        { "thing": "Stone", "x": 136, "y": 8 },
                        { "thing": "Goomba", "x": 136, "y": 16 },
                        { "thing": "Stone", "x": 152, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 168, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 184, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 200, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 216, "y": 24, "height": 24 },
                        { "thing": "Goomba", "x": 232, "y": 8 },
                        { "thing": "Brick", "x": 232, "y": 40, "contents": "Coin" },
                        { "thing": "Stone", "x": 248, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 264, "y": 16, "height": 16 },
                        { "macro": "Fill", "thing": "Brick", "x": 312, "y": 32, "ynum": 3 },
                        { "thing": "Brick", "x": 320, "y": 32 },
                        { "thing": "Coin", "x": 321, "y": 39 },
                        { "macro": "Fill", "thing": "Brick", "x": 328, "y": 32, "ynum": 3 },
                        { "macro": "Fill", "thing": "Coin", "x": 330, "y": 60, "xnum": 4, "xwidth": 8 },
                        { "thing": "Brick", "x": 336, "y": 48 },
                        { "thing": "Brick", "x": 344, "y": 48 },
                        { "macro": "Fill", "thing": "Koopa", "x": 352, "y": 12, "xnum": 2, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Brick", "x": 352, "y": 32, "ynum": 3 },
                        { "thing": "Brick", "x": 360, "y": 32 },
                        { "thing": "Coin", "x": 361, "y": 39 },
                        { "macro": "Fill", "thing": "Brick", "x": 368, "y": 32, "ynum": 2 },
                        { "thing": "Brick", "x": 368, "y": 48, "contents": "Star" },
                        { "macro": "Fill", "thing": "Brick", "x": 416, "y": 32, "xnum": 2, "ynum": 5 },
                        { "macro": "Fill", "thing": "Brick", "x": 432, "y": 16, "xnum": 2, "ynum": 3 },
                        { "macro": "Fill", "thing": "Brick", "x": 432, "y": 72, "xnum": 2, "ynum": 2 },
                        { "macro": "Fill", "thing": "Brick", "x": 464, "y": 32, "xnum": 4, "ynum": 1 },
                        { "macro": "Fill", "thing": "Brick", "x": 464, "y": 72, "xnum": 5, "ynum": 2 },
                        { "macro": "Fill", "thing": "Coin", "x": 465, "y": 39, "xnum": 4, "xwidth": 8 },
                        { "thing": "Koopa", "x": 472, "y": 12 },
                        { "macro": "Fill", "thing": "Brick", "x": 496, "y": 32, "xnum": 2, "ynum": 7 },
                        { "thing": "Goomba", "x": 494, "y": 8 },
                        { "thing": "Goomba", "x": 510, "y": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 528, "y": 72, "xnum": 4, "ynum": 2 },
                        { "macro": "Fill", "thing": "Brick", "x": 536, "y": 32, "ynum": 5 },
                        { "macro": "Fill", "thing": "Brick", "x": 544, "y": 32, "xnum": 2 },
                        { "thing": "Coin", "x": 545, "y": 39 },
                        { "thing": "Brick", "x": 552, "y": 40, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Brick", "x": 576, "y": 32, "xnum": 2 },
                        { "thing": "Brick", "x": 576, "y": 40 },
                        { "macro": "Fill", "thing": "Brick", "x": 576, "y": 48, "xnum": 2, "ynum": 3 },
                        { "thing": "Brick", "x": 584, "y": 40, "contents": "Coin" },
                        { "thing": "Goomba", "x": 584, "y": 72 },
                        { "macro": "Fill", "thing": "Brick", "x": 608, "y": 32, "xnum": 4 },
                        { "macro": "Fill", "thing": "Goomba", "x": 608, "y": 40, "xnum": 2, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Brick", "x": 608, "y": 72, "xnum": 4, "ynum": 2 },
                        { "macro": "Floor", "x": 664, "width": 272 },
                        { "macro": "Fill", "thing": "Brick", "x": 672, "y": 40, "xnum": 6, "ynum": 2 },
                        { "macro": "Fill", "thing": "Coin", "x": 674, "y": 64, "xnum": 6, "xwidth": 8 },
                        { "thing": "Brick", "x": 712, "y": 88, "contents": "Mushroom1Up" },
                        { "macro": "Ceiling", "x": 720, "width": 360 },
                        { "macro": "Fill", "thing": "Goomba", "x": 768, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Pipe", "x": 800, "height": 24, "piranha": true, "transport": 2 },
                        { "macro": "Pipe", "x": 848, "height": 32, "piranha": true },
                        { "thing": "Goomba", "x": 872, "y": 8 },
                        { "macro": "Pipe", "x": 896, "height": 16, "piranha": true, "entrance": 3 },
                        { "macro": "Floor", "x": 952, "width": 16 },
                        { "macro": "Fill", "thing": "Brick", "x": 952, "y": 8, "xnum": 2, "ynum": 3 },
                        { "macro": "Floor", "x": 984, "width": 96 },
                        { "thing": "Stone", "x": 1040, "y": 8 },
                        { "thing": "Stone", "x": 1048, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1056, "y": 24, "height": 24 },
                        { "thing": "Goomba", "x": 1056, "y": 32 },
                        { "thing": "Stone", "x": 1064, "y": 32, "height": 32 },
                        { "thing": "Goomba", "x": 1064, "y": 48 },
                        { "thing": "Stone", "x": 1072, "y": 32, "height": 32 },
                        { "macro": "PlatformGenerator", "x": 1096, "width": 24 },
                        { "macro": "Floor", "x": 1144, "width": 64 },
                        { "macro": "Fill", "thing": "Brick", "x": 1144, "y": 40, "xnum": 5, "ynum": 1 },
                        { "thing": "Koopa", "x": 1152, "y": 12, "smart": true },
                        { "thing": "Brick", "x": 1184, "y": 40, "contents": "Mushroom" },
                        { "macro": "PlatformGenerator", "x": 1224, "width": 24, "direction": -1 },
                        { "macro": "Floor", "x": 1264,  "width": 256 },
                        { "macro": "Fill", "thing": "Brick", "x": 1264, "y": 8, "xnum": 17, "ynum": 3 },
                        { "thing": "PipeHorizontal", "x": 1312, "y": 40, "transport": 4 },
                        { "thing": "PipeVertical", "x": 1328, "y": 88, "height": 64 },
                        { "thing": "ScrollEnabler", "x": 1328, "y": 120, "height": 48 },
                        { "macro": "Ceiling", "x": 1272, "width": 56 },
                        { "macro": "Fill", "thing": "Brick", "x": 1344, "y": 32, "xnum": 7, "ynum": 7 },
                        { "macro": "Ceiling", "x": 1344, "width": 136 },
                        { "thing": "ScrollBlocker", "x": 1344 },
                        { "macro": "WarpWorld", "x": 1400, "warps": [4, 3, 2] },
                        { "macro": "Fill", "thing": "Brick", "x": 1504, "y": 8, "xnum": 2, "ynum": 11 },
                        { "thing": "ScrollBlocker", "x": 1518, "y": 8 }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 24, "y": 32, "xnum": 9 },
                        { "macro": "Fill", "thing": "Brick", "x": 24, "y": 64, "xnum": 10, "ynum": 4 },
                        { "macro": "Fill", "thing": "Coin", "x": 25, "y": 7, "xnum": 9, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 33, "y": 39, "xnum": 8, "xwidth": 8 },
                        { "thing": "Brick", "x": 96, "y": 32, "contents": "Coin" },
                        { "macro": "Fill", "thing": "Brick", "x": 104, "y": 24, "xnum": 2, "ynum": 9 },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 3 },
                        { "thing": "PipeVertical", "x": 120, "y": 100, "height": 100 }
                    ]
                }, {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 464 },
                        { "macro": "Pipe", "height": 16, "piranha": true, "entrance": 4 },
                        { "macro": "Pattern", "pattern": "BackRegular", "x": 104, },
                        { "thing": "Stone", "x": 16, "y": 8 },
                        { "thing": "Stone", "x": 24, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 32, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 40, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 48, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 56, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 64, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 72, "y": 64, "height": 64, "width": 16 },
                        { "macro": "EndOutsideCastle", "x": 152, "transport": { "map": "1-3" } }
                    ]
                }
            ]
        }, {
            "name": "1-3",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackCloud", "x": 0, "y": 4, "repeat": 5 },
                        { "macro": "Floor", "x": 0, "y": 0, "width": 128 },
                        { "macro": "CastleSmall" },
                        { "macro": "Tree", "x": 144, "y": 8, "width": 32 },
                        { "macro": "Tree", "x": 192, "y": 32, "width": 64, "solidTrunk": true },
                        { "macro": "Tree", "x": 208, "y": 64, "width": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 217, "y": 71, "xnum": 3, "xwidth": 8 },
                        { "thing": "Koopa", "x": 240, "y": 76, "smart": true },
                        { "macro": "Tree", "x": 256, "y": 8, "width": 24 },
                        { "thing": "Coin", "x": 266, "y": 15 },
                        { "macro": "Tree", "x": 280, "y": 40, "width": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 297, "y": 87, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 320, "y": 72, "width": 56 },
                        { "macro": "Fill", "thing": "Goomba", "x": 352, "y": 80, "xnum": 2, "xwidth": 16 },
                        { "macro": "Tree", "x": 400, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 402, "y": 55, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 440, "y": 56, "width": 24, "floating": true, "begin": -4, "end": 56 },
                        { "macro": "Tree", "x": 472, "width": 40 },
                        { "thing": "Block", "x": 472, "y": 24, "contents": "Mushroom" },
                        { "macro": "Tree", "x": 480, "y": 64, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 482, "y": 71, "xnum": 4, "xwidth": 8 },
                        { "macro": "Tree", "x": 520, "width": 40 },
                        { "macro": "Tree", "x": 560, "y": 32, "width": 24 },
                        { "thing": "Koopa", "x": 592, "y": 76, "smart": true, "jumping": true, "floating": true, "begin": 16, "end": 88 },
                        { "macro": "Tree", "x": 608, "y": 56, "width": 48 },
                        { "thing": "Goomba", "x": 640, "y": 64 },
                        { "macro": "Fill", "thing": "Coin", "x": 681, "y": 63, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 688, "y": 40, "width": 24, "sliding": true, "begin": 660, "end": 720 },
                        { "macro": "Fill", "thing": "Coin", "x": 745, "y": 71, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 752, "y": 32, "width": 24, "sliding": true, "begin": 708, "end": 776 },
                        { "macro": "Fill", "thing": "Coin", "x": 777, "y": 71, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 784, "y": 16, "width": 32 },
                        { "macro": "Tree", "x": 832, "y": 48, "width": 64, "solidTrunk": true },
                        { "thing": "Koopa", "x": 880, "y": 60, "smart": true },
                        { "macro": "Tree", "x": 904, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 906, "y": 7, "xnum": 3, "xwidth": 8 },
                        { "thing": "Koopa", "x": 912, "y": 68, "smart": true, "jumping": true, "floating": true, "begin": 4, "end": 76 },
                        { "macro": "Tree", "x": 928, "y": 32, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 963, "y": 63, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 976, "y": 32, "width": 32, "solidTrunk": true },
                        { "macro": "Floor", "x": 1032, "width": 368 },
                        { "thing": "Platform", "x": 1048, "y": 56, "width": 24, "sliding": true, "begin": 1024, "end": 1068 },
                        { "thing": "Koopa", "x": 1064, "y": 12, "smart": true },
                        { "thing": "Stone", "x": 1104, "y": 32, "width": 16, "height": 32 },
                        { "thing": "Stone", "x": 1120, "y": 48, "width": 16, "height": 48 },
                        { "thing": "Stone", "x": 1136, "y": 64, "width": 16, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 1224, "large": true, "walls": 12, "transport": { "map": "1-4" } }
                    ]
                }
            ]
        }, {
            "name": "1-4",
            "time": 300,
            "locations": [
                { "entry": "Castle" }
            ],
            "areas": [
                {
                    "setting": "Castle",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "StartInsideCastle", "width": 104 },
                        { "thing": "Stone", "y": 88, "width": 192, "height": 24 },
                        { "macro": "Water", "x": 104, "y": 8, "width": 24 },
                        { "macro": "Floor", "x": 120, "y": 24, "width": 88 },
                        { "thing": "Stone", "x": 184, "y": 64 },
                        { "thing": "CastleBlock", "x": 184, "y": 56 },
                        { "thing": "Stone", "x": 192, "y": 88, "width": 1088 },
                        { "macro": "Water", "x": 208, "width": 24 },
                        { "macro": "Floor", "x": 232, "y": 24, "width": 8 },
                        { "macro": "Floor", "x": 240, "y": 16, "width": 8 },
                        { "thing": "CastleBlock", "x": 240, "y": 24, "fireballs": 6, "speed": -1 },
                        { "thing": "Block", "x": 240, "y": 56, "contents": "Mushroom" },
                        { "macro": "Floor", "x": 248, "y": 24, "width": 8 },
                        { "macro": "Water", "x": 256, "width": 24 },
                        { "macro": "Floor", "x": 280, "y": 0, "width": 744 },
                        { "thing": "Stone", "x": 280, "y": 32, "width": 296 },
                        { "thing": "Stone", "x": 280, "y": 24, "width": 552, "height": 24 },
                        { "thing": "Stone", "x": 296, "y": 80, "width": 280, "height": 24 },
                        { "thing": "CastleBlock", "x": 296, "y": 56 },
                        { "thing": "CastleBlock", "x": 392, "y": 56, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 480, "y": 56, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 536, "y": 56, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 608, "y": 32, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 640, "y": 72 },
                        { "thing": "Stone", "x": 640, "y": 80 },
                        { "thing": "CastleBlock", "x": 672, "y": 32, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 704, "y": 72, "fireballs": 6, "direction": 1 },
                        { "thing": "Stone", "x": 704, "y": 80 },
                        { "thing": "CastleBlock", "x": 736, "y": 32 },
                        { "thing": "Stone", "x": 776, "y": 80, "width": 56, "height": 16 },
                        { "macro": "Fill", "thing": "Block", "x": 848, "y": 32, "xnum": 3, "xwidth": 24, "hidden": true },
                        { "macro": "Fill", "thing": "Block", "x": 856, "y": 64, "xnum": 3, "xwidth": 24, "hidden": true },
                        { "thing": "Stone", "x": 928, "y": 24, "width": 32, "height": 24 },
                        { "thing": "Stone", "x": 984, "y": 24, "width": 40, "height": 24 },
                        { "thing": "Stone", "x": 984, "y": 80, "width": 40, "height": 16 },
                        { "macro": "EndInsideCastle", "x": 1024, "transport": { "map": "2-1" } },
                        { "thing": "Platform", "x": 1108, "y": 56, "width": 16, "sliding": true, "begin": 1080, "end": 1112, "nocollidechar": true }
                    ]
                }
            ]
        }, {
            "name": "2-1",
            "locations": [
                { "entry": "Plain" }, 
                { "xloc": 1288 }, 
                { "entry": "PipeVertical" }, 
                { "area": 1, "entry": "Vine" }, 
                { "area": 2 }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 736 },
                        { "macro": "CastleLarge", "x": -16 },
                        { "macro": "Pattern", "pattern": "BackFence", "repeat": 2 },
                        { "thing": "Brick", "x": 120, "y": 32 },
                        { "thing": "Brick", "x": 128, "y": 32, "contents": "Mushroom" },
                        { "thing": "Brick", "x": 136, "y": 32 },
                        { "thing": "Stone", "x": 160, "y": 8 },
                        { "thing": "Stone", "x": 168, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 176, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 184, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 192, "y": 40, "height": 40 },
                        { "thing": "Goomba", "x": 192, "y": 48 },
                        { "thing": "Block", "x": 224, "y": 32, "hidden": true },
                        { "thing": "Block", "x": 224, "y": 64, "contents": "Mushroom1Up", "hidden": true },
                        { "macro": "Fill", "thing": "Brick", "x": 232, "y": 64, "xnum": 3 },
                        { "thing": "Koopa", "x": 256, "y": 12 },
                        { "thing": "Koopa", "x": 264, "y": 12 },
                        { "thing": "Stone", "x": 272, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 280, "y": 16, "height": 16 },
                        { "thing": "Goomba", "x": 336, "y": 8 },
                        { "thing": "Goomba", "x": 348, "y": 8 },
                        { "macro": "Pipe", "x": 368, "height": 32, "Piranha": "true" },
                        { "thing": "Block", "x": 424, "y": 32, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Block", "x": 424, "y": 64, "xnum": 5 },
                        { "macro": "Fill", "thing": "Block", "x": 432, "y": 32, "xnum": 4 },
                        { "thing": "Koopa", "x": 440, "y": 44 },
                        { "thing": "Goomba", "x": 472, "y": 8 },
                        { "thing": "Goomba", "x": 484, "y": 8 },
                        { "thing": "Koopa", "x": 528, "y": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 544, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "thing": "Brick", "x": 544, "y": 32 },
                        { "thing": "Brick", "x": 552, "y": 64, "contents": "Star" },
                        { "thing": "Brick", "x": 560, "y": 64, "xnum": 3 },
                        { "macro": "Pipe", "x": 592, "height": 32, "piranha": true },
                        { "macro": "Fill", "thing": "Block", "x": 632, "y": 32, "xnum": 4 },
                        { "macro": "Fill", "thing": "Brick", "x": 648, "y": 64, "xnum": 2 },
                        { "thing": "Brick", "x": 664, "y": 64, "contents": ["Vine", { "transport": 3 }] },
                        { "macro": "Fill", "thing": "Brick", "x": 672, "y": 64, "xnum": 2 },
                        { "macro": "Fill", "thing": "Block", "x": 680, "y": 32, "xnum": 3 },
                        { "macro": "Fill", "thing": "Goomba", "x": 704, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Brick", "x": 736, "y": 64, "xnum": 4 },
                        { "macro": "Floor", "x": 768, "width": 80 },
                        { "macro": "Pattern", "pattern": "BackFenceMin", "x": 768 },
                        { "thing": "Goomba", "x": 820, "y": 40 },
                        { "macro": "Pipe", "x": 824, "height": 32, "piranha": true, "transport": 4 },
                        { "macro": "Floor", "x": 872, "width": 240 },
                        { "thing": "Goomba", "x": 916, "y": 24 },
                        { "macro": "Pipe", "x": 920, "height": 16, "piranha": true, "entrance": 2 },
                        { "thing": "Goomba", "x": 962, "y": 8 },
                        { "macro": "Pipe", "x": 976, "height": 32, "piranha": true },
                        { "thing": "Brick", "x": 1000, "y": 64, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Brick", "x": 1008, "y": 64, "xnum": 3 },
                        { "macro": "Pipe", "x": 1008, "height": 24 },
                        { "macro": "Pipe", "x": 1040, "height": 40, "piranha": true },
                        { "macro": "Floor", "x": 1136, "width": 80 },
                        { "macro": "Pattern", "pattern": "BackFence", "x": 1152, "repeat": 2 },
                        { "thing": "Koopa", "x": 1200, "y": 36, "jumping": true },
                        { "macro": "Floor", "x": 1232, "width": 576 },
                        { "thing": "Stone", "x": 1232, "y": 24, "height": 24 },
                        { "thing": "Brick", "x": 1288, "y": 32, "contents": "Coin" },
                        { "macro": "Fill", "thing": "Goomba", "x": 1296, "y": 8, "xnum": 2, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Brick", "x": 1312, "y": 64, "xnum": 5 },
                        { "macro": "Fill", "thing": "Koopa", "x": 1352, "y": 12, "xnum": 2, "xwidth": 16 },
                        { "thing": "Block", "x": 1360, "y": 32 },
                        { "thing": "Block", "x": 1374, "y": 64, "contents": "Mushroom" },
                        { "macro": "Pipe", "x": 1408, "height": 24, "piranha": true },
                        { "thing": "Koopa", "x": 1480, "y": 12 },
                        { "macro": "Fill", "thing": "Brick", "x": 1480, "y": 32, "xnum": 2 },
                        { "thing": "Block", "x": 1488, "y": 64, "contents": "Coin", "hidden": true },
                        { "thing": "Springboard", "x": 1504, "y": 14.5 },
                        { "macro": "Fill", "thing": "Stone", "x": 1520, "y": 80, "xnum": 2, "height": 80 },
                        { "macro": "EndOutsideCastle", "x": 1600, "transport": { "map": "2-2" } }
                    ]
                }, {
                    "setting": "Sky",
                    "exit": 1,
                    "creation": [
                        { "thing": "Stone", "width": 32 },
                        { "thing": "Stone", "x": 40, "width": 456 },
                        { "macro": "Fill", "thing": "Coin", "x": 121, "y": 55, "xnum": 16, "xwidth": 8 },
                        { "thing": "Platform", "x": 128, "y": 24, "width": 24, "transport": true },
                        { "macro": "Fill", "thing": "Coin", "x": 257, "y": 71, "xnum": 3, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 289, "y": 63, "xnum": 16, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 425, "y": 71, "xnum": 3, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 553, "y": 7, "xnum": 3, "xwidth": 8 }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Ceiling", "x": 32, "width": 56 },
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 8, "xnum": 7, "ynum": 3 },
                        { "macro": "Fill", "thing": "Coin", "x": 33, "y": 31, "xnum": 7, "ynum": 2, "yheight": 16, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 41, "y": 63, "xnum": 5, "xwidth": 8 },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 2 },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }
            ]
        }, {
            "name": "2-2",
            "locations": [
                { "entry": "Walking" }, 
                { "area": 1 }, 
                { "area": 2, "entry": "PipeVertical" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 2 },
                        { "macro": "Floor", "width": 192 },
                        { "macro": "CastleSmall" },
                        { "thing": "PipeHorizontal", "x": 80, "y": 16, "transport": 1 },
                        { "macro": "Pipe", "x": 96, "height": 32 }
                    ]
                }, {
                    "setting": "Underwater",
                    "blockBoundaries": true,
                    "underwater": true,
                    "creation": [
                        { "macro": "Floor", "width": 536 }, 
                        { "thing": "Coral", "x": 96, "y": 24, "height": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 121, "y": 7, "xnum": 2, "xwidth": 8 },
                        { "thing": "Stone", "x": 152, "y": 32, "width": 24 },
                        { "thing": "Blooper", "x": 184, "y": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 224, "y": 64, "xnum": 3, "xwidth": 8 },
                        { "thing": "Coral", "x": 272, "y": 40, "height": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 296, "y": 7, "xnum": 3, "xwidth": 8 },
                        { "thing": "Stone", "x": 344, "y": 32, "width": 16 },
                        { "thing": "Coral", "x": 344, "y": 48, "height": 16 },
                        { "thing": "Blooper", "x": 376, "y": 32 },
                        { "thing": "Coral", "x": 408, "y": 32, "height": 32 },
                        { "thing": "Blooper", "x": 448, "y": 24 },
                        { "thing": "Stone", "x": 520, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 528, "y": 40, "height": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 546, "y": 23, "xnum": 3, "xwidth": 8 },
                        { "macro": "Floor", "x": 576, "width": 480 },
                        { "thing": "Stone", "x": 576, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 584, "y": 24, "height": 24 },
                        { "thing": "CheepCheep", "x": 616, "y": 24 },
                        { "thing": "Stone", "x": 632, "y": 24, "width": 16, "height": 24 },
                        { "thing": "Stone", "x": 632, "y": 88, "width": 16, "height": 24 },
                        { "thing": "CheepCheep", "x": 640, "y": 48 },
                        { "thing": "CheepCheep", "x": 656, "y": 16 },
                        { "thing": "Stone", "x": 664, "y": 64, "width": 24 },
                        { "thing": "Blooper", "x": 672, "y": 40 },
                        { "thing": "Coral", "x": 672, "y": 80, "height": 16 },
                        { "thing": "Coral", "x": 720, "y": 24, "height": 24 },
                        { "thing": "Blooper", "x": 760, "y": 80 },
                        { "thing": "CheepCheep", "x": 760, "y": 56 },
                        { "thing": "CheepCheep", "x": 784, "y": 80, "smart": true },
                        { "macro": "Fill", "thing": "Coin", "x": 816, "y": 15, "xnum": 3, "xwidth": 8 },
                        { "thing": "Stone", "x": 824, "y": 32, "width": 16 },
                        { "thing": "Coral", "x": 824, "y": 64, "height": 32 },
                        { "thing": "Blooper", "x": 848, "y": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 912, "y": 55, "xnum": 3, "xwidth": 8 },
                        { "thing": "Stone", "x": 928, "y": 40, "width": 16 },
                        { "thing": "CheepCheep", "x": 944, "y": 72 },
                        { "thing": "Coral", "x": 968, "y": 32, "height": 32 },
                        { "thing": "CheepCheep", "x": 1032, "y": 24, "smart": true },
                        { "thing": "Stone", "x": 1040, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1048, "y": 16, "height": 16 },
                        { "thing": "CheepCheep", "x": 1056, "y": 16 },
                        { "thing": "Stone", "x": 1056, "y": 88, "height": 24 },
                        { "thing": "Stone", "x": 1064, "y": 72, "width": 64 },
                        { "thing": "Coin", "x": 1073, "y": 15 },
                        { "macro": "Fill", "thing": "Coin", "x": 1080, "y": 7, "xnum": 3, "xwidth": 8 },
                        { "thing": "Coin", "x": 1105, "y": 15 },
                        { "thing": "CheepCheep", "x": 1100, "y": 40 },
                        { "macro": "Floor", "x": 1128, "width": 136 },
                        { "thing": "Stone", "x": 1128, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1136, "y": 32, "height": 32 },
                        { "thing": "CheepCheep", "x": 1160, "y": 32 },
                        { "thing": "Coral", "x": 1184, "y": 16, "height": 16 },
                        { "thing": "Coral", "x": 1200, "y": 24, "height": 24 },
                        { "thing": "CheepCheep", "x": 1206, "y": 56, "smart": true },
                        { "thing": "Stone", "x": 1256, "y": 64, "height": 64 },
                        { "thing": "Stone", "x": 1264, "y": 64, "width": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 1281, "y": 7, "xnum": 3, "ynum": 2, "xwidth": 8, "yheight": 24 },
                        { "thing": "Stone", "x": 1304, "y": 64, "width": 16 },
                        { "thing": "Stone", "x": 1320, "y": 64, "height": 64 },
                        { "macro": "Floor", "x": 1320, "width": 320 },
                        { "thing": "CheepCheep", "x": 1320, "y": 80 },
                        { "thing": "CheepCheep", "x": 1344, "y": 16 },
                        { "macro": "Fill", "thing": "Stone", "x": 1384, "y": 32, "ynum": 2, "yheight": 32, "width": 40 },
                        { "thing": "Coral", "x": 1392, "y": 80, "height": 16 },
                        { "thing": "CheepCheep", "x": 1408, "y": 40 },
                        { "macro": "Fill", "thing": "Stone", "x": 1448, "y": 32, "ynum": 2, "yheight": 32, "width": 32 },
                        { "thing": "CheepCheep", "x": 1472, "y": 72, "smart": true },
                        { "thing": "CheepCheep", "x": 1496, "y": 48, "smart": true },
                        { "thing": "Stone", "x": 1488, "y": 8, "width": 40 },
                        { "thing": "Stone", "x": 1496, "y": 16, "width": 32 },
                        { "thing": "Stone", "x": 1504, "y": 24, "width": 24 },
                        { "thing": "Stone", "x": 1512, "y": 32, "width": 16 },
                        { "thing": "Stone", "x": 1512, "y": 88, "width": 16, "height": 32 },
                        { "thing": "PipeHorizontal", "x": 1520, "y": 48, "transport": 2, "small": true },
                        { "thing": "Stone", "x": 1528, "y": 88, "width": 128, "height": 88 },
                        { "macro": "Floor", "x": 1640, "width": 16 }
                    ]
                }, {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 464 },
                        { "macro": "Pipe", "height": 16, "piranha": true, "entrance": 2 },
                        { "macro": "Pattern", "pattern": "BackRegular", "x": 104, },
                        { "thing": "Stone", "x": 16, "y": 8 },
                        { "thing": "Stone", "x": 24, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 32, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 40, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 48, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 56, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 64, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 72, "y": 64, "height": 64, "width": 16 },
                        { "macro": "EndOutsideCastle", "x": 152, "transport": { "map": "2-3" } }
                    ]
                }
            ]
        }, {
            "name": "2-3",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 56 },
                        { "macro": "CastleSmall" },
                        { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 4 },
                        { "macro": "CheepsStart", "x": 64 },
                        { "macro": "Tree", "x": 64, "width": 64 },
                        { "thing": "Stone", "x": 80, "y": 8 },
                        { "thing": "Stone", "x": 88, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 96, "y": 24, "height": 24, "width": 24 },
                        { "macro": "Bridge", "x": 120, "y": 24, "width": 136, "end": true },
                        { "macro": "Bridge", "x": 256, "y": 24, "width": 128, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 290, "y": 63, "xnum": 4, "xwidth": 8 },
                        { "macro": "Bridge", "x": 384, "y": 24, "width": 128, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 441, "y": 63, "xnum": 3, "xwidth": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 449, "y": 55, "xnum": 2, "xwidth": 16 },
                        { "macro": "Bridge", "x": 544, "y": 24, "width": 96, "begin": true, "end": true },
                        { "macro": "Bridge", "x": 672, "y": 24, "width": 96, "begin": true, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 777, "y": 63, "xnum": 3, "xwidth": 8 },
                        { "macro": "Bridge", "x": 792, "y": 32, "width": 56, "begin": true, "end": true },
                        { "thing": "Block", "x": 816, "y": 64, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Coin", "x": 865, "y": 63, "xnum": 3, "xwidth": 8 },
                        { "macro": "Tree", "x": 896, "width": 64 },
                        { "macro": "Bridge", "x": 976, "y": 24, "width": 24 },
                        { "macro": "Bridge", "x": 1016, "y": 24, "width": 136, "begin": true, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 1064, "y": 63, "xnum": 6, "xwidth": 8 },
                        { "macro": "Bridge", "x": 1168, "y": 8, "width": 80, "begin": true, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 1193, "y": 39, "xnum": 4, "xwidth": 8 },
                        { "macro": "Bridge", "x": 1272, "y": 24, "width": 80, "begin": true, "end": true },
                        { "macro": "Bridge", "x": 1368, "y": 24, "width": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 1385, "y": 55, "xnum": 6, "xwidth": 8 },
                        { "macro": "Bridge", "x": 1400, "y": 24, "width": 16 },
                        { "macro": "Bridge", "x": 1432, "y": 24, "width": 16 },
                        { "macro": "Bridge", "x": 1464, "y": 24, "width": 80, "begin": true },
                        { "macro": "Tree", "x": 1536, "width": 104 },
                        { "macro": "Pattern", "pattern": "BackCloud", "x": 1536, "y": 4, "skips": [5] },
                        { "thing": "Stone", "x": 1544, "y": 24, "width": 16, "height": 24 },
                        { "thing": "Stone", "x": 1560, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1568, "y": 8 },
                        { "macro": "CheepsStop", "x": 1600 },
                        { "macro": "Floor", "x": 1656, "width": 280 },
                        { "thing": "Stone", "x": 1664, "y": 8 },
                        { "thing": "Stone", "x": 1672, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1680, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1688, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1696, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1704, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 1712, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1720, "y": 64, "width": 16, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 1800, "large": true, "walls": 7, "transport": { "map": "2-4" } }
                    ]
                }
            ]
        }, {
            "name": "2-4",
            "time": 300,
            "locations": [
                { "entry": "Castle" }
            ],
            "areas": [
                {
                    "setting": "Castle",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "StartInsideCastle", "width": 128 },
                        { "thing": "Stone", "y": 88, "width": 128, "height": 24 },
                        { "thing": "Podoboo", "x": 128, "y": -32 },
                        { "macro": "Water", "x": 128, "width": 128 },
                        { "thing": "Stone", "x": 144, "y": 32, "width": 16 },
                        { "thing": "Stone", "x": 176, "y": 48 },
                        { "thing": "CastleBlock", "x": 184, "y": 48 },
                        { "thing": "Block", "x": 184, "y": 80, "contents": "Mushroom" },
                        { "thing": "Stone", "x": 192, "y": 48 },
                        { "thing": "Stone", "x": 216, "y": 32, "width": 16 },
                        { "thing": "Podoboo", "x": 240, "y": -32 },
                        { "macro": "Floor", "x": 256, "y": -8, "width": 416 },
                        { "thing": "Stone", "x": 256, "y": 24, "width": 16, "height": 32 },
                        { "thing": "Stone", "x": 272, "y": 88, "width": 392, "height": 24 },
                        { "thing": "Stone", "x": 272, "y": 64, "width": 168 },
                        { "thing": "Stone", "x": 272, "width": 72 },
                        { "thing": "Stone", "x": 296, "y": 32, "width": 96 },
                        { "thing": "CastleBlock", "x": 344 },
                        { "thing": "Stone", "x": 352, "width": 88 },
                        { "thing": "CastleBlock", "x": 392, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 400, "y": 32, "width": 88 },
                        { "thing": "CastleBlock", "x": 440, "y": 64, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 440 },
                        { "thing": "Stone", "x": 448, "width": 88 },
                        { "thing": "Stone", "x": 448, "y": 64, "width": 216 },
                        { "thing": "CastleBlock", "x": 488, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 496, "y": 32, "width": 88 },
                        { "thing": "CastleBlock", "x": 536 },
                        { "thing": "Stone", "x": 544, "width": 96 },
                        { "thing": "CastleBlock", "x": 584, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 640, "y": 24, "width": 32, "height": 32 },
                        { "thing": "CastleBlock", "x": 656, "y": 56, "fireballs": 6 },
                        { "macro": "PlatformGenerator", "x": 686, "width": 12, "direction": -1 },
                        { "macro": "PlatformGenerator", "x": 710, "width": 12 },
                        { "macro": "Floor", "x": 736, "y": 16 },
                        { "thing": "CastleBlock", "x": 736, "y": 24, "fireballs": 6, "direction": 1 },
                        { "macro": "Floor", "x": 744, "y": 24, "width": 48 },
                        { "thing": "Stone", "x": 744, "y": 88, "width": 48, "height": 24 },
                        { "macro": "Floor", "x": 792, "width": 80 },
                        { "macro": "Fill", "thing": "Coin", "x": 817, "y": 7, "xnum": 3, "ynum": 2, "xwidth": 8, "yheight": 32 },
                        { "thing": "CastleBlock", "x": 824, "y": 16 },
                        { "thing": "Stone", "x": 864, "y": 24, "height": 24 },
                        { "macro": "Water", "x": 872, "width": 16 },
                        { "thing": "Stone", "x": 864, "y": 24, "height": 24 },
                        { "macro": "Floor", "x": 888, "y": 24, "width": 16 },
                        { "macro": "Water", "x": 904, "width": 32 },
                        { "macro": "Floor", "x": 920, "width": 104 },
                        { "thing": "Stone", "x": 920, "y": 24, "width": 40, "height": 24 },
                        { "thing": "Stone", "x": 920, "y": 88, "width": 104, "height": 24 },
                        { "macro": "Fill", "thing": "Stone", "x": 976, "y": 24, "xnum": 2, "xwidth": 32, "width": 16, "height": 24 },
                        { "macro": "Fill", "thing": "Brick", "x": 1024, "y": 64, "xnum": 6 },
                        { "macro": "EndInsideCastle", "x": 1024, "spawnType": "Shell", "transport": { "map": "3-1" }},
                        { "thing": "Platform", "x": 1108, "y": 56, "width": 16, "sliding": true, "begin": 1080, "end": 1112, "nocollidechar": true }
                    ]
                }
            ]
        }, {
            "name": "3-1",
            "time": 300,
            "locations": [
                { "entry": "Plain" }, 
                { "entry": "PipeVertical" },
                { "xloc": 1272 }, 
                { "area": 1 }, 
                { "area": 2, "entry": "Vine" }
            ],
            "areas": [
                {
                    "setting": "Overworld Night Alt",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 360 },
                        { "macro": "CastleLarge", "x": -16 },
                        { "macro": "Pattern", "pattern": "BackFence", "repeat": 5 },
                        { "thing": "Block", "x": 128, "y": 32 },
                        { "thing": "Block", "x": 152, "y": 40 },
                        { "thing": "Block", "x": 176, "y": 40, "contents": "Mushroom" },
                        { "thing": "Koopa", "x": 200, "y": 12, "jumping": true },
                        { "macro": "Fill", "thing": "Brick", "x": 208, "y": 32, "xnum": 3 },
                        { "thing": "Koopa", "x": 224, "y": 20, "jumping": true },
                        { "macro": "Pipe", "x": 256, "height": 24, "piranha": true },
                        { "thing": "Goomba", "x": 296, "y": 8 },
                        { "macro": "Pipe", "x": 304, "height": 32, "piranha": true, "transport": 3 },
                        { "macro": "Floor", "x": 384, "width": 232 },
                        { "macro": "Fill", "thing": "Goomba", "x": 424, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Pipe", "x": 456, "height": 24, "piranha": true },
                        { "thing": "Brick", "x": 488, "y": 32 },
                        { "thing": "Koopa", "x": 520, "y": 12 },
                        { "macro": "Pipe", "x": 536, "height": 16, "piranha": true, "entrance": 1 },
                        { "thing": "Stone", "x": 584, "y": 8 },
                        { "thing": "Stone", "x": 592, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 600, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 608, "y": 32, "height": 32 },
                        { "macro": "Water", "x": 616, "y": 10, "width": 64 },
                        { "macro": "Bridge", "x": 616, "y": 32, "width": 64 },
                        { "macro": "Fill", "thing": "Goomba", "x": 656, "y": 40, "xnum": 3, "xwidth": 12 },
                        { "thing": "Block", "x": 656, "y": 64, "contents": "Mushroom1Up", "hidden": true },
                        { "macro": "Floor", "x": 680 },
                        { "thing": "Stone", "x": 680, "y": 32, "height": 32 },
                        { "macro": "Water", "x": 688, "y": 10, "width": 16 },
                        { "macro": "Floor", "x": 704, "width": 320 },
                        { "thing": "Stone", "x": 704, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 712, "y": 16, "height": 16 },
                        { "thing": "Brick", "x": 720, "y": 64, "contents": "Star" },
                        { "macro": "Fill", "thing": "Brick", "x": 728, "y": 64, "xnum": 2 },
                        { "macro": "Fill", "thing": "Goomba", "x": 752, "y": 8, "xnum": 2, "xwidth": 12 },
                        { "thing": "Koopa", "x": 808, "y": 12 },
                        { "macro": "Pipe", "x": 824, "height": 32, "piranha": true },
                        { "macro": "Fill", "thing": "Brick", "x": 888, "y": 32, "xnum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 888, "y": 64, "xnum": 2 },
                        { "thing": "HammerBro", "x": 904, "y": 44 },
                        { "thing": "Block", "x": 904, "y": 64 },
                        { "macro": "Fill", "thing": "Brick", "x": 912, "y": 64, "xnum": 3 },
                        { "thing": "HammerBro", "x": 936, "y": 12 },
                        { "thing": "Block", "x": 936, "y": 64, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Brick", "x": 944, "y": 64, "xnum": 3 },
                        // { "thing": "Springboard", "x": 1008, "y": 14.5 },
                        { "macro": "Fill", "thing": "Brick", "x": 1032, "y": 40, "xnum": 3 },
                        { "macro": "Fill", "thing": "Brick", "x": 1032, "y": 64, "xnum": 2 },
                        { "thing": "Brick", "thing": "Brick", "x": 1048, "y": 64, "contents": ["Vine", { "entrance": 4 }] },
                        { "macro": "Floor", "x": 1056, "width": 80 },
                        { "thing": "Stone", "x": 1088, "y": 8 },
                        { "thing": "Stone", "x": 1096, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1104, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1112, "y": 32, "height": 32 },
                        { "thing": "Goomba", "x": 1112, "y": 40 },
                        { "thing": "Stone", "x": 1120, "y": 40, "height": 40 },
                        { "thing": "Goomba", "x": 1120, "y": 48 },
                        { "thing": "Stone", "x": 1128, "y": 48, "height": 48 },
                        { "macro": "Floor", "x": 1152, "width": 264 },
                        { "thing": "Koopa", "x": 1192, "y": 12 },
                        { "macro": "Fill", "thing": "Brick", "x": 1200, "y": 32, "xnum": 2, "ynum": 2, "xwidth": 16, "yheight": 32 },
                        { "macro": "Fill", "thing": "Block", "x": 1208, "y": 32, "ynum": 2, "yheight": 32 },
                        { "thing": "Koopa", "x": 1216, "y": 76 },
                        { "macro": "Fill", "thing": "Goomba", "x": 1232, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Brick", "x": 1240, "y": 32, "xnum": 2, "ynum": 2, "xwidth": 16, "yheight": 32 },
                        { "thing": "Block", "x": 1248, "y": 32, "contents": "Mushroom" },
                        { "thing": "Block", "x": 1248, "y": 64 },
                        { "thing": "Koopa", "x": 1320, "y": 12, "jumping": true },
                        { "thing": "Brick", "x": 1328, "y": 32 },
                        { "thing": "Brick", "x": 1336, "y": 32, "contents": "Coin" },
                        { "thing": "Koopa", "x": 1344, "y": 18, "jumping": true },
                        { "macro": "Fill", "thing": "Brick", "x": 1344, "y": 32, "xnum": 3 },
                        { "thing": "Koopa", "x": 1360, "y": 44 },
                        { "thing": "Koopa", "x": 1368, "y": 12, "jumping": true },
                        { "thing": "Stone", "x": 1392, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1400, "y": 48, "height": 48 },
                        { "macro": "Floor", "x": 1440, "width": 320 },
                        { "thing": "Stone", "x": 1464, "y": 8 },
                        { "thing": "Stone", "x": 1472, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1480, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1488, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1496, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1504, "y": 48, "height": 48 },
                        { "thing": "Koopa", "x": 1504, "y": 60 },
                        { "thing": "Stone", "x": 1512, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1520, "y": 64, "width": 16, "height": 64 },
                        { "thing": "Koopa", "x": 1528, "y": 76 },
                        { "macro": "EndOutsideCastle", "x": 1600, "transport": { "map": "3-2" } }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 24, "y": 40, "xnum": 2, "ynum": 4, "xwidth": 72 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 32, "xnum": 2, "xwidth": 56 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 56, "xnum": 2, "ynum": 2, "xwidth": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 33, "y": 39, "xnum": 2, "xwidth": 56 },
                        { "macro": "Fill", "thing": "Brick", "x": 40, "y": 40, "xnum": 2, "xwidth": 40 },
                        { "thing": "Brick", "x": 40, "y": 64, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Coin", "x": 41, "y": 47, "xnum": 2, "xwidth": 40 },
                        { "macro": "Fill", "thing": "Brick", "x": 48, "y": 48, "xnum": 2, "xwidth": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 49, "y": 55, "xnum": 2, "ynum": 2, "xwidth": 24, "yheight": 16 },
                        { "macro": "Fill", "thing": "Brick", "x": 56, "y": 56, "xnum": 2, "ynum": 2 },
                        { "macro": "Fill", "thing": "Coin", "x": 57, "y": 71, "xnum": 2, "ynum": 2, "xwidth": 8, "yheight": 8 },
                        { "thing": "Brick", "x": 80, "y": 64 },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "entrance": 1 },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }, {
                    "setting": "Sky Night",
                    "blockBoundaries": false,
                    "exit": 2,
                    "creation": [
                        { "thing": "Stone", "width": 32 },
                        { "thing": "Stone", "x": 40, "width": 624 },
                        { "thing": "Platform", "x": 128, "y": 24, "width": 24, "transport": true },
                        { "macro": "Fill", "thing": "Coin", "x": 121, "y": 55, "xnum": 16, "xwidth": 8 },
                        { "thing": "Stone", "x": 256, "y": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 273, "y": 55, "xnum": 16, "xwidth": 8 },
                        { "thing": "Stone", "x": 408, "y": 48, "height": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 425, "y": 63, "xnum": 7, "xwidth": 8 },
                        { "thing": "Stone", "x": 488, "y": 48, "height": 16 },
                        { "thing": "Stone", "x": 536, "y": 56, "width": 16 },
                        { "macro": "Fill", "thing": "Stone", "x": 568, "y": 56, "xnum": 5, "xwidth": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 569, "y": 63, "xnum": 10, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 681, "y": 15, "xnum": 3, "xwidth": 8 }
                    ]
                }
            ]
        }, {
            "name": "3-2",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld Night Alt",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackFence",  "x": -384, "repeat": 6 },
                        { "macro": "Floor", "width": 640 },
                        { "macro": "CastleSmall" },
                        { "thing": "Koopa", "x": 136, "y": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 192, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Koopa", "x": 264, "y": 12, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Koopa", "x": 344, "y": 12, "xnum": 2, "xwidth": 12 },
                        { "thing": "Stone", "x": 392, "y": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 441, "y": 31, "xnum": 3, "xwidth": 8 },
                        { "thing": "Stone", "x": 480, "y": 24, "height": 24 },
                        { "thing": "Block", "x": 480, "y": 56, "contents": "Mushroom" },
                        { "thing": "Koopa", "x": 528, "y": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 568, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "thing": "Stone", "x": 600, "y": 16, "height": 16 },
                        { "thing": "Brick", "x": 616, "y": 32, "contents": "Coin" },
                        { "thing": "Brick", "x": 616, "y": 64, "contents": "Star" },
                        { "thing": "Koopa", "x": 624, "y": 12 },
                        { "thing": "Stone", "x": 632, "y": 16, "height": 16 },
                        { "macro": "Floor", "x": 656, "width": 328 },
                        { "thing": "Koopa", "x": 736, "y": 34, "jumping": true },
                        { "thing": "Koopa", "x": 888, "y": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 952, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Floor", "x": 1000, "width": 24 },
                        { "thing": "Stone", "x": 1008, "y": 16, "height": 16 },
                        { "thing": "Brick", "x": 1008, "y": 56 },
                        { "macro": "Floor", "x": 1040, "width": 752 },
                        { "thing": "Koopa", "x": 1072, "y": 12 },
                        { "macro": "Fill", "thing": "Koopa", "x": 1120, "y": 12, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Koopa", "x": 1200, "y": 12, "xnum": 2, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Koopa", "x": 1296, "y": 12, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Coin", "x": 1345, "y": 55, "xnum": 4, "xwidth": 8 },
                        { "macro": "Pipe", "x": 1352, "height": 24, "piranha": true },
                        { "thing": "Koopa", "x": 1400, "y": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 1432, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 1504, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "thing": "Stone", "x": 1536, "y": 8 },
                        { "thing": "Stone", "x": 1544, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1552, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1560, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1568, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1576, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 1584, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1592, "y": 64, "width": 16, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 1672, "transport": { "map": "3-3" } }
                    ]
                }
            ]
        }, {
            "name": "3-3",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld Night",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 7 },
                        { "macro": "Floor", "width": 128 },
                        { "macro": "CastleSmall" },
                        { "macro": "Tree", "x": 144, "y": 24, "width": 40 },
                        { "macro": "Tree", "x": 176, "y": 48, "width": 48 },
                        { "thing": "Goomba", "x": 208, "y": 56 },
                        { "thing": "Platform", "x": 240, "y": 72, "width": 24, "sliding": true, "begin": 228, "end": 260 },
                        { "macro": "Tree", "x": 240, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 249, "y": 7, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 264, "y": 40, "width": 24, "sliding": true, "begin": 244, "end": 276 },
                        { "macro": "Tree", "x": 288, "y": 8, "width": 56 },
                        { "thing": "Coin", "x": 298, "y": 55 },
                        { "macro": "Fill", "thing": "Coin", "x": 337, "y": 55, "xnum": 3, "xwidth": 8 },
                        { "macro": "Tree", "x": 344, "y": 32, "width": 32 },
                        { "macro": "Tree", "x": 368, "y": 16, "width": 80 },
                        { "macro": "Tree", "x": 376, "y": 48, "width": 48 },
                        { "thing": "Block", "x": 392, "y": 80, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Coin", "x": 417, "y": 31, "xnum": 3, "xwidth": 8 },
                        { "thing": "Koopa", "x": 416, "y": 60, "smart": true },
                        { "thing": "Koopa", "x": 432, "y": 28, "smart": true },
                        { "macro": "Tree", "x": 440, "y": 80, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 449, "y": 87, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 482, "y": 56, "width": 24, "falling": true },
                        { "macro": "Tree", "x": 520, "width": 128 },
                        { "macro": "Tree", "x": 520, "y": 48, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 529, "y": 55, "xnum": 3, "xwidth": 32 },
                        { "macro": "Tree", "x": 552, "y": 48, "width": 24 },
                        { "thing": "Koopa", "x": 584, "y": 12, "smart": true },
                        { "macro": "Tree", "x": 584, "y": 48, "width": 24 },
                        { "macro": "Tree", "x": 616, "y": 72, "width": 24 },
                        { "thing": "Coin", "x": 625, "y": 79 },
                        { "macro": "Scale", "x": 660, "y": 86, "between": 56, "dropRight": 44 },
                        { "macro": "Tree", "x": 672, "y": 16, "width": 32 },
                        { "thing": "Platform", "x": 752, "y": 32, "width": 24, "falling": true },
                        { "thing": "Platform", "x": 768, "y": 64, "width": 24, "falling": true },
                        { "macro": "Tree", "x": 776, "y": 32, "width": 24 },
                        { "thing": "Platform", "x": 824, "y": 16, "width": 24, "falling": true },
                        { "macro": "Tree", "x": 832, "y": 64, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 841, "y": 71, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 856, "y": 16, "width": 40 },
                        { "thing": "Coin", "x": 865, "y": 23 },
                        { "macro": "Tree", "x": 864, "y": 48, "width": 24 },
                        { "thing": "Coin", "x": 873, "y": 55 },
                        { "thing": "Koopa", "x": 912, "y": 66, "smart": true, "jumping": true, "floating": true, "begin": 14, "end": 66 },
                        { "macro": "Tree", "x": 928, "width": 24 },
                        { "macro": "Tree", "x": 952, "y": 24, "width": 96, "solidTrunk": true },
                        { "macro": "Fill", "thing": "Koopa", "x": 992, "y": 36, "xnum": 2, "xwidth": 14, "smart": true },
                        { "thing": "Platform", "x": 1056, "y": 56, "width": 24 },
                        { "macro": "Scale", "x": 1100, "y": 86, "between": 32, "dropRight": 48 },
                        { "macro": "Floor", "x": 1152, "width": 256 },
                        { "macro": "EndOutsideCastle", "x": 1208, "large": true, "walls": 15, "transport": { "map": "3-4" } }
                    ]
                }
            ]
        }, {
            "name": "3-4",
            "time": 300,
            "locations": [
                { "entry": "Castle" }
            ],
            "areas": [
                {
                    "setting": "Castle",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "StartInsideCastle", "width": 128 },
                        { "thing": "Stone", "y": 88, "width": 128, "height": 24 },
                        { "thing": "Stone", "x": 128, "y": 88, "width": 896 },
                        { "thing": "Podoboo", "x": 128, "y": -32 },
                        { "macro": "Floor", "x": 144, "y": 24 },
                        { "macro": "Floor", "x": 152, "y": 8 },
                        { "macro": "Fill", "thing": "Stone", "x": 152, "y": 24, "xnum": 3, "xwidth": 40 },
                        { "macro": "Fill", "thing": "CastleBlock", "x": 152, "y": 16, "xnum": 3, "xwidth": 40, "fireballs": 6 },
                        { "macro": "Floor", "x": 160, "y": 24 },
                        { "macro": "Floor", "x": 184, "y": 24 },
                        { "macro": "Floor", "x": 192, "y": 8 },
                        { "macro": "Floor", "x": 200, "y": 24 },
                        { "thing": "Podoboo", "x": 208, "y": -32 },
                        { "macro": "Floor", "x": 224, "y": 24 },
                        { "macro": "Floor", "x": 232, "y": 8 },
                        { "macro": "Floor", "x": 240, "y": 24 },
                        { "macro": "Floor", "x": 264, "width": 104 },
                        { "thing": "Stone", "x": 264, "y": 24, "width": 16, "height": 24 },
                        { "thing": "Stone", "x": 280, "y": 80, "width": 88, "height": 16 },
                        { "thing": "Block", "x": 336, "y": 32 },
                        { "thing": "Block", "x": 344, "y": 32, "contents": "Mushroom" },
                        { "thing": "Block", "x": 352, "y": 32 },
                        { "macro": "Water", "x": 368, "width": 16 },
                        { "macro": "Floor", "x": 384, "width": 320 },
                        { "macro": "Fill", "thing": "Stone", "x": 424, "y": 8, "xnum": 2, "xwidth": 80, "width": 24 },
                        { "macro": "Fill", "thing": "Stone", "x": 424, "y": 80, "xnum": 2, "xwidth": 80, "width": 24, "height": 16 },
                        { "macro": "Fill", "thing": "CastleBlock", "x": 432, "y": 16, "xnum": 2, "xwidth": 80, "fireballs": 6, "direction": 1 },
                        { "macro": "Fill", "thing": "CastleBlock", "x": 432, "y": 64, "xnum": 2, "xwidth": 80, "fireballs": 6 },
                        { "thing": "Stone", "x": 632, "y": 8, "width": 24 },
                        { "thing": "Stone", "x": 632, "y": 80, "width": 24, "height": 16 },
                        { "thing": "CastleBlock", "x": 640, "y": 16, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 640, "y": 64, "fireballs": 6, "direction": 1 },
                        { "macro": "Fill", "thing": "Coin", "x": 649, "y": 55, "xnum": 3, "xwidth": 8 },
                        { "thing": "Podoboo", "x": 704, "y": -32 },
                        { "macro": "Water", "x": 704, "width": 16 },
                        { "macro": "Floor", "x": 720, "y": 24, "width": 48 },
                        { "thing": "Stone", "x": 720, "y": 80, "width": 48, "height": 16 },
                        { "macro": "Water", "x": 768, "width": 24 },
                        { "thing": "Podoboo", "x": 776, "y": -32 },
                        { "macro": "Floor", "x": 792, "y": 24, "width": 24 },
                        { "macro": "Water", "x": 816, "width": 24 },
                        { "thing": "Podoboo", "x": 824, "y": -32 },
                        { "macro": "Floor", "x": 840, "y": 24, "width": 24 },
                        { "macro": "Water", "x": 864, "width": 24 },
                        { "thing": "Podoboo", "x": 872, "y": -32 },
                        { "macro": "Floor", "x": 888, "width": 136 },
                        { "thing": "Stone", "x": 888, "y": 24, "width": 40, "height": 24 },
                        { "thing": "Stone", "x": 888, "y": 80, "width": 136, "height": 16 },
                        { "thing": "Stone", "x": 944, "y": 24, "width": 80, "height": 24 },
                        { "macro": "EndInsideCastle", "x": 1024, "spawnType": "Beetle", "transport": { "map": "4-1" }},
                        { "macro": "Fill", "thing": "Brick", "x": 1056, "y": 64, "xnum": 2, "ynum": 3 },
                        { "thing": "Platform", "x": 1084, "y": 56, "width": 16 }
                    ]
                }
            ]
        }, {
            "name": "4-1",
            "locations": [
                { "entry": "Plain" }, 
                { "entry": "PipeVertical" }, 
                { "area": 1 }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 256 },
                        { "macro": "CastleLarge", "x": -16 },
                        { "macro": "Pattern", "pattern": "BackRegular", "repeat": 5 },
                        { "macro": "Pipe", "x": 168, "height": 24, "piranha": true },
                        { "thing": "Block", "x": 200, "y": 32, "contents": "Mushroom" },
                        { "thing": "Block", "x": 200, "y": 64 },
                        { "thing": "Lakitu", "x": 212, "y": 84 },
                        { "macro": "Floor", "x": 272, "width": 352 },
                        { "macro": "Fill", "thing": "Coin", "x": 329, "y": 31, "xnum": 2, "xwidth": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 337, "y": 39, "xnum": 2, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Block", "x": 512, "y": 32, "xnum": 2, "ynum": 2, "xwidth": 24, "yheight": 32 },
                        { "macro": "Floor", "x": 656, "width": 536 },
                        { "macro": "Fill", "thing": "Block", "x": 720, "y": 32, "xnum": 4 },
                        { "thing": "Block", "x": 736, "y": 64, "contents": "Mushroom1Up", "hidden": true },
                        { "thing": "Stone", "x": 824, "y": 24, "height": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 841, "y": 55, "xnum": 4, "xwidth": 8 },
                        { "macro": "Pipe", "x": 928, "height": 32, "piranha": true },
                        { "macro": "Fill", "thing": "Coin", "x": 953, "y": 55, "xnum": 4, "xwidth": 8 },
                        { "macro": "Pipe", "x": 1056, "height": 32, "piranha": true, "transport": 2 },
                        { "macro": "Fill", "thing": "Coin", "x": 1081, "y": 55, "xnum": 4, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Block", "x": 1168, "y": 32, "xnum": 2 },
                        { "thing": "Block", "x": 1184, "y": 32, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Block", "x": 1184, "y": 64, "xnum": 4 },
                        { "macro": "Fill", "thing": "Brick", "x": 1192, "y": 32, "xnum": 2 },
                        { "macro": "Fill", "thing": "Block", "x": 1208, "y": 32, "xnum": 3 },
                        { "macro": "Floor", "x": 1208, "width": 184 },
                        { "macro": "Pipe", "x": 1304, "height": 16, "piranha": true, "entrance": 1 },
                        { "macro": "Floor", "x": 1416, "width": 24 },
                        { "macro": "Floor", "x": 1456, "width": 64 },
                        { "thing": "Stone", "x": 1512, "y": 24, "height": 24 },
                        { "macro": "Floor", "x": 1536, "width": 384 },
                        { "macro": "LakituStop", "x": 1664 },
                        { "thing": "Stone", "x": 1664, "y": 8 },
                        { "thing": "Stone", "x": 1672, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1680, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1688, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1696, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1704, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 1712, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1720, "y": 64, "width": 16, "height": 64 },
                        { "thing": "Brick", "x": 1760, "y": 32, "contents": "Coin" },
                        { "macro": "EndOutsideCastle", "x": 1800, "transport": { "map": "4-2" } }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 24, "y": 16, "ynum": 3 },
                        { "macro": "Fill", "thing": "Brick", "x": 24, "y": 80, "xnum": 12 },
                        { "macro": "Fill", "thing": "Coin", "x": 25, "y": 39, "xnum": 8, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 25, "y": 7, "xnum": 10, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 32, "xnum": 6 },
                        { "macro": "Fill", "thing": "Brick", "x": 80, "y": 16, "ynum": 3 },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 1 },
                        { "thing": "Brick", "x": 104, "y": 32, "contents": "Mushroom" },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }
            ]
        }, {
            "name": "4-2",
            "locations": [
                { "entry": "Walking" }, 
                { "area": 1 }, 
                { "area": 1, "entry": "PipeVertical" }, 
                { "area": 2 }, 
                { "area": 3, "entry": "PipeVertical" }, 
                { "area": 4, "entry": "Vine" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 1 },
                        { "macro": "Floor", "width": 192 },
                        { "macro": "CastleSmall" },
                        { "thing": "PipeHorizontal", "x": 80, "y": 16, "transport": 1 },
                        { "macro": "Pipe", "x": 96, "height": 32 }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 88 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Ceiling", "x": 48, "width": 408 },
                        { "macro": "Floor", "x": 104, "width": 16 },
                        { "macro": "Floor", "x": 136 },
                        { "macro": "Fill", "thing": "Brick", "x": 160, "y": 64, "xnum": 23, "ynum": 3 },
                        { "macro": "Floor", "x": 168, "width": 288 },
                        { "macro": "Fill", "thing": "Brick", "x": 176, "y": 16, "xnum": 5, "ynum": 3 },
                        { "thing": "Brick", "x": 216, "y": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 217, "y": 7, "xnum": 3, "xwidth": 8, "xwidth": 8 },
                        { "thing": "Brick", "x": 224, "y": 32, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Brick", "x": 240, "y": 8, "xnum": 18, "ynum": 4 },
                        { "macro": "Fill", "thing": "Goomba", "x": 344, "y": 40, "xnum": 3, "xwidth": 12 },
                        { "thing": "Brick", "x": 344, "y": 64 },
                        { "thing": "Brick", "x": 344, "y": 72, "contents": "Coin" },
                        { "thing": "Brick", "x": 344, "y": 80 },
                        { "macro": "Fill", "thing": "Brick", "x": 352, "y": 64, "xnum": 4, "ynum": 3 },
                        { "macro": "Fill", "thing": "Block", "x": 400, "y": 32, "xnum": 2, "ynum": 2, "yheight": 32 },
                        { "macro": "Fill", "thing": "Block", "x": 432, "y": 32, "xnum": 2, "xwidth": 16 },
                        { "thing": "Block", "x": 440, "y": 32, "contents": "Mushroom" },
                        { "macro": "PlatformGenerator", "x": 470, "width": 24 },
                        { "macro": "Floor", "x": 504, "width": 336 },
                        { "thing": "Block", "x": 504, "y": 40, "hidden": true },
                        { "thing": "Block", "x": 512, "y": 48, "hidden": true },
                        { "thing": "Brick", "x": 512, "y": 64, "contents": ["Vine", { "transport": 5 }] },
                        { "thing": "Block", "x": 520, "y": 40, "hidden": true },
                        { "macro": "Fill", "thing": "Brick", "x": 520, "y": 64, "xnum": 2 },
                        { "thing": "Block", "x": 528, "y": 32, "hidden": true },
                        { "macro": "Ceiling", "x": 536, "width": 360 },
                        { "macro": "Pipe", "x": 576, "height": 24, "piranha": true },
                        { "thing": "Brick", "x": 608, "y": 32 },
                        { "thing": "Brick", "x": 616, "y": 32, "contents": "Coin" },
                        { "thing": "Koopa", "x": 616, "y": 12 },
                        { "macro": "Pipe", "x": 624, "height": 56, "piranha": true },
                        { "thing": "Brick", "x": 640, "y": 32 },
                        { "thing": "Brick", "x": 648, "y": 32, "contents": "Star" },
                        { "thing": "Beetle", "x": 664, "y": 8.5 },
                        { "macro": "Pipe", "x": 672, "height": 24, "piranha": true, "transport": 3 },
                        { "thing": "Brick", "x": 696, "y": 40 },
                        { "thing": "Beetle", "x": 704, "y": 8.5 },
                        { "macro": "Pipe", "x": 712, "height": 24 },
                        { "macro": "Fill", "thing": "Koopa", "x": 800, "y": 12, "xnum": 2, "xwidth": 12 },
                        { "thing": "Stone", "x": 824, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 832, "y": 24, "height": 24 },
                        { "macro": "Floor", "x": 856, "width": 16 },
                        { "macro": "Pipe", "x": 856, "height": 32 },
                        { "macro": "Floor", "x": 888, "width": 16 },
                        { "thing": "Stone", "x": 888, "y": 24, "width": 16, "height": 24 },
                        { "macro": "PlatformGenerator", "x": 918, "width": 24 },
                        { "macro": "Floor", "x": 952, "width": 32 },
                        { "macro": "Fill", "thing": "Brick", "x": 952, "y": 32, "xnum": 4 },
                        { "thing": "Brick", "x": 952, "y": 64 },
                        { "macro": "Ceiling", "x": 952, "width": 32 },
                        { "thing": "Brick", "x": 960, "y": 64, "contents": "Mushroom" },
                        { "thing": "Brick", "x": 968, "y": 64 },
                        { "macro": "PlatformGenerator", "x": 992, "width": 24 },
                        { "macro": "Ceiling", "x": 1024, "width": 216 },
                        { "macro": "Floor", "x": 1032, "width": 120 },
                        { "macro": "Pipe", "x": 1048, "height": 16, "entrance": 2 },
                        { "thing": "Koopa", "x": 1096, "y": 12 },
                        { "macro": "Pipe", "x": 1104, "height": 24, "piranha": true },
                        { "macro": "Pipe", "x": 1136, "height": 32, "piranha": true },
                        { "macro": "Floor", "x": 1168, "width": 72 },
                        { "thing": "Stone", "x": 1216, "y": 8 },
                        { "thing": "Stone", "x": 1224, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1232, "y": 24, "height": 24 },
                        { "thing": "Beetle", "x": 1232, "y": 32.5 },
                        { "macro": "PlatformGenerator", "x": 1246, "width": 24 },
                        { "macro": "Floor", "x": 1280, "width": 184 },
                        { "macro": "Fill", "thing": "Brick", "x": 1280, "y": 48, "ynum": 2 },
                        { "macro": "Fill", "thing": "Brick", "x": 1280, "y": 64, "xnum": 16, "ynum": 3 },
                        { "macro": "Ceiling", "x": 1280, "width": 232 },
                        { "thing": "Brick", "x": 1288, "y": 32, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Brick", "x": 1296, "y": 32, "xnum": 10 },
                        { "macro": "Fill", "thing": "Coin", "x": 1297, "y": 39, "xnum": 10, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Koopa", "x": 1344, "y": 12, "xnum": 2, "xwidth": 12 },
                        { "thing": "Stone", "x": 1384, "y": 8 },
                        { "thing": "Stone", "x": 1392, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1400, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1408, "y": 32, "height": 32 },
                        { "thing": "Beetle", "x": 1432, "y": 8.5 },
                        { "macro": "Pipe", "x": 1440, "height": 56, "piranha": true },
                        { "macro": "Floor", "x": 1480, "width": 312 },
                        { "macro": "Fill", "thing": "Brick", "x": 1480, "y": 8, "xnum": 24, "ynum": 3 },
                        { "thing": "PipeHorizontal", "x": 1496, "y": 40, "transport": 4 },
                        { "thing": "PipeVertical", "x": 1512, "y": 88, "height": 64 },
                        { "macro": "Fill", "thing": "Brick", "x": 1528, "y": 32, "xnum": 18, "ynum": 7 },
                        { "macro": "Ceiling", "x": 1528, "width": 184 },
                        { "macro": "Fill", "thing": "Brick", "x": 1616, "y": 32, "xnum": 7, "ynum": 7 },
                        { "thing": "ScrollEnabler", "x": 1512, "y": 184, "height": 96, "width": 16 },
                        { "thing": "ScrollBlocker", "x": 1528 },
                        { "macro": "Ceiling", "x": 1616, "width": 136 },
                        { "macro": "WarpWorld", "x": 1672, "warps": [5] },
                        { "macro": "Fill", "thing": "Brick", "x": 1776, "y": 8, "xnum": 2, "ynum": 11 }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Ceiling", "x": 32, "width": 56 },
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 48, "xnum": 7 }, 
                        { "thing": "Brick", "x": 32, "y": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 42, "y": 55, "xnum": 5, "ynum": 2, "xwidth": 8, "yheight": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 80, "y": 56, "ynum": 4 },
                        { "macro": "Fill", "thing": "Brick", "x": 88, "y": 56, "xnum": 2 },
                        { "thing": "Brick", "x": 112, "y": 48, "contents": "Coin" },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 2 },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }, {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackRegular", "x": -280, "repeat": 2 },
                        { "macro": "Floor", "width": 464 },
                        { "macro": "Pipe", "height": 16, "piranha": true, "entrance": 4 },
                        { "thing": "Stone", "x": 16, "y": 8 },
                        { "thing": "Stone", "x": 24, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 32, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 40, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 48, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 56, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 64, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 72, "y": 64, "width": 16, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 152, "transport": { "map": "4-3" } }
                    ]
                }, {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackCloud", "x": -384, "y": 4, "repeat": 3 },
                        { "macro": "Floor", "width": 32 },
                        { "macro": "Floor", "x": 40, "width": 472 },
                        { "macro": "Shroom", "x": 96, "y": 32, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 97, "y": 39, "xnum": 3, "xwidth": 8 },
                        { "macro": "Shroom", "x": 128, "y": 64, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 129, "y": 71, "xnum": 3, "xwidth": 8 },
                        { "macro": "Shroom", "x": 144, "y": 16, "width": 24 },
                        { "macro": "Shroom", "x": 176, "y": 16, "width": 40 },
                        { "macro": "Shroom", "x": 176, "y": 64, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 177, "y": 71, "xnum": 3, "xwidth": 8 },
                        { "macro": "Shroom", "x": 208, "y": 48, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 209, "y": 55, "xnum": 3, "xwidth": 8 },
                        { "macro": "Shroom", "x": 240, "y": 72, "width": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 241, "y": 79, "xnum": 5, "xwidth": 8 },
                        { "macro": "Shroom", "x": 248, "y": 24, "width": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 281, "y": 31, "xnum": 2, "xwidth": 8 },
                        { "thing": "Stone", "x": 320, "y": 8 },
                        { "thing": "Stone", "x": 328, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 336, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 344, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 352, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 360, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 368, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 376, "y": 64, "height": 64 },
                        { "thing": "Stone", "x": 384, "y": 72, "height": 72 },
                        { "thing": "Stone", "x": 392, "y": 72, "width": 88 },
                        { "macro": "WarpWorld", "x": 392, "warps": [8, 7, 6], "textHeight": 0 },
                        { "thing": "Stone", "x": 496, "y": 88, "width": 16, "height": 88 },
                        { "thing": "ScrollBlocker", "x": 512, "y": 88 }
                    ]
                }
            ]
        }, {
            "name": "4-3",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld Shrooms",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackCloud", "x": 0, "y": 4, "repeat": 3 },
                        { "macro": "Floor", "x": 0, "y": 0, "width": 120 },
                        { "macro": "CastleSmall" },
                        { "macro": "Shroom", "x": 128, "width": 40 },
                        { "macro": "Shroom", "x": 152, "y": 64, "width": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 161, "y": 71, "xnum": 3, "xwidth": 8 },
                        { "macro": "Shroom", "x": 184, "y": 32, "width": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 193, "y": 39, "xnum": 4, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Koopa", "x": 224, "y": 44, "xnum": 2, "smart": true },
                        { "macro": "Shroom", "x": 256, "y": 72, "width": 24 },
                        { "macro": "Shroom", "x": 288, "y": 8, "width": 56 },
                        { "thing": "Koopa", "x": 288, "y": 84, "smart": true, "floating": true, "jumping": true, "begin": 32, "end": 88 },
                        { "thing": "Coin", "x": 302, "y": 15 },
                        { "thing": "Koopa", "x": 312, "y": 20, "smart": true },
                        { "macro": "Shroom", "x": 312, "y": 64, "width": 40 },
                        { "thing": "Coin", "x": 321, "y": 15 },
                        { "thing": "Block", "x": 344, "y": 88, "contents": "Mushroom" },
                        { "macro": "Shroom", "x": 352, "y": 32, "width": 24 },
                        { "thing": "Coin", "x": 385, "y": 47 },
                        { "macro": "Scale", "x": 396, "y": 86, "between": 56, "dropRight": 44 },
                        { "macro": "Shroom", "x": 408, "y": 40, "width": 24 },
                        { "thing": "Platform", "x": 464, "y": 20, "width": 24, "floating": true, "begin": 16, "end": 72 },
                        { "thing": "Platform", "x": 496, "y": 66, "width": 24, "floating": true, "begin": 32, "end": 88 },
                        { "macro": "Shroom", "x": 520, "width": 40 },
                        { "macro": "Shroom", "x": 536, "y": 48, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 537, "y": 55, "xnum": 3, "xwidth": 8 },
                        { "thing": "Koopa", "x": 544, "y": 12, "smart": true },
                        { "macro": "Shroom", "x": 560, "y": 80, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 561, "y": 87, "xnum": 3, "xwidth": 8 },
                        { "macro": "Shroom", "x": 576, "y": 32, "width": 24 },
                        { "thing": "Coin", "x": 585, "y": 39 },
                        { "macro": "Shroom", "x": 592, "y": 64, "width": 40 },
                        { "thing": "Koopa", "x": 624, "y": 76, "smart": true },
                        { "macro": "Scale", "x": 652, "y": 86, "between": 64, "dropRight": 52 },
                        { "macro": "Shroom", "x": 672, "y": 32 },
                        { "macro": "Scale", "x": 740, "y": 86, "dropRight": 56 },
                        { "thing": "Coin", "x": 770, "y": 47 },
                        { "macro": "Shroom", "x": 792, "y": 16, "width": 24 },
                        { "macro": "Scale", "x": 828, "y": 86, "between": 48, "dropRight": 56 },
                        { "macro": "Shroom", "x": 840, "y": 24, "width": 24 },
                        { "macro": "Shroom", "x": 904, "y": 32, "width": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 905, "y": 39, "xnum": 5, "xwidth": 8 },
                        { "macro": "Shroom", "x": 936, "y": 56, "width": 24 },
                        { "macro": "Shroom", "x": 968, "width": 56 },
                        { "macro": "Shroom", "x": 1040, "y": 24, "width": 40 },
                        { "thing": "Platform", "x": 1088, "y": 67, "width": 24, "floating": true, "begin": 8, "end": 88 },
                        { "macro": "Floor", "x": 1128, "width": 152 },
                        { "macro": "EndOutsideCastle", "x": 1176, "large": true, "walls": 3, "transport": { "map": "4-4" } }
                    ]
                }
            ]
        }, {
            "name": "4-4",
            "time": 300,
            "locations": [
                { "entry": "Castle" }
            ],
            "areas": [
                {
                    "setting": "Castle",
                    "creation": [
                        { "macro": "StartInsideCastle", "width": 48 },
                        { "thing": "Stone", "y": 88, "width": 48, "height": 24 },
                        { "macro": "Floor", "x": 48, "y": 24 },
                        { "thing": "Stone", "x": 48, "y": 88, "width": 80 },
                        { "macro": "Water", "x": 56, "width": 16 },
                        { "macro": "Floor", "x": 72, "y": 24, "width": 16 },
                        { "macro": "Water", "x": 88, "width": 16 },
                        { "macro": "Floor", "x": 104, "y": 24, "width": 24 },
                        { "macro": "Section", "x": 128, "section": 0 }
                    ],
                    "sections": [
                        {
                            "before": {
                                "width": 400,
                                "creation": [
                                    { "macro": "Floor", "width": 400 },
                                    { "thing": "Stone", "y": 88, "width": 400 },
                                    { "thing": "Stone", "x": 16, "y": 56, "width": 48, "height": 32 },
                                    { "macro": "Fill", "thing": "Stone", "x": 72, "y": 56, "xnum": 5, "xwidth": 16, "height": 32 },
                                    { "thing": "Stone", "x": 152, "y": 56, "width": 24, "height": 32 },
                                    { "thing": "Stone", "x": 176, "y": 56, "width": 48 },
                                    { "macro": "Pipe", "x": 192, "height": 24, "piranha": true },
                                    { "thing": "Stone", "x": 224, "y": 56, "width": 136, "height": 32 },
                                    { "thing": "CastleBlock", "x": 296, "y": 56, "fireballs": 6, "hidden": true },
                                    { "thing": "CastleBlock", "x": 352, "y": 32, "fireballs": 6, "hidden": true },
                                    { "macro": "SectionFail", "x": 384, "y": 24, "width": 40, "height": 24 },
                                    { "macro": "SectionPass", "x": 394, "y": 80, "width": 40, "height": 24 },
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "thing": "Stone", "y": 56, "height": 32 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 40,
                                "creation": [
                                    { "macro": "Floor", "width": 40 },
                                    { "thing": "Stone", "y": 88, "width": 40 },
                                    { "thing": "Stone", "x": 16, "y": 80, "width": 24, "height": 24 },
                                    { "thing": "Stone", "x": 16, "y": 24, "width": 24, "height": 24 },
                                    { "macro": "SectionDecider", "x": 40, "pass": 1, "fail": 0 }
                                ]
                            }
                        },
                        {
                            "before": {
                                "width": 320,
                                "creation": [
                                    { "macro": "Floor", "width": 64 },
                                    { "thing": "Stone", "y": 88, "width": 336 },
                                    { "thing": "Stone", "x": 48, "y": 24, "width": 16 },
                                    { "macro": "Water", "x": 64, "width": 16 },
                                    { "thing": "Stone", "x": 72, "y": 40, "width": 16 },
                                    { "macro": "Floor", "x": 80, "y": 16 },
                                    { "thing": "Stone", "x": 80, "y": 24, "width": 40 },
                                    { "macro": "Water", "x": 88, "width": 32 },
                                    { "thing": "Stone", "x": 104, "y": 48 },
                                    { "thing": "Stone", "x": 112, "y": 40, "height": 16 },
                                    { "macro": "Floor", "x": 120, "width": 216 },
                                    { "thing": "Stone", "x": 120, "y": 56, "height": 16 },
                                    { "thing": "Stone", "x": 128, "y": 24, "width": 208 },
                                    { "thing": "Stone", "x": 128, "y": 56, "width": 16 },
                                    { "thing": "Stone", "x": 160, "y": 56, "width": 32 },
                                    { "thing": "Stone", "x": 200, "y": 48, "height": 24 },
                                    { "thing": "Stone", "x": 200, "y": 56, "width": 24 },
                                    { "thing": "Stone", "x": 240, "y": 56, "width": 96 },
                                    { "thing": "CastleBlock", "x": 280, "y": 56, "fireballs": 6, "hidden": true },
                                    { "thing": "CastleBlock", "x": 328, "y": 24, "fireballs": 6, "hidden": true },
                                    { "macro": "SectionPass", "x": 360, "y": 16, "width": 40, "height": 16 },
                                    { "macro": "SectionFail", "x": 360, "y": 48, "width": 40, "height": 24 },
                                    { "macro": "SectionFail", "x": 360, "y": 80, "width": 40, "height": 24 }
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "thing": "Stone", "y": 24 },
                                    { "thing": "Stone", "y": 56 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 136,
                                "creation": [
                                    { "macro": "Floor", "width": 80 },
                                    { "thing": "Stone", "y": 64, "height": 40 },
                                    { "thing": "Stone", "y": 88 },
                                    { "thing": "Stone", "x": 8, "y": 88, "width": 16, "height": 24 },
                                    { "macro": "Floor", "x": 72, "y": 24, "width": 32 },
                                    { "thing": "Stone", "x": 72, "y": 88, "width": 64 },
                                    { "macro": "Floor", "x": 96, "width": 32 },
                                    { "macro": "Floor", "x": 120, "y": 24, "width": 16 },
                                    { "macro": "SectionDecider", "x": 136, "pass": 2 }
                                ]
                            }
                        },
                        {
                            "before": {
                                "width": 256,
                                "creation": [ 
                                    { "macro": "EndInsideCastle", "spawnType": "SpinyEgg", "transport": { "map": "5-1" } }
                                ]
                            }
                        }
                    ]
                }
            ]
        }, {
            "name": "5-1",
            "locations": [
                { "entry": "Plain" }, 
                { "entry": "PipeVertical" }, 
                { "area": 1 }
            ],
            "areas": [
                {
                    "setting": "Overworld Alt",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackFence", "x": -384, "repeat": 6 },
                        { "macro": "Floor", "width": 392 },
                        { "macro": "CastleLarge", "x": -16 },
                        { "thing": "Koopa", "x": 128, "y": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 152, "y": 8, "xnum": 3, "xwidth": 21 },
                        { "macro": "Fill", "thing": "Goomba", "x": 240, "y": 8, "xnum": 3, "xwidth": 21 },
                        { "macro": "Fill", "thing": "Goomba", "x": 328, "y": 12, "xnum": 2, "xwidth": 21 },
                        { "macro": "Pipe", "x": 352, "height": 24, "piranha": true },
                        { "macro": "Floor", "x": 408, "width": 328 },
                        { "macro": "Pipe", "x": 408, "height": 24, "piranha": true },
                        { "thing": "Koopa", "x": 488, "y": 32, "jumping": true },
                        { "thing": "Goomba", "x": 520, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "thing": "Goomba", "x": 608, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "thing": "Koopa", "x": 696, "y": 16, "jumping": true },
                        { "thing": "Stone", "x": 712, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 712, "y": 32, "width": 40 },
                        { "macro": "Fill", "thing": "Brick", "x": 720, "y": 64, "xnum": 2, "xwidth": 16 },
                        { "thing": "Brick", "x": 728, "y": 64, "contents": "Star" },
                        { "macro": "Floor", "x": 768, "width": 324 },
                        { "macro": "Fill", "thing": "Goomba", "x": 824, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "thing": "Cannon", "x": 888, "y": 16, "height": 16 },
                        { "macro": "Floor", "x": 928, "width": 288 },
                        { "thing": "Stone", "x": 928, "y": 24, "height": 24 },
                        { "macro": "Fill", "thing": "Goomba", "x": 968, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "thing": "Koopa", "x": 1016, "y": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 1080, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Koopa", "x": 1152, "y": 12, "xnum": 2, "xwidth": 12 },
                        { "thing": "Stone", "x": 1176, "y": 32, "width": 32 },
                        { "thing": "Block", "x": 1184, "y": 32, "contents": "Mushroom1Up", "hidden": true },
                        { "macro": "Fill", "thing": "Brick", "x": 1192, "y": 32, "xnum": 2 },
                        { "macro": "Floor", "x": 1240, "width": 552 },
                        { "thing": "Stone", "x": 1248, "y": 32, "width": 16 },
                        { "macro": "Pipe", "x": 1248, "y": 32, "height": 16, "piranha": true, "transport": 2 },
                        { "thing": "Cannon", "x": 1272, "y": 16, "height": 16 },
                        { "macro": "Pipe", "x": 1304, "height": 16, "piranha": true, "entrance": 1 },
                        { "thing": "Cannon", "x": 1360, "y": 16, "height": 16 },
                        { "thing": "Koopa", "x": 1424, "y": 12, "jumping": true },
                        { "thing": "Stone", "x": 1456, "y": 8 },
                        { "thing": "Brick", "x": 1456, "y": 44 },
                        { "thing": "Stone", "x": 1464, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1472, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1480, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1488, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1512, "y": 64, "width": 16, "height": 48 },
                        { "macro": "EndOutsideCastle", "x": 1592, "transport": { "map": "5-2" } }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Ceiling", "x": 32, "width": 56 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 48, "xnum": 7 },
                        { "thing": "Brick", "x": 32, "y": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 41, "y": 55, "xnum": 5, "ynum": 2, "xwidth": 8, "yheight": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 80, "y": 56, "ynum": 4 },
                        { "thing": "Brick", "x": 88, "y": 56, "xnum": 2 },
                        { "thing": "Brick", "x": 112, "y": 48, "contents": "Coin" },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 1 },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }
            ]
        }, {
            "name": "5-2",
            "locations": [
                { "entry": "Plain" }, 
                { "entry": "PipeVertical" }, 
                { "xloc": 1032 },
                { "area": 1 }, 
                { "area": 2, "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld Alt",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackFence", "x": -384, "repeat": 4 },
                        { "macro": "Floor", "width": 208 },
                        { "macro": "CastleSmall" },
                        { "thing": "Stone", "x": 96, "y": 8 },
                        { "thing": "Stone", "x": 104, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 112, "y": 24, "width": 16, "height": 24 },
                        { "thing": "Stone", "x": 120, "y": 32, "width": 32 },
                        { "thing": "Cannon", "x": 136, "y": 48, "height": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 169, "y": 71, "xnum": 3, "xwidth": 8 },
                        { "thing": "Koopa", "x": 184, "y": 12 },
                        { "thing": "Springboard", "x": 200, "y": 14.5 },
                        { "macro": "Floor", "x": 232, "width": 296 },
                        { "macro": "Fill", "thing": "Brick", "x": 232, "y": 32, "xnum": 6 },
                        { "macro": "Fill", "thing": "Brick", "x": 232, "y": 64, "xnum": 5 },
                        { "macro": "Fill", "thing": "Coin", "x": 233, "y": 39, "xnum": 3, "xwidth": 8 },
                        { "thing": "Brick", "x": 272, "y": 64, "contents": "Mushroom" },
                        { "thing": "Koopa", "x": 320, "y": 32, "jumping": true },
                        { "thing": "Stone", "x": 352, "y": 8 },
                        { "thing": "Stone", "x": 360, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 368, "y": 24, "height": 24 },
                        { "thing": "HammerBro", "x": 368, "y": 36 },
                        { "thing": "Stone", "x": 376, "y": 32, "width": 16, "height": 32 },
                        { "thing": "Stone", "x": 392, "y": 16, "height": 16 },
                        { "macro": "Pipe", "x": 440, "height": 24, "piranha": true, "transport": 3 },
                        { "thing": "Stone", "x": 496, "y": 8 },
                        { "thing": "Stone", "x": 504, "y": 16, "height": 16 },
                        { "thing": "Goomba", "x": 504, "y": 24 },
                        { "thing": "Stone", "x": 512, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 520, "y": 32, "height": 32 },
                        { "thing": "Goomba", "x": 520, "y": 40 },
                        { "macro": "Floor", "x": 544, "width": 192 },
                        { "thing": "Stone", "x": 544, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 552, "y": 48, "width": 16, "height": 48 },
                        { "macro": "Fill", "thing": "Block", "x": 624, "y": 32, "xnum": 5 },
                        { "thing": "HammerBro", "x": 648, "y": 46 },
                        { "thing": "Block", "x": 672, "y": 32, "hidden": true },
                        { "thing": "Brick", "x": 680, "y": 64, "contents": ["Vine", { "entrance": 4 }] },
                        { "macro": "Fill", "thing": "Brick", "x": 688, "y": 64, "xnum": 2 },
                        { "macro": "Fill", "thing": "Coin", "x": 689, "y": 71, "xnum": 2, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 712, "y": 40, "xnum": 3 },
                        { "macro": "Fill", "thing": "Coin", "x": 713, "y": 7, "xnum": 2, "xwidth": 8 },
                        { "macro": "Floor", "x": 768, "width": 248 },
                        { "thing": "Koopa", "x": 848, "y": 32, "jumping": true },
                        { "thing": "Cannon", "x": 856, "y": 16, "height": 16 },
                        { "macro": "Pipe", "x": 920, "height": 16, "piranha": true, "entrance": 1 },
                        { "macro": "Fill", "thing": "Brick", "x": 944, "y": 32, "xnum": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 944, "y": 64, "xnum": 7 },
                        { "thing": "HammerBro", "x": 960, "y": 44 },
                        { "thing": "HammerBro", "x": 992, "y": 76 },
                        { "thing": "Brick", "x": 1000, "y": 64, "contents": "Star" },
                        { "macro": "Floor", "x": 1032, "width": 120 },
                        { "thing": "Stone", "x": 1032, "y": 24, "height": 24 },
                        { "macro": "Fill", "thing": "Beetle", "x": 1088, "y": 8.5, "xnum": 3, "xwidth": 8.5 },
                        { "thing": "Brick", "x": 1128, "y": 16, "contents": "Coin" },
                        { "thing": "Brick", "x": 1136, "y": 16, "contents": "Mushroom" },
                        { "macro": "Pattern", "pattern": "BackFence", "x": 1142, "repeat": 2 },
                        { "macro": "Fill", "thing": "Brick", "x": 1176, "y": 32, "xnum": 3 },
                        { "macro": "Floor", "x": 1208, "width": 152 },
                        { "macro": "Fill", "thing": "Brick", "x": 1124, "y": 64, "xnum": 5 },
                        { "macro": "Fill", "thing": "Goomba", "x": 1240, "y": 8, "xnum": 2, "xwidth": 12 },
                        { "thing": "Koopa", "x": 1256, "y": 76, "smart": true },
                        { "thing": "Koopa", "x": 1304, "y": 28, "jumping": true },
                        { "thing": "Koopa", "x": 1328, "y": 20, "jumping": true },
                        { "thing": "Block", "x": 1344, "y": 32, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Brick", "x": 1376, "y": 64, "xnum": 4 },
                        { "macro": "Fill", "thing": "Coin", "x": 1377, "y": 71, "xnum": 2, "xwidth": 8 },
                        { "macro": "Floor", "x": 1384, "width": 16 },
                        { "macro": "Pipe", "x": 1384, "height": 16 },
                        { "macro": "Floor", "x": 1416, "width": 64 },
                        { "thing": "Stone", "x": 1464, "y": 8 },
                        { "thing": "Stone", "x": 1472, "y": 16, "height": 16 },
                        { "macro": "Floor", "x": 1488, "width": 16 },
                        { "thing": "Stone", "x": 1488, "y": 32, "height": 32 },
                        { "thing": "Koopa", "x": 1488, "y": 64, "jumping": true },
                        { "thing": "Stone", "x": 1496, "y": 40, "height": 40 },
                        { "macro": "Floor", "x": 1512, "width": 280 },
                        { "thing": "Stone", "x": 1512, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1520, "y": 64, "width": 16, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 1600, "transport": { "map": "5-3" } }
                    ]
                }, {
                    "setting": "Underwater",
                    "blockBoundaries": true,
                    "underwater": true,
                    "creation": [
                        { "macro": "Floor", "width": 176 },
                        { "thing": "Stone", "x": 88, "y": 56, "width": 40 },
                        { "thing": "Coral", "x": 96, "y": 24, "height": 24 },
                        { "thing": "Coral", "x": 120, "y": 72, "height": 16 },
                        { "thing": "Blooper", "x": 136, "y": 24 },
                        { "thing": "Coral", "x": 160, "y": 32, "height": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 177, "y": 47, "xnum": 10, "xwidth": 8 },
                        { "macro": "PlatformGenerator", "x": 182, "width": 24 },
                        { "macro": "Floor", "x": 208, "y": 24, "width": 16 },
                        { "thing": "Stone", "x": 208, "y": 88, "width": 16, "height": 24 },
                        { "thing": "CheepCheep", "x": 220, "y": 60 },
                        { "macro": "PlatformGenerator", "x": 230, "width": 24 },
                        { "macro": "Floor", "x": 256, "y": 24, "width": 16 },
                        { "thing": "Stone", "x": 256, "height": 88, "width": 16, "height": 24 },
                        { "macro": "Floor", "x": 272, "width": 32 },
                        { "thing": "Blooper", "x": 272, "y": 24 },
                        { "thing": "Coral", "x": 304, "y": 64, "height": 32 },
                        { "thing": "Stone", "x": 304, "y": 72, "width": 48 },
                        { "thing": "CheepCheep", "x": 312, "y": 20 },
                        { "macro": "Floor", "x": 320, "width": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 321, "y": 7, "xnum": 2, "xwidth": 8 },
                        { "thing": "Coral", "x": 344, "y": 64, "height": 32 },
                        { "thing": "Blooper", "x": 348, "y": 22 },
                        { "macro": "Floor", "x": 352, "width": 168 },
                        { "thing": "Coral", "x": 368, "y": 16, "height": 16 },
                        { "thing": "CheepCheep", "x": 388, "y": 40, "smart": true },
                        { "thing": "Stone", "x": 400, "y": 32, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 401, "y": 39, "xnum": 4, "xwidth": 8 },
                        { "thing": "CheepCheep", "x": 424, "y": 84 },
                        { "thing": "Stone", "x": 432, "y": 56, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 433, "y": 63, "xnum": 4, "xwidth": 8 },
                        { "thing": "Stone", "x": 472, "y": 8 },
                        { "thing": "Stone", "x": 480, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 488, "y": 32, "width": 16, "height": 40 },
                        { "thing": "Stone", "x": 488, "y": 88, "width": 16, "height": 40 },
                        { "thing": "PipeHorizontal", "x": 496, "y": 48, "transport": 1 },
                        { "thing": "Stone", "x": 504, "y": 88, "width": 16, "height": 88 }
                    ]
                }, {
                    "setting": "Sky",
                    "blockBoundaries": true,
                    "exit": 2,
                    "creation": [
                        { "thing": "Stone", "width": 32 },
                        { "thing": "Stone", "x": 40, "width": 576 },
                        { "thing": "Platform", "x": 120, "y": 32, "width": 16, "transport": true },
                        { "macro": "Fill", "thing": "Coin", "x": 120, "y": 64, "xnum": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 256, "y": 80, "xnum": 3 },
                        { "macro": "Fill", "thing": "Coin", "x": 288, "y": 72, "xnum": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 424, "y": 80, "xnum": 3 }
                    ]
                }
            ]
        }, {
            "name": "5-3",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackCloud", "x": 0, "y": 4, "repeat": 5 },
                        { "macro": "Floor", "x": 0, "y": 0, "width": 128 },
                        { "macro": "CastleSmall" },
                        { "macro": "BulletBillsStart", "width": 128 },
                        { "macro": "Tree", "x": 144, "y": 8, "width": 32 },
                        { "macro": "Tree", "x": 192, "y": 32, "width": 64, "solidTrunk": true },
                        { "macro": "Tree", "x": 208, "y": 64, "width": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 217, "y": 71, "xnum": 3, "xwidth": 8 },
                        { "thing": "Koopa", "x": 240, "y": 76, "smart": true },
                        { "macro": "Tree", "x": 256, "y": 8, "width": 24 },
                        { "thing": "Coin", "x": 266, "y": 15 },
                        { "macro": "Tree", "x": 280, "y": 40, "width": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 297, "y": 87, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 320, "y": 72, "width": 56 },
                        { "macro": "Fill", "thing": "Goomba", "x": 352, "y": 80, "xnum": 2, "xwidth": 16 },
                        { "macro": "Tree", "x": 400, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 402, "y": 55, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 440, "y": 56, "width": 16, "floating": true, "begin": -4, "end": 56 },
                        { "macro": "Tree", "x": 472, "width": 40 },
                        { "thing": "Block", "x": 472, "y": 24, "contents": "Mushroom" },
                        { "macro": "Tree", "x": 480, "y": 64, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 482, "y": 71, "xnum": 4, "xwidth": 8 },
                        { "macro": "Tree", "x": 520, "width": 40 },
                        { "macro": "Tree", "x": 560, "y": 32, "width": 24 },
                        { "thing": "Koopa", "x": 592, "y": 76, "smart": true, "jumping": true, "floating": true, "begin": 16, "end": 88 },
                        { "macro": "Tree", "x": 608, "y": 56, "width": 48 },
                        { "thing": "Goomba", "x": 640, "y": 64 },
                        { "macro": "Fill", "thing": "Coin", "x": 681, "y": 63, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 672, "y": 40, "width": 20, "sliding": true, "begin": 660, "end": 720 },
                        { "macro": "Fill", "thing": "Coin", "x": 745, "y": 71, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 756, "y": 32, "width": 20, "sliding": true, "begin": 708, "end": 776 },
                        { "macro": "Fill", "thing": "Coin", "x": 777, "y": 71, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 784, "y": 16, "width": 32 },
                        { "macro": "Tree", "x": 832, "y": 48, "width": 64, "solidTrunk": true },
                        { "thing": "Koopa", "x": 880, "y": 60, "smart": true },
                        { "macro": "Tree", "x": 904, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 906, "y": 7, "xnum": 3, "xwidth": 8 },
                        { "thing": "Koopa", "x": 912, "y": 68, "smart": true, "jumping": true, "floating": true, "begin": 4, "end": 76 },
                        { "macro": "Tree", "x": 928, "y": 32, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 963, "y": 63, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 976, "y": 32, "width": 32, "solidTrunk": true },
                        { "macro": "Floor", "x": 1032, "width": 368 },
                        { "thing": "Platform", "x": 1052, "y": 56, "width": 20, "sliding": true, "begin": 1008, "end": 1076 },
                        { "thing": "Koopa", "x": 1064, "y": 12, "smart": true },
                        { "thing": "Stone", "x": 1104, "y": 32, "width": 16, "height": 32 },
                        { "thing": "Stone", "x": 1120, "y": 48, "width": 16, "height": 48 },
                        { "thing": "Stone", "x": 1136, "y": 64, "width": 16, "height": 64 },
                        { "macro": "BulletBillsStop", "x": 1152 },
                        { "macro": "EndOutsideCastle", "x": 1224, "large": true, "walls": 12, "transport": { "map": "5-4" } }
                    ]
                }
            ]
        }, {
            "name": "5-4",
            "time": 300,
            "locations": [
                { "entry": "Castle" }
            ],
            "areas": [
                {
                    "setting": "Castle",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "StartInsideCastle", "width": 128 },
                        { "thing": "Stone", "y": 88, "width": 128, "height": 24 },
                        { "thing": "Podoboo", "x": 128, "y": -32 },
                        { "macro": "Water", "x": 128, "width": 128 },
                        { "thing": "Stone", "x": 144, "y": 32, "width": 16 },
                        { "thing": "Podoboo", "x": 160, "y": -24 },
                        { "thing": "Stone", "x": 176, "y": 48 },
                        { "thing": "CastleBlock", "x": 184, "y": 48, "fireballs": 12, "direction": 1 },
                        { "thing": "Block", "x": 184, "y": 80, "contents": "Mushroom" },
                        { "thing": "Stone", "x": 192, "y": 48 },
                        { "thing": "Stone", "x": 216, "y": 32, "width": 16 },
                        { "thing": "Podoboo", "x": 240, "y": -32 },
                        { "macro": "Floor", "x": 256, "y": -8, "width": 416 },
                        { "thing": "Stone", "x": 256, "y": 24, "width": 16, "height": 32 },
                        { "thing": "Stone", "x": 272, "y": 88, "width": 392, "height": 24 },
                        { "thing": "Stone", "x": 272, "y": 64, "width": 168 },
                        { "thing": "Stone", "x": 272, "width": 72 },
                        { "thing": "Stone", "x": 296, "y": 32, "width": 96 },
                        { "thing": "CastleBlock", "x": 344, "fireballs": 6, "direction": 1 },
                        { "thing": "Stone", "x": 352, "width": 88 },
                        { "thing": "CastleBlock", "x": 392, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 400, "y": 32, "width": 88 },
                        { "thing": "CastleBlock", "x": 440, "y": 64, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 440, "fireballs": 6, "direction": 1 },
                        { "thing": "Stone", "x": 448, "width": 88 },
                        { "thing": "Stone", "x": 448, "y": 64, "width": 216 },
                        { "thing": "CastleBlock", "x": 488, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 496, "y": 32, "width": 88 },
                        { "thing": "CastleBlock", "x": 536, "fireballs": 6, "direction": 1 },
                        { "thing": "Stone", "x": 544, "width": 96 },
                        { "thing": "CastleBlock", "x": 584, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 640, "y": 24, "width": 32, "height": 32 },
                        { "thing": "CastleBlock", "x": 656, "y": 56, "fireballs": 6 },
                        { "macro": "PlatformGenerator", "x": 686, "width": 12, "direction": -1 },
                        { "macro": "PlatformGenerator", "x": 710, "width": 12 },
                        { "macro": "Floor", "x": 736, "y": 16 },
                        { "thing": "CastleBlock", "x": 736, "y": 24, "fireballs": 6, "direction": 1 },
                        { "macro": "Floor", "x": 744, "y": 24, "width": 48 },
                        { "thing": "Stone", "x": 744, "y": 88, "width": 48, "height": 24 },
                        { "macro": "Floor", "x": 792, "width": 80 },
                        { "macro": "Fill", "thing": "Coin", "x": 817, "y": 7, "xnum": 3, "ynum": 2, "xwidth": 8, "yheight": 32 },
                        { "thing": "CastleBlock", "x": 824, "y": 16, "fireballs": 6, "direction": 1 },
                        { "thing": "Stone", "x": 864, "y": 24, "height": 24 },
                        { "macro": "Water", "x": 872, "width": 16 },
                        { "thing": "Podoboo", "x": 872, "y": -32 },
                        { "thing": "Stone", "x": 864, "y": 24, "height": 24 },
                        { "macro": "Floor", "x": 888, "y": 24, "width": 16 },
                        { "macro": "Water", "x": 904, "width": 32 },
                        { "thing": "Podoboo", "x": 904, "y": -32 },
                        { "macro": "Floor", "x": 920, "width": 104 },
                        { "thing": "Stone", "x": 920, "y": 24, "width": 40, "height": 24 },
                        { "thing": "Stone", "x": 920, "y": 88, "width": 104, "height": 24 },
                        { "macro": "Fill", "thing": "Stone", "x": 976, "y": 24, "xnum": 2, "xwidth": 32, "width": 16, "height": 24 },
                        { "macro": "Fill", "thing": "Brick", "x": 1024, "y": 64, "xnum": 6 },
                        { "macro": "EndInsideCastle", "x": 1024, "spawnType": "Lakitu", "transport": { "map": "6-1" } },
                        { "thing": "Podoboo", "x": 1048, "y": -40 },
                        { "thing": "Platform", "x": 1108, "y": 56, "width": 16, "sliding": true, "begin": 1080, "end": 1112, "nocollidechar": true }
                    ]
                }
            ]
        }, {
            "name": "6-1",
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld Night",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 160 },
                        { "macro": "CastleLarge", "x": -16 },
                        { "macro": "Pattern", "pattern": "BackRegular", "repeat": 4 },
                        { "thing": "Lakitu", "x": 184, "y": 84 },
                        { "macro": "Fill", "thing": "Block", "x": 128, "y": 32, "xnum": 2 },
                        { "macro": "Floor", "x": 176, "width": 72 },
                        { "thing": "Stone", "x": 208, "y": 8, "width": 48 },
                        { "thing": "Stone", "x": 232, "y": 16, "width": 40 },
                        { "thing": "Stone", "x": 256, "y": 24, "width": 32 },
                        { "thing": "Stone", "x": 280, "y": 32, "width": 24 },
                        { "thing": "Brick", "x": 288, "y": 64, "contents": "Mushroom" },
                        { "macro": "Floor", "x": 296, "width": 16 },
                        { "thing": "Brick", "x": 296, "y": 64 },
                        { "macro": "Floor", "x": 328, "width": 128 },
                        { "macro": "Fill", "thing": "Brick", "x": 328, "y": 32, "xnum": 2 },
                        { "thing": "Brick", "x": 344, "y": 32, "contents": "Coin" },
                        { "macro": "Floor", "x": 472, "width": 120 },
                        { "macro": "Fill", "thing": "Coin", "x": 497, "y": 31, "xnum": 3, "xwidth": 8 },
                        { "thing": "Stone", "x": 552, "y": 8 },
                        { "thing": "Stone", "x": 560, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 568, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 576, "y": 32, "width": 16, "height": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 609, "y": 47, "xnum": 2, "xwidth": 8 },
                        { "macro": "Floor", "x": 616, "width": 128 },
                        { "thing": "Stone", "x": 672, "y": 16 },
                        { "thing": "Stone", "x": 680, "y": 24, "height": 16 },
                        { "thing": "Stone", "x": 696, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 704, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 712, "y": 56, "height": 56 },
                        { "thing": "Block", "x": 720, "y": 40, "contents": "Mushroom1Up", "hidden": true },
                        { "macro": "Fill", "thing": "Brick", "x": 720, "y": 56, "xnum": 3 },
                        { "macro": "Fill", "thing": "Brick", "x": 736, "y": 24, "xnum": 3 },
                        { "macro": "Floor", "x": 768, "width": 248 },
                        { "macro": "Pipe", "x": 816, "height": 24, "piranha": true },
                        { "macro": "Fill", "thing": "Coin", "x": 841, "y": 39, "xnum": 3, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Block", "x": 904, "y": 32, "ynum": 2, "yheight": 32, "hidden": true },
                        { "thing": "Stone", "x": 976, "y": 8 },
                        { "thing": "Stone", "x": 984, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 992, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1000, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1008, "y": 40, "height": 40 },
                        { "macro": "Fill", "thing": "Brick", "x": 1016, "y": 40, "xnum": 2 },
                        { "macro": "Fill", "thing": "Brick", "x": 1040, "y": 8, "xnum": 5 },
                        { "thing": "Brick", "x": 1048, "y": 40 },
                        { "macro": "Floor", "x": 1072, "width": 16 },
                        { "macro": "Floor", "x": 1096, "width": 96 },
                        { "thing": "Stone", "x": 1144, "y": 8 },
                        { "thing": "Stone", "x": 1152, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1160, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1168, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1176, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1184, "y": 48, "height": 48 },
                        { "macro": "Fill", "thing": "Brick", "x": 1192, "y": 48, "xnum": 2 },
                        { "thing": "Brick", "x": 1208, "y": 32 },
                        { "macro": "Fill", "thing": "Brick", "x": 1216, "y": 16, "xnum": 3 },
                        { "thing": "Brick", "x": 1216, "y": 32, "contents": "Coin" },
                        { "macro": "Floor", "x": 1240, "width": 72 },
                        { "macro": "Floor", "x": 1336, "width": 56 },
                        { "thing": "Stone", "x": 1352, "y": 8 },
                        { "thing": "Stone", "x": 1360, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1368, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1376, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1384, "y": 40, "height": 40 },
                        { "macro": "Floor", "x": 1408, "width": 240 },
                        { "macro": "LakituStop", "x": 1408 },
                        { "thing": "Stone", "x": 1408, "y": 64, "width": 16, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 1488, "transport": { "map": "6-2" } }
                    ]
                }
            ]
        }, {
            "name": "6-2",
            "locations": [
                { "entry": "Plain" }, 
                { "entry": "PipeVertical" }, 
                { "entry": "PipeVertical" },
                { "xloc": 1304 }, 
                { "entry": "PipeVertical" },
                { "area": 1 }, 
                { "area": 2 }, 
                { "area": 3, "entry": "Vine" },
                { "area": 4 }
            ],
            "areas": [
                {
                    "setting": "Overworld Night",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 984 },
                        { "macro": "CastleSmall" },
                        { "macro": "Pattern", "pattern": "BackRegular", "repeat": 5 },
                        { "macro": "Fill", "thing": "Brick", "x": 80, "y": 32, "xnum": 3 },
                        { "macro": "Pipe", "x": 152, "height": 32, "piranha": true, "transport": 5 },
                        { "thing": "Brick", "x": 184, "y": 64 },
                        { "thing": "Block", "x": 192, "y": 32, "hidden": true },
                        { "thing": "Brick", "x": 192, "y": 64, "contents": "Coin" },
                        { "thing": "Brick", "x": 200, "y": 64 },
                        { "thing": "Koopa", "x": 208, "y": 12 },
                        { "macro": "Pipe", "x": 224, "height": 32, "piranha": true },
                        { "thing": "Stone", "x": 256, "y": 40, "width": 16 },
                        { "macro": "Pipe", "x": 256, "y": 40, "height": 16, "piranha": true },
                        { "macro": "Pipe", "x": 280, "height": 16, "piranha": true, "entrance": 1 },
                        { "macro": "Pipe", "x": 296, "height": 16, "piranha": true },
                        { "thing": "Koopa", "x": 344, "y": 32, "jumping": true },
                        { "macro": "Pipe", "x": 368, "height": 32, "piranha": true },
                        { "thing": "Brick", "x": 408, "y": 32 },
                        { "thing": "Brick", "x": 416, "y": 32, "contents": "Mushroom" },
                        { "thing": "Beetle", "x": 432, "y": 8.5 },
                        { "macro": "Pipe", "x": 448, "height": 40, "piranha": true, "transport": 6 },
                        { "thing": "Stone", "x": 496, "y": 32, "width": 16 },
                        { "macro": "Pipe", "x": 496, "y": 32, "height": 16, "piranha": true },
                        { "macro": "Pipe", "x": 536, "height": 16, "piranha": true },
                        { "macro": "Fill", "thing": "Brick", "x": 616, "y": 64, "xnum": 4 },
                        { "macro": "Pipe", "x": 640, "height": 24, "piranha": true },
                        { "thing": "Block", "x": 656, "y": 32, "hidden": true },
                        { "thing": "Brick", "x": 648, "y": 64, "contents": [ "Vine", { "transport": 7 } ] },
                        { "macro": "Pipe", "x": 672, "height": 16, "piranha": true },
                        { "macro": "Pipe", "x": 696, "height": 48, "piranha": true },
                        { "thing": "Beetle", "x": 736, "y": 8.5 },
                        { "macro": "Pipe", "x": 752, "height": 24, "piranha": true },
                        { "macro": "Pipe", "x": 816, "height": 32 },
                        { "macro": "Pipe", "x": 840, "height": 16, "piranha": true },
                        { "macro": "Fill", "thing": "Brick", "x": 880, "y": 32, "xnum": 2, "xwidth": 24 },
                        { "thing": "Stone", "x": 888, "y": 32, "width": 16 },
                        { "macro": "Pipe", "x": 888, "y": 32, "height": 24, "piranha": true },
                        { "macro": "Pipe", "x": 920, "height": 16, "piranha": true, "entrance": 2 },
                        { "thing": "Brick", "x": 920, "y": 64 },
                        { "macro": "Fill", "thing": "Brick", "x": 952, "y": 64, "xnum": 9 },
                        { "thing": "Beetle", "x": 950, "y": 72.5 },
                        { "macro": "Floor", "x": 1032, "width": 96 },
                        { "macro": "Pipe", "x": 1048, "height": 16, "piranha": true },
                        { "macro": "Pipe", "x": 1080, "height": 16, "piranha": true },
                        { "macro": "Fill", "thing": "Brick", "x": 1104, "y": 40, "xnum": 2 },
                        { "thing": "Brick", "x": 1120, "y": 64, "contents": "Star" },
                        { "thing": "Brick", "x": 1128, "y": 64 },
                        { "macro": "Floor", "x": 1136 },
                        { "macro": "Floor", "x": 1152, "width": 64 },
                        { "macro": "Fill", "thing": "Brick", "x": 1152, "y": 32, "xnum": 3 },
                        { "macro": "Fill", "thing": "Brick", "x": 1160, "y": 64, "xnum": 2 },
                        { "thing": "Stone", "x": 1192, "y": 8 },
                        { "thing": "Stone", "x": 1200, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1208, "y": 24, "height": 24 },
                        { "macro": "Floor", "x": 1224, "width": 696 },
                        { "macro": "Pipe", "x": 1224, "height": 24, "piranha": true, "transport": 8 },
                        { "thing": "Stone", "x": 1248, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1256, "y": 16, "height": 16 },
                        { "macro": "Fill", "thing": "Brick", "x": 1280, "y": 32, "xnum": 3, "ynum": 2, "yheight": 32 },
                        { "thing": "Beetle", "x": 1304, "y": 8.5 },
                        { "thing": "Stone", "x": 1336, "y": 32, "width": 16 },
                        { "macro": "Pipe", "x": 1336, "y": 32, "height": 24, "piranha": true },
                        { "thing": "Goomba", "x": 1352, "y": 8 },
                        { "macro": "Pipe", "x": 1392, "height": 32, "piranha": true },
                        { "macro": "Pipe", "x": 1432, "height": 16, "piranha": true, "entrance": 4 },
                        { "macro": "Pipe", "x": 1448, "height": 24, "piranha": true },
                        { "macro": "Pipe", "x": 1464, "height": 32, "piranha": true },
                        { "macro": "Pipe", "x": 1512, "height": 24, "piranha": true },
                        { "thing": "Stone", "x": 1592, "y": 8 },
                        { "thing": "Stone", "x": 1600, "y": 16, "height": 16 },
                        { "macro": "Pipe", "x": 1608, "height": 32, "piranha": true },
                        { "thing": "Stone", "x": 1624, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1632, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 1640, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1648, "y": 64, "height": 64 },
                        { "thing": "Koopa", "x": 1648, "y": 84, "jumping": true },
                        { "macro": "EndOutsideCastle", "x": 1728, "transport": { "map": "6-3" } }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Ceiling", "x": 32, "width": 56 },
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 48, "xnum": 7 },
                        { "thing": "Brick", "x": 32, "y": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 42, "y": 55, "xnum": 5, "ynum": 2, "xwidth": 8, "yheight": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 80, "y": 56, "ynum": 4 },
                        { "macro": "Fill", "thing": "Brick", "x": 112, "y": 48, "contents": "Coin" },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 1 },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }, {
                    "setting": "Underwater",
                    "blockBoundaries": true,
                    "underwater": true,
                    "creation": [
                        { "macro": "Floor", "width": 176 },
                        { "thing": "Stone", "x": 88, "y": 56, "width": 40 },
                        { "thing": "Coral", "x": 96, "y": 24, "height": 24 },
                        { "thing": "Coral", "x": 1220, "y": 72, "height": 16 },
                        { "thing": "Blooper", "x": 136, "y": 24 },
                        { "thing": "Coral", "x": 160, "y": 32, "height": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 177, "y": 47, "xnum": 10, "xwidth": 8 },
                        { "macro": "PlatformGenerator", "x": 186, "width": 16 },
                        { "macro": "Floor", "x": 208, "y": 24, "width": 16 },
                        { "thing": "Stone", "x": 208, "y": 88, "width": 16, "height": 24 },
                        { "thing": "CheepCheep", "x": 220, "y": 60 },
                        { "macro": "PlatformGenerator", "x": 234, "width": 16 },
                        { "macro": "Floor", "x": 256, "y": 24, "width": 16 },
                        { "thing": "Stone", "x": 256, "y": 88, "width": 16, "height": 24 },
                        { "macro": "Floor", "x": 272, "width": 32 },
                        { "thing": "Blooper", "x": 272, "y": 24 },
                        { "thing": "Coral", "x": 304, "y": 64, "height": 32 },
                        { "thing": "Stone", "x": 304, "y": 72, "width": 48 },
                        { "thing": "CheepCheep", "x": 312, "y": 20 },
                        { "macro": "Floor", "x": 320, "width": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 321, "y": 7, "xnum": 2, "xwidth": 8 },
                        { "thing": "Coral", "x": 344, "y": 64, "height": 32 },
                        { "thing": "Blooper", "x": 348, "y": 22 },
                        { "macro": "Floor", "x": 352, "width": 168 },
                        { "thing": "Coral", "x": 368, "y": 16, "height": 16 },
                        { "thing": "CheepCheep", "x": 388, "y": 40, "smart": true },
                        { "thing": "Stone", "x": 400, "y": 32, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 401, "y": 39, "xnum": 4, "xwidth": 8 },
                        { "thing": "CheepCheep", "x": 424, "y": 84 },
                        { "thing": "Stone", "x": 432, "y": 56, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 433, "y": 63, "xnum": 4, "xwidth": 8 },
                        { "thing": "Stone", "x": 472, "y": 8 },
                        { "thing": "Stone", "x": 480, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 488, "y": 32, "width": 16, "height": 32 },
                        { "thing": "Stone", "x": 488, "y": 88, "width": 16, "height": 32 },
                        { "thing": "PipeHorizontal", "x": 496, "y": 48, "width": 16, "transport": 2 },
                        { "thing": "Stone", "x": 504, "y": 88, "width": 16, "height": 88, "width": 16 },
                        { "thing": "ScrollBlocker", "x": 520 }
                    ]
                }, {
                    "setting": "Sky Night",
                    "exit": 3,
                    "creation": [
                        { "thing": "Stone", "width": 32 },
                        { "thing": "Stone", "x": 40, "width": 624 },
                        { "thing": "Platform", "x": 128, "y": 24, "width": 24, "transport": true },
                        { "macro": "Fill", "thing": "Coin", "x": 121, "y": 55, "xnum": 16, "xwidth": 8 },
                        { "thing": "Stone", "x": 256, "y": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 273, "y": 55, "xnum": 16, "xwidth": 8 },
                        { "thing": "Stone", "x": 408, "y": 48, "height": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 425, "y": 63, "xnum": 7, "xwidth": 8 },
                        { "thing": "Stone", "x": 488, "y": 48, "height": 16 },
                        { "thing": "Stone", "x": 536, "y": 56, "width": 16 },
                        { "macro": "Fill", "thing": "Stone", "x": 568, "y": 56, "xnum": 5, "xwidth": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 569, "y": 63, "xnum": 10, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 681, "y": 15, "xnum": 3, "xwidth": 8 }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Ceiling", "x": 32, "width": 88 },
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 24, "y": 16, "ynum": 3 },
                        { "macro": "Fill", "thing": "Coin", "x": 25, "y": 39, "xnum": 8, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 25, "y": 7, "xnum": 10, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 32, "xnum": 6 },
                        { "macro": "Fill", "thing": "Brick", "x": 80, "y": 16, "ynum": 3 },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 4 },
                        { "thing": "Brick", "x": 104, "y": 32, "contents": "Mushroom" },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }
            ]
        }, {
            "name": "6-3",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld Night Alt2",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "CastleSmall" },
                        { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 4 },
                        { "macro": "Floor", "width": 128 },
                        { "macro": "CastleSmall" },
                        { "macro": "BulletBillsStart", "x": 128 },
                        { "macro": "Tree", "x": 144, "width": 24 },
                        { "macro": "Tree", "x": 168, "y": 32, "width": 24 },
                        { "macro": "Tree", "x": 192, "width": 24 },
                        { "thing": "Platform", "x": 224, "width": 16, "floating": true, "begin": 0, "end": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 226, "y": 87, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 248, "y": 32, "width": 32 },
                        { "macro": "Tree", "x": 296, "width": 24 },
                        { "thing": "Springboard", "x": 304, "y": 14.5 },
                        { "macro": "Tree", "x": 344, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 345, "y": 71, "xnum": 7, "xwidth": 8 },
                        { "thing": "Platform", "x": 348, "y": 64, "width": 16, "sliding": true, "begin": 312, "end": 364 },
                        { "thing": "Platform", "x": 388, "y": 47, "width": 16, "sliding": true, "begin": 356, "end": 400 },
                        { "macro": "Tree", "x": 392, "y": 16, "width": 32 },
                        { "thing": "Block", "x": 440, "y": 80, "contents": "Mushroom" },
                        { "thing": "Platform", "x": 444, "y": 56, "width": 16, "sliding": true, "begin": 408, "end": 464 },
                        { "thing": "Platform", "x": 480, "y": 7, "width": 16, "floating": true, "begin": -8, "end": 52 },
                        { "macro": "Tree", "x": 520, "y": 32, "width": 40 },
                        { "macro": "Scale", "x": 572, "y": 86, "widthLeft": 16, "widthRight": 16, "between": 32, "dropRight": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 585, "y": 63, "xnum": 2, "xwidth": 8 },
                        { "macro": "Scale", "x": 636, "y": 86, "widthLeft": 16, "widthRight": 16, "between": 24, "dropRight": 56 },
                        { "macro": "Tree", "x": 680, "y": 24, "width": 40 },
                        { "macro": "Tree", "x": 680, "y": 80, "width": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 681, "y": 87, "xnum": 3, "xwidth": 8 },
                        { "macro": "Tree", "x": 720, "y": 40, "width": 24 },
                        { "macro": "Tree", "x": 744, "y": 0, "width": 24 },
                        { "macro": "Tree", "x": 776, "y": 0, "width": 32 },
                        { "macro": "Fill", "thing": "Coin", "x": 801, "y": 39, "xnum": 4, "xwidth": 8 },
                        { "macro": "Tree", "x": 824, "width": 24 },
                        { "macro": "Tree", "x": 856, "y": 32, "width": 40 },
                        { "macro": "Tree", "x": 904, "width": 40 },
                        { "thing": "Springboard", "x": 928, "y": 14.5 },
                        { "thing": "Platform", "x": 972, "y": 63, "width": 16, "sliding": true, "begin": 940, "end": 992 },
                        { "macro": "Tree", "x": 984, "width": 24 },
                        { "macro": "Scale", "x": 1020, "y": 86, "widthLeft": 16, "widthRight": 16, "between": 24, "dropLeft": 32, "dropRight": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 1025, "y": 63, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 1056, "width": 32 },
                        { "macro": "Tree", "x": 1056, "y": 64, "width": 24 },
                        { "macro": "Tree", "x": 1080, "y": 32, "width": 32 },
                        { "thing": "Platform", "x": 1128, "y": 47, "width": 16, "falling": true },
                        { "thing": "Platform", "x": 1160, "y": 55, "width": 16, "falling": true },
                        { "macro": "Fill", "thing": "Coin", "x": 1161, "y": 47, "xnum": 2, "xwidth": 8 },
                        { "thing": "Platform", "x": 1192, "y": 51, "width": 16, "falling": true },
                        { "thing": "Platform", "x": 1224, "y": 59, "width": 16, "falling": true },
                        { "macro": "Fill", "thing": "Coin", "x": 1233, "y": 87, "xnum": 2, "xwidth": 8 },
                        { "macro": "Tree", "x": 1246, "y": 72, "width": 24 },
                        { "macro": "Floor", "x": 1280, "width": 256 },
                        { "macro": "BulletBillsStop", "x": 1280 },
                        { "macro": "EndOutsideCastle", "x": 1336, "large": true, "walls": 15, "transport": { "map": "6-4" } }
                    ]
                }
            ]
        }, {
            "name": "6-4",
            "time": 300,
            "locations": [
                { "entry": "Castle" }
            ],
            "areas": [
                {
                    "setting": "Castle",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "StartInsideCastle" },
                        { "thing": "Stone", "y": 88, "width": 192, "height": 24 },
                        { "macro": "Floor", "x": 40, "y": 24, "width": 64 },
                        { "macro": "Water", "x": 104, "y": 8, "width": 16 },
                        { "macro": "Floor", "x": 120, "y": 24, "width": 88 },
                        { "thing": "Stone", "x": 184, "y": 64 },
                        { "thing": "CastleBlock", "x": 184, "y": 56, "fireballs": 6 },
                        { "thing": "Stone", "x": 192, "y": 88, "width": 1088 },
                        { "macro": "Water", "x": 208, "width": 24 },
                        { "thing": "Podoboo", "x": 216, "y": -32 },
                        { "macro": "Floor", "x": 232, "y": 24, "width": 24 },
                        { "thing": "CastleBlock", "x": 240, "y": 24, "fireballs": 6 },
                        { "thing": "Block", "x": 240, "y": 56, "contents": "Mushroom" },
                        { "macro": "Water", "x": 256, "width": 24 },
                        { "thing": "Podoboo", "x": 264, "y": -32 },
                        { "thing": "Stone", "x": 280, "y": 32, "width": 296 },
                        { "thing": "Stone", "x": 280, "y": 24, "width": 552, "height": 24 },
                        { "macro": "Floor", "x": 280, "width": 744 },
                        { "thing": "Stone", "x": 296, "y": 80, "width": 280, "height": 24 },
                        { "thing": "CastleBlock", "x": 296, "y": 56, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 392, "y": 56, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 480, "y": 56, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 536, "y": 56, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 608, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 640, "y": 80 },
                        { "thing": "CastleBlock", "x": 640, "y": 72, "fireballs": 6 },
                        { "thing": "CastleBlock", "x": 672, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 704, "y": 80 },
                        { "thing": "CastleBlock", "x": 704, "y": 72, "fireballs": 6, "direction": 1 },
                        { "thing": "CastleBlock", "x": 736, "y": 32, "fireballs": 6 },
                        { "thing": "Stone", "x": 776, "y": 80, "width": 56, "height": 16 },
                        { "macro": "Fill", "thing": "Block", "x": 848, "y": 32, "xnum": 3, "xwidth": 24, "contents": "Coin", "hidden": true },
                        { "macro": "Fill", "thing": "Block", "x": 856, "y": 64, "xnum": 3, "xwidth": 24, "contents": "Coin", "hidden": true },
                        { "thing": "Stone", "x": 928, "y": 24, "width": 32, "height": 24 },
                        { "thing": "Stone", "x": 984, "y": 24, "width": 40, "height": 24 },
                        { "thing": "Stone", "x": 984, "y": 80, "width": 40, "height": 16 },
                        { "macro": "EndInsideCastle", "x": 1024, "spawnType": "Blooper", "throwing": true, "transport": { "map": "7-1" } }
                    ]
                }
            ]
        }, {
            "name": "7-1",
            "locations": [
                { "entry": "Plain" }, 
                { "entry": "PipeVertical" },
                { "area": 1 }
            ],
            "areas": [
                {
                    "setting": "Overworld Alt",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "CastleLarge", "x": -16 },
                        { "macro": "Pattern", "pattern": "BackFence", "repeat": 5 },
                        { "macro": "Floor", "width": 584 },
                        { "thing": "Cannon", "x": 152, "y": 16, "height": 16 },
                        { "thing": "Koopa", "x": 208, "y": 22, "flying": true },
                        { "thing": "Brick", "x": 216, "y": 64, "contents": "Mushroom" },
                        { "thing": "Cannon", "x": 224, "y": 8 },
                        { "thing": "Cannon", "x": 224, "y": 24, "height": 16 },
                        { "macro": "Fill", "thing": "Brick", "x": 224, "y": 64, "xnum": 2 },
                        { "thing": "Cannon", "x": 288, "y": 16, "height": 16 },
                        { "macro": "Fill", "thing": "Block", "x": 312, "y": 32, "xnum": 4 },
                        { "thing": "Koopa", "x": 352, "y": 28, "flying": true },
                        { "thing": "Cannon", "x": 368, "y": 24, "height": 24 },
                        { "thing": "Koopa", "x": 424, "y": 22, "flying": true },
                        { "thing": "Cannon", "x": 448, "y": 8 },
                        { "thing": "Cannon", "x": 448, "y": 24, "height": 16 },
                        { "macro": "Fill", "thing": "Brick", "x": 496, "y": 32, "xnum": 2 },
                        { "thing": "Stone", "x": 512, "y": 32 },
                        { "thing": "Cannon", "x": 512, "y": 48, "height": 16 },
                        { "thing": "Koopa", "x": 520, "y": 16, "flying": true },
                        { "thing": "Brick", "x": 520, "y": 32, "contents": "Coin" },
                        { "thing": "Brick", "x": 528, "y": 32 },
                        { "thing": "Cannon", "x": 544, "y": 16, "height": 16 },
                        { "macro": "Floor", "x": 600, "width": 616 },
                        { "macro": "Pipe", "x": 608, "height": 24, "piranha": true },
                        { "macro": "Fill", "thing": "Brick", "x": 656, "y": 32, "xnum": 7, "ynum": 2, "yheight": 23 },
                        { "thing": "HammerBro", "x": 680, "y": 44 },
                        { "thing": "HammerBro", "x": 692, "y": 76 },
                        { "macro": "Pipe", "x": 744, "height": 24, "piranha": true, "transport": 2 },
                        { "thing": "Block", "x": 744, "y": 64, "contents": "Mushroom1Up", "hidden": true },
                        { "thing": "Cannon", "x": 832, "y": 16, "height": 16 },
                        { "macro": "Pipe", "x": 872, "height": 24, "piranha": true },
                        { "thing": "Koopa", "x": 912, "y": 12 },
                        { "macro": "Pipe", "x": 920, "height": 16, "piranha": true, "entrance": 1 },
                        { "thing": "Cannon", "x": 976, "y": 16, "height": 16 },
                        { "macro": "Pipe", "x": 1024, "height": 16, "piranha": true },
                        { "macro": "Fill", "thing": "Brick", "x": 1072, "y": 32, "xnum": 5, "ynum": 2, "yheight": 32 },
                        { "thing": "HammerBro", "x": 1080, "y": 12 },
                        { "thing": "HammerBro", "x": 1096, "y": 44 },
                        { "thing": "Stone", "x": 1128, "y": 24 },
                        { "thing": "Cannon", "x": 1168, "y": 8 },
                        { "thing": "Cannon", "x": 1168, "y": 24, "height": 16 },
                        { "macro": "Fill", "thing": "Brick", "x": 1192, "y": 40, "xnum": 2 },
                        { "thing": "Springboard", "x": 1208, "y": 14.5 },
                        { "thing": "Brick", "x": 1208, "y": 88, "contents": "Mushroom" },
                        { "macro": "Floor", "x": 1224, "width": 432 },
                        { "thing": "Stone", "x": 1224, "y": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 1224, "y": 56, "xnum": 2 },
                        { "thing": "Stone", "x": 1232, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1240, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1248, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1256, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1264, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 1296, "y": 8 },
                        { "thing": "Stone", "x": 1304, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1312, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1320, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1328, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1336, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 1344, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1352, "y": 64, "height": 64, "width": 16 },
                        { "thing": "Beetle", "x": 1360, "y": 72.5 },
                        { "macro": "EndOutsideCastle", "x": 1432, "transport": { "map": "7-2" } }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Ceiling", "x": 32, "width": 56 },
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 8, "xnum": 7, "ynum": 3 },
                        { "macro": "Fill", "thing": "Coin", "x": 33, "y": 31, "xnum": 7, "ynum": 2, "xwidth": 8, "yheight": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 41, "y": 63, "xnum": 5, "xwidth": 8 },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16 },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }
            ]
        }, {
            "name": "7-2",
            "locations": [
                { "entry": "Walking" },
                { "area": 1 }, 
                { "area": 2, "entry": "PipeVertical" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "CastleSmall" },
                        { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 2 },
                        { "macro": "Floor", "width": 192 },
                        { "macro": "CastleSmall" },
                        { "thing": "PipeHorizontal", "x": 80, "y": 16, "transport": 1 },
                        { "macro": "Pipe", "x": 96, "height": 32 }
                    ]
                }, {
                    "setting": "Underwater",
                    "blockBoundaries": true,
                    "underwater": true,
                    "creation": [
                        { "macro": "Floor", "width": 536 },
                        { "thing": "Coral", "x": 96, "y": 24, "height": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 120, "y": 7, "xnum": 2, "xwidth": 8 },
                        { "thing": "Stone", "x": 152, "y": 32, "width": 24 },
                        { "thing": "Blooper", "x": 184, "y": 16 },
                        { "thing": "Blooper", "x": 208, "y": 46 },
                        { "macro": "Fill", "thing": "Coin", "x": 224, "y": 64, "xnum": 3, "xwidth": 8 },
                        { "thing": "Coral", "x": 272, "y": 40, "height": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 296, "y": 7, "xnum": 3, "xwidth": 8 },
                        { "thing": "Stone", "x": 344, "y": 32, "width": 16 },
                        { "thing": "Blooper", "x": 376, "y": 32 },
                        { "thing": "Coral", "x": 408, "y": 32, "height": 32 },
                        { "thing": "Blooper", "x": 424, "y": 46 },
                        { "thing": "Blooper", "x": 448, "y": 24 },
                        { "thing": "Stone", "x": 520, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 528, "y": 40, "height": 40 },
                        { "macro": "Fill", "thing": "Coin", "x": 546, "y": 23, "xnum": 3, "xwidth": 8 },
                        { "macro": "Floor", "x": 576, "width": 480 },
                        { "thing": "Stone", "x": 576, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 584, "y": 24, "height": 24 },
                        { "thing": "CheepCheep", "x": 616, "y": 24 },
                        { "thing": "Stone", "x": 632, "y": 24, "width": 16, "height": 24 },
                        { "thing": "Stone", "x": 532, "y": 88, "width": 16, "height": 24 },
                        { "thing": "Blooper", "x": 624, "y": 54 },
                        { "thing": "CheepCheep", "x": 640, "y": 48 },
                        { "thing": "CheepCheep", "x": 656, "y": 16 },
                        { "thing": "Stone", "x": 664, "y": 64, "height": 24 },
                        { "thing": "Blooper", "x": 672, "y": 40 },
                        { "thing": "Coral", "x": 672, "y": 80, "height": 16 },
                        { "thing": "Coral", "x": 720, "y": 24, "height": 24 },
                        { "thing": "Blooper", "x": 728, "y": 16 },
                        { "thing": "Blooper", "x": 760, "y": 80 },
                        { "thing": "CheepCheep", "x": 760, "y": 56 },
                        { "thing": "CheepCheep", "x": 784, "y": 80, "smart": true },
                        { "macro": "Fill", "thing": "Coin", "x": 816, "y": 15, "xnum": 3, "xwidth": 8 },
                        { "thing": "CheepCheep", "x": 816, "y": 24 },
                        { "thing": "Stone", "x": 824, "y": 32, "width": 16 },
                        { "thing": "Coral", "x": 824, "y": 64, "height": 32 },
                        { "thing": "Blooper", "x": 848, "y": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 912, "y": 55, "xnum": 3, "xwidth": 8 },
                        { "thing": "Stone", "x": 928, "y": 40, "width": 16 },
                        { "thing": "CheepCheep", "x": 944, "y": 72 },
                        { "thing": "Coral", "x": 968, "y": 32, "height": 32 },
                        { "thing": "CheepCheep", "x": 1032, "y": 24, "smart": true },
                        { "thing": "Stone", "x": 1040, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1048, "y": 16, "height": 16 },
                        { "thing": "CheepCheep", "x": 1056, "y": 16 },
                        { "thing": "Stone", "x": 1056, "y": 88, "height": 24 },
                        { "thing": "Stone", "x": 1064, "y": 72, "width": 64 },
                        { "thing": "Coin", "x": 1072, "y": 15 },
                        { "macro": "Fill", "thing": "Coin", "x": 1080, "y": 7, "xnum": 3, "xwidth": 8 },
                        { "thing": "Coin", "x": 1104, "y": 15 },
                        { "thing": "CheepCheep", "x": 1100, "y": 40 },
                        { "macro": "Floor", "x": 1128, "width": 136 },
                        { "thing": "Stone", "x": 1128, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1136, "y": 32, "height": 32 },
                        { "thing": "CheepCheep", "x": 1160, "y": 32 },
                        { "thing": "Coral", "x": 1184, "y": 16, "height": 16 },
                        { "thing": "Coral", "x": 1200, "y": 24, "height": 24 },
                        { "thing": "CheepCheep", "x": 1206, "y": 56, "smart": true },
                        { "thing": "Blooper", "x": 1208, "y": 38 },
                        { "thing": "Stone", "x": 1256, "y": 64, "height": 64 },
                        { "thing": "Stone", "x": 1264, "y": 64, "width": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 1281, "y": 32, "xnum": 3, "ynum": 2, "xwidth": 8, "yheight": -24 },
                        { "thing": "Stone", "x": 1304, "y": 64, "width": 16 },
                        { "macro": "Floor", "x": 1320, "width": 320 },
                        { "thing": "Stone", "x": 1320, "y": 64, "height": 64 },
                        { "thing": "CheepCheep", "x": 1320, "y": 80 },
                        { "thing": "CheepCheep", "x": 1344, "y": 16, "smart": true },
                        { "macro": "Fill", "thing": "Stone", "x": 1384, "y": 32, "ynum": 2, "yheight": 32, "width": 40 },
                        { "thing": "Blooper", "x": 1392, "y": 14 },
                        { "thing": "Coral", "x": 1392, "y": 80, "height": 16 },
                        { "thing": "CheepCheep", "x": 1408, "y": 40 },
                        { "thing": "Blooper", "x": 1440, "y": 14 },
                        { "macro": "Fill", "thing": "Stone", "x": 1448, "y": 32, "yum": 2, "Yheight": 32, "width": 32 },
                        { "thing": "CheepCheep", "x": 1472, "y": 72, "smart": true },
                        { "thing": "CheepCheep", "x": 1496, "y": 48, "smart": true },
                        { "thing": "Stone", "x": 1488, "y": 8, "width": 40 },
                        { "thing": "Stone", "x": 1496, "y": 16, "width": 32 },
                        { "thing": "Stone", "x": 1504, "y": 24, "width": 24 },
                        { "thing": "Stone", "x": 1512, "y": 32, "width": 16, "height": 32 },
                        { "thing": "Stone", "x": 1512, "y": 88, "width": 88 },
                        { "thing": "PipeHorizontal", "x": 1520, "y": 48, "width": 16 },
                        { "thing": "Stone", "x": 1528, "y": 88, "width": 112, "height": 88 }
                    ]
                }, {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackRegular", "x": 104 },
                        { "macro": "Floor", "width": 336 },
                        { "macro": "Pipe", "height": 16, "piranha": true, "entrance": 2 },
                        { "thing": "Stone", "x": 16, "y": 8 }, 
                        { "thing": "Stone", "x": 24, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 32, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 40, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 48, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 56, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 64, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 72, "y": 64, "height": 64 },
                        { "thing": "Stone", "x": 80, "y": 64, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 152, "transport": { "map": "7-3" } }
                    ]
                }
            ]
        }, {
            "name": "7-3",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 56 },
                        { "macro": "CastleSmall" },
                        { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 4 },
                        { "macro": "CheepsStart", "x": 64 },
                        { "macro": "Tree", "x": 64, "width": 64 },
                        { "thing": "Stone", "x": 80, "y": 8 },
                        { "thing": "Stone", "x": 88, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 96, "y": 24, "height": 24, "width": 24 },
                        { "macro": "Bridge", "x": 120, "y": 24, "width": 136, "end": true },
                        { "macro": "Bridge", "x": 256, "y": 24, "width": 128, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 290, "y": 63, "xnum": 4, "xwidth": 8 },
                        { "thing": "Koopa", "x": 312, "y": 36 },
                        { "macro": "Bridge", "x": 384, "y": 24, "width": 128, "end": true },
                        { "thing": "Koopa", "x": 416, "y": 44, "jumping": true },
                        { "macro": "Fill", "thing": "Coin", "x": 441, "y": 63, "xnum": 3, "xwidth": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 449, "y": 55, "xnum": 2, "xwidth": 16 },
                        { "macro": "Bridge", "x": 544, "y": 24, "width": 96, "begin": true, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 576, "y": 56, "xnum": 2, "xwidth": 24 },
                        { "macro": "Fill", "thing": "Coin", "x": 584, "y": 64, "xnum": 2, "xwidth": 8 },
                        { "thing": "Koopa", "x": 632, "y": 36, "smart": true },
                        { "macro": "Bridge", "x": 672, "y": 24, "width": 96, "begin": true, "end": true },
                        { "thing": "Koopa", "x": 760, "y": 36, "smart": true },
                        { "macro": "Fill", "thing": "Coin", "x": 777, "y": 63, "xnum": 3, "xwidth": 8 },
                        { "macro": "Bridge", "x": 792, "y": 32, "width": 56, "begin": true, "end": true },
                        { "thing": "Block", "x": 816, "y": 64, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Coin", "x": 865, "y": 63, "xnum": 3, "xwidth": 8 },
                        { "macro": "Tree", "x": 896, "width": 64 },
                        { "thing": "Koopa", "x": 952, "y": 12, "smart": true },
                        { "macro": "Bridge", "x": 976, "y": 24, "width": 24 },
                        { "macro": "Bridge", "x": 1016, "y": 24, "width": 136, "begin": true, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 1064, "y": 63, "xnum": 6, "xwidth": 8 },
                        { "thing": "Koopa", "x": 1120, "y": 52, "jumping": true, "flying": true },
                        { "macro": "Bridge", "x": 1168, "y": 8, "width": 80, "begin": true, "end": true },
                        { "macro": "Fill", "thing": "Coin", "x": 1193, "y": 39, "xnum": 4, "xwidth": 8 },
                        { "macro": "Bridge", "x": 1272, "y": 24, "width": 80, "begin": true, "end": true },
                        { "thing": "Koopa", "x": 1248, "y": 36, "jumping": true, "flying": true },
                        { "macro": "Bridge", "x": 1368, "y": 24, "width": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 1385, "y": 55, "xnum": 6, "xwidth": 8 },
                        { "macro": "Bridge", "x": 1400, "y": 24, "width": 16 },
                        { "macro": "Bridge", "x": 1432, "y": 24, "width": 16 },
                        { "macro": "Bridge", "x": 1464, "y": 24, "width": 80, "begin": true },
                        { "macro": "Tree", "x": 1536, "width": 104 },
                        { "macro": "Pattern", "pattern": "BackCloud", "x": 1536, "y": 4, "skips": [5] },
                        { "thing": "Stone", "x": 1544, "y": 24, "width": 16, "height": 24 },
                        { "thing": "Stone", "x": 1560, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1568, "y": 8 },
                        { "macro": "CheepsStop", "x": 1600 },
                        { "macro": "Floor", "x": 1656, "width": 280 },
                        { "thing": "Stone", "x": 1664, "y": 8 },
                        { "thing": "Stone", "x": 1672, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1680, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 1688, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1696, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 1704, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 1712, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 1720, "y": 64, "width": 16, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 1800, "large": true, "walls": 7, "transport": { "map": "7-4" } }
                    ]
                }
            ]
        }, {
            "name": "7-4",
            "locations": [
                { "entry": "Castle" }
            ],
            "areas": [
                {
                    "setting": "Castle",
                    "creation": [
                        { "macro": "StartInsideCastle" },
                        { "thing": "Stone", "y": 88, "width": 128, "height": 24 },
                        { "macro": "Floor", "x": 40, "y": 24, "width": 88 },
                        { "macro": "Water", "x": 128, "width": 88 },
                        { "thing": "Stone", "x": 128, "y": 88, "width": 128 },
                        { "thing": "Platform", "x": 144, "y": 48, "width": 16, "falling": true },
                        { "thing": "Podoboo", "x": 160, "y": -32 },
                        { "thing": "Platform", "x": 176, "y": 40, "width": 16, "falling": true },
                        { "macro": "Floor", "x": 216, "y": 24, "width": 40 },
                        { "thing": "Stone", "x": 224, "y": 80, "width": 32, "height": 16 },
                        { "macro": "Section", "x": 256 }
                    ],
                    "sections": [
                        {
                            "before": {
                                "width": 48,
                                "creation": [
                                    { "macro": "Floor", "width": 48 },
                                    { "thing": "Stone", "y": 88, "width": 48 },
                                    { "thing": "Stone", "x": 16, "y": 32, "width": 32 },
                                    { "thing": "Stone", "x": 32, "y": 40, "width": 16 },
                                    { "thing": "Stone", "x": 40, "y": 48, "width": 8 },
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "macro": "SectionPass", "y": 24, "height": 24 },
                                    { "thing": "Stone", "y": 56, "height": 32 },
                                    { "macro": "SectionFail", "y": 80, "height": 24 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 24,
                                "creation": [
                                    { "macro": "Floor", "width": 24 },
                                    { "thing": "Stone", "y": 88, "width": 24 },
                                    { "macro": "Section", "x": 24, "section": 1 }
                                ]
                            }
                        },
                        {
                            "before": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "thing": "Stone", "y": 24 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "macro": "SectionFail", "y": 16, "height": 16 },
                                    { "thing": "Stone", "y": 24 },
                                    { "macro": "SectionPass", "y": 48, "height": 24 },
                                    { "thing": "Stone", "y": 56 },
                                    { "macro": "SectionFail", "y": 80, "height": 24 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 32,
                                "creation": [
                                    { "macro": "Floor", "width": 32 },
                                    { "thing": "Stone", "y": 24 },
                                    { "thing": "Stone", "y": 88, "width": 32 },
                                    { "macro": "Section", "x": 32, "section": 2 }
                                ]
                            }
                        },
                        {
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "macro": "SectionFail", "y": 24, "height": 24 },
                                    { "thing": "Stone", "y": 56, "height": 32 },
                                    { "macro": "SectionPass", "y": 80, "height": 24 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 80,
                                "creation": [
                                    { "macro": "Floor", "width": 80 },
                                    { "thing": "Stone", "y": 40 },
                                    { "thing": "Stone", "y": 48, "width": 16 },
                                    { "thing": "Stone", "y": 56, "width": 32 },
                                    { "thing": "Stone", "y": 88, "width": 80 },
                                    { "thing": "Stone", "x": 40, "y": 24, "width": 24, "height": 24 },
                                    { "macro": "SectionDecider", "x": 80, "pass": 3, "fail": 0 }
                                ]
                            }
                        },
                        {
                            "before": {
                                "width": 136,
                                "creation": [
                                    { "macro": "Floor", "y": 24, "width": 24 },
                                    { "thing": "Stone", "y": 88, "width": 136 },
                                    { "macro": "Floor", "x": 24, "width": 32 },
                                    { "thing": "Stone", "x": 48, "y": 56, "width": 16 },
                                    { "macro": "Water", "x": 56, "width": 24 },
                                    { "thing": "Stone", "x": 72, "y": 56, "width": 24 },
                                    { "macro": "Floor", "x": 80 },
                                    { "thing": "CastleBlock", "x": 80, "y": 48, "fireballs": 6, "direction": 1 },
                                    { "macro": "Water", "x": 88, "width": 24 },
                                    { "thing": "Stone", "x": 104, "y": 56, "width": 32 },
                                    { "macro": "Floor", "x": 112, "width": 24 }
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "SectionFail", "y": 24, "height": 24 },
                                    { "macro": "SectionPass", "y": 80, "height": 24 },
                                    { "macro": "Floor" },
                                    { "thing": "Stone", "y": 56, "height": 32 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 80,
                                "creation": [
                                    { "macro": "Section", "section": 4 }
                                ]
                            }
                        },
                        {
                            "before": {
                                "width": 64,
                                "creation": [
                                    { "macro": "Floor", "width": 64 },
                                    { "thing": "Stone", "y": 88, "width": 64 },
                                    { "thing": "Stone", "x": 16, "y": 56, "width": 24 },
                                    { "thing": "Stone", "x": 24, "y": 24, "width": 24 },
                                    { "thing": "Stone", "x": 56, "y": 56 }
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "thing": "Stone", "y": 24 },
                                    { "thing": "Stone", "y": 56 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 64,
                                "creation": [
                                    { "macro": "Floor", "width": 64 },
                                    { "thing": "Stone", "y": 24 },
                                    { "thing": "Stone", "y": 88, "width": 64 },
                                    { "thing": "Stone", "x": 24, "y": 56, "width": 24 },
                                    { "thing": "Stone", "x": 32, "y": 24, "width": 24 },
                                    { "macro": "Section", "x": 64, "section": 5 }
                                ]
                            }
                        },
                        {
                            "before": {
                                "width": 32,
                                "creation": [
                                    { "macro": "Floor", "width": 16 },
                                    { "thing": "Stone", "y": 56, "height": 32 },
                                    { "thing": "Stone", "y": 88, "width": 32 },
                                    { "thing": "Stone", "x": 8, "y": 56, "width": 24 },
                                    { "macro": "Floor", "x": 16, "y": 8 },
                                    { "macro": "Floor", "x": 24, "y": 16 },
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor", "y": 24 },
                                    { "macro": "SectionPass", "y": 80, "height": 24 },
                                    { "thing": "Stone", "y": 56 },
                                    { "macro": "SectionFail", "y": 48, "height": 24 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 56,
                                "creation": [
                                    { "macro": "Floor", "y": 24, "width": 56 },
                                    { "thing": "Stone", "y": 88, "width": 56 },
                                    { "macro": "SectionDecider", "x": 56, "y": 80, "height": 56, "pass": 6, "fail": 3 },
                                ]
                            }
                        },
                        {
                            "before": {
                                "width": 272,
                                "creation": [
                                    { "macro": "Floor", "width": 24 },
                                    { "thing": "Stone", "y": 88, "width": 272 },
                                    { "macro": "Floor", "x": 24, "y": 24, "width": 24 },
                                    { "macro": "Floor", "x": 48, "width": 16 },
                                    { "macro": "Floor", "x": 64, "y": 24, "width": 64 },
                                    { "macro": "Floor", "x": 128, "width": 16 },
                                    { "macro": "Floor", "x": 144, "y": 24, "width": 16 },
                                    { "macro": "Floor", "x": 160, "width": 16 },
                                    { "macro": "Floor", "x": 176, "y": 24, "width": 16 },
                                    { "macro": "Floor", "x": 192, "width": 16 },
                                    { "macro": "Floor", "x": 208, "y": 24, "width": 64 },
                                    { "macro": "EndInsideCastle", "x": 272, "spawnType": "HammerBro", "throwing": false, "transport": { "map": "8-1" } }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        {
            "name": "8-1",
            "time": 300,
            "locations": [
                { "entry": "Plain" },
                { "entry": "PipeVertical" }, 
                { "area": 1 }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackFence", "repeat": 7 },
                        { "macro": "CastleLarge", "x": -16 },
                        { "macro": "Floor", "width": 368 },
                        { "thing": "Beetle", "x": 144, "y": 8.5 },
                        { "macro": "Fill", "thing": "Goomba", "x": 184, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 240, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Pipe", "x": 280, "height": 32, "piranha": true },
                        { "macro": "Fill", "thing": "Koopa", "x": 344, "y": 12, "xnum": 2, "xwidth": 12 },
                        { "macro": "Floor", "x": 376 },
                        { "macro": "Floor", "x": 392, "width": 16 },
                        { "macro": "Floor", "x": 416, "width": 16 },
                        { "macro": "Floor", "x": 440, "width": 16 },
                        { "macro": "Floor", "x": 464, "width": 888 },
                        { "thing": "Koopa", "x": 488, "y": 12 },
                        { "thing": "Coin", "x": 513, "y": 39 },
                        { "macro": "Fill", "thing": "Goomba", "x": 552, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Pipe", "x": 608, "height": 32, "piranha": true },
                        { "thing": "Block", "x": 640, "y": 40, "contents": "Mushroom1Up", "hidden": true },
                        { "thing": "Beetle", "x": 648, "y": 8.5 },
                        { "macro": "Pipe", "x": 656, "height": 24, "piranha": true },
                        { "thing": "Coin", "x": 713, "y": 39 },
                        { "macro": "Pipe", "x": 752, "height": 32, "piranha": true },
                        { "thing": "Coin", "x": 786, "y": 39 },
                        { "macro": "Pipe", "x": 832, "height": 32, "piranha": true, "transport": 2 },
                        { "macro": "Fill", "thing": "Goomba", "x": 864, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Coin", "x": 873, "y": 71, "xnum": 2, "xwidth": 8 },
                        { "macro": "Pipe", "x": 920, "height": 16, "piranha": true, "entrance": 1 },
                        { "thing": "Koopa", "x": 952, "y": 12 },
                        { "macro": "Fill", "thing": "Koopa", "x": 992, "y": 12, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Koopa", "x": 1040, "y": 12, "xnum": 3, "xwidth": 12 },
                        { "macro": "Pipe", "x": 1120, "height": 24, "piranha": true },
                        { "macro": "Fill", "thing": "Goomba", "x": 1184, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "thing": "Stone", "x": 1224, "y": 32, "height": 32 },
                        { "macro": "Fill", "thing": "Brick", "x": 1232, "y": 64, "xnum": 4 },
                        { "thing": "Block", "x": 1264, "y": 32, "hidden": true },
                        { "thing": "Brick", "x": 1264, "y": 64, "contents": "Mushroom" },
                        { "macro": "Fill", "thing": "Brick", "x": 1272, "y": 64, "xnum": 3 },
                        { "thing": "Koopa", "x": 1288, "y": 32, "jumping": true },
                        { "thing": "Stone", "x": 1304, "y": 32, "height": 32 },
                        { "macro": "Floor", "x": 1360 },
                        { "macro": "Floor", "x": 1376, "width": 16 },
                        { "thing": "Koopa", "x": 1376, "y": 32, "jumping": true },
                        { "macro": "Floor", "x": 1400 },
                        { "macro": "Floor", "x": 1416, "width": 16 },
                        { "thing": "Koopa", "x": 1416, "y": 28, "jumping": true },
                        { "macro": "Floor", "x": 1416, "width": 16 },
                        { "macro": "Floor", "x": 1440, "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "x": 1472, "y": 40, "xnum": 2 },
                        { "thing": "Brick", "x": 1488, "y": 40, "contents": "Star" },
                        { "macro": "Fill", "thing": "Brick", "x": 1496, "y": 40, "xnum": 5 },
                        { "macro": "Floor", "x": 1584 },
                        { "macro": "Floor", "x": 1600 },
                        { "macro": "Floor", "x": 1616, "width": 152 },
                        { "macro": "Fill", "thing": "Koopa", "x": 1656, "y": 12, "xnum": 2, "xwidth": 12 },
                        { "thing": "Stone", "x": 1680, "y": 16, "height": 16 },
                        { "macro": "Fill", "thing": "Coin", "x": 1785, "y": 39, "xnum": 2, "xwidth": 8 },
                        { "macro": "Floor", "x": 1816, "width": 80 },
                        { "macro": "Fill", "thing": "Goomba", "x": 1856, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Floor", "x": 1904, "width": 16 },
                        { "macro": "Pipe", "x": 1904, "height": 24, "piranha": true },
                        { "macro": "Floor", "x": 1936, "height": 32, "piranha": true },
                        { "macro": "Floor", "x": 1968, "width": 352 },
                        { "macro": "Pipe", "x": 1968, "height": 40 },
                        { "thing": "Beetle", "x": 2032, "y": 8.5 },
                        { "macro": "Fill", "thing": "Goomba", "x": 2056, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 2112, "y": 8, "xnum": 3, "xwidth": 12 },
                        { "macro": "Fill", "thing": "Goomba", "x": 2176, "y": 8, "xnum": 2, "xwidth": 12 },
                        { "thing": "Stone", "x": 2200, "y": 8 },
                        { "thing": "Stone", "x": 2208, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 2216, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 2224, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 2232, "y": 40, "height": 40 },
                        { "thing": "Stone", "x": 2240, "y": 48, "height": 48 },
                        { "thing": "Beetle", "x": 2264, "y": 8.5 },
                        { "macro": "Fill", "thing": "Coin", "x": 2265, "y": 39, "xnum": 2, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 2329, "y": 39, "xnum": 2, "xwidth": 40 },
                        { "macro": "Floor", "x": 2344, "width": 16 },
                        { "macro": "Floor", "x": 2384, "width": 128 },
                        { "macro": "Fill", "thing": "Stone", "x": 2424, "y": 16, "xnum": 2, "xwidth": 32, "height": 16 },
                        { "thing": "Koopa", "x": 2440, "y": 12 },
                        { "macro": "Fill", "thing": "Coin", "x": 2529, "y": 39, "xnum": 2, "xwidth": 8 },
                        { "macro": "Floor", "x": 2552 },
                        { "macro": "Fill", "thing": "Coin", "x": 2569, "y": 39, "xnum": 2, "xwidth": 8 },
                        { "macro": "Floor", "x": 2600, "width": 272 },
                        { "thing": "Koopa", "x": 2656, "y": 12 },
                        { "macro": "Pattern", "pattern": "BackFence", "x": 2688, "skips": [5, 10] },
                        { "macro": "Fill", "thing": "Koopa", "x": 2712, "y": 12, "xnum": 3, "xwidth": 12 },
                        { "macro": "Pipe", "x": 2752, "height": 24, "piranha": true },
                        { "macro": "Pipe", "x": 2840, "height": 16, "piranha": true },
                        { "macro": "Floor", "x": 2880 },
                        { "thing": "Stone", "x": 2880, "y": 16, "height": 16 },
                        { "macro": "Floor", "x": 2896 },
                        { "thing": "Stone", "x": 2896, "y": 32, "height": 32 },
                        { "macro": "Floor", "x": 2912 },
                        { "thing": "Stone", "x": 2912, "y": 48, "height": 48 },
                        { "macro": "Floor", "x": 2928, "width": 288 },
                        { "thing": "Stone", "x": 2928, "y": 64, "width": 16, "height": 64 },
                        { "macro": "EndOutsideCastle", "x": 3008, "transport": { "map": "8-2" } },
                        { "macro": "Pattern", "pattern": "BackFence", "x": 3072, "skips": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 24, "y": 32, "xnum": 9 },
                        { "macro": "Fill", "thing": "Brick", "x": 24, "y": 64, "xnum": 10, "ynum": 4 },
                        { "macro": "Fill", "thing": "Coin", "x": 25, "y": 7, "xnum": 9, "xwidth": 8 },
                        { "macro": "Fill", "thing": "Coin", "x": 33, "y": 39, "xnum": 8, "xwidth": 8 },
                        { "thing": "Brick", "x": 96, "y": 32, "contents": "Coin" },
                        { "macro": "Fill", "thing": "Brick", "x": 104, "y": 24, "xnum": 2, "ynum": 9 },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 1 },
                        { "thing": "PipeVertical", "x": 120, "y": 100, "height": 100 }
                    ]
                }
            ]
        }, {
            "name": "8-2",
            "locations": [
                { "entry": "Plain" }, 
                { "entry": "PipeVertical" },
                { "area": 1 }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackFenceMin2", "repeat": 4 },
                        { "macro": "CastleSmall" },
                        { "macro": "Floor", "width": 120 },
                        { "macro": "Floor", "x": 128, "width": 40 },
                        { "thing": "Lakitu", "x": 128, "y": 84 },
                        { "thing": "Stone", "x": 136, "y": 8 },
                        { "thing": "Stone", "x": 144, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 152, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 160, "y": 32, "height": 32 },
                        { "macro": "Floor", "x": 176, "width": 112 },
                        { "thing": "Stone", "x": 176, "y": 48, "height": 48 },
                        { "thing": "Stone", "x": 184, "y": 56, "height": 56 },
                        { "thing": "Stone", "x": 192, "y": 64, "width": 16, "height": 64 },
                        { "macro": "Fill", "thing": "Block", "x": 232, "y": 32, "xnum": 4 },
                        { "macro": "Floor", "x": 296, "width": 64 },
                        { "thing": "Brick", "x": 344, "y": 64 },
                        { "thing": "Springboard", "x": 352, "y": 14.5 },
                        { "thing": "Brick", "x": 352, "y": 64, "contents": "Mushroom1Up" },
                        { "macro": "Fill", "thing": "Brick", "x": 360, "y": 64, "xnum": 31 },
                        { "macro": "Floor", "x": 368, "width": 32 },
                        { "macro": "Floor", "x": 408 },
                        { "macro": "Floor", "x": 424, "width": 24 },
                        { "macro": "Floor", "x": 456, "width": 48 },
                        { "thing": "Koopa", "x": 456, "y": 26, "jumping": true },
                        { "macro": "Floor", "x": 512, "width": 112 },
                        { "macro": "Fill", "thing": "Brick", "x": 616, "y": 32, "xnum": 2 },
                        { "thing": "PlantLarge", "x": 552, "y": 23 },
                        { "macro": "Floor", "x": 640, "width": 32 },
                        { "macro": "Floor", "x": 680, "width": 424 },
                        { "thing": "Cannon", "x": 680, "y": 16, "height": 16 },
                        { "thing": "Koopa", "x": 736, "y": 32, "jumping": true },
                        { "thing": "Cannon", "x": 744, "y": 8, "nofire": true },
                        { "thing": "Koopa", "x": 760, "y": 24, "jumping": true },
                        { "thing": "Brick", "x": 792, "y": 32 },
                        { "thing": "Brick", "x": 800, "y": 32, "contents": "Mushroom" },
                        { "thing": "Cannon", "x": 840, "y": 16, "height": 16 },
                        { "macro": "Fill", "thing": "Brick", "x": 880, "y": 32, "xnum": 8 },
                        { "thing": "Fence", "x": 888, "y": 8 },
                        { "thing": "Beetle", "x": 888, "y": 8.5 },
                        { "thing": "Cannon", "x": 920, "y": 8 },
                        { "thing": "Brick", "x": 944, "y": 32 },
                        { "thing": "PlantLarge", "x": 936, "y": 23 },
                        { "thing": "Stone", "x": 952, "y": 32 },
                        { "thing": "Cannon", "x": 952, "y": 40 },
                        { "thing": "Brick", "x": 960, "y": 32, "contents": "Mushroom" },
                        { "thing": "Beetle", "x": 968, "y": 8.5 },
                        { "thing": "Beetle", "x": 984, "y": 8.5 },
                        { "thing": "Cannon", "x": 1000, "y": 24, "height": 24 },
                        { "macro": "Pipe", "x": 1048, "height": 16, "piranha": true },
                        { "macro": "Floor", "x": 1112, "width": 40 },
                        { "thing": "Koopa", "x": 1112, "y": 12, "jumping": true },
                        { "macro": "Pipe", "x": 1136, "height": 16, "piranha": true },
                        { "macro": "Floor", "x": 1160 },
                        { "macro": "Floor", "x": 1176 },
                        { "macro": "Floor", "x": 1232, "width": 160 },
                        { "thing": "Fence", "x": 1272, "y": 8 },
                        { "macro": "Pipe", "x": 1248, "height": 32, "piranha": true, "transport": 2 },
                        { "macro": "Pipe", "x": 1304, "height": 16, "piranha": true, "entrance": 1 },
                        { "thing": "PlantLarge", "x": 1320, "y": 23 },
                        { "thing": "Koopa", "x": 1360, "y": 32, "jumping": true },
                        { "thing": "Koopa", "x": 1376, "y": 24, "jumping": true },
                        { "macro": "Floor", "x": 1400 },
                        { "thing": "Cannon", "x": 1400, "y": 16, "height": 16 },
                        { "thing": "Koopa", "x": 1400, "y": 48, "jumping": true },
                        { "macro": "Floor", "x": 1432, "width": 184 },
                        { "thing": "Stone", "x": 1456, "y": 8 },
                        { "thing": "Stone", "x": 1464, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1472, "y": 24, "height": 24 },
                        { "thing": "Goomba", "x": 1472, "y": 32 },
                        { "thing": "Stone", "x": 1480, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 1488, "y": 40, "height": 40 },
                        { "thing": "Goomba", "x": 1488, "y": 48 },
                        { "thing": "Beetle", "x": 1512, "y": 8.5 },
                        { "thing": "Cannon", "x": 1528, "y": 8, "nofire": true },
                        { "thing": "Cannon", "x": 1528, "y": 24, "height": 16 },
                        { "macro": "Pattern", "pattern": "BackFenceMin2", "x": 1536, "skips": [2, 7] },
                        { "thing": "Stone", "x": 1592, "y": 8 },
                        { "thing": "Stone", "x": 1600, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1608, "y": 24, "height": 24 },
                        { "macro": "Floor", "x": 1624 },
                        { "thing": "Stone", "x": 1624, "y": 40, "height": 40 },
                        { "thing": "Koopa", "x": 1624, "y": 72, "jumping": true },
                        { "macro": "Floor", "x": 1648, "width": 320 },
                        { "macro": "LakituStop", "x": 1648 },
                        { "thing": "Stone", "x": 1648, "y": 64, "width": 16, "height": 64 },
                        { "thing": "PlantLarge", "x": 1704, "y": 23 },
                        { "macro": "EndOutsideCastle", "x": 1728, "transport": { "map": "8-3" } }
                    ]
                }, {
                    "setting": "Underworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Ceiling", "x": 32, "width": 7 },
                        { "macro": "Floor", "width": 136 },
                        { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                        { "macro": "Fill", "thing": "Brick", "x": 32, "y": 48, "xnum": 7 },
                        { "thing": "Brick", "x": 32, "y": 56 },
                        { "macro": "Fill", "thing": "Coin", "x": 42, "y": 55, "xnum": 5, "ynum": 2, "xwidth": 8, "yheight": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 80, "y": 56, "ynum": 4 },
                        { "macro": "Fill", "thing": "Brick", "x": 88, "y": 56, "xnum": 2 },
                        { "thing": "Brick", "x": 112, "y": 48, "contents": "Coin" },
                        { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 1 },
                        { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                    ]
                }
            ]
        }, {
            "name": "8-3",
            "time": 300,
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pattern", "pattern": "BackFenceMin3", "repeat": 3 },
                        { "macro": "CastleSmall" },
                        { "macro": "Floor", "width": 552 },
                        { "thing": "Fence", "x": 120, "y": 8, "width": 24 },
                        { "thing": "Cannon", "x": 144, "y": 16, "height": 16 },
                        { "thing": "CastleWall", "x": 192, "y": 48, "width": 64 },
                        { "thing": "Koopa", "x": 240, "y": 32, "jumping": true },
                        { "thing": "Cannon", "x": 272, "y": 24, "height": 24 },
                        { "thing": "CastleWall", "x": 296, "y": 48, "width": 112 },
                        { "macro": "Pipe", "x": 424, "height": 23, "piranha": true },
                        { "macro": "Fill", "thing": "Brick", "x": 480, "y": 32, "xnum": 8 },
                        { "macro": "Fill", "thing": "Brick", "x": 480, "y": 64, "xnum": 6 },
                        { "thing": "HammerBro", "x": 504, "y": 12 },
                        { "thing": "Fence", "x": 504, "y": 8, "width": 24 },
                        { "thing": "HammerBro", "x": 520, "y": 44 },
                        { "thing": "Brick", "x": 528, "y": 64, "contents": "Mushroom" },
                        { "thing": "Brick", "x": 536, "y": 64 },
                        { "macro": "Floor", "x": 568, "width": 32 },
                        { "thing": "Stone", "x": 568, "y": 32, "height": 32 },
                        { "thing": "Stone", "x": 576, "y": 24, "height": 24 },
                        { "thing": "Stone", "x": 584, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 592, "y": 8 },
                        { "macro": "Floor", "x": 616, "width": 376 },
                        { "thing": "CastleWall", "x": 632, "y": 48, "width": 48 },
                        { "thing": "Cannon", "x": 688, "y": 16, "height": 16 },
                        { "thing": "Fence", "x": 696, "y": 8 },
                        { "thing": "CastleWall", "x": 704, "y": 48, "width": 48 },
                        { "thing": "Koopa", "x": 744, "y": 24, "jumping": true },
                        { "thing": "Stone", "x": 760, "y": 24, "height": 24 },
                        { "thing": "CastleWall", "x": 776, "y": 48, "width": 80 },
                        { "thing": "Stone", "x": 872, "y": 32, "width": 16, "height": 32 },
                        { "thing": "Fence", "x": 888, "y": 8, "width": 24 },
                        { "macro": "Fill", "thing": "Brick", "x": 920, "y": 32, "xnum": 8 },
                        { "thing": "Brick", "x": 920, "y": 64 },
                        { "thing": "Brick", "x": 928, "y": 64, "contents": "Mushroom" },
                        { "thing": "HammerBro", "x": 936, "y": 44 },
                        { "macro": "Fill", "thing": "Brick", "x": 936, "y": 64, "xnum": 6 },
                        { "thing": "HammerBro", "x": 952, "y": 12 },
                        { "macro": "Floor", "x": 1008, "width": 16 },
                        { "macro": "Pipe", "x": 1008, "height": 23, "piranha": true },
                        { "macro": "Floor", "x": 1040, "width": 536 },
                        { "thing": "CastleWall", "x": 1056, "y": 48, "width": 272 },
                        { "thing": "Koopa", "x": 1096, "y": 12 },
                        { "thing": "HammerBro", "x": 1168, "y": 12 },
                        { "thing": "HammerBro", "x": 1270, "y": 12 },
                        { "thing": "Cloud1", "x": 1296, "y": 80 },
                        { "thing": "PlantSmall", "x": 1336, "y": 16 },
                        { "macro": "Pipe", "x": 1344, "height": 24, "piranha": true },
                        { "thing": "Cloud1", "x": 1372, "y": 88 },
                        { "thing": "CastleWall", "x": 1376, "y": 48, "width": 160 },
                        { "thing": "Cloud2", "x": 1396, "y": 80 },
                        { "thing": "HammerBro", "x": 1416, "y": 12 },
                        { "thing": "HammerBro", "x": 1480, "y": 12 },
                        { "thing": "Cloud1", "x": 1516, "y": 88 },
                        { "thing": "Brick", "x": 1520, "y": 32, "contents": "Coin" },
                        { "thing": "Cloud2", "x": 1540, "y": 80 },
                        { "thing": "Stone", "x": 1560, "y": 16, "height": 16 },
                        { "thing": "Stone", "x": 1584, "y": 16 },
                        { "thing": "Stone", "x": 1600, "y": 32 },
                        { "thing": "Stone", "x": 1616, "y": 48 },
                        { "thing": "Stone", "x": 1632, "y": 64, "width": 16 },
                        { "macro": "Floor", "x": 1664, "width": 256 },
                        { "thing": "Fence", "x": 1664, "y": 8, "width": 16 },
                        { "thing": "Cloud1", "x": 1684, "y": 80 },
                        { "thing": "PlantLarge", "x": 1704, "y": 23 },
                        { "macro": "EndOutsideCastle", "x": 1712, "castleDistance": 48, "large": true, "walls": 13, "transport": { "map": "8-4" } },
                        { "thing": "PlantSmall", "x": 1720, "y": 15 },
                        { "thing": "PlantSmall", "x": 1728, "y": 15 },
                        { "thing": "Cloud1", "x": 1756, "y": 88 },
                        { "thing": "Cloud1", "x": 1900, "y": 88 }
                    ]
                }
            ]
        }, {
            "name": "8-4",
            "locations": [
                { "entry": "Castle" },
                { "entry": "PipeVertical" },  // 1: Pipe 1
                { "area": 1, "entry": "PipeVertical" }, // 2: Past B 
                { "area": 2, "entry": "PipeVertical" }, // 3: Past C
                { "area": 3, "entry": "PipeVertical", "xloc": 0 }, // 4: Underwater
                { "area": 4, "entry": "PipeVertical" } // 5: Past E
            ],
            "areas": [
                {
                    "setting": "Castle",
                    "creation": [
                        { "macro": "StartInsideCastle" },
                        { "thing": "Stone", "y": 88, "width": 256 },
                        { "macro": "Floor", "x": 40, "y": 24 },
                        { "macro": "Water", "x": 48, "width": 40 },
                        { "macro": "Floor", "x": 88, "width": 64 },
                        { "macro": "Pipe", "x": 152, "y": 16, "height": "Infinity", "piranha": true, "entrance": 1 },
                        { "macro": "Section", "x": 168 }
                    ],
                    "sections": [
                        {
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "thing": "Stone", "y": 88 },
                                ]
                            },
                            "after": {
                                "width": 424,
                                "creation": [
                                    { "macro": "Pipe", "y": 16, "height": "Infinity", "piranha": true, "transport": 1 },
                                    { "thing": "Stone", "y": 88, "width": 424 },
                                    { "macro": "Floor", "x": 16, "width": 72 },
                                    { "macro": "Fill", "thing": "Goomba", "x": 36, "y": 8, "xnum": 3, "xwidth": 12 },
                                    { "macro": "Floor", "x": 88, "y": 24, "width": 32 },
                                    { "macro": "Water", "x": 120, "width": 136 },
                                    { "thing": "Platform", "x": 152, "width": 16, "sliding": true, "begin": 140, "end": 232, "speed": 2 },
                                    { "macro": "Floor", "x": 256, "y": 24, "width": 48 },
                                    { "thing": "Stone", "x": 264, "y": 56, "width": 32 },
                                    { "macro": "Pipe", "x": 304, "y": 40, "height": "Infinity", "piranha": true, "transport": 2 },
                                    { "macro": "Floor", "x": 320, "y": 24, "width": 56 },
                                    { "macro": "Pipe", "x": 376, "y": 48, "height": "Infinity", "piranha": true },
                                    { "macro": "Floor", "x": 392, "y": 24, "width": 32 },
                                    { "macro": "Section", "x": 424 }
                                ]
                            }
                        },
                    ]
                }, {
                    "setting": "Castle",
                    "creation": [
                        { "macro": "Pipe", "y": 16, "height": "Infinity", "piranha": true, "entrance": 2 },
                        { "thing": "Stone", "y": 88, "width": 16 },
                        { "macro": "Section", "x": 16 }
                    ],
                    "sections": [
                        {
                            "before": {
                                "width": 328,
                                "creation": [
                                    { "thing": "Stone", "y": 88, "width": 328 },
                                    { "macro": "Floor", "width": 40 },
                                    { "macro": "Pipe", "x": 40, "y": 24, "height": "Infinity", "piranha": true },
                                    { "macro": "Floor", "x": 56, "width": 64 },
                                    { "macro": "Fill", "thing": "Beetle", "x": 88, "y": 8.5, "xnum": 2, "xwidth": 16 },
                                    { "macro": "Pipe", "x": 120, "y": 16, "height": "Infinity", "piranha": true, "transport": 1 },
                                    { "macro": "Floor", "x": 136, "width": 64 },
                                    { "thing": "Koopa", "x": 176, "y": 32, "jumping": true },
                                    { "thing": "Koopa", "x": 192, "y": 24, "jumping": true },
                                    { "macro": "Pipe", "x": 200, "y": 24, "height": "Infinity", "piranha": true },
                                    { "macro": "Water", "x": 216, "width": 24 },
                                    { "macro": "Floor", "x": 240, "width": 88 },
                                    { "thing": "Block", "x": 264, "y": 32, "hidden": true },
                                    { "thing": "Stone", "x": 280, "y": 32, "width": 16 },
                                    { "macro": "Pipe", "x": 280, "y": 32, "height": 24, "transport": 3 },
                                    { "thing": "Koopa", "x": 304, "y": 28, "jumping": true },
                                    { "thing": "Koopa", "x": 320, "y": 36, "jumping": true },
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor" },
                                    { "thing": "Stone", "y": 88 },
                                ]
                            },
                            "after": {
                                "width": 16,
                                "creation": [
                                    { "macro": "Pipe", "y": 16, "height": "Infinity", "piranha": true },
                                    { "thing": "Stone", "y": 88, "width": 16 },
                                    { "macro": "Section", "x": 16 }
                                ]
                            }
                        }
                    ]
                }, {
                    "setting": "Castle",
                    "creation": [
                        { "macro": "Pipe", "y": 16, "height": "Infinity", "piranha": true, "entrance": 3 },
                        { "thing": "Stone", "y": 88, "width": 16 },
                        { "macro": "Section", "x": 16 }
                    ],
                    "sections": [
                        {
                            "before": {
                                "width": 264,
                                "creation": [
                                    { "thing": "Stone", "y": 88, "width": 264 },
                                    { "macro": "Floor" },
                                    { "macro": "Floor", "x": 8, "y": 24, "width": 48 },
                                    { "macro": "Pipe", "x": 56, "y": 40, "height": "Infinity", "piranha": true },
                                    { "macro": "CheepsStart", "x": 72 },
                                    { "macro": "Floor", "x": 72, "y": 24, "width": 48 },
                                    { "macro": "Pipe", "x": 120, "y": 48, "height": "Infinity", "piranha": true, "transport": 1 },
                                    { "macro": "Floor", "x": 136, "y": 24, "width": 48 },
                                    { "macro": "Water", "x": 184, "width": 32 },
                                    { "macro": "Floor", "x": 216, "y": 24, "width": 32 },
                                    { "macro": "Pipe", "x": 248, "y": 40, "height": "Infinity", "piranha": true, "transport": 4 },
                                    { "macro": "CheepsStop", "x": 264 },
                                ]
                            },
                            "stretch": {
                                "width": 8,
                                "creation": [
                                    { "macro": "Floor", "y": 24 },
                                    { "thing": "Stone", "y": 88 }
                                ]
                            },
                            "after": {
                                "width": 40,
                                "creation": [
                                    { "macro": "Floor", "width": 24 },
                                    { "thing": "Stone", "y": 88, "width": 40 },
                                    { "macro": "Pipe", "x": 24, "y": 16, "height": "Infinity", "piranha": true },
                                    { "macro": "Section", "x": 40 }
                                ]
                            }
                        }
                    ]
                }, {
                    "setting": "Underwater Castle",
                    "blockBoundaries": true,
                    "underwater": true,
                    "creation": [
                        { "macro": "Floor", "y": 88, "width": 16 },
                        { "macro": "Floor", "x": 16 },
                        { "macro": "Pipe", "x": 24, "y": 16, "height": "Infinity", "entrance": 4 },
                        { "macro": "Floor", "x": 40, "width": 536 },
                        { "thing": "Stone", "x": 48, "y": 24, "width": 40, "height": 24 },
                        { "thing": "Stone", "x": 48, "y": 80, "width": 40, "height": 16 },
                        { "thing": "Stone", "x": 48, "y": 88, "width": 528 },
                        { "thing": "Stone", "x": 88, "y": 32, "width": 56, "height": 32 },
                        { "thing": "Stone", "x": 88, "y": 80, "width": 56, "height": 24 },
                        { "thing": "CastleBlock", "x": 160, "y": 46, "fireballs": 6, "hidden": true },
                        { "thing": "Blooper", "x": 224, "y": 16 },
                        { "thing": "CastleBlock", "x": 248, "y": 22, "fireballs": 6, "hidden": true },
                        { "thing": "Stone", "x": 312, "y": 24, "width": 24, "height": 24 },
                        { "thing": "Stone", "x": 312, "y": 80, "width": 24, "height": 24 },
                        { "thing": "CastleBlock", "x": 320, "y": 54, "fireballs": 6, "hidden": true },
                        { "thing": "Blooper", "x": 408, "y": 24 },
                        { "thing": "Blooper", "x": 424, "y": 56 },
                        { "thing": "CastleBlock", "x": 446, "y": 38, "fireballs": 6, "hidden": true },
                        { "thing": "CastleBlock", "x": 512, "y": 44, "fireballs": 6, "hidden": true },
                        { "thing": "Stone", "x": 536, "y": 32, "width": 40, "height": 32 },
                        { "thing": "Stone", "x": 536, "y": 80, "width": 40, "height": 24 },
                        { "thing": "PipeHorizontal", "x": 544, "y": 48, },
                        { "thing": "Stone", "x": 552, "y": 56, "width": 24, "height": 24 }
                    ]
                }, {
                    "setting": "Castle",
                    "blockBoundaries": true,
                    "creation": [
                        { "macro": "Pipe", "y": 16, "height": "Infinity", "piranha": true, "entrance": 5 },
                        { "thing": "Stone", "y": 88, "width": 232 },
                        { "macro": "Floor", "x": 16, "width": 40 },
                        { "macro": "Pipe", "x": 56, "y": 16, "height": "Infinity", "piranha": true, "transport": 1 },
                        { "macro": "Floor", "x": 72, "width": 72 },
                        { "thing": "HammerBro", "x": 112, "y": 12 },
                        { "macro": "Water", "x": 128, "width": 56 },
                        { "thing": "Podoboo", "x": 160, "y": -32 },
                        { "macro": "Floor", "x": 184, "y": 24, "width": 48 },
                        { "thing": "Stone", "x": 184, "y": 80, "width": 48, "height": 16 },
                        { "macro": "EndInsideCastle", "x": 232, "spawnType": "Bowser", "throwing": true, "transport": { "map": "1-1" } }
                    ]
                }
            ]
        }, {
            "name": "Random",
            "locations": {
                "0": { "entry": "Plain", "area": "Overworld" },
                "Overworld": { "entry": "Plain", "area": "Overworld" },
                "OverworldFromSky": { "area": "Overworld" },
                "OverworldFromPipe": { "entry": "PipeVertical", "area": "OverworldWithPipe" },
                "Underworld": { "area": "Underworld" },
                "Sky": { "entry": "Vine", "area": "Sky" },
                "Castle": { "entry": "Castle", "area": "Castle" }
            },
            "areas": {
                "Overworld": {
                    "setting": "Overworld",
                    "random": true,
                    "creation": [
                        { "thing": "RandomSpawner", "x": 0, "y": 0, "randomization": "Overworld", "randomTop": 80, "randomWidth": 2800, "randomBottom": -8 }
                    ]
                },
                "OverworldWithPipe": {
                    "setting": "Overworld",
                    "random": true,
                    "creation": [
                        { "macro": "Pipe", "entrance": "OverworldFromPipe", "height": 16 },
                        { "thing": "RandomSpawner", "x": 0, "y": 0, "randomization": "Overworld", "randomTop": 80, "randomWidth": 1520, "randomBottom": -8 }
                    ]
                },
                "Underworld": {
                    "setting": "Underworld",
                    "random": true,
                    "creation": [
                        { "thing": "RandomSpawner", "x": 0, "y": 0, "randomization": "Underworld", "randomTop": 80, "randomWidth": 2800, "randomBottom": -8 }
                    ]
                },
                "Sky": {
                    "setting": "Sky",
                    "random": true,
                    "exit": "OverworldFromSky",
                    "creation": [
                        { "thing": "RandomSpawner", "x": 0, "y": 0, "randomization": "Sky", "randomTop": 80, "randomWidth": 2800, "randomBottom": -8 }
                    ]
                },
                "Castle": {
                    "setting": "Castle",
                    "random": true,
                    "creation": [
                        { "thing": "RandomSpawner", "x": 0, "y": 0, "randomization": "Castle", "randomTop": 80, "randomWidth": 2000, "randomBottom": -8 }
                    ]
                }
            }
        }
    ])
};
;

/* settings/mods.js */
FullScreenMario.prototype.settings.mods = {
    "storeLocally": true,
    "storageSettings": {
        "prefix": "FullScreenMario::Mods::",
        "autoSave": true
    },
    "mods": [
        {
            "name": "Bouncy Bounce",
            "description": "Mario landing causes him to jump.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onPlayerLanding": function (mod) {
                    var player = this.player;
                    
                    // Don't trigger during cutscenes or small landings
                    if (
                        player.EightBitter.MapScreener.nokeys
                        || Math.abs(player.yvel) < player.EightBitter.unitsize / 4
                    ) {
                        return;
                    }
                    
                    if (player.resting.actionTop) {
                        player.resting.actionTop(player, player.resting);
                    }
                    
                    player.jumpcount = 0;
                    player.resting = undefined;
                    player.yvel = -3 * player.EightBitter.unitsize;
                },
                "onPlayerActionLeft": function (mod, player, other) {
                    other.actionLeft(player, other, true);
                }
            },
        }, {
            "name": "Dark is the Night",
            "description": "The night is darkest before the dawn, but I promise you: the dawn is coming.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    var area = this.MapsHandler.getArea();
                    
                    if (!area) {
                        return;
                    }
                    
                    mod.events.onPreSetLocation.call(this, mod);
                },
                "onPreSetLocation": function (mod) {
                    var area = this.MapsHandler.getArea();
                    
                    area.setting += " Castle Alt2";
                    area.setBackground(area);
                    
                    this.PixelDrawer.setBackground(area.background);
                    this.GroupHolder.callOnAll(
                        undefined,
                        this.PixelDrawer.setThingSprite
                    );
                    
                    this.ModAttacher.fireEvent(
                        "onSetLocation",
                        this.MapsHandler.getLocation()
                    );
                },
                "onModDisable": function (mod) {
                    var area = this.MapsHandler.getArea();
                    
                    area.setting = area.setting.replace(" Castle Alt2", "");
                    area.setBackground(area);
                    
                    this.PixelDrawer.setBackground(area.background);
                    this.GroupHolder.callOnAll(
                        undefined,
                        this.PixelDrawer.setThingSprite
                    );
                    
                    this.ModAttacher.fireEvent(
                        "onSetLocation",
                        this.MapsHandler.getLocation()
                    );
                }
            }
        }, {
            "name": "Earthquake!",
            "description": "Mario landing causes everything else to jump.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onPlayerLanding": (function () {
                    var shiftLevels = [2, 1.5, 1, .5, 0, -.5, -1, -1.5, -2],
                        shiftCount = 0,
                        shiftAll = function (EightBitter, texts, solids, scenery, characters) {
                            var dy = shiftLevels[shiftCount];
                            
                            if (dy < 0) {
                                EightBitter.shiftVert(EightBitter.player, dy);
                            }
                            
                            EightBitter.shiftThings(texts, 0, dy);
                            EightBitter.shiftThings(solids, 0, dy);
                            EightBitter.shiftThings(scenery, 0, dy);
                            EightBitter.shiftThings(characters, 0, dy);
                            
                            shiftCount += 1;
                            if (shiftCount >= shiftLevels.length) {
                                shiftCount = 0;
                                return true;
                            }
                        };
                    
                    return function (mod) {
                        var player = this.player,
                            characters, solids, scenery, texts, character, i;
                    
                        // Don't trigger during cutscenes or small landings
                        if (
                            player.EightBitter.MapScreener.nokeys
                            || Math.abs(player.yvel) < player.EightBitter.unitsize / 4
                        ) {
                            return;
                        }
                        
                        this.AudioPlayer.play("Bump");
                        
                        texts = this.GroupHolder.getTextGroup().slice();
                        scenery = this.GroupHolder.getSceneryGroup().slice();
                        solids = this.GroupHolder.getSolidGroup().slice();
                        characters = this.GroupHolder.getCharacterGroup().slice();
                        
                        for (i = 0; i < characters.length; i += 1) {
                            character = characters[i];
                            if (
                                character.player 
                                || character.nofall 
                                || !character.resting 
                                || character.grounded
                            ) {
                                continue;
                            }
                            
                            character.resting = undefined;
                            character.yvel = player.EightBitter.unitsize * -1.4;
                        }
                        
                        // A copy of each group is made because new Things 
                        // added in shouldn't start being moved in the middle
                        if (shiftCount === 0) {
                            this.TimeHandler.addEventInterval(
                                shiftAll, 1, Infinity, this,
                                texts, solids, scenery, characters
                            );
                        }
                    }
                })()
            }
        }, {
            "name": "Gradient Skies",
            "description": "Skies fade out to black in the heavens above.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    if (this.MapsHandler.getMap()) {
                        mod.events.onSetLocation.call(this, mod);
                    }
                },
                "onModDisable": function (mod) {
                    var area = this.MapsHandler.getArea();
                    
                    area.setBackground(area);
                    this.PixelDrawer.setBackground(area.background);
                },
                "onSetLocation": (function (gradients) {
                    return function (mod) {
                        var area = this.MapsHandler.getArea(),
                            setting = area.setting,
                            context = this.canvas.getContext("2d"),
                            background = context.createLinearGradient(
                                0, 0,
                                this.MapScreener.width,
                                this.MapScreener.height
                            ), gradient, i;
                        
                        for (i in gradients) {
                            if (setting.indexOf(i) !== -1) {
                                gradient = gradients[i]
                                break;
                            }
                        }
                        
                        if (!gradient) {
                            gradient = gradients["default"];
                        }
                        
                        for (i in gradient) {
                            background.addColorStop(i, gradient[i]);
                        }
                        
                        area.background = background;
                        this.PixelDrawer.setBackground(area.background);
                    };
                })({
                    "Underwater": {
                        ".21": "#5CC7FC",
                        "1": "#CCCCAA"
                    },
                    "Night": {
                        "0": "#000000",
                        "0.49": "#000035",
                        "0.84": "#280035",
                        "1": "#350035"
                    },
                    "Underworld": {
                        "0.35": "#000000",
                        "1": "#003528"
                    },
                    "Castle": {
                        "0.21": "#000000",
                        "1": "#700000"
                    },
                    "Shrooms": {
                        ".21": "#9C94EC",
                        ".49": "#A7AAEE",
                        "1": "#FFCC77"
                    },
                    "Womb": {
                        "0.21": "#703521",
                        ".7": "#770014",
                        "1": "#AA0035"
                    },
                    "default": {
                        ".21": "#5C94FC",
                        ".49": "#77AAFF",
                        "1": "#FFCCAA"
                    }
                })
            },
            "settings": {}
        }, {
            // http://www.themushroomkingdom.net/smb_breakdown.shtml#hard
            "name": "Hard Mode",
            "description": "Like in Super Mario Bros Deluxe!",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onAddThing": function (mod, thing) {
                    var spawn;
                    if (thing.title === "Goomba") {
                        spawn = thing.EightBitter.killReplace(
                            thing,
                            "Beetle", 
                            undefined,
                            [ "direction", "moveleft", "lookleft", "xvel", "yvel", "speed" ]
                        );
                        spawn.mod = "Hard Mode";
                    }
                    else if (thing.title === "Platform") {
                        thing.EightBitter.reduceWidth(thing, thing.EightBitter.unitsize * 8, true);
                        thing.EightBitter.shiftHoriz(thing, thing.EightBitter.unitsize * 4);
                    }
                    
                    if (thing.groupType === "Character") {
                        thing.speed *= 1.4;
                    }
                },
                "onModEnable": function (mod) {
                    var EightBitter = EightBittr.ensureCorrectCaller(this),
                        characters = EightBitter.GroupHolder.getCharacterGroup(),
                        solids = EightBitter.GroupHolder.getSolidGroup(),
                        attributes = ["direction", "moveleft", "lookleft", "xvel", "yvel", "speed"],
                        spawn, thing, i;
                    
                    for (i = 0; i < characters.length; i += 1) {
                        thing = characters[i];
                        if (thing.title === "Goomba") {
                            spawn = thing.EightBitter.killReplace(
                                thing, 
                                "Beetle", 
                                undefined,
                                attributes
                            );
                            spawn.mod = "Hard Mode";
                            if (thing.xvel > 0) {
                                spawn.EightBitter.flipHoriz(spawn);
                            } else {
                                spawn.EightBitter.unflipHoriz(spawn);
                            }
                        }
                        thing.speed *= 1.4;
                    }
                    
                    for(i = 0; i < solids.length; i += 1) {
                        thing = solids[i];
                        if(thing.title === "Platform") {
                            thing.EightBitter.reduceWidth(thing, thing.EightBitter.unitsize * 8, true);
                            thing.EightBitter.shiftHoriz(thing, thing.EightBitter.unitsize * 4);
                        }
                    }
                },
                "onModDisable": function (mod) {
                    var EightBitter = EightBittr.ensureCorrectCaller(this),
                        characters = EightBitter.GroupHolder.getCharacterGroup(),
                        solids = EightBitter.GroupHolder.getSolidGroup(),
                        attributes = ["direction", "moveleft", "lookleft", "xvel", "yvel", "speed"],
                        thing, i;
                    
                    for (i = 0; i < characters.length; i += 1) {
                        thing = characters[i];
                        if (thing.title === "Beetle" && thing.mod === "Hard Mode") {
                            thing.EightBitter.killReplace(
                                thing, 
                                "Goomba", 
                                undefined,
                                attributes
                            );
                        } else {
                            thing.speed /= 1.4;
                        }
                    }
                    
                    for (i = 0; i < solids.length; i += 1) {
                        thing = solids[i];
                        if (thing.title === "Platform") {
                            thing.EightBitter.increaseWidth(thing, thing.EightBitter.unitsize * 8);
                            thing.EightBitter.shiftHoriz(thing, thing.EightBitter.unitsize * -4);
                        }
                    }
                }
            }
        }, {
            "name": "High Speed",
            "description": "Mario's maximum speed is quadrupled.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    var stats = this.ObjectMaker.getFunction("Player").prototype,
                        keyNames = mod.settings.keyNames,
                        multiplier = mod.settings.multiplier,
                        i;
                    
                    for (i = 0; i < keyNames.length; i += 1) {
                        mod.settings[keyNames[i]] = stats[keyNames[i]];
                        stats[keyNames[i]] *= multiplier;
                    }
                },
                "onModDisable": function (mod) {
                    var stats = this.ObjectMaker.getFunction("Player").prototype,
                        keyNames = mod.settings.keyNames,
                        i;
                    
                    for (i = 0; i < keyNames.length; i += 1) {
                        stats[keyNames[i]] = mod.settings[keyNames[i]];
                    }
                }
            },
            "settings": {
                "keyNames": ["maxspeedsave", "maxspeed", "scrollspeed"],
                "multiplier": 14
            }
        }, {
            "name": "Infinite Lives",
            "description": "Mario never really dies.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    var proto = this.ObjectMaker.getFunction("Area").prototype,
                        stats = this.settings.statistics.values.lives;
                    
                    mod.settings.onPlayerDeathOld = proto.onPlayerDeath;
                    proto.onPlayerDeath = this.mapEntranceRespawn;
                    
                    mod.settings.livesOld = this.StatsHolder.get("lives");
                    mod.settings.statsOld = stats;
                    stats.valueDefault = Infinity;
                    this.StatsHolder.set("lives", Infinity);
                },
                "onModDisable": function (mod) {
                    var proto = this.ObjectMaker.getFunction("Area").prototype,
                        stats = this.settings.statistics.values.lives;
                    
                    proto.onPlayerDeath = mod.settings.onPlayerDeathOld;
                    
                    stats.valueDefault = mod.settings.statsOld.valueDefault;
                    this.StatsHolder.set("lives", mod.settings.livesOld);
                }
            },
            "settings": {
                "onPlayerDeathOld": undefined,
                "statsOld": undefined,
                "livesOld": undefined
            }
        }, {
            "name": "Invincibility",
            "description": "Mario is constantly given star power.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    if (this.player) {
                        this.playerStarUp(this.player, Infinity);
                    }
                },
                "onModDisable": function () {
                    if (this.player) {
                        this.playerStarDown(this.player);
                    }
                },
                "onSetLocation": function () {
                    if (this.player) {
                        this.playerStarUp(this.player, Infinity);
                    }
                },
                "onPlayerRespawn": function () {
                    if (this.player) {
                        this.playerStarUp(this.player, Infinity);
                    }
                }
            }
        }, {
            "name": "Parallax Clouds",
            "description": "Clouds in the sky scroll at about 63% the normal rate.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.ObjectMaker.getFunction("Cloud").prototype.parallaxHoriz = .7;
                },
                "onModDisable": function () {
                    this.ObjectMaker.getFunction("Cloud").prototype.parallaxHoriz = undefined;
                }
            }
        }, {
            "name": "Low Gravity",
            "description": "I believe I can fly!",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.ObjectMaker.getFunction("Player").prototype.gravity 
                            = this.ObjectMaker.getFunction("Area").prototype.gravity / 1.4
                },
                "onModDisable": function () {
                    this.ObjectMaker.getFunction("Player").prototype.gravity 
                            = this.ObjectMaker.getFunction("Area").prototype.gravity;
                }
            }
        }, {
            "name": "Luigi",
            "description": "The little brother who could!",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.StatsHolder.set("luigi", true);
                    this.ObjectMaker.getFunction("Player").prototype.title = "Luigi";
                    
                    if (this.player) {
                        this.player.title = "Luigi";
                        this.PixelDrawer.setThingSprite(this.player);
                        
                        this.ThingHitter.cacheHitCheckType(
                            this.player.title,
                            this.player.groupType
                        );
                    }
                },
                "onModDisable": function () {
                    this.StatsHolder.set("luigi", false);
                    this.ObjectMaker.getFunction("Player").prototype.title = "Player";
                    
                    if (this.player) {
                        this.player.title = "Player";
                        this.PixelDrawer.setThingSprite(this.player);
                    }
                }
            }
        }, { 
            "name": "Tilt Gravity",
            "description": "Tilting your device pushes characters around",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onDeviceMotion": function (mod, event) {
                    var characters = this.GroupHolder.getCharacterGroup(),
                        acceleration = event.accelerationIncludingGravity,
                        diff = -acceleration.x * this.unitsize,
                        y = acceleration.y,
                        character, i;
                    
                    for (i = 0; i < characters.length; i += 1) {
                        character = characters[i];
                        if (!character.player && !character.grounded) {
                            this.shiftHoriz(character, diff);
                        }
                    }
                    
                    if (typeof mod.settings.y !== "undefined") {
                        diff = (y - mod.settings.y) * this.unitsize * 2;
                        if (diff > 0) {
                            for (i = 0; i < characters.length; i += 1) {
                                character = characters[i];
                                if (!character.grounded) {
                                    this.shiftVert(character, -diff);
                                    character.yvel = -diff;
                                    character.resting = undefined;
                                }
                            }
                        }
                    }
                    
                    mod.settings.y = y;
                }
            },
            "settings": {
                "y": undefined
            }
        }, {
            "name": "Palette Swap",
            "description": "Swaps the color palette around randomly for each area.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    mod.settings.paletteDefaultOld = this.settings.sprites.paletteDefault;
                    
                    if (this.MapsHandler.getMapName()) {
                        mod.events.onPreSetLocation.call(this, mod);
                    }
                },
                "onModDisable": function (mod) {
                    this.settings.sprites.paletteDefault = mod.settings.paletteDefaultOld;
                    
                    mod.resetVisuals(this);
                    mod.resetThingSprites(this);
                },
                "onPreSetLocation": function (mod, location) {
                    this.settings.sprites.paletteDefault = mod.shufflePalette(
                        Array.prototype.slice.call(mod.settings.paletteDefaultOld)
                    );
                    
                    mod.resetVisuals(this);
                    mod.resetThingSprites(this);
                }
            },
            "settings": {
                "paletteOld": undefined
            },
            "resetVisuals": function (EightBitter) {
                EightBitter.resetPixelRender(EightBitter, EightBitter.customs);
                EightBitter.resetPixelDrawer(EightBitter, EightBitter.customs);
                EightBitter.PixelDrawer.setCanvas(EightBitter.canvas);
                EightBitter.PixelDrawer.setThingArrays([
                    EightBitter.GroupHolder.getSceneryGroup(),
                    EightBitter.GroupHolder.getSolidGroup(),
                    EightBitter.GroupHolder.getCharacterGroup(),
                    EightBitter.GroupHolder.getTextGroup()
                ]);
                EightBitter.PixelDrawer.setBackground(
                    EightBitter.MapsHandler.getArea().background
                );
            },
            "resetThingSprites": function (EightBitter) {
                EightBitter.GroupHolder.callOnAll(undefined, function (thing) {
                    thing.numSprites = undefined;
                    // EightBitter.PixelDrawer.setThingSprite(thing);
                });
            },
            "shufflePalette": function shufflePalette(array) {
                var i, j, temp;
                
                for (i = 0; i < array.length - 1; i += 1) {
                    j = Math.floor(Math.random() * i);
                    temp = array[i + 1];
                    array[i + 1] = array[j + 1];
                    array[j + 1] = temp;
                }
                
                return array;
            }
        }, {
            "name": "QCount",
            "description": "QQQQQQQ",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    var EightBitter = this,
                        characters = mod.settings.characters,
                        charactersEightBitter = EightBitter.GroupHolder.getCharacterGroup(),
                        level;
                    
                    this.InputWriter.addEvent("onkeydown", "q", function () {
                        mod.settings.qcount += 1;
                        
                        if (mod.settings.levels[mod.settings.qcount]) {
                            var level = mod.settings.levels[mod.settings.qcount];
                            mod.settings.events.push(EightBitter.TimeHandler.addEventInterval(function () {
                                if (charactersEightBitter.length < 210) {
                                    var num = Math.floor(Math.random() * level.length),
                                        lul = EightBitter.ObjectMaker.make.apply(EightBitter.ObjectMaker, level[num]);
                                    
                                    lul.yvel = Math.random() * EightBitter.unitsize / 4;
                                    lul.xvel = lul.speed = Math.random() * EightBitter.unitsize * 2;
                                    if (Math.floor(Math.random() * 2)) {
                                        lul.xvel *= -1;
                                    }
                                    
                                    characters.push(lul);
                                    EightBitter.addThing(
                                        lul, 
                                        (32 * Math.random() + 128) * EightBitter.unitsize,
                                        88 * Math.random() * EightBitter.unitsize
                                    );
                                }
                            }, 7, Infinity));
                        }
                    });
                    this.InputWriter.addAliasValues("q", [81]);
                },
                "onModDisable": function (mod) {
                    mod.settings.qcount = 0;
                    mod.settings.events.forEach(this.TimeHandler.cancelEvent);
                    mod.settings.events.length = 0;
                    this.InputWriter.removeEvent("onkeydown", 81, undefined);
                    this.InputWriter.removeEvent("onkeydown", "q", undefined);
                },
                "onSetLocation": function (mod) {
                    mod.settings.qcount = 0;
                }
            },
            "settings": {
                "qcount": 0,
                "characters": [],
                "events": [],
                "levels": {
                    "7": [ ["Goomba"] ],
                    "14": [ 
                        ["Koopa"],
                        ["Koopa", { "smart": true }],
                        ["Koopa", { "jumping": true }],
                        ["Koopa", { "smart": true, "jumping": true }],
                        ["Beetle"],
                        ["HammerBro"],
                        ["Lakitu"],
                        ["Blooper"]
                    ],
                    "21": [ ["Bowser"] ]
                }
            }
        }, {
            "name": "Super Fireballs",
            "description": "Fireballs blow up solids, and Mario has unlimited.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.ObjectMaker.getFunction("solid").prototype.nofire = 0;
                    this.ObjectMaker.getFunction("solid").prototype.firedeath = 1;
                },
                "onModDisable": function (mod) {
                    this.ObjectMaker.getFunction("solid").prototype.nofire = 2;
                    this.ObjectMaker.getFunction("solid").prototype.firedeath = 0;
                }
            }
        }, {
            "name": "Trip of Acid",
            "description": "Sprites aren't cleared from the screen each game tick.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.TimeHandler.addEvent(function () {
                        this.PixelDrawer.setNoRefill(true);
                    }.bind(this), 3);
                },
                "onSetLocation": function (mod) {
                    this.PixelDrawer.setNoRefill(false);
                    this.TimeHandler.addEvent(function () {
                        this.PixelDrawer.setNoRefill(true);
                    }.bind(this), 3);
                },
                "onModDisable": function (mod) {
                    this.PixelDrawer.setNoRefill(false);
                }
            }
        }
    ]
};
;
