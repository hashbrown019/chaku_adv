
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore, storage, db
import tempfile, os
from flask import Flask, send_file, abort
from io import BytesIO
# Initialize the app with a service account certificate and database URL
#'databaseURL': 'https://ad-phone-call-app.firebasestorage.app/'
cred = credentials.Certificate('models/ad-phone-call-app-firebase-adminsdk-fbsvc-a67d9db4ec.json')
# Initialize the Firebase app
# firebase_admin.initialize_app(cred, {
#     "storageBucket": "ad-phone-call-app.firebasestorage.app"
# })
firebase_admin.initialize_app(cred, {
	"storageBucket": "ad-phone-call-app.firebasestorage.app"
})

# 
# Get a Firestore client
db = firestore.client()
print(" * Successfully connected to the Firestore database!")

bucket = storage.bucket()

def get_data_by_id(table,recordid,insert_id_on_record=False):
	stream_generator = db.collection(table).document(recordid)
	docs = stream_generator.stream()
	documents_dict = {doc.id: doc.to_dict() for doc in docs}
	return documents_dict

def get_data(table,insert_id_on_record=False):
	stream_generator = db.collection(table)
	docs = stream_generator.stream()
	documents_dict = {doc.id: doc.to_dict() for doc in docs}
	return documents_dict

def add_data(table,data):
	doc_ref = db.collection(table)
	doc_ref.add(data)
	return doc_ref

def edit_data(table,recordid,data):
	doc_ref = db.collection(table).document(recordid) # EDIT
	doc_ref.update(data)
	return doc_ref

def del_data(table,recordid):
	return db.collection(table).document(recordid).delete()

def upload_file(request,inputName,path="/"):
	if inputName not in request.files:
		return {"is_uploaded":False, "note": ['No file part', 400]}

	file = request.files[inputName]
	
	if file.filename == '':
		return {"is_uploaded":False, "note": ['No selected file', 400]}
		
	if file:
		destination_blob_name = f"{path}{file.filename}"
		blob = bucket.blob(destination_blob_name)
		blob.upload_from_file(file, content_type=file.content_type)
		return {"is_uploaded":True,"storagePath":destination_blob_name,"note":["success",200]}
	else:
		return {"is_uploaded":False, "note":["error in handling file",500]}

def download_file(filename):
	blob = bucket.blob(filename)
	dl_file_name = filename.split("/")[1]

	try:
		if not blob.exists():
			return "File not found", 404
		file_bytes = blob.download_as_bytes()
		file_io = BytesIO(file_bytes)
		return send_file(
			file_io,
			download_name=os.path.basename(filename), # Use the original filename
			as_attachment=False,
			# as_attachment=True,
			mimetype=blob.content_type if blob.content_type else 'application/octet-stream'
		)

	except Exception as e:
		return f"An error occurred: {e}", 500

		# return send_file(local_file_path, as_attachment=True, download_name=dl_file_name)

	
# print(add_data("users",{
# 		"createdAt":"",
# 		"displayName":"Jonah Does",
# 		"email":"jonahs@gmail.com",
# 		"role":"user",
# 		"username" : "jonah",
# 		"password" : "doe",
# 		"google_acc_id" : "",
# 		"status": 'blocked'
# 	}).id)
# print(get_data('users'))