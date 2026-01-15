from flask import Flask, session, jsonify, request, redirect, Blueprint, make_response, render_template
from flask_cors import CORS,cross_origin
import Configurations as c
from modules import Firebase_connect_mod as firebase 
from jinja_temp import templates
from datetime import datetime

from modules.Req_Brorn_util import authenication

adver_auth = authenication(request,redirect,session,"user_log","/login").login_auth_web
admin_auth_ = authenication(request,redirect,session,"admin_log","/login").login_auth_web
muni_auth_ = authenication(request,redirect,session,"muni_log","/login").login_auth_web

app = Flask(__name__)

app.config['JSON_SORT_KEYS'] = False
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = True
app.secret_key=c.SECRET_KEY
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

templates(app).init()

@app.route("/")
def index():
	return redirect("/login")

@app.route("/login")
def login():
	return render_template("login.html")

@app.route("/login_auth",methods=['POST'])
def login_auth():
	_USERS = firebase.get_data("users",True)
	_MUNI = firebase.get_data("municipalities",True)
	for uid in _USERS:
		user = _USERS[uid]
		user["uid"] = uid
		print(f" {user['email']} == {request.form['email']}")
		print(f" {user['password']} == {request.form['password']}")
		print("-----------")
		if(user['email']==request.form['email'] and user['password']==request.form['password']):
			if user['status'] == "active":
				del user['password']
				session['user_log'] = user
				if(user['role']=='user'):
					return redirect("/dashboard/advertisers")
				else:
					return redirect("/admin")
		else:
			pass
	return redirect("/login?luc=504")

@app.route("/login_auth_adv",methods=['POST'])
def login_auth_adv():
	_USERS = firebase.get_data("advertisers",True)
	_MUNI = firebase.get_data("municipalities",True)

	for uid in _USERS:
		user = _USERS[uid]
		user["uid"] = uid
		print(f" {user['email']} == {request.form['email']}")
		print(f" {user['password']} == {request.form['password']}")
		print("-----------")
		if(user['email']==request.form['email'] and user['password']==request.form['password']):
			if(user['status']=="unverified"):
				return redirect("/login?luc=302")
			else:
				session['user_log'] = user

				return redirect("/dashboard/advertisers")
		else:
			pass
	for uid in _MUNI:
		muni = _MUNI[uid]
		muni["uid"] = uid
		print(f" {muni['email']} == {request.form['email']}")
		print(f" {muni['password']} == {request.form['password']}")
		print("-----------")
		if(muni['email']==request.form['email'] and muni['password']==request.form['password']):
			if(muni['status']=="unverified"):
				return redirect("/login?luc=302")
			else:
				session['muni_log'] = muni

				return redirect("/dashboard/municipality")
		else:
			pass
	if("admin@admin.admin"==request.form['email'] and "admin"==request.form['password']):
		session['admin_log'] = {'role':"admin"}
		return redirect("/admin")

	return redirect("/login?luc=504")

@app.route("/logout")
def logout():
	session.clear()
	return redirect("/login")

# ====================================================
# ====================================================
# ====================================================
# ================ADVERTISER PANEL====================
# ====================================================

@app.route("/dashboard/advertisers")
@adver_auth()
def advadmin():
	ads = firebase.get_data("ads",True)
	return render_template("advertisers/adv_page.html",ads=ads, user = session['user_log'])


@app.route("/post_advertisement")
@adver_auth()
def post_advertisement():
	return render_template("advertisers/create_adds.html",user=session['user_log'])

@app.route("/upload_ads", methods=["POST"])
@adver_auth()
def upload_ads():
	upload_file = firebase.upload_file(request,"storagePath",f"ads/{request.form['advertiserId']}/")
	if upload_file["is_uploaded"] == True:
		now = datetime.now()
		res = firebase.add_data("ads",{
			"createdAt" : now,
			"advertiserId" : request.form['advertiserId'],
			"title" : request.form['title'],
			"description" : request.form['description'],
			"isFallback" : False,
			"isPublished" : True,
			"lat" : request.form['lat'],
			"lng" : request.form['lng'],
			"deliveryPeriod" : request.form['deliveryPeriod'],
			"radiusMeters" : request.form['radiusMeters'],
			"status" : "draft",
			"type" : request.form['type'],
			"storagePath" : upload_file['storagePath']
		})
		return redirect("/dashboard/advertisers")
	else:
		return f"encountered an error. Please go back to the previous page <br> {upload_file}"

