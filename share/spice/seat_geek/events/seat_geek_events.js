(function(env) {
    "use strict";

    var basePath = "/js/spice/seat_geek";

    function get_clean_query() {
        return DDG.get_query()
            .replace(/((upcoming\s)?(concerts?))|(live(\s(shows?))?)/, '')
            .trim().toLowerCase();
    }

    function handle_api_result(api_result) {
        if(!api_result || api_result.error || api_result.events.length === 0) {
            return Spice.failed('seat_geek');
        }

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            clean_query = get_clean_query();

        Spice.add({
            id: "seat_geek",
            name: "Concerts",
            data: api_result.events,
            meta: {
                sourceName: "SeatGeek",
                sourceUrl: "https://seatgeek.com/search?search=" + clean_query,
                sourceIconUrl: "https://seatgeek.com/favicon.ico",
                itemType: "Upcoming Concerts"
            },
            normalize: function(item) {
                var artist = capitalizedAcronym(clean_query);

                // Capitalize the name of the band/artist searched for;
                // if the name is composed by multiple words, capitalize
                // all of them; if the name is too long, return the acronym

                function capitalizedAcronym(string) {
                    var splitted = string.split(" ");
                    if(string.length < 18) {
                        for(var i = 0; i < splitted.length; i++) {
                            splitted[i] = DDG.capitalize(splitted[i]);
                        }

                        return splitted.join(" ");
                    } else {
                        var acronym = '';
                        for(var i = 0; i < splitted.length; i++) {
                            var upper = splitted[i].substr(0, 1).toUpperCase() + '.';
                            acronym += upper;
                        }

                        return acronym;
                    }
                }

                function getDate(date) {
                    if(date) {
                        // IE 8 and Safari don't support the yyyy-mm-dd date format,
                        // but they support mm/dd/yyyy
                        date = date.replace(/T.*/, '');
                        var remix_date = date.split("-");
                        date = remix_date[1] + "/" + remix_date[2] + "/" + remix_date[0];

                        date = new Date(date);
                        return date;
                    }

                    return;
                }

                function getMonth(date) {
                    if(date) {
                        var month = months[parseInt(date.getMonth())];
                        return month.toUpperCase();
                    }

                    return;
                }

                function getDay(date) {
                    if(date) {
                        var day = date.getDate();
                        return day;
                    }

                    return;
                }

                // Get number of performers, excluding
                // the one searched for

                function getNumPerformers(performers) {
                    var how_many = 0;
                    var slug = clean_query.replace(/\s/g, "-");
                    for(var i = 0; i < performers.length; i++) {
                        if(performers[i].slug !== slug) {
                            how_many++;
                        }
                    }

                    if(how_many > 1) {
                        return how_many;
                    }

                    return;
                }

                function getPrice(lowest, highest) {
                    var price = "";

                    if(lowest && highest) {
                        price = "$" + lowest + "+";
                    }

                    return price;
                }

                return {
                    url: item.url,
                    price: getPrice(item.stats.lowest_price, item.stats.highest_price),
                    artist: artist,
                    num_performers: getNumPerformers(item.performers),
                    title: item.short_title,
                    place: item.venue.name,
                    img: item.performers[0].images.small,
                    city: item.venue.display_location,
                    month: getMonth(getDate(item.datetime_local)),
                    day: getDay(getDate(item.datetime_local))
                };
            },
            templates: {
                group: 'products',
                item: Spice.seat_geek_events.item,
                detail: false,
                item_detail: false,
                options: {
                    moreAt: true,
                    rating: false
                }
            }
        });
    }

    env.ddg_spice_seat_geek_events = function(api_result) {
        var clean_query = get_clean_query(),
            slug = clean_query.replace(/\s/g, "-");

        // prevent the spice from running with empty queries e.g. "live shows"
        if(clean_query.length === 0) {
            return Spice.failed('seat_geek');
        }

        // Prevent jQuery from appending "_={timestamp}" in our url when we use $.getScript.
        // If cache was set to false, it would be calling /js/spice/dictionary/definition/hello?_=12345
        // and that's something that we don't want.
        $.ajaxSetup({ cache: true });

        // check the remainder of the query...
        if(clean_query.indexOf("in ") === 0 && clean_query.length > 3) {
            // if it's something like "in {placename}", look at cities
            $.getScript(basePath + "/events_by_city/" + slug.replace("in-", ""));
        } else if(clean_query.indexOf("at ") === 0 && clean_query.length > 3) {
            // if it's something like "at {placename}", look at venues
            $.getScript(basePath + "/events_by_venue/" + slug.replace("at-", ""));
        } else {
            // else assume we mean an artist name
            $.getScript(basePath + "/events_by_artist/" + slug);
        }
    };

    // all event searches are handled the same way
    env.ddg_spice_seat_geek_events_by_artist = handle_api_result;
    env.ddg_spice_seat_geek_events_by_city = handle_api_result;
    env.ddg_spice_seat_geek_events_by_venue = handle_api_result;
}(this));
