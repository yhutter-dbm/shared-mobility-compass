$("#stationsFromAddressAndRadiusButton").click(() => {
    $.get( "stations_from_address?address='8001'&radius=10", (response) =>  {
        $( "#stationsFromAddressAndRadiusRequestResponse" ).html(JSON.stringify(response));
    });
});