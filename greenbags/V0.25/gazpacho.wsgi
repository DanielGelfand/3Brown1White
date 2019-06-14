#!/usr/bin/python3
import sys
sys.path.insert(0,"/var/www/gazpacho/")
sys.path.insert(0,"/var/www/gazpacho/gazpacho/")

import logging
logging.basicConfig(stream=sys.stderr)

from gazpacho.app import app as application
application.secret_key="3Brown1White"
