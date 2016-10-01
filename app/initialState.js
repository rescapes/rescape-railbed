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
import * as settingsActions from './actions/settings'

var amtrakStandardModels = OrderedMap({
    'AMTRAK Superliner': Map({
        status: Statuses.INITIALIZED,
        id: '2b495238-e77d-4edf-bb23-b186daf0640f',
        anchorId: 'id.5ktmpvprnx88',
        scenes: OrderedMap({ entries: Map({
            'Outside': Map({
            }),
            'Coach Car': Map({
            }),
        })}),
        media: OrderedMap({
            'Capitol Corridor Interior': Map({
                caption: "Northern California's Capitol Corridor",
                sourceImageUrl: 'http://photos.everintransit.com/US-California/Sacramento/i-ZdzL7CV/0/M/sacramento-0138-M.jpg',
                sourceUrl: 'http://www.everintransit.com/capitol-corridor-amtrak-california/',
                credit: 'Ever In Transit'
            }),
            'AMTRAK Superliner Cafe Lounge Car': Map({
                caption: 'Casual food is available on most AMTRAK trains',
                sourceImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Amtrak_Superliner_Cafe_Lounge_car.jpg',
                sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Amtrak_Superliner_Cafe_Lounge_car.jpg',
                credit: 'Wikimedia'
            }),
            'AMTRAK Superliner Dining Car': Map({
                caption: 'Hot breakfast in the dining car on the northbound Coast Starlight',
                sourceUrl: 'http://rescapes.net/',
                credit: 'Rescape',
                date: 'October 2015'
            }),
            'AMTRAK Superliner Fraser Winter Park': Map({
                caption: 'Chicago Zephyr Passengers take a brake at the Fraser/Winter Park AMTRAK Station',
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'November 2015'
            }),
            'AMTRAK Superliner Colorado': Map({
                caption: "AMTRAK's Chicago Zephyr offers stunning scenery in the Colorado Rockies",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'November 2015'
            }),
            'AMTRAK Coast Starlight Parlour Car': Map({
                caption: "AMTRAK's Coast Starlight first class parlour car offers the height of travel luxury on a quasi-publicly-operated train",
                sourceImageUrl: 'http://www.trainsandtravel.com/wp-content/uploads/2015/07/Parlour-Car-copy-1090x818.jpg',
                sourceUrl: 'http://www.trainsandtravel.com/the-nickel-and-diming-continues/',
                credit: 'Tranis & Travel with Jim Loomis',
                date: 'July 2015'
            })
        })

    }),
    'AMTRAK Café Car': Map({
        status: Statuses.INITIALIZED,
        id: '9b7bbfe8-2ad5-4074-ae81-7bc0645dfce9',
        anchorId: 'id.bc4p3rsjqez8',
        scenes: OrderedMap({ entries: Map({
            'Seating': Map({
            }),
            'Offerings': Map({
            }),
            'Group Seating': Map({
            }),
        })}),
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
                sourceImageUrl: 'https://www.flickr.com/photos/hercwad/3592097342/',
                sourceUrl: 'http://www.flickriver.com/photos/hercwad/3592097342/',
                credit: 'Chris (Flickr Handle LA Wad)'
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
                sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=42379331',
                credit: 'George Garrigues, CC BY-SA 3.0',
            }),
            'Deutsche Bahn Bordbistro': Map({
                caption: "Germany's Deutsche Bahn serves food and drinks on intercity high-speed and regional trains",
                sourceImageUrl: 'http://www.spiegel.de/#ref=gallery-last-image',
                sourceUrl: 'http://www.spiegel.de/fotostrecke/bahn-millionen-investition-fuer-kaffeetrinker-fotostrecke-56176-3.html',
                credit: 'Der Spiegel'
            })
        })
    }),

    'Smoothness and Comfort of Travel': Map({
        status: Statuses.INITIALIZED,
        id: '419df1d2-949f-4e60-adbc-59da24a5c6ce',
        anchorId: 'id.2y8fqiblaq2h',
        scenes: OrderedMap({ entries: Map({
            'All Transit': Map({
            }),
            'Fixed Guideway': Map({
            }),
            'Not Fixed Guideway': Map({
            }),
        })}),
        media: OrderedMap({
            'St Charles Streetcar': Map({
                caption: "The venerable New Orleans Saint Charles Streetcar saunters along tree and grass-lined tracks",
                sourceImageUrl: 'http://i0.wp.com/gonola.com/images/Saint-Charles-streetcar.jpg?w=510',
                sourceUrl: 'http://gonola.com/2012/12/11/make-a-day-of-riding-the-saint-charles-streetcar.html',
                credit: 'Hotels.com'
            }),
            'Ghent Trams and Public Life': Map({
                caption: "Trams in Ghent, Belgium predictably slide through public space on fixed guideways",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'July 2016'
            }),
            'Bordeaux Tramway': Map({
                caption: "Trams in Bordeaux, France are powered by a safe, inductive power source between the tracks, eliminating overhead wires downtown",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'July, 2010'
            }),
            'Bordeaux Tramway Tracks': Map({
                caption: "The inductive power source for trams in Bordeaux, France is likely the future wireless option for many trams and some buses, if not on-board batteries",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'July, 2010'
            }),
            'Nantes Busway': Map({
                caption: "Bus Rapid Transit Service in Nantes, France with dedicated right-of-way, but not fixed guideway",
                sourceImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Flickr_-_IngolfBLN_-_Nantes_-_Busway_-_Ligne_4_-_Duchesse_Anne_-_Ch%C3%A2teau_des_Ducs_de_Bretagne_%281%29.jpg/1920px-Flickr_-_IngolfBLN_-_Nantes_-_Busway_-_Ligne_4_-_Duchesse_Anne_-_Ch%C3%A2teau_des_Ducs_de_Bretagne_%281%29.jpg',
                sourceUrl: 'https://en.wikipedia.org/wiki/Nantes_Busway',
                credit: 'IngolfBLN'
            }),
            'Los Angeles Orange Line BRT': Map({
                type: 'png',
                caption: "BRT busline built upon Southern Pacific Railroad's former Burbank Branch Line. This uncomfortable, overcrowded bus will now be upgraded to light rail",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'December 2012'
            }),
            'Bus Rapid Transit': Map({
                caption: "BRT in Cambridge, England that attempts to imitate the aesthetics of a modern tram. A tram track would be safer in this pedestrian environment",
                sourceImageUrl: 'http://www.buszone.co.uk/Streetcar%5E061005_02.jpg',
                sourceUrl: 'http://www.skyscrapercity.com/showthread.php?t=1155659&page=2',
                credit: 'Thefancydanhimself, user/SkyscraperCity.com',
            }),
            'O Bahn Busway': Map({
                caption: "A rare fixed-guideway bus in Adelaide, South Australia, which also functions off-track in the suburbs",
                sourceImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Bus_track.jpg?download',
                sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Bus_track.jpg',
                credit: 'Beneaththelandslide at English Wikipedia'
            }),
            'Montreal Metro': Map({
                caption: "New cars for Montreal's Metro, which is among the few that runs on rubber tires, resulting in a quiet, smooth underground ride",
                sourceImageUrl: 'https://shawglobalnews.files.wordpress.com/2014/04/metro-car-unveil-6.jpg?quality=70&strip=all&w=672&h=448&crop=1',
                sourceUrl: 'http://globalnews.ca/news/1296093/new-metro-trains-unveiled/',
                credit: 'Tim Sargeant/Global News'
            }),
            'Mi Teleferico': Map({
                caption: "Gondolas like this on in La Paz, Bolivia are an excellent fixed-guideway option for hills, mountains, and bodies of water",
                sourceImageUrl: 'http://i2.cdn.turner.com/cnnnext/dam/assets/150107162851-cable-cars-la-paz-gondola-exlarge-169.jpg',
                sourceUrl: 'http://www.cnn.com/2015/02/09/travel/worlds-most-amazing-cable-cars/',
                credit: 'CNN'
            }),
            'Funicular': Map({
                caption: "Feniculars like this classic one in Budapest, Hungary are also a viable fixed-guideway option for hills and mountains",
                sourceImageUrl: 'http://www.budapest.com/w/assignables/galleries/51/funicular_02.jpg',
                sourceUrl: 'http://www.budapest.com/city_guide/sights/monuments_of_art/buda_castle_funicular.en.html',
                credit: 'Budapest.com'
            })
        })
    }),

    'Types of Right-of-Way': Map({
        status: Statuses.INITIALIZED,
        id: '510744fa-42ef-452d-87af-2096ae064d40',
        anchorId: 'id.18woithqdgdg',
        scenes: OrderedMap({ entries: Map({
            'Class A ROW': Map({
            }),
            'Class B ROW': Map({
            }),
            'Class C ROW': Map({
            }),
        })}),
        media: OrderedMap({
            'Cologne': Map({
                caption: 'Practically all heavy-rail trains, like this high-speed train in Cologne, Germany, enjoy Class A ROW',
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'August 2014'
            }),
            'Swedish Rail': Map({
                caption: 'Active Class A tracks of the railway station in Skinnskatteberg, Sweden',
                sourceUrl: 'http://www.tribunetalk.com/wp-content/uploads/2014/12/Streetcar.jpg',
                credit: 'Rescape',
                date: 'July 2016'
            }),
            'Jack London Square AMTRAK': Map({
                caption: 'Even though this AMTRAK train in Oakland, California runs down the middle of the street, it has class A right-of-way with crossing gates at intersections',
                sourceImageUrl: 'http://www.redoveryellow.com/railroad/21761_jack_london_oakland.jpg',
                sourceUrl: 'http://www.redoveryellow.com/railroad/_page1.html',
                credit: 'Eric Haas, red over yellow dot com'
            }),
            'St Charles Streetcar': Map({
                caption: 'The iconic St Charles Streetcar of New Orleans travels part of its route on unimpeded Class B right-of-way. Other parts of the route are unfortunately in mixed traffic',
                sourceImageUrl: 'http://i0.wp.com/gonola.com/images/Saint-Charles-streetcar.jpg?w=510',
                sourceUrl: 'http://gonola.com/2012/12/11/make-a-day-of-riding-the-saint-charles-streetcar.html',
                credit: 'Hotels.com'
            }),
            'Portland Streetcar in Traffic': Map({
                caption: 'A streetcar investment in Portland, Oregon needlessly discomforts and inconveniences its users by putting the streetcar in mixed traffic (Class C ROW)',
                sourceImageUrl: 'http://image.oregonlive.com/home/olive-media/width960/img/oregonian/photo/2015/12/03/portland-streetcar-dcae5f69472d7f5e.jpg',
                sourceUrl: 'http://www.oregonlive.com/commuting/index.ssf/2015/12/portland_streetcar_to_try_limi.html',
                credit: 'Zach Schaner - Seattle Transit Blog',
                date: 'November 2015'
            }),
            'Madison BRT Profile': Map({
                caption: 'A planned BRT route in Madison, Wisconsin is already to be compromised by Class C right-of-way',
                sourceImageUrl: 'http://s3.amazonaws.com/stb-wp/wp-content/uploads/2015/11/10113329/Madison-BRT-Profile-01.png, http://bloximages.chicago2.vip.townnews.com/host.madison.com/content/tncms/assets/v3/editorial/7/c0/7c0fff53-3e68-5dd1-847f-4d7a8ea4953e/543306d6a2f32.image.jpg',
                sourceUrl: 'http://seattletransitblog.com/2015/11/11/madison-brt-creep/, http://host.madison.com/wsj/news/local/govt-and-politics/madison-poised-for-next-steps-to-bus-rapid-transit-system/article_2c526b02-0100-51fd-92e7-39bb330b943a.html',
                credit: 'Mike Chechvala - Wisconsin State Journal',
                date: 'December 2015'
            }),
            'St Charles Streetcar versus Car': Map({
                caption: 'A Saint Charles streetcar runs in Class B right-of-way besides a car. Downtown the streetcar must compete with the car in class C right-of-way',
                sourceImageUrl: 'http://s3.amazonaws.com/stb-wp/wp-content/uploads/2015/11/10113329/Madison-BRT-Profile-01.png',
                sourceUrl: '',
                credit: 'Unknown',
                date: 'December 2007'
            }),
        })
    }),

    'Frequency of Transit Stops': Map({
        status: Statuses.INITIALIZED,
        id: '9173b60e-b557-44bf-a736-2e352e4f7a86',
        anchorId: 'id.6d96nseqjwad',
        scenes: OrderedMap({ entries: Map({
            'Current Conditions': Map({
            }),
            'Removal of Minor Stops': Map({
            }),
            'Consolidation of Close Stops': Map({
            }),
            'Tram Upgrade': Map({
            }),
            'Consolidation Challenges': Map({
            }),
        })}),
        media: OrderedMap({
            'AC Transit': Map({
                type: 'png',
                caption: 'This local bus in Oakland, California, is littered with some 50 stops and dozens of stop signs and traffic lights on a 9 mile (14.5 km) line, meaning a stop every .2 miles (.3 km)',
                sourceUrl: 'https://sfbaytransit.org/actransit/route/11/map',
                credit: 'SF Bay Transit',
                date: 'As of September 2016'
            }),
            'Rapid Bus': Map({
                caption: 'This Rapid Bus in the Oakland, Calfornia region, despite running in mix traffic and other discomforts, wisely stops only every .5 miles (.8 km) on average',
                sourceImageUrl: 'http://i47.tinypic.com/flfzix.jpg',
                sourceUrl: 'https://cptdb.ca/topic/294-ac-transit/?page=2',
                credit: 'CPTDB Wiki Editor',
                date: 'June, 2010'
            }),
            'Deutsche Bahn': Map({
                caption: 'This 500 mile (800 km) high speed train trip in Germany from Munich to Hamburg has a reasonable eight intermediate stops in 5 1/2 hours',
                sourceUrl: 'https://www.bahn.com/, http://www.gamesareasocial.com/loja/222610/2/conteudo-adicional-dlc/DB-BR-Class-411-%C2%B4ICE-T%C2%B4-EMU-Add-On-detalhes',
                credit: 'Deutsche Bahn (schdule), Games Area (photo)',
                date: 'As of September 2016'
            }),
            'Third Street Muni': Map({
                caption: "Phase 1 of San Francisco's Third Street (T) Light Rail Line has 20 stops in 5 miles (8 km), all south of downtown. 10 stops would make nicer rides for all with .5 mile spacing instead of .2 to .3 miles",
                sourceImageUrl: 'http://mission.wpengine.netdna-cdn.com/wp-content/uploads/2010/04/muni-620x393.jpg',
                sourceUrl: 'http://missionlocal.org/2010/04/the-risks-of-riding-munis-third-street-line/',
                credit: 'Mission Local (Route list from Wikipedia)',
                date: 'April 2010'
            }),
            'A Train': Map({
                caption: "New York City's MTA A Line expresses by the stations of local lines on center tracks, creating a satisfying travel speed for longer trips",
                sourceImageUrl: 'http://cdn.newsday.com/polopoly_fs/1.12168711.1471269222!/httpImage/image.jpg_gen/derivatives/landscape_1280/image.jpg',
                sourceUrl: 'http://www.amny.com/transit/a-train-facts-figures-and-history-of-the-eighth-avenue-fulton-and-rockaway-lines-1.12168565',
                credit: 'AM New York',
                date: 'August 2016'
            }),
        })
    }),

    'Space and Seat Comfort (Metro and Tram)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.em6st57x7wbe',
        // Scenes aren't able to transition fast enough for this model, so everide the usual time
        scenes: OrderedMap({ entries: Map({
            'Empty Rows': Map({
            }),
            'Plush Seats': Map({
            }),
            'Occasional Wooden Seats': Map({
            }),
            'Classic Wooden Seats': Map({
            }),
            'Seat Height': Map({
            }),
            'Armrests and Recliners': Map({
            })
        })}),
        media: OrderedMap({
            'Munich Ubahn': Map({
                caption: "Munich's metro cars combine unpadded fabric row seats with wooden inward-facing seats",
                sourceImageUrl: 'https://i.ytimg.com/vi/zOLp6u7Se3Q/maxresdefault.jpg',
                sourceUrl: 'https://www.youtube.com/watch?v=zOLp6u7Se3Q',
                credit: 'You Tube',
            }),
            'BART': Map({
                caption: "The San Francisco Bay Area's BART and Washington DC's Metro cars are among few metro systems that feature padded seats",
                sourceImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Bart_C2_car_Interior.jpg',
                sourceUrl: 'https://en.wikipedia.org/wiki/Bay_Area_Rapid_Transit',
                credit: 'Wikipedia',
            }),
            'Moscow Metro Car': Map({
                caption: "Moscow's subway stations are famous for their architectural beauty. The cars offer padded seats and soft lighting",
                sourceImageUrl: 'http://www.architecture-online.org/wp-content/uploads/2013/04/Moscow_metro_car_from_inside.jpg',
                sourceUrl: 'http://www.architecture-online.org/2013/04/moscow-metro-subway/',
                credit: 'Architecture Online by user Ada',
                date: 'April 2013'
            }),
            'Edinburgh Tram': Map({
                caption: "Edinburgh's trams feature padded seats with high seatbacks. There is no reason to deny passengers such niceties",
                sourceImageUrl: 'http://upload.wikimedia.org/wikipedia/commons/2/2b/Interior_of_Edinburgh_Tram_-_geograph.org.uk_-_1175899.jpg',
                sourceUrl: 'http://www.skyscrapercity.com/showthread.php?t=672554&page=153',
                credit: 'OneMelbGuy, user of SkyscraperCity.com',
            }),
            'Montpelier Tram': Map({
                caption: "Long trams like these in Montpelier, France increase the chance of plenty of open seats, which is always a good thing",
                sourceImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Montpellier_-_Tram_3_-_Details_%287716485224%29.jpg/1600px-Montpellier_-_Tram_3_-_Details_%287716485224%29.jpg',
                sourceUrl: 'https://commons.wikimedia.org/wiki/File:Montpellier_-_Tram_3_-_Details_(7716485224).jpg',
                credit: 'Wikimedia Commons',
            }),
            'St Charles Wooden Seats': Map({
                caption: 'The wooden benches on the New Orleans Saint Charles streetcar are reversible to match the direction of travel',
                sourceImageUrl: 'https://i.ytimg.com/vi/zOLp6u7Se3Q/maxresdefault.jpg',
                sourceUrl: 'https://www.youtube.com/watch?v=zOLp6u7Se3Q',
                credit: 'Go NOLA',
                date: 'May 2013'
            }),
        })
    }),

    'Space and Seat Comfort (AMTRAK and Bus)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.em6st57x7wbe',
        id: '843cbe82-5a4a-4453-9766-488049133e9d',
        scenes: OrderedMap({ entries: Map({
            'Forward-facing Seats on AMTRAK': Map({
            }),
            "AMTRAK's Sightseeing Seats": Map({
            }),
            'Low-floor buses have rear-facing seats': Map({
            }),
        })}),
        media: OrderedMap({
            'AMTRAK Sightseer Lounge': Map({
                type: 'jpg',
                caption: "AMTRAK's Sightseer Lounge Car offers a social and scenic passtime for coach and sleeper car passengers",
                sourceImageUrl: 'http://i2.photobucket.com/albums/y34/Nolaguy79/IMG_0998.jpg',
                sourceUrl: 'http://www.airliners.net/forum/viewtopic.php?t=959419',
                credit: 'Airliners.net by user MSYtristar'
            }),
            'Brightline Interior': Map({
                caption: 'Brightline, a company building now rail service in Florida (All Aboard Florida) has designed train cars with "intuitive interiors"',
                sourceImageUrl: 'http://m.allaboardflorida.com/images/bl/Press-Release-Images/brightline_interiors_press-release.jpg?sfvrsn=4',
                sourceUrl: 'http://m.allaboardflorida.com/press/press-releases/2016/06/10/brightline-reveals-innovative-trains-under-construction',
                credit: 'Brightline',
            }),
            'TGV Océane': Map({
                type: 'jpg',
                caption: "France's SNCF's new TGV Océane high-speed-rail cars are designed for working and relaxing",
                sourceUrl: "http://www.europeanrailwayreview.com/29822/rail-industry-news/tgv-oceane-interior/",
                imageUrl: "http://d1p2xdir0176pq.cloudfront.net/wp-content/uploads/TGV-Oc%C3%A9ane-3.jpg",
                credit: 'Katie Sadler, European Railway Review',
                date: 'September 2016'
            }),
            'Switzerland Bus Comfort': Map({
                caption: "This Swiss bus in the Alps in the nicest local bus I have ever been in, the only local bus I've experienced that focuses on comfort and shows off the scenery",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'July 2016'
            }),
            'Sound Transit': Map({
                type: 'jpg',
                caption: "Sound Transit's express buses serving the Seattle region manage to have plush seats with armrests that recline",
                sourceImageUrl: 'https://c1.staticflickr.com/9/8768/17134452856_eab76d6f0b_b.jpg',
                sourceUrl: 'https://www.flickr.com/photos/zheistand/17134452856',
                credit: 'Zack Heistand'
            })
        })
    }),

    'Personal Space and Privacy': Map({
        status: Statuses.INITIALIZED,
        id: '268c95fd-8a33-4636-bf72-ceaff2c1e997',
        anchorId: 'id.n0mwt01mtot1',
        scenes: OrderedMap({ entries: Map({
            'Train Compartment': Map({
            }),
            'AMTRAK Roomettes': Map({
            }),
            'AMTRAK Bedrooms': Map({
            }),
            'Private Metro Compartments': Map({
            }),
        })}),
        media: OrderedMap({
            'ICE_First_Class_Compartment': Map({
                caption: "A first class compartment in Deutsche Bahn's Intercity Express (ICE) between Amsterdam and Berlin",
                sourceImageUrl: 'http://www.vagonweb.cz/fotogalerie/foto/201003/IMGP8329.jpg',
                sourceUrl: 'http://www.railforums.co.uk/showthread.php?t=52925',
                credit: 'vagonWEB'
            }),
            'Eurostar_First_Class': Map({
                caption: "Friends crowd into a first class compartment on Eurostar between Naples and Florence",
                sourceImageUrl: 'http://www.adventurouskate.com/wp-content/uploads/2010/04/004_21A-1024x679.jpg',
                sourceUrl: 'http://www.adventurouskate.com/travelers-night-in-the-best-of-europe/',
                credit: 'Eurail.com'
            }),
            'First_Class_Denmark': Map({
                caption: "This first-class compartment in Denver is spacious and functional",
                sourceImageUrl: 'http://blog.eurail.com/wp-content/uploads/2014/08/2-1st-class-compartment-on-a-train-in-Denmark.jpg',
                sourceUrl: 'http://blog.eurail.com/essential-guide-first-class-vs-second-class-eurail-passes/',
                credit: 'Kate McCulley'
            }),
            'Women_In_3_Bed_Compartment': Map({
                caption: "A 3-bed compartment on Deutsche Bahn's City Night Line (CNL). Overnight trains in Europe have been declining; hopefully they will rebound",
                sourceImageUrl: 'http://www.eurail.com/sites/eurail.com/files/styles/asset_image_images_slider_big/public/girls_in_3_bed_compartment_of_citynightline.jpg?itok=kYrbL3RR',
                sourceUrl: 'http://www.eurail.com/europe-by-train/night-trains/city-night-line',
                credit: 'Eurrail.com'
            }),
            'AMTRAK_3_Bed_Compartment': Map({
                caption: "AMTRAK's Bedroom offers space for 3 and a sink",
                sourceImageUrl: 'http://cal.streetsblog.org/wp-content/uploads/sites/13/2015/10/SleepingCompartmentOnAmtrak-AdjustingExistingSchedulesCouldProvideOvernightServiceFromLAtoTheBayArea.jpg',
                sourceUrl: 'http://cal.streetsblog.org/2015/10/14/dreaming-of-the-night-train-sleeping-from-la-to-the-bay-area/',
                credit: 'Roger Rudick, Streetsblog California',
                date: 'October 2015'
            }),
            'AMTRAK_Roomette': Map({
                type: 'png',
                caption: "Though charmingly dated in appearance, AMTRAK roomettes provide two comfortable seats in a private compartment that convert to beds",
                sourceImageUrl: 'http://trainweb.org/carl/LATrainDay2011/640/IMG_5267.jpg',
                sourceUrl: 'http://discuss.amtraktrains.com/index.php?/topic/58967-is-first-class-worth-it/page-2',
                credit: 'User SarahZ on Amtrak Unlimited',
                date: 'October 2015'
            }),
            'Family Section': Map({
                type: 'png',
                caption: "Deutsche Bahn designates cabin space to families on it's inter-city trains, creating tender interactions between strangers",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'August 2016'
            })
        }),

    }),

    'Access to Amenities': Map({
        status: Statuses.INITIALIZED,
        id: '6d32b9a2-8ef9-4b3f-8065-00d08ee87c05',
        anchorId: 'id.c784pbnlt1sa',
        scenes: OrderedMap({ entries: Map({
            'AMTRAK Toilet': Map({
            }),
            'Metro Toilet': Map({
            }),
            'Tram Toilet': Map({
            }),
            'Metro Café': Map({
            }),
            'Tram Café': Map({
            })
        })}),
        media: OrderedMap({
            'AMTRAK Toilet': Map({
                caption: "AMTRAK has handicap accessible toilets on all trains",
                sourceImageUrl: 'https://farm1.staticflickr.com/83/248892234_a52b84005c_o_d.jpg, https://www.flickr.com/photos/sgroi/248892234',
                sourceUrl: 'http://www.trainsandtravel.com/a-preview-look-at-amtraks-new-viewliner-sleeping-cars/',
                credit: 'Jim Loomis, Trains & Travel',
            }),
            'Tramtrain': Map({
                caption: "Karlsruhe, Germany's innovated tramtrain, which runs both on city tram track and regional rails, offers toilets onboard",
                sourceImageUrl: 'http://www.karlsruhe-tourismus.de/var/ka/storage/images/media/bilder/gruppenangebote/tramstadt_01/6905-1-ger-DE/tramstadt_01_front_colorbox.jpg',
                sourceUrl: 'http://www.karlsruhe-tourismus.de/en/book/special-interest/the-tramtrain-system',
                credit: 'Karlsruhe Tourismus',
            }),
            'Parlour Car': Map({
                caption: "Strangers and friends mingle for meals and sightseeing on AMTRAK's Coast Starlight first class Parlour Car",
                sourceImageUrl: 'http://1.bp.blogspot.com/-Gtaa0F0Di0w/VB51swNMg_I/AAAAAAAAH7w/pNTWbutCzDQ/s1600/Parlour%2BCar.JPG',
                sourceUrl: 'http://www.trainsandtravel.com/there-really-is-something-were-doing-better-than-the-europeans-overnight-trains/',
                credit: 'Jim Loomis, Trains & Travel'
            }),
            'Parlour Car Tasting': Map({
                caption: "Wine tasting in AMTRAK's Coast Starlight first class Parlour Car",
                sourceImageUrl: 'http://cdn.akamai.steamstatic.com/steam/apps/222610/ss_0b93f50e5ecabbb4dde32756405bba6ccb93f8d9.jpg, http://cdn.akamai.steamstatic.com/steam/apps/',
                sourceUrl: 'http://www.trainsandtravel.com/getting-a-taste-of-the-parlour-car/',
                credit: 'Jim Loomis, Trains & Travel'
            }),
            'Munich Tram Helpful Digital Station List': Map({
                caption: "This first-class compartment in Denver is spacious and functional",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape'
            }),

        })
    }),

    'Expectation of Good Behavior (Poor)': Map({
        status: Statuses.INITIALIZED,
        id: '605a8f98-af02-4b26-8145-cfe247f91dba',
        anchorId: 'id.97xvu0r03y0e',
        scenes: OrderedMap({entries: Map({
            'Metro Entrance with Faregates': Map({
            }),
            'Barriers Waste Time and Space': Map({
            }),
            'Amenities Must Be Inside or Outside Faregates': Map({
            }),
            'Accessing Transit is Cumbersome': Map({
            }),
        })}),
        media: OrderedMap({
            'BART Powell St Station': Map({
                caption: "Faregates needlessly delay passengers existing BART's Powell St Station in San Francisco",
                sourceImageUrl: 'http://subwaynut.com/california/bart/powell/powell39.jpg',
                sourceUrl: 'http://subwaynut.com/california/bart/powell/p2.php',
                credit: 'Jeremiah Cox/SubwayNut.com',
                date: '2014'
            }),
            'BART Clipper Card': Map({
                caption: "RFID Cards, like the Clipper Card of the San Francisco Bay Area, could be tapped without requiring faregates",
                sourceImageUrl: 'http://farm6.staticflickr.com/5258/5505480382_fb3fec7082_b.jpg',
                sourceUrl: 'http://www.akit.org/2012_10_01_archive.html',
                credit: 'Akit',
            }),
            'Los Angeles Tapreader': Map({
                type: 'png',
                caption: "Los Angeles Metro installed faregates in its subways but not above ground in 2009 to prevent fare evasion",
                sourceImageUrl: 'https://www.transit.wiki/File:Tapreader.jpg',
                sourceUrl: 'https://www.transit.wiki/Los_Angeles_Metro_ticket_machine',
                credit: 'Transit Wiki',
            }),
            'BART Police': Map({
                caption: "Presence of officials on the San Francisco Bay Area's BART is relatively rare and for stark cases rather than frequent, friendly supervision",
                sourceImageUrl: 'https://p931z2nb6eo1jytzj2ufrzyoiz-wpengine.netdna-ssl.com/news/wp-content/uploads/sites/10/2014/12/RS13482_3301483-qut.jpg',
                sourceUrl: 'https://ww2.kqed.org/news/2016/07/18/bart-still-hasnt-installed-surveillance-cameras/',
                credit: 'Justin Sullivan/Getty Images',
            }),
        })
    }),

    'Expectation of Good Behavior (Improved)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.97xvu0r03y0e',
        id: '1ed98a7a-99ec-4bb7-9fb1-41df8361c2ce',
        scenes: OrderedMap({entries: Map({
            'Validators Replace Faregates and Barriers': Map({
            }),
            'Quicker Access to Amenities': Map({
            }),
            'Improved Movement Througout Station': Map({
            }),
            'Fast Fare Inspection': Map({
            }),
            'Quicker Access without Barriers and Perhaps No Mezzanine Level': Map({
            }),
        })}),
        media: OrderedMap({
            'Munich U-Bahn Inspection': Map({
                caption: "On board ticket inspection on the Munich Ü-Bahn (metro system)",
                sourceImageUrl: 'http://polpix.sueddeutsche.com/bild/1.997485.1356593680/900x600/ein-kontrolleur-muenchner-verkehrsgesellschaft-mvg-muenchner-ubahn.jpg',
                sourceUrl: 'http://www.sueddeutsche.de/muenchen/muenchner-tatsachen-verruchte-boazn-und-eine-geheimmission-1.1142794-5',
                credit: 'Süddeutsche Zeitung',
            }),
            'Cologne U-Bahn Inspection': Map({
                caption: "Platform ticket inspection on the Cologn Ü-Bahn (metro system)",
                sourceImageUrl: 'http://blog.kvb-koeln.de/wp-content/uploads/2016/03/Header_Standkontrolle.jpg',
                sourceUrl: 'http://blog.kvb-koeln.de/grosseinsatz-am-westbahnhof-schwerpunktkontrolle-in-der-u-bahn',
                credit: 'Susanne Zeidler-Goll/Menschen bewegen',
            }),
            'Oystercard Readers': Map({
                caption: "Card-readers like those for London's Oystercard could be used without faregates in metro systems",
                sourceImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Oystercard_readers.jpg',
                sourceUrl: 'http://www.wikiwand.com/en/Oyster_card',
                credit: 'Wikiwand',
            }),
            'Portland Fare Inspection': Map({
                caption: "The presence of officials checking fares and enforcing behavior is relatively frequent on Portland, Oregon's MAX Light Rail",
                sourceImageUrl: 'https://maxfaqs.files.wordpress.com/2012/02/fareinspectorsupervisor.jpg',
                sourceUrl: 'https://maxfaqs.wordpress.com/tag/fare-evasion/',
                credit: 'The Oregonian',
            }),
            'Berlin Smart Phone Inspection': Map({
                caption: "Tickets purchased online are quickly inspected on Berlin's S-Bahn, and through Germany on Deutsche Bahn trains",
                sourceImageUrl: 'http://www.it-zoom.de/fileadmin/_processed_/csm_moba-sbahn_berlin-scanner_casio_192e0f5ea4.jpg',
                sourceUrl: 'http://www.it-zoom.de/mobile-business/e/mobile-ticketkontrolle-9524/',
                credit: 'Bianca Brandis/IT-Zoom',
            }),
            'AMTRAK Smart Phone Inspection': Map({
                caption: "Tickets purchased online are quickly inspected on all AMTRAK trains. Metro systems should do spot checks instead of faregates",
                sourceImageUrl: 'http://www.railway-technology.com/uploads/newsarticle/734904/images/149435/large/eticket%20smartphone%20l.jpg',
                sourceUrl: 'http://www.railway-technology.com/features/featureamtrak-eticketing-ereader-rail-tickets-us/featureamtrak-eticketing-ereader-rail-tickets-us-1.html',
                credit: 'railway-technology.com',
            }),
        })
    }),

    'Personal Transportation and Freight (AMTRAK)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.phqdf6isq3v4',
        id: '659a315f-97b4-4a9c-8a29-4ca5f6e8cbac',
        scenes: OrderedMap({entries: Map({
            'Initial': Map({
            }),
            'Personal Bike Storage on Regional Trains': Map({
            }),
        })}),
        media: OrderedMap({
            'Bikes on AMTRAK': Map({
                caption: "Long distance AMTRAK trains had poor bike service, forcing bikes into boxes. New trains will have racks but still sadly only allow access at staffed stations.",
                sourceImageUrl: 'http://cs.trains.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-00-11-12-Malcolm+Kenton/2311.amtrakbikeboxes.jpg',
                sourceUrl: 'http://cs.trains.com/trn/b/observation-tower/archive/2015/04/02/the-greatest-advantage-of-amtrak-39-s-new-baggage-cars-bike-racks.aspx',
                credit: 'Malcolm Kenton/Observation Tower',
                date: 'April 2015'
            }),
            'Bikes on Capitol Corridor': Map({
                caption: "Bike storage is plentiful, safe, and simple on AMTRAK's Capitol Corridor in Northern California",
                sourceImageUrl: 'http://www.capitolcorridor.org/blogs/get_on_board/wp-content/uploads/2015/05/akf_0769a.jpg',
                sourceUrl: 'http://www.capitolcorridor.org/blogs/get_on_board/rider-tip-taking-your-bike-on-the-train-for-the-first-time/',
                credit: 'Capitol Corridor',
            }),
            'Bikes on Deutsche Bahn': Map({
                caption: "Some train system's in Europe, like Germany's Deutsche Bahn, charge a small fee per bike",
                sourceImageUrl: 'http://radreise-wiki.de/Datei:Fahrradabteil.jpg',
                sourceUrl: 'http://radreise-wiki.de/Transport_im_Zug',
                credit: 'radreise-wiki.de',
            }),
            'AMTRAK Retractable Platforms': Map({
                caption: "Although many North American train station platforms outdated and not level with train floors, retractable platforms can help disabled passengers on modern platforms",
                sourceImageUrl: 'http://www.crainsdetroit.com/article/20150728/news01/150729870/amtrak-testing-retractable-platform-at-ann-arbor-train-station',
                sourceUrl: 'http://www.crainsdetroit.com/article/20150728/news01/150729870/amtrak-testing-retractable-platform-at-ann-arbor-train-station',
                credit: 'Chuck Gomez/AMTRAK',
            }),
        })
    }),

    'Personal Transportation and Freight (Metro)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.phqdf6isq3v4',
        id: '04163027-d8a3-4912-9997-0f30573fd0fc',
        scenes: OrderedMap({entries: Map({
            'Space for personal mobility, freight, and strollers': Map({
            }),
            'A hundred bikes fit on a long metro': Map({
            }),
        })}),
        media: OrderedMap({
            'Bikes on BART': Map({
                caption: "Metro trains have room for up to a hundred bikes. New cars of the Bay Area's BART system will have racks",
                sourceImageUrl: 'http://www.bart.gov/sites/default/files/images/basic_page/bike_rack_0.jpg',
                sourceUrl: 'http://www.bart.gov/about/projects/cars/new-features',
                credit: 'Bay Area Rapid Transit',
            }),
            'Wheelchairs on BART': Map({
                caption: "Wheelchairs can easily board most metro systems, like the Bay Area's BART system, as long as elevators exist and work",
                sourceImageUrl: 'https://i.ytimg.com/vi/nlPELKb1KFU/hqdefault.jpg',
                sourceUrl: 'http://www.bart.gov/guide/accessibility/mobility',
                credit: 'Bay Area Rapid Transit',
            }),
            'Luggage on BART': Map({
                caption: "Transporting luggage on metro, like the Bay Area's BART system, is relatively painless if systems eliminate normal crowding on trains",
                sourceImageUrl: 'http://f.tqn.com/y/gocalifornia/1/S/5/Z/3/P1010642-a.jpg',
                sourceUrl: 'http://gocalifornia.about.com/od/casfmenu/ss/Bart-Train-SFO-to-San-Francisco.htm',
                credit: 'Betsy Malloy/About Travel',
            }),
        })
    }),

    'Personal Transportation and Freight (Tram)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.phqdf6isq3v4',
        id: 'f04baa96-4c29-43ab-9f51-c8520c907d25',
        scenes: OrderedMap({entries: Map({
            'Long trams have plentiful bike storage': Map({
            }),
            'Trams have flush, level boarding': Map({
            }),
        })}),
        media: OrderedMap({
            "Bikes on Bordeaux's Trams": Map({
                caption: "Bikes load easily on modern trams, which are long enough to have plentiful space for them",
                sourceImageUrl: 'http://sedeplacer.bordeaux-metropole.fr/var/bdxmetro/storage/images/media/images/se-deplacer/velo/intermodalite-velo-tramway/93952-1-fre-FR/Intermodalite-Velo-Tramway.jpg',
                sourceUrl: 'http://sedeplacer.bordeaux-metropole.fr/Velo/Intermodalite',
                credit: 'Bordeaux Métropole',
            }),
            "Bikes on Portland's MAX Light Rail": Map({
                caption: "Modern trams, such as Portland's MAX Light Rail have dedicated space for bikes",
                sourceImageUrl: 'http://bikeportland.org/wp-content/uploads/2015/03/max-jimpics-6.jpg',
                sourceUrl: 'http://bikeportland.org/2015/04/01/sneak-peek-inside-trimets-new-max-trains-136400',
                credit: 'Jim “K’Tesh” Parsons/Bike Portland',
            }),
            "Wheelchairs on Trams": Map({
                caption: "Long, modern trams can accommodate dozens of wheelchairs and provide seamless boarding with a platform or simply a sidewalk",
                sourceImageUrl: 'https://www.uestra.de/fileadmin/_processed_/csm_barrierefrei_tw6000_web_4d199a78aa.jpg',
                sourceUrl: 'https://www.uestra.de/kundenservice/barrierefreie-uestra/barrierefreiheit-in-der-stadtbahn/',
                credit: 'üstra',
            }),
        })
    }),

    'Personal Transportation and Freight (Bus)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.phqdf6isq3v4',
        id: 'eaaae7b6-5a68-4f3e-a9f0-21ba35ec73b7',
        scenes: OrderedMap({entries: Map({
            'External bike storage is limited and risky': Map({
            }),
            'Wheelchairs on buses': Map({
            }),
        })}),
        media: OrderedMap({
            'Bikes on AC Transit': Map({
                caption: "Transporting bikes on buses, as here on AC Transit in the San Francisco East Bay, is valuable but cumbersome, unreliable, and inefficient",
                sourceImageUrl: 'https://i.ytimg.com/vi/wGaUAyfQIQQ/maxresdefault.jpg',
                sourceUrl: 'https://www.youtube.com/watch?v=wGaUAyfQIQQ',
                credit: 'Ruth Miller',
            }),
            'Bus with Locked Bike Storage': Map({
                type: 'png',
                caption: "This local bus in the French Alps wastes precious space with locked bike storage, forcing passengers to cram",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape',
                date: 'July 2016'
            }),
            'BRT Stroller': Map({
                caption: "Boarding and alighting strollers from bus rapid transit (BRT) is cumbersome. BRT is supposed to have retractable level platforms but almost never does",
                sourceImageUrl: 'http://www.lightrailnow.org/images02/la-bus-brt-orangeline-pax-stroller-deboarding-n-hollywood-80116-20060927brx2_D-Dobbs.jpg',
                sourceUrl: 'http://www.lightrailnow.org/facts/fa_brt_2006-10a-5.htm',
                credit: 'Dave Dobbs/Light Rail Now',
            }),
            'Level Boarding Bus': Map({
                caption: "This bus in the Nuremberg, Germany region has on level boarding for strollers, but needs a ramp for wheelchairs. Trams by contrast have a dozen for each",
                sourceImageUrl: 'https://www.vag.de/fileadmin/user_upload/01_headerbilder/05_service_und_mehr/service_rollstuhl_kinderwagen_03.jpg',
                sourceUrl: 'https://www.vag.de/service-mehr/mit-rollstuhl-und-kinderwagen.html',
                credit: 'VAG',
            }),
            'Wheelchairs on Buses': Map({
                caption: "Wheelchairs must be secured by the driver of the bus, like here in Edmonton, AB, and at most two can fit on typical buses",
                sourceImageUrl: 'https://www.edmonton.ca/transportation/Images/18121_430.jpg',
                sourceUrl: 'https://www.edmonton.ca/ets/accessible-vehicles.aspx',
                credit: 'Edmonton Transit System',
            }),
            'Boston Silver Line': Map({
                caption: "Boston's disastrous Silver Line BRT is a terrible fit for airport service. Passengers must lug suitcases up steps and store them on crowded racks",
                sourceImageUrl: 'https://www.edmonton.ca/transportation/Images/18121_430.jpg',
                sourceUrl: 'https://c.o0bg.com/rf/image_960w/Boston/2011-2020/2012/06/04/BostonGlobe.com/Metro/Images/05silver_photo2.jpg',
                credit: 'www.bostonglobe.com',
            }),
        })
    }),

    'Station and Stop Amenities (Inside)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.hcrfkm926ytq',
        id: '731899d7-02b7-4f47-9a3b-7ae84454e0c7',
        scenes: OrderedMap({entries: Map({
            'Lobby': Map({
            }),
            'New Station Amenities': Map({
            }),
        })}),
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
            'Copenhagen Central Station Amenities on the Platform': Map({
                caption: "Food is available right on the platform at Copenhagen's Central Station",
                sourceUrl: 'http://rescapes.net',
                credit: 'Rescape'
            }),
        })
    }),

    'Station and Stop Amenities (Outside Poor)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.hcrfkm926ytq',
        id: '87320bcf-05d7-4df9-8e51-f5c1e8ed82d1',
        scenes: OrderedMap({entries: Map({
            'Amenity-Poor Transit Center': Map({
            }),
        })})
    }),

    'Station and Stop Amenities (Outside Improved)': Map({
        status: Statuses.INITIALIZED,
        anchorId: 'id.hcrfkm926ytq',
        id: 'e2157bf5-de7d-413f-b80d-ec9ffc095a13',
        scenes: OrderedMap({entries: Map({
            'Improved Transit Center': Map({
            }),
            'Transit Center Amenities': Map({
            }),
        })})
    }),
});

