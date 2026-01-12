from flask import Flask, session, jsonify, request, redirect, Blueprint, make_response, render_template

app = Flask(__name__)

@app.route("/")
def index():
	return "Test_____________"

if __name__ == '__main__':
	app.run(debug=c.IS_DEBUG)