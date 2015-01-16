package DDG::Spice::SeatGeek::EventsByCity;
# ABSTRACT: Returns upcoming concerts in a city

use DDG::Spice;

attribution github => ['https://github.com/MariagraziaAlastra','MariagraziaAlastra'];

spice to => 'http://api.seatgeek.com/2/events?taxonomies.name=concert&venue.city=$1&callback={{callback}}';
triggers any => "///***never_trigger***///";

handle remainder => sub {
    return $_ if $_;
    return;
};

1;
