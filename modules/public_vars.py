# from views import login
# from views import home
# from controllers import api
# from controllers import apiV2
# from controllers import migrations

class public_vars:
	"""docstring for public_vars"""
	def __init__(self, flask_app):
		super(public_vars, self).__init__()
		self.flask_app = flask_app
		with self.flask_app.app_context():
			self.init()

	def init(self):
		print(" - Starting public_vars app_context")
		# apiV2.FARMER_PROFILE_LS = apiV2._main.list_all_profile___()
