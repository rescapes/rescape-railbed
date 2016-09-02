/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {OrderedMap, Map, List} from 'immutable'
import Statuses from './statuses'


var amtrakStandardModels = Map({
    'AMTRAK Superliner': Map({
        status: Statuses.INITIALIZED,
        id: '2b495238-e77d-4edf-bb23-b186daf0640f',
        anchorId: 'id.5ktmpvprnx88',
        scenes: Map({

        }),
        media: OrderedMap({
            'Capitol Corridor Interior': Map({
                caption: "Northern California's Capitol Corridor",
                sourceImageUrl: 'http://photos.everintransit.com/US-California/Sacramento/i-ZdzL7CV/0/M/sacramento-0138-M.jpg',
                sourceUrl: 'http://www.everintransit.com/capitol-corridor-amtrak-california/',
                credit: 'Ever In Transit'
            }),
            'AMTRAK Superliner Cafe Lounge Car': Map({
                caption: 'Casual food is available on most AMTRAK trains',
                sourceImageUrl: 'http://photos.everintransit.com/US-California/Sacramento/i-ZdzL7CV/0/M/sacramento-0138-M.jpg',
                sourceUrl: 'http://www.everintransit.com/capitol-corridor-amtrak-california/',
                credit: 'Ever In Transit'
            }),
            'AMTRAK Superliner Dining Car': Map({
                caption: 'Hot breakfast in the dining car on the northbound Coast Starlight',
                sourceImageUrl: 'http://photos.everintransit.com/US-California/Sacramento/i-ZdzL7CV/0/M/sacramento-0138-M.jpg',
                sourceUrl: 'http://www.everintransit.com/capitol-corridor-amtrak-california/',
                credit: 'Ever In Transit'
            }),
            'AMTRAK Superliner Fraster Winter Park': Map({
                caption: 'Hot breakfast in the dining car on the northbound Coast Starlight',
                sourceImageUrl: 'http://photos.everintransit.com/US-California/Sacramento/i-ZdzL7CV/0/M/sacramento-0138-M.jpg',
                sourceUrl: 'http://www.everintransit.com/capitol-corridor-amtrak-california/',
                credit: 'Ever In Transit'
            })
        })

    }),
    'AMTRAK Café Car': Map({
        status: Statuses.INITIALIZED,
        id: '9b7bbfe8-2ad5-4074-ae81-7bc0645dfce9',
        scenes: Map({
            'AMTRAK Cafe Seating': Map({
                anchorId: 'id.bc4p3rsjqez8'
            }),
            'AMTRAK Cafe Offerings': Map({
                anchorId: 'id.wcuwoy7h102u'
            }),
            'Group Seating': Map({
                anchorId: 'id.wcuwoy7h102u'
            }),
        }),
        media: OrderedMap({
            'Eastern Cafe Tables': Map({
                caption: 'Eastern AMTRAK Café Car tables with bike space',
                sourceImageUrl: 'http://www.bikenyc.org/sites/default/files/Bikes%20On%20Board%20Between%20ALB%20%26%20SDY.JPG',
                sourceUrl: 'http://www.bikenyc.org/blog/bikes-amtrak-trains-northeast-nyc-summer',
                credit: 'Bike NYC'
            }),
            'Western Cafe Tables': Map({
                caption: 'Western AMTRAK Café Car tables',
                sourceImageUrl: 'http://photos.everintransit.com/US-California/Sacramento/i-CHSJLNj/0/M/sacramento-091445-M.jpg',
                sourceUrl: 'http://www.everintransit.com/capitol-corridor-amtrak-california/',
                credit: 'Ever In Transit'
            }),
            'San Joaquin Cafe Car': Map({
                caption: "Café Car of AMTRAK's Central California service",
                sourceImageUrl: 'http://photos.everintransit.com/US-California/Sacramento/i-CHSJLNj/0/M/sacramento-091445-M.jpg',
                sourceUrl: 'http://www.everintransit.com/capitol-corridor-amtrak-california/',
                credit: 'Ever In Transit'
            }),
            'Cafe Car Service': Map({
                caption: "Café Car Service on AMTRAK's Northern California Capitol Corridor",
                sourceImageUrl: 'http://ww3.hdnux.com/photos/07/63/06/2044314/5/1024x1024.jpg',
                sourceUrl: 'http://www.sfgate.com/bayarea/article/Calif-Amtrak-ridership-rising-on-state-trains-2479851.php#photo-2044314',
                credit: 'Carlos Avila Gonzalez, The San Francisco Chronicle'
            }),
            'Cafe Car Lounge Area': Map({
                caption: "Café Car Lounge Area on AMTRAK's Central California San Joaquin",
                sourceImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Passengers_in_Amtrak_lounge_car_of_San_Joaquin_%28train%29_2014.jpg',
                sourceUrl: 'https://en.wikipedia.org/wiki/California_Car_(railcar)',
                credit: 'George Garrigues, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=42379331'
            }),
            'Deutsche Bahn Bordbistro': Map({
                caption: "Germany's Deutsche Bahn serves food and drinks on intercity high-speed and regional trains",
                sourceImageUrl: 'http://www.spiegel.de/#ref=gallery-last-image',
                sourceUrl: 'http://www.spiegel.de/fotostrecke/bahn-millionen-investition-fuer-kaffeetrinker-fotostrecke-56176-3.html',
                credit: 'Der Spiegel'
            })
        })
    }),

    'Fixed-Guideways': Map({
        status: Statuses.INITIALIZED,
        id: '419df1d2-949f-4e60-adbc-59da24a5c6ce',
        anchorId: 'id.2y8fqiblaq2h',
        scenes: Map({
            'All Transit': Map({
                anchorId: 'id.2y8fqiblaq2h'
            }),
            'Fixed Guideway': Map({
                anchorId: 'id.fxqrlhz9p7by'
            }),
            'Not Fixed Guideway': Map({
                anchorId: 'id.5dezdsk8y4kg'
            }),
        }),
        media: Map({
            'Nantes Busway': Map({
                caption: "Bus Rapid Transit Service in Nantes, France. Though the bus has its own dedicated right-of-way, the" +
                "busway cannot be considered a fixed-guideway, since the bus is physically free to veer off of it",
                sourceImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Flickr_-_IngolfBLN_-_Nantes_-_Busway_-_Ligne_4_-_Duchesse_Anne_-_Ch%C3%A2teau_des_Ducs_de_Bretagne_%281%29.jpg/1920px-Flickr_-_IngolfBLN_-_Nantes_-_Busway_-_Ligne_4_-_Duchesse_Anne_-_Ch%C3%A2teau_des_Ducs_de_Bretagne_%281%29.jpg',
                sourceUrl: 'https://en.wikipedia.org/wiki/Nantes_Busway',
                credit: 'By IngolfBLN - Nantes - Busway - Ligne 4 - Duchesse Anne - Château des Ducs de Bretagne, CC BY-SA 2.0, https://commons.wikimedia.org/w/index.php?curid=22010918'
            })

        })
    }),

    'Types of Right-Of-Way': Map({
        status: Statuses.INITIALIZED,
        id: '510744fa-42ef-452d-87af-2096ae064d40',
        anchorId: 'id.18woithqdgdg',
        scenes: Map({
            'Class A ROW': Map({
                anchorId: 'id.18woithqdgd'
            }),
            'Class B ROW': Map({
                anchorId: 'id.h4oentdtic5m'
            }),
            'Class C ROW': Map({
                anchorId: 'id.d35p1mlt87up'
            }),
        }),
        media: OrderedMap({
            'St Charles Streetcar': Map({
                caption: 'The iconic St Charles Streetcar of New Orleans travels part of its route on unimpeded class B right-of-way. Other parts of the route are unfortunately in mixed traffic',
                sourceImageUrl: 'http://www.tribunetalk.com/wp-content/uploads/2014/12/Streetcar.jpg',
                sourceUrl: 'http://www.tribunetalk.com/wp-content/uploads/2014/12/Streetcar.jpg',
                credit: 'Zach Schaner - Seattle Transit Blog',
                date: 'December 2015'
            }),
            'Portland Streetcar in Traffic': Map({
                caption: 'A streetcar investment needlessly discomforts and inconveniences its users by putting the streetcar in mixed traffic',
                sourceImageUrl: 'http://image.oregonlive.com/home/olive-media/width960/img/oregonian/photo/2015/12/03/portland-streetcar-dcae5f69472d7f5e.jpg',
                sourceUrl: 'http://www.oregonlive.com/commuting/index.ssf/2015/12/portland_streetcar_to_try_limi.html',
                credit: 'Zach Schaner - Seattle Transit Blog',
                date: 'November 2015'
            }),
            'Madison BRT Profile': Map({
                type: 'png',
                caption: 'A planned BRT route in Madison, Wisconsin is compromised by Class C right-of-way',
                sourceImageUrl: 'http://s3.amazonaws.com/stb-wp/wp-content/uploads/2015/11/10113329/Madison-BRT-Profile-01.png',
                sourceUrl: 'http://seattletransitblog.com/2015/11/11/madison-brt-creep/',
                credit: 'Elliot Njus - The Orgonian/Oregon Live',
                date: 'December 2015'
            }),
        })
    }),

    'Frequency of Transit Stops': Map({
        status: Statuses.INITIALIZED,
        id: '9173b60e-b557-44bf-a736-2e352e4f7a86',
        anchorId: 'id.mxfqg4xj55jc',
        scenes: Map({
            'Current Conditions': Map({
                anchorId: 'id.mxfqg4xj55jc'
            }),
            'Removal of Minor Stops': Map({
                anchorId: 'id.17g6w82r9xg0'
            }),
            'Consolidation of Close Stops': Map({
                anchorId: 'id.jkjm80gwudui'
            }),
            'Tram Upgrade': Map({
                anchorId: 'id.vwedkoe7xxns'
            }),
            'Consolidation Challenges': Map({
                anchorId: 'id.ifjl8mnx6p4n'
            }),
        })
    }),

    'Seat Comfort (Metro)': Map({
        status: Statuses.INITIALIZED,
        id: 'f3ad4189-7150-4048-a4c9-c3e9652e9482',
        anchorId: 'id.em6st57x7wbe',
        scenes: Map({
            'Empty Rows': Map({
                anchorId: 'id.em6st57x7wbe'
            }),
            'Plush Seats': Map({
                anchorId: 'id.rcz0hdr6gctf'
            }),
            'Occasional Wooden Seats': Map({
                anchorId: 'id.nj75dz9x9en1'
            }),
            'Classic Wooden Seats': Map({
                anchorId: 'id.xhr56xmk5mgb'
            }),
            'Seat Height': Map({
                anchorId: 'id.v297r7jcxci4'
            }),
            'Armrests and Recliners': Map({
                anchorId: 'id.bbssm7d9ycql'
            })
        })
    }),

    'Seat Comfort (AMTRAK/Bus)': Map({
        status: Statuses.INITIALIZED,
        id: '843cbe82-5a4a-4453-9766-488049133e9d',
        anchorId: 'id.53cvna734bl4',
        scenes: Map({
            'Forward-facing Seats on AMTRAK': Map({
                anchorId: 'id.53cvna734bl4'
            }),
            "AMTRAK's Sightseeing Seats": Map({
                anchorId: 'id.nups2saj5zpa'
            }),
            'Low-floor buses have rear-facing seats': Map({
                anchorId: 'id.s9a7cdqojj39'
            }),
        })
    }),

    'Personal Space and Privacy': Map({
        status: Statuses.INITIALIZED,
        id: '268c95fd-8a33-4636-bf72-ceaff2c1e997',
        anchorId: 'id.n0mwt01mtot1',
        scenes: Map({
            'Train Compartment': Map({
                anchorId: 'id.n0mwt01mtot1'
            }),
            'AMTRAK Roomettes': Map({
                anchorId: 'id.ciyi25f3rtt'
            }),
            'AMTRAK Bedrooms': Map({
                anchorId: 'id.6hku2y24we4a'
            }),
            'Private Metro Compartments': Map({
                anchorId: 'id.cf2ldt4sfy35'
            }),
        })
    }),

    'Transit Access to Amenities': Map({
        status: Statuses.INITIALIZED,
        id: '6d32b9a2-8ef9-4b3f-8065-00d08ee87c05',
        anchorId: 'id.c784pbnlt1sa',
        scenes: Map({
            'AMTRAK Toilet': Map({
                anchorId: 'id.c784pbnlt1sa'
            }),
            'Metro Toilet': Map({
                anchorId: 'id.wkg1zdsmjr7b'
            }),
            'Tram Toilet': Map({
                anchorId: 'id.tffs1gaxh5t5'
            }),
            'Metro Café': Map({
                anchorId: 'id.dfk0f1h01dbd'
            }),
            'Tram Café': Map({
                anchorId: 'id.5pgtgqe6khzj'
            })
        })
    }),

    'Metro Station with Faregates': Map({
        status: Statuses.INITIALIZED,
        id: '605a8f98-af02-4b26-8145-cfe247f91dba',
        anchorId: 'id.97xvu0r03y0e',
        scenes: Map({
            'Metro Entrance with Faregates': Map({
                anchorId: 'id.97xvu0r03y0e'
            }),
            'Barriers Waste Time and Space': Map({
                anchorId: 'id.4ow1z2rta9gh'
            }),
            'Amenities Must Be Inside or Outside Faregates': Map({
                anchorId: 'id.v9iem34tpzwl'
            }),
            'Accessing Transit is Cumbersome': Map({
                anchorId: 'id.p4m8oqotbbz'
            }),
        })
    }),

    'Metro Station with Faregates Removed': Map({
        status: Statuses.INITIALIZED,
        id: '1ed98a7a-99ec-4bb7-9fb1-41df8361c2ce',
        anchorId: 'id.hk1vjyv7ea7a',
        scenes: Map({
            'Validators Replace Faregates and Barriers': Map({
                anchorId: 'id.hk1vjyv7ea7a'
            }),
            'Quicker Access to Amenities': Map({
                anchorId: 'id.z94jy3r4mx0n'
            }),
            'Improved Movement Througout Station': Map({
                anchorId: 'id.62vj9iexviam'
            }),
            'Fast Fare Inspection': Map({
                anchorId: 'id.exqvsmpb53ea'
            }),
            'Luggage & Bike Conveyor': Map({
                anchorId: 'id.bnqw4memdz2g'
            }),
        })
    }),

    'Personal Transportation and Freight (AMTRAK)': Map({
        status: Statuses.INITIALIZED,
        id: '659a315f-97b4-4a9c-8a29-4ca5f6e8cbac',
        anchorId: 'id.phqdf6isq3v4',
        scenes: Map({
            'Initial': Map({
                anchorId: 'id.phqdf6isq3v4'
            }),
            'Personal Bike Storage on Regional Trains': Map({
                anchorId: 'id.9itw958nhuqz'
            }),
        })
    }),

    'Personal Transportation and Freight (Metro)': Map({
        status: Statuses.INITIALIZED,
        id: '04163027-d8a3-4912-9997-0f30573fd0fc',
        anchorId: 'id.3o0isfthvzsv',
        scenes: Map({
            'A hundred bikes fit on a long metro': Map({
                anchorId: 'id.3o0isfthvzsv'
            }),
        })
    }),

    'Personal Transportation and Freight (Tram)': Map({
        status: Statuses.INITIALIZED,
        id: 'f04baa96-4c29-43ab-9f51-c8520c907d25',
        anchorId: 'id.ksrni4wfi211',
        scenes: Map({
            'Long trams have plentiful bike storage': Map({
                anchorId: 'id.ksrni4wfi211'
            }),
            'Trams have flush, level boarding': Map({
                anchorId: 'id.xluw7fz8woop'
            }),
        })
    }),

    'Personal Transportation and Freight (Bus)': Map({
        status: Statuses.INITIALIZED,
        id: 'eaaae7b6-5a68-4f3e-a9f0-21ba35ec73b7',
        anchorId: 'id.b7ievcnhbpl7',
        scenes: Map({
            'External bike storage is limited and risky': Map({
                anchorId: 'id.b7ievcnhbpl7'
            }),
            'Wheelchairs on buses': Map({
                anchorId: 'id.xluw7fz8woop'
            }),
        })
    }),

    'Station and Stop Amenities (Inside)': Map({
        status: Statuses.INITIALIZED,
        id: '731899d7-02b7-4f47-9a3b-7ae84454e0c7',
        anchorId: 'id.hcrfkm926ytq',
        scenes: Map({
            'New Station Amenities': Map({
                anchorId: 'id.hcrfkm926ytq',
            }),
        }),
        media: OrderedMap({
            'Denver Union Station': Map({
                caption: 'Eastern AMTRAK Café Car tables with bike space',
                sourceImageUrl: 'http://www.bikenyc.org/sites/default/files/Bikes%20On%20Board%20Between%20ALB%20%26%20SDY.JPG',
                sourceUrl: 'http://www.bikenyc.org/blog/bikes-amtrak-trains-northeast-nyc-summer',
                credit: 'Bike NYC'
            }),
            'Bakery in Munich Hauptbahnhof': Map({
                caption: 'Fresh bakeries are common in train stations throughout Europe, but especially in Bavaria',
                credit: 'Andy Likuski',
                date: 'August 2014'
            }),
        })
    }),

    'Station and Stop Amenities (Outside, Poor)': Map({
        status: Statuses.INITIALIZED,
        id: '87320bcf-05d7-4df9-8e51-f5c1e8ed82d1',
        anchorId: 'id.360zh96s35x0',
        scenes: Map({
            'Amenity-Poor Transit Center': Map({
                anchorId: 'id.360zh96s35x0'
            }),
        })
    }),

    'Station and Stop Amenities (Outside, Improved)': Map({
        status: Statuses.INITIALIZED,
        id: 'e2157bf5-de7d-413f-b80d-ec9ffc095a13',
        anchorId: 'id.wmbnbioo95zf',
        scenes: Map({
            'Improved Transit Center': Map({
                anchorId: 'id.f60tsmh8mcrv'
            }),
            'Transit Center Amenities': Map({
                anchorId: 'id.wmbnbioo95zf'
            }),
        })
    }),
});

