# should be run in python 3
run: app.py
	python app.py

clean:
	rm */database.db
	rm -rf */__pycache__/
