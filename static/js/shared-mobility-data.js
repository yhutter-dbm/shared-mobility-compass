$("#stationsFromAddressAndRadiusButton").click(() => {
    $.get( "stations_from_address?address='8001'&radius=10", function( data ) {
        $( "#stationsFromAddressAndRadiusRequestResponse" ).html(JSON.stringify(data));
    });
});