from werkzeug.utils import secure_filename
from datetime import date, datetime
import os, json
import rsa
import base64
import Configurations as c
from functools import wraps
from flask import session

class file_from_request:
	"""docstring for file_from_request"""
	def __init__(self,flaskapp):
		super(file_from_request, self).__init__()
		self.flaskapp = flaskapp

	def save_file_from_request(self,request,idfield,pathtosave="",raise_error=False,timestamp=False,custom_name=""):
		'''
			@params: request = flask request
			@params: idfield = id of the field

			
		'''
		file_arr_str = "";file_arr = [];files_count = 0;status ="unfinished";msg ="unfinished";
		try:
			files = request.files.getlist(idfield)
			for f in files:
				today = str(datetime.today()).replace("-","_").replace(" ","_").replace(":","_").replace(".","_")
				tms = "";UPLOAD_NAME = secure_filename(f.filename)
				if(timestamp):tms=today
				_SAVE_NAME_FILE = "{}_{}".format(tms,UPLOAD_NAME)
				if(custom_name!=""):
					_SAVE_NAME_FILE = custom_name
				f.save(os.path.join(pathtosave,_SAVE_NAME_FILE ))
				file_arr_str+= "||"+(_SAVE_NAME_FILE)
				file_arr.append(_SAVE_NAME_FILE)
			files_count = len(files)
			status ="success"
			msg ="File transfer succeed"
		except Exception as e:
			status ="error"
			msg ="{}".format(e)
			if(raise_error):raise e
		return {
			"status" : status,
			"msg" : msg,
			"file_arr_str" : file_arr_str[2:],
			"file_arr" : file_arr,
			"idfield" : idfield,
			"pathtosave" : pathtosave,
			"files_count": files_count
		}

	def _save_file_from_request(self,request,idfield,pathtosave="",raise_error=False,timestamp=False):
		file_arr_str = "";file_arr = [];files_count = 0;status ="unfinished";msg ="unfinished"
		try:
			files = request.files.getlist(idfield)
			for f in files:
				today = str(datetime.today()).replace("-","_").replace(" ","_").replace(":","_").replace(".","_")
				tms = "";UPLOAD_NAME = secure_filename(f.filename)
				if(timestamp):tms=today
				if(UPLOAD_NAME=="" or UPLOAD_NAME==" "): raise Exception("No File Found in Form")
				_SAVE_NAME_FILE = "{}_{}".format(tms,UPLOAD_NAME)
				f.save(os.path.join(pathtosave,_SAVE_NAME_FILE ))
				file_arr_str+= "||"+(_SAVE_NAME_FILE)
				file_arr.append(_SAVE_NAME_FILE)
			files_count = len(files)
			status ="success"
			msg ="File transfer succeed"
		except Exception as e:
			status ="error"
			msg ="{}".format(e)
			if(raise_error):raise e
		return {
			"status" : status,
			"msg" : msg,
			"file_arr_str" : file_arr_str[2:],
			"file_arr" : file_arr,
			"idfield" : idfield,
			"pathtosave" : pathtosave,
			"files_count": files_count
		}


class string_websafe:
	"""docstring for string_websafe"""
	def encode_websafe(strs):
		strs = str(strs)
		return strs.replace("!",'%21').replace('"','%22').replace("#",'%23').replace("$",'%24').replace("&",'%26').replace("'",'%27').replace("(",'%28').replace(")",'%29').replace("*",'%2A').replace("+",'%2B').replace(",",'%2C').replace("-",'%2D').replace(".",'%2E').replace("/",'%2F').replace(":",'%3A').replace(";",'%3B').replace("<",'%3C').replace("=",'%3D').replace(">",'%3E').replace("?",'%3F').replace("@",'%40').replace("[",'%5B').replace("\\",'%5C').replace("]",'%5D').replace("^",'%5E').replace("_",'%5F').replace("`",'%60').replace("{",'%7B').replace("|",'%7C').replace("}",'%7D').replace("~",'%7E')
	
	def decode_websafe(strs):
		strs = str(strs)
		return strs.replace('%21',"!").replace('%22','"').replace('%23',"#").replace('%24',"$").replace('%26',"&").replace('%27',"'").replace('%28',"(").replace('%29',")").replace('%2A',"*").replace('%2B',"+").replace('%2C',",").replace('%2D',"-").replace('%2E',".").replace('%2F',"/").replace('%3A',":").replace('%3B',";").replace('%3C',"<").replace('%3D',"=").replace('%3E',">").replace('%3F',"?").replace('%40',"@").replace('%5B',"[").replace('%5C',"\\").replace('%5D',"]").replace('%5E',"^").replace('%5F',"_").replace('%60',"`").replace('%7B',"{").replace('%7C',"|").replace('%7D',"}").replace('%7E',"~")