/***
 * The initial state of the application
 * @type {*|Map<K, V>|Map<string, V>}
 */
export default Map({
    // See settings.js action. All action keys can be set here
    settings: Map({
        [settingsActions.SET_3D]: false,
        [settingsActions.SET_RELATED_IMAGES]: true,
        [settingsActions.SET_LIGHTBOX_VISIBILITY]: false
    }),
    documents: Map({
        keys: List(['about', 'contact', 'ths_amtrak_standard', 'the_new_rules_of_the_road']),
        // The URL of the source document
        baseUrl: id => (`https://docs.google.com/document/d/${id}/pub`),
        // The URL of the site
        siteUrl: key => (`http://rescapes.net/${key}`),
        entries: Map({
            'about': Map({
                status: Statuses.INITIALIZED,
                title: 'About',
                isHeaderDocument: true,
                id: '1CRu-68GaWZcUxZkUf7RBAos39YrdYFYS8NEC07L5vQM',
                modelKeys: List()
            }),
            'contact': Map({
                status: Statuses.INITIALIZED,
                title: 'Contact',
                isHeaderDocument: true,
                id: '1X0zMTLoEaQ-mBmqrOOQR2ahmQSGaNNVa8unu0qz6u1w',
                modelKeys: List()
            }),
            'the_amtrak_standard': Map({
                date: new Date('October 2016'),
                author: 'Andy Likuski',
                status: Statuses.INITIALIZED,
                title: 'The AMTRAK Standard',
                id: '1GbrsFkL4hlMP9o-J1JLw4Qu08j6hEPde_ElJdanJX5U',
                modelKeys: List(amtrakStandardModels.keys())
            }),
            'the_new_rules_of_the_road': Map({
                date: new Date('January 2017'),
                author: 'Andy Likuski',
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
         * @param etp: 'im' for still images. Blank for 3d
         */
        baseUrl: (id, etp) => (`https://my.sketchup.com/viewer/3dw?WarehouseModelId=${id}`),
        baseVideoUrl: modelKey => `/videos/${modelKey}.webm`,

        entries: amtrakStandardModels
    })
})
