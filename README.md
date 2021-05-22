# Shared Mobility Compass
A useful web application which uses the Shared Mobility API.
The web application uses the [Flask Library](https://flask.palletsprojects.com/en/1.1.x/) for the Server side logic.

## Prerequisites
* Python Version >= 3.x installed
* Pip (Python Package Manager) installed

Then execute the following commands:
* `pip install flask`
* `pip install pandas`
* `pip install geopy`

**Note: Make sure that panda version is greater or equal to 1.0.3.**


## How to run
First we need to tell flask the directory which it should run as well as the environment this is done via the following commands:


**Mac and Linux**
```bash
export FLASK_APP=shared-mobility-compass
export FLASK_ENV=development
```

**Windows**
```bash
set FLASK_APP=shared-mobility-compass
set FLASK_ENV=development
```

After setting those environment variables flask can be simply started with

```bash
flask run
```

**Note that you do need to run this command outside the shared-mobility-compass (one level above it)**

## Map View
In this part of the Web Application the user can enter a location in the search field. Then all Shared Mobility providers in a certain radius (depending on the zoom level will be shown as markers.) Upon clicking on a marker a Popup with additional information will be shown:

![Map with Popup](/documentation/imgs/mapWithPopup.png)

Furthermore the user has the ability to filter the displayed markers by clicking on one or more vehicle types in the filter section and then clicking the **Apply Filter** Button.
If no results could be found or an error has occurred a notification will be shown:

![Notification](/documentation/imgs/notification.png)

## Data View
Here information about different Shared Mobility Providers will be visualized by charts. In order for this to work the user has to enter a location in the search field. Then all shared mobility providers within a radius of 10km will queried.

First there is the **Bar Chart**. Inside the Bar Chart we can see all Shared Mobility Providers grouped by their vehicle type.

![Bar Chart](/documentation/imgs/barChart.png)

Second there is the **Bubble Chart**. Inside the Bubble Chart we can see all Shared Mobility Providers grouped by their vehicle type. The radius of each Bubble is dependent on the vehicle types.

![Bubble Chart](/documentation/imgs/bubbleChart.png)