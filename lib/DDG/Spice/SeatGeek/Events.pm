package DDG::Spice::SeatGeek::Events;
# ABSTRACT: Returns upcoming concerts for a band/artist.

use DDG::Spice;

primary_example_queries "live show weezer", "upcoming concerts in flames";
description "Upcoming concerts from SeatGeek";
name "SeatGeek Events";
code_url "https://github.com/duckduckgo/zeroclickinfo-spice/blob/master/lib/DDG/Spice/SeatGeek/Events.pm";
category "entertainment";
topics "entertainment", "music";
attribution github => ['https://github.com/MariagraziaAlastra','MariagraziaAlastra'];

triggers startend => 'upcoming concert', 'upcoming concerts', 'concert', 'concerts', 'live', 'live show', 'live shows';

spice call_type => 'self';

handle remainder => sub {
    return call if $_;
    return;
};

1;
