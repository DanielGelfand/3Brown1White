#!/usr/bin/python3
import sys
sys.path.insert(0,"/var/www/greenbags/")
sys.path.insert(0,"/var/www/greenbags/greenbags/")

import logging
logging.basicConfig(stream=sys.stderr)

from GreenBags import app as application
application.secret_key="3Brown1White"