@app.route("/get_record/<recordId>", methods=["POST"])
@adver_auth()
def get_ads_detail_by_id(recordId):
	res = firebase.get_data_by_id()
	del res['createdAt'] 
	return res

@app.route("/rmads/<uid>")
def rmads(uid):
	firebase.del_data('ads',uid)
	return redirect("/dashboard/advertisers")

@app.route("/rmads_admin/<uid>")
def rmads_admin(uid):
	firebase.del_data('ads',uid)
	return redirect("/ads")


@app.route("/set_stat_advertiser/<aid>/<stat>")
def set_stat_advertiser(aid,stat):
	firebase.edit_data("advertisers",aid,{"status":stat})
	return "/advertisers"


@app.route("/set_stat_ads/<aid>/<stat>")
def set_stat_ads(aid,stat):
	note = request.args['note']
	firebase.edit_data("ads",aid,{"status":stat,'admin_note':note})
	return "/ads"

# =======================================================
# =======================================================
# =======================================================
# =========MUNICIPALITY PANEL============================
# =======================================================
# =======================================================


@app.route("/dashboard/municipality/")
@muni_auth_()
def muniadmin():
	municipal_content = firebase.get_data("municipal_content",True)
	return render_template("municipality/muni_page.html",municipal_content=municipal_content, user = session['muni_log'])


@app.route("/post_content_municipality")
@muni_auth_()
def post_content_municipality():
	return render_template("municipality/create_content.html",user=session['muni_log'])

@app.route("/upload_municipality_content", methods=["POST"])
@muni_auth_()
def upload_municipality_content():
	upload_file = firebase.upload_file(request,"storagePath",f"municipalities/{request.form['municipal_id']}/")
	if upload_file["is_uploaded"] == True:
		now = datetime.now()
		res = firebase.add_data("municipal_content",{
			"createdAt" : now,
			"municipal_id" : request.form['municipal_id'],
			"title" : request.form['title'],
			"description" : request.form['description'],
			"use_for" : request.form['use_for'],
			"isFallback" : False,
			"isPublished" : True,
			"lat" : request.form['lat'],
			"lng" : request.form['lng'],
			"deliveryPeriod" : request.form['deliveryPeriod'],
			# "radiusMeters" : request.form['radiusMeters'],
			"status" : "draft",
			"type" : request.form['type'],
			"storagePath" : upload_file['storagePath']
		})
		return redirect("/dashboard/municipality")
	else:
		return f"encountered an error. Please go back to the previous page <br> {upload_file}"


@app.route("/municipal_set_status/<uid>/<status>")
def municipal_set_status(uid,status):
	firebase.edit_data('municipalities',uid,{"status":status})
	session['muni_log']['status'] = status
	session.modified = True 
	return redirect("/dashboard/municipality")

@app.route("/rmcontent/<uid>")
def rmcontent(uid):
	firebase.del_data('municipal_content',uid)
	return redirect("/dashboard/municipality")

@app.route("/rmcontent_admin/<uid>")
def rmcontent_admin(uid):
	firebase.del_data('municipal_content',uid)
	return redirect("/municipality_content")

@app.route("/set_stat_muni/<aid>/<stat>")
def set_stat_muni(aid,stat):
	firebase.edit_data("municipalities",aid,{"status":stat})
	return "/municipality"

@app.route("/set_stat_muni_content/<aid>/<stat>")
def set_stat_muni_content(aid,stat):
	note = request.args['note']
	firebase.edit_data("municipal_content",aid,{"status":stat,'admin_note':note})
	return "/municipality_content"

# ======================================================
# ======================================================
# =================ADMIN PANEL==========================
# ======================================================
# ======================================================
# ======================================================
# ======================================================

