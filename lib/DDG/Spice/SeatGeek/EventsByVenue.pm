package DDG::Spice::SeatGeek::EventsByVenue;
# ABSTRACT: Returns upcoming concerts at a venue

use DDG::Spice;

attribution github => ['https://github.com/MariagraziaAlastra','MariagraziaAlastra'];

spice to => 'http://api.seatgeek.com/2/events?taxonomies.name=concert&venue.slug=$1&callback={{callback}}';
triggers any => "///***never_trigger***///";

handle remainder => sub {
    return $_ if $_;
    return;
};

1;
