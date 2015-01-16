package DDG::Spice::SeatGeek::EventsByArtist;
# ABSTRACT: Returns upcoming concerts for a band/artist

use DDG::Spice;

attribution github => ['https://github.com/MariagraziaAlastra','MariagraziaAlastra'];

spice to => 'http://api.seatgeek.com/2/events?performers.slug=$1&callback={{callback}}';
triggers any => "///***never_trigger***///";

handle remainder => sub {
    return $_ if $_;
    return;
};

1;
