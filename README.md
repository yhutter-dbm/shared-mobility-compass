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