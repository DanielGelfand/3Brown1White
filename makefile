# should be run in python 3
PYV=$(shell python -c "import sys;t='{v[0]}'.format(v=list(sys.version_info[:4]));sys.stdout.write(t)");
run: app.py
ifeq ($(PYV), '3;') # doesn't work when flipped even though it should be flipped
		$(error Must be run in Python 3 or greater)
else
		@echo "Python 3 or greater is installed, running app"
endif
	@python app.py

clean:
	rm */database.db
	rm -rf */__pycache__/