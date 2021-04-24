$("#allStationInformationsButton").click(() => {
    $.get( "station_information", function( data ) {
        $( "#allStationInformationsRequestResponse" ).html(JSON.stringify(data));
    });
});

$("#stationInformationFromPostCodeButton").click(() => {
    $.get( "station_information?post_code=8866", function( data ) {
        $( "#stationInformationWithPostCodeRequestResponse" ).html(JSON.stringify(data));
    });
});