
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db # Import the db module
from firebase_admin import firestore

# Initialize the app with a service account certificate and database URL
#'databaseURL': 'https://ad-phone-call-app.firebasestorage.app/'
cred = credentials.Certificate('models/ad-phone-call-app-firebase-adminsdk-fbsvc-a67d9db4ec.json')
# Initialize the Firebase app
firebase_admin.initialize_app(cred)
# Get a Firestore client
db = firestore.client()
print(" * Successfully connected to the Firestore database!")


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