# should be run in python 3
PYV=$(shell python -c "import sys;t='{v[0]}'.format(v=list(sys.version_info[:4]));sys.stdout.write(t)");
TEST=OFF
run: app.py
	@if [ "$(PYV)" = "3;" ]; then echo "" && echo "Python 3 is installed, running app" && python app.py; else echo "" && echo "This app requires Python 3 or greater to be installed. Please install Python 3.6.7 or greater at https://www.python.org/downloads/" && echo ""; fi

clean:
	rm */database.db
	rm -rf */__pycache__/
	rm */*.csv