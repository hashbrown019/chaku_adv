import mysql.connector as connects # TEMPORARY DISABLED
import sqlite3
import socket

class sqlite:
	def __init__(self, database):
		super(sqlite, self).__init__()
		self.database=database

	def init_db(self):
		conn = None
		try:
			conn = sqlite3.connect(self.database)
			# print("<<<<<<<<< SQLITE INITIALIZATION COMPLETE <<<<<<<<<")
		except Exception as e:
			print(e)
			print("xxxxxxxx ERROR IN SQLITE INITIALIZATION  xxxxxxxx")
		return conn

	def do(self,sql):
		conn = sqlite.init_db(self)
		cur = conn.cursor()
		cur.execute(sql)
		conn.commit()
		return cur.lastrowid

	def select(self,sql):
		conn = sqlite.init_db(self)
		conn.row_factory = sqlite.dict_factory
		cur = conn.cursor()
		cur.execute(sql)
		rows = cur.fetchall()
		return rows
		
	def dict_factory(cursor, row):
	    d = {}
	    for idx, col in enumerate(cursor.description):
	        d[col[0]] = row[idx]
	    return d

class mysql:
	def __init__(self, host,user,password,database,use_pure=False):
		'''
			@params: host = Hostname of the database
			@params: user = Username of the database
			@params: password = Password of the database
			@params: database = Database name
			@params: use_pure = Use pure python connection
		'''
		super(mysql, self).__init__()
		self.host=host
		self.user=user
		self.password=password
		self.database=database
		self.use_pure=use_pure
		self.err_page = 1 

	def info(self):
		return connects

	def init_db(self):
		hostname = socket.gethostname()
		ip_address = socket.gethostbyname(hostname)
		mydb = connects.connect(
			host=self.host,
			user=self.user,
			password=self.password,
			database=self.database,
			use_pure=self.use_pure)
		return mydb

	def do(self,sql):
		if(self.err_page==1):
			conn = mysql.init_db(self)
			cur = conn.cursor()
			cur.execute(sql)
			conn.commit()
			return cur.lastrowid
		else:
			try:
				conn = mysql.init_db(self)
				cur = conn.cursor()
				cur.execute(sql)
				conn.commit()
				return {"response":"done","message":cur.lastrowid, "sql":sql}
				# return cur.lastrowid
			except Exception as e:
				return {"response":"error","message":str(e), "sql":sql}

	def select(self,sql,dict_=True):
		if(self.err_page==1):
			conn = mysql.init_db(self)
			cur = conn.cursor(dictionary=dict_)
			cur.execute(sql)
			rows = cur.fetchall()
			return rows
		else:
			try:
				conn = mysql.init_db(self)
				cur = conn.cursor(dictionary=dict_)
				cur.execute(sql)
				rows = cur.fetchall()
				return rows
			except Exception as e:
				return {"response":"error","message":str(e), "sql":sql}


	def insert_or_add_to_db(self,req,table,ids):
		'''
			Insert or Update data to the database
			@params: req = Json data from the request
			@params: table = Table name to insert or update
			@params: ids = ColName of the ID of the table
		'''
		status = 'uknown'
		data = dict(req.form)
		key = [];val = [];args=""
		is_ex_ssql = "SELECT * FROM `{}` WHERE `{}` ='{}' ;".format(table, ids, data[ids])
		print(is_ex_ssql)
		is_exist = len(self.select(is_ex_ssql))
		if(is_exist==0):
			for datum in data:
				# print(datum)
				key.append("`{}`".format(datum))
				val.append("'{}'".format(data[datum]))
			sql = ('''INSERT INTO `{}` ({}) VALUES ({});'''.format(table, ", ".join(key),", ".join(val)))
			status = "inserted"
		else:
			for datum in data:
				args += ",`{}`='{}'".format(datum,data[datum])
			sql = "UPDATE `{}` SET  {}  WHERE `{}`='{}';".format(table, args[1:], ids, data[ids])
			status = "updated"
		print(sql)
		last_row_id = self.do(sql)
		return {"lastrowid":last_row_id, "status":status}

	# ==========FUNCTION ON MULTIPLE SIMULTANEUS TRANSACTION==========================================
	# function(sql, mysql.init_db(self) )
	# returns a connection that has to be committed before closing transaction
	# conn.commit()

	def db_ready_commit(self,conn):return conn.commit()
	def db_ready(self): # READY for MULTIPLE SIMULTANEUS TRANSACTION
		conn = mysql.init_db(self)
		cur = conn.cursor()
		db_ = {"conn":conn,"cur":cur,"commit":conn.commit}
		return Struct_obj(db_)
		
	def do_(self,sql,db_ready_func):
		if(self.err_page==1):
			db_ready_func.cur.execute(sql)
			return db_ready_func.conn # RETURNS a conn (connection) to close
		else:
			try:
				db_ready_func.cur.execute(sql)
				return db_ready_func.conn # RETURNS a conn (connection) to close
			except Exception as e:
				return {"response":"error","message":str(e), "sql":sql}

	def _select(self,db_ready_func,sql,dict_=True):
		cur = db_ready_func['cur']
		if(self.err_page==1):
			cur.execute(sql)
			rows = cur.fetchall()
			print(rows)
			return rows
		else:
			try:
				# conn = mysql.init_db(self)
				# cur = conn.cursor(dictionary=dict_)
				cur.execute(sql)
				rows = cur.fetchall()
				return rows
			except Exception as e:
				return {"response":"error","message":str(e), "sql":sql}


# ===============================================================================
class Struct_obj:
    def __init__(self, entries):
        self.__dict__.update(**entries)

# =======================================================================