class rsa_sec:
	def generate_key(key_size = 512,key_name=str(datetime.today()).replace("-","_").replace(" ","_").replace(":","_").replace(".","_"),password='root'):
		public_key, private_key = rsa.newkeys(key_size)
		prv_readable = base64_sec.encr(key_name, private_key.save_pkcs1().decode().replace("\n","").replace("-----BEGIN RSA PRIVATE KEY-----","").replace("-----END RSA PRIVATE KEY-----",""))
		prv_raw = base64_sec.encr(key_name, str(private_key))

		KEY = {
			'privkey':{
				'readable' : "BORN",
				'raw' : "skkkrtttt"
				# 'readable' : prv_readable,
				# 'raw' : prv_raw
			},
			'pubkey':{
				'readable' : public_key.save_pkcs1().decode().replace("\n","").replace("-----BEGIN RSA PUBLIC KEY-----","").replace("-----END RSA PUBLIC KEY-----",""),
				'raw' : str(public_key),
			}
		}
		msg = "Unfinished"
		try:
			file_ =  open(c.RECORDS+ "../_system/__/" +key_name +".json","w")
			file_.write(json.dumps(KEY))
			file_.close()
			msg = "done saving keys"
		except Exception as e:
			msg = "Error: {}".format(e)
			raise e

		return {"msg":msg,"name":key_name,"file_path":c.RECORDS+ "../_system/__/" +key_name +".json","key_size":key_size}

	def view_keys(key_name,password):
		try:
			file_ =  open(c.RECORDS+ "../_system/__/" +key_name +".json","r")
			data = json.loads(file_.read())
			file_.close()
		except Exception as e:
			raise e
		return data

	def encrypt(pubkey,raw_data):
		return rsa.encrypt(data.encode(), pubkey)

	def decrypt(privkey,encrypted_data):
		return rsa.decrypt(encrypted_data, privkey).decode()

class base64_sec:
	def encr(keyword,str_to_enc):
		encoded = base64.b64encode(keyword.encode() + b":" + str_to_enc.encode())
		return encoded.decode("utf-8")


	def decr(keyword,encstr_to_decr):
		decoded = base64.b64decode(encstr_to_decr).decode()
		if decoded.startswith(keyword + ":"):
			dec_str = decoded[len(keyword) + 1:]
			return dec_str
		else:
			return "CONFIDENTIAL"

# ===============================================================================
# ===============================================================================
# ===============================================================================
# ===============================================================================
# ===============================================================================
# ===============================================================================
class authenication:
	"""docstring for file_from_request"""
	###### Declare first a global in config (c)
	###### from modules.Req_Brorn_util import authenication
	# _auth = authenication(FLASK.request,FLASK.redirect,FLASK.session,"USER_DATA","/login")
	# c.login_auth_web = _auth.login_auth_web

	def __init__(
			self, # SELF
			web_app_request_func, # 
			web_app_redirect_func, #
			session, #
			find_in_session, #
			url_if_not_found #
		):
		super(authenication, self).__init__()
		self.web_app_request_func = web_app_request_func
		self.web_app_redirect_func = web_app_redirect_func
		self.session = session
		self.find_in_session = find_in_session
		self.url_if_not_found = url_if_not_found

	def login_auth_web(self,arg_in_deco=None):
		def decorator_argument_holder(caller_func):
			@wraps(caller_func)
			def exec_caller_func(*arg1,**arg2):
				# print(caller_func)
				if(self.find_in_session not in self.session):
					return self.web_app_redirect_func("{}?urlvisit={}".format(self.url_if_not_found,self.web_app_request_func.url))
				else:
					return caller_func(*arg1,**arg2)
			return exec_caller_func
		return decorator_argument_holder
