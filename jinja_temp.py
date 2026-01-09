from flask import render_template, render_template_string
from datetime import datetime, timedelta

class templates:
	"""docstring for ClassName"""
	def __init__(self, app):
		super(templates, self).__init__()
		self.app = app

	def format_timestamp(timestamp):
		now = datetime.now()
		time_difference = now - timestamp
		if time_difference.total_seconds() < 1:
			return "Just now"
		elif time_difference.total_seconds() == 1:
			return "1 second ago"
		elif time_difference.total_seconds() < 60:
			return f"{int(time_difference.total_seconds())} seconds ago"
		elif time_difference.total_seconds() == 60:
			return "1 minute ago"
		elif time_difference.total_seconds() < 3600:
			minutes_ago = int(time_difference.total_seconds() / 60)
			return f"{minutes_ago} minute{'s' if minutes_ago != 1 else ''} ago"
		elif time_difference.total_seconds() == 3600:
			return "1 hour ago"
		elif time_difference.total_seconds() < 86400:
			hours_ago = int(time_difference.total_seconds() / 3600)
			return f"{hours_ago} hour{'s' if hours_ago != 1 else ''} ago"
		else:
			return timestamp.strftime("%Y-%m-%d %H:%M:%S")

	def get_time_dif(yyyy_mm_dd_hh_mm_ss_1, yyyy_mm_dd_hh_mm_ss_2 ):
		yyyy_mm_dd_hh_mm_ss_1 = yyyy_mm_dd_hh_mm_ss_1.split(".")[0]
		yyyy_mm_dd_hh_mm_ss_2 = yyyy_mm_dd_hh_mm_ss_2.split(".")[0]
		# Define two datetime objects (later date subtracted by earlier date for a positive result)
		date1 = str(yyyy_mm_dd_hh_mm_ss_1).split(" ")
		time1 =	list(map(int,date1[1].split(":")))
		date1 = list(map(int, date1[0].split("-")))
		date1 = datetime(*date1,*time1)

		date2 = str(yyyy_mm_dd_hh_mm_ss_2).split(" ")
		time2 =	list(map(int,date2[1].split(":")))
		date2 = list(map(int, date2[0].split("-")))
		date2 = datetime(*date2,*time2)
	
		# Calculate the difference (results in a timedelta object)
		difference =  date2 - date1 
		# Get the total difference in hours
		# total_seconds() method is available in Python 2.7+
		hours_difference = difference.total_seconds() / 3600.0
		return difference

	def trancuate_text(text, lngth, elipse="...", word_tranc = "(truncated)"):
		if(len(str(text))-5 < lngth):
			return text
		return f"{str(text)[:lngth]}{elipse}{word_tranc}"

	def file_ext_type(file):
		_EXT = const.FILE_EXT[file.split(".")[-1].lower()][0]
		return _EXT

	def file_ext(file):
		_EXT = file.split(".")[-1].lower()
		return _EXT
		# ===========================================================================================================
		# ===========================================================================================================
		# ===========================================================================================================
		# ===========================================================================================================
		# ===========================================================================================================
	def add_jinja_temp(jinja_name, func):
		self.app.jinja_env.filters[jinja_name] = func

	def init(self):
		self.app.jinja_env.filters['format_timestamp'] = templates.format_timestamp
		self.app.jinja_env.filters['trancuate_text'] = templates.trancuate_text
		self.app.jinja_env.filters['file_ext_type'] = templates.file_ext_type
		self.app.jinja_env.filters['file_ext'] = templates.file_ext
		self.app.jinja_env.filters['get_time_dif'] = templates.get_time_dif
	# Register the custom filter on the Flask application\

	#
	# Plans 
	# 	- Hire a IT (2)
	# 	- Train It in to Months
	#	- Discuss Pending MIS task
	#	- Prepare 2 month Turnover Plan

	# Things to Turn-over
	# 	- Rapid Properties
	# 	- Credentials
	# 		- Server Key
	# 		- Server access
	# 		- Server Permission
	# 	- Source Code
	# 		- Github Repositories
	# 		- Database Credentials
	# 		- Code Documentation
	#