/***
 * The initial state of the application
 * @type {*|Map<K, V>|Map<string, V>}
 */
export default Map({
    settings: Map({
        // These are in here since they are used for arguments to the iframe URL, and hence can't be in css
        modelWidth: 800,
        modelHeight: 710
    }),
    documents: Map({
        keys: List(['amtrak_standard', 'the_new_rules_of_the_road']),
        baseUrl: id => (`https://docs.google.com/document/d/${id}/pub`),
        entries: Map({
            'amtrak_standard': Map({
                status: Statuses.INITIALIZED,
                title: 'The AMTRAK Standard',
                id: '1GbrsFkL4hlMP9o-J1JLw4Qu08j6hEPde_ElJdanJX5U',
                modelKeys: List(amtrakStandardModels.keys())
            }),
            'the_new_rules_of_the_road': Map({
                status: Statuses.INITIALIZED,
                title: 'The New Rules of the Road',
            })
        })
    }),
    models: Map({
        keys: List(amtrakStandardModels.keys()),
        /**
         * These parameters distinguish and size the 3d model. etp is used to get a 2d version
         * @param id: The unique id of the Sketchup model
         * @param width: The width to request. Make sure it matches the iframe size
         * @param height: The height to request. make sure it matches the iframe size
         * @param etp: 'im' for still images. Blank for 3d
         */
        baseUrl: (id, width, height, etp) => (`https://my.sketchup.com/viewer/3dw?WarehouseModelId=${id}`),

        entries: amtrakStandardModels
    })
})