@app.route("/admin")
@admin_auth_()
def admin():
	ads_logs = firebase.get_data("ad_playback_logs",True)
	logs = firebase.get_data("call_logs",True)
	skip_ad = 0
	for adl in ads_logs:
		if(ads_logs[adl]['status']=="skipped"):
			skip_ad = skip_ad + 1


	return render_template("admin/_home.html",completed_add=(len(ads_logs)-skip_ad)*1,ad_views=len(ads_logs),total_call=len(logs))

@app.route("/ads")
@admin_auth_()
def ads():
	ads = firebase.get_data("ads",True)
	adver = firebase.get_data("advertisers",True)
	return render_template("admin/_adds.html",ads=ads,advertisers=adver)

@app.route("/municipality_content")
@admin_auth_()
def municipality_content():
	municipal_content = firebase.get_data("municipal_content",True)
	municipalities = firebase.get_data("municipalities",True)
	return render_template("admin/municipal_content.html",municipal_content=municipal_content,municipalities=municipalities)

@app.route("/register_advertiser",methods=['POST'])
def register_advertiser():

	res = firebase.add_data("advertisers",{
		"name" : request.form['name'],
		"email" : request.form['email'],
		"manager" : request.form['manager'],
		"tel" : request.form['tel'],
		"website" : request.form['website'],
		"status" : "unverified",
		"password" : request.form['password'],
		"lat" : request.form['lat'],
		"lng" : request.form['lng'],
		"createdAt" : datetime.now()
,
	})
	# return jsonify(res)
	return redirect("/advertisers")

@app.route("/new_advertisers")
@admin_auth_()
def new_advertisers():
	return render_template("admin/_add_advertizer.html",user=session['admin_log'])



@app.route("/view_ads_file")
def view_ads_file():
	file_path = request.args['file_path']
	print(file_path)
	return firebase.download_file(file_path)

# @app.route("/new_ads")
# def new_ads():
# 	return render_template("_add_adds.html")

@app.route("/advertisers")
@admin_auth_()
def advertisers():
	advs = firebase.get_data("advertisers",True)
	return render_template("admin/_advtsr.html",advertisers = advs)


@app.route("/municipality")
@admin_auth_()
def municipality():
	municipalities = firebase.get_data("municipalities",True)
	return render_template("admin/municipality.html",municipalities= municipalities)


@app.route("/new_municipalities")
@admin_auth_()
def new_municipalities():
	return render_template("admin/new_municipalities.html",user=session['admin_log'])


@app.route("/register_municipality",methods=['POST'])
def register_municipality():

	res = firebase.add_data("municipalities",{
		"name" : request.form['name'],
		"email" : request.form['email'],
		"mayor" : request.form['mayor'],
		"tel" : request.form['tel'],
		"website" : request.form['website'],
		"status" : "normal",
		"password" : request.form['password'],
		"lat" : request.form['lat'],
		"lng" : request.form['lng'],
		"createdAt" : datetime.now()
,
	})
	# return jsonify(res)
	return redirect("/municipality")

@app.route("/users")
@admin_auth_()
def users():
	_USERS = firebase.get_data("users",True)
	return render_template("admin/_users.html",users= _USERS)

@app.route("/blckusers/<uid>")
def blckusers(uid):
	firebase.edit_data('users',uid,{"status":'blocked'})
	return redirect("/users")

@app.route("/activateusers/<uid>")
def activateusers(uid):
	firebase.edit_data('users',uid,{"status":'active'})
	return redirect("/users")

@app.route("/rmusers/<uid>")
def rmusers(uid):
	firebase.del_data('users',uid)
	return redirect("/users")

@app.route("/logs")
@admin_auth_()
def call_logs():
	_LOGS = firebase.get_data("call_logs",True)
	_USERS = firebase.get_data("users",True)
	return render_template("admin/_call_logs.html",logs = _LOGS, users= _USERS)

@app.route("/adlogs")
@admin_auth_()
def adlogs():
	ads = firebase.get_data("ads",True)
	_LOGS = firebase.get_data("ad_playback_logs",True)
	_USERS = firebase.get_data("users",True)
	return render_template("admin/_ads_logs.html",logs = _LOGS, users= _USERS,advertisments=ads)

if __name__ == '__main__':
	app.run(debug=c.IS_DEBUG)
# app.run(host=c.HOST,port=c._PORT,debug=c.IS_DEBUG)

