from flask import send_file
import os
import platform
from io import BytesIO
import os, json


class obj_handling:
	def file_creation_date(path_to_file):
		"""
		Try to get the date that a file was created, falling back to when it was
		last modified if that isn't possible.
		See http://stackoverflow.com/a/39501288/1709587 for explanation.
		"""
		return os.path.getmtime(path_to_file)
		

	def obj_file_dl(dl_name,_OBJ_,mimetype ="text/plain"):
		buffer = BytesIO()
		buffer.write(bytes(json.dumps(_OBJ_),'utf-8'))
		buffer.seek(0)
		return send_file(
			buffer,
			# form_mig_excel.get_all_uploaded_excel_data_f_a(),
			as_attachment=True,
			mimetype ="text/plain",
			download_name=dl_name
		)

	def txt_file_dl(dl_name,_TXT_,mimetype ="text/plain"):
		buffer = BytesIO()
		buffer.write(bytes(_TXT_,'utf-8'))
		buffer.seek(0)
		return send_file(
			buffer,
			# form_mig_excel.get_all_uploaded_excel_data_f_a(),
			as_attachment=True,
			mimetype ="text/plain",
			download_name=dl_name
		)
