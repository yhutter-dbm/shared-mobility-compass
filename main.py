from flask import Flask
from flask import render_template
import logging

# Setup application
app = Flask("Shared Mobility Compass")

# Debug flag for logging etc.
debug = False

# Only enable logger when not in debug mode...
app.logger.disabled = not debug

if debug:
    app.logger.setLevel(logging.DEBUG)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data')
def data():
    return render_template('data.html')


@app.route('/route')
def route():
    return render_template('route.html')


if __name__ == "__main__":
    app.run(debug=debug, port=5000)
