from flask import Flask, session, jsonify, request, redirect, Blueprint, make_response, render_template
from flask_cors import CORS,cross_origin
import Configurations as c
from modules import Firebase_connect_mod as firebase 
from jinja_temp import templates


app = Flask(__name__)

app.config['JSON_SORT_KEYS'] = False
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = True
app.secret_key=c.SECRET_KEY
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

templates(app).init()

@app.route("/")
def index():
	return redirect("/admin")

@app.route("/login")
def login():
	return render_template("_login.html")

@app.route("/login_auth",methods=['POST'])
def login_auth():
	_USERS = firebase.get_data("users",True)
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
	for uid in _USERS:
		user = _USERS[uid]
		user["uid"] = uid
		print(f" {user['email']} == {request.form['email']}")
		print(f" {user['password']} == {request.form['password']}")
		print("-----------")
		if(user['email']==request.form['email'] and user['password']==request.form['password']):
			session['user_log'] = user

			return redirect("/dashboard/advertisers")
		else:
			pass
	return redirect("/login?luc=504")

@app.route("/logout")
def logout():
	session.clear()
	return redirect("/login")

@app.route("/dashboard/advertisers")
def advadmin():
	return render_template("adv_page.html",user = session['user_log'])

@app.route("/register_advertiser",methods=['POST'])
def register_advertiser():

	res = firebase.add_data("advertisers",{
		"name" : request.form['name'],
		"email" : request.form['email'],
		"manager" : request.form['manager'],
		"tel" : request.form['tel'],
		"website" : request.form['website'],
		"password" : request.form['password'],
	})
	# return jsonify(res)
	return redirect("/new_advertisers")


@app.route("/admin")
def admin():
	return render_template("home.html")

@app.route("/ads")
def ads():
	return render_template("_adds.html")

@app.route("/new_advertisers")
def new_advertisers():
	return render_template("_add_advertizer.html")

@app.route("/new_ads")
def new_ads():
	return render_template("_add_adds.html")

@app.route("/advertisers")
def advertisers():
	advs = firebase.get_data("advertisers",True)
	return render_template("_advtsr.html",advertisers = advs)

@app.route("/users")
def users():
	_USERS = firebase.get_data("users",True)
	return render_template("_users.html",users= _USERS)

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
def call_logs():
	_LOGS = firebase.get_data("call_logs",True)
	_USERS = firebase.get_data("users",True)
	return render_template("_call_logs.html",logs = _LOGS, users= _USERS)


app.run(debug=c.IS_DEBUG)
# app.run(host=c.HOST,port=c._PORT,debug=c.IS_DEBUG)

