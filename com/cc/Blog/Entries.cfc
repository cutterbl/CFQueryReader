/**
 *    ===================================================================
 *    COMPONENT/CLASS
 *    com.cc.Blog.Entries
 *
 *    PURPOSE
 *    A component for getting/setting information on blog entries
 *
 *    AUTHOR
 *    Steve 'Cutter' Blades [C], webDOTadminATcutterscrossingDOTcom
 *
 *    REVISIONS
 *    ===================================================================
 *    [C 01.29.11]
 *    Initial creation
 *    ===================================================================
 *
 *    @name Entries
 *    @displayName Blog Entries
 *    @output false
 */
component {

	/*
	 *	Creating some constants, for validity checking
	 */
	VARIABLES._COLUMNARRAY = ["id","title","posted","views"];
	VARIABLES._DIRARRAY = ["asc","desc"];
	VARIABLES.dsn = "blog";

	/**
	 *	FUNCTION GetAllStandard
	 *	A function to return a very basic ColdFusion Query object
	 *
	 *	@access remote
	 *	@returnType query
	 *	@output false
	 */
	function GetAllStandard(numeric pageIndex = 1, numeric pageSize = 50, string sort = "", string search = "") {
		var LOCAL.tmp = GetEntries(argumentCollection: ARGUMENTS);
		var LOCAL['retVal'] = QueryNew('id,title,posted,views');
		if (LOCAL.tmp.success) {
			LOCAL.retVal = LOCAL.tmp.getEntries;
		}
		return LOCAL.retVal;
	}

	/**
	 *	FUNCTION getAllQCFG
	 *	This function returns a ColdFusion object, created by the QueryConvertForGrid() method.
	 *	The method returns a struct, with the Query object as one key and the total count as another.
	 *	See the Adobe ColdFusion documentation for more information on QueryConvertForGrid(), which
	 *	is used for *very* basic paging sets for simple paging grids with a low number of overall records.
	 *
	 *	@access remote
	 *	@returnType struct
	 *	@output false
	 */
	function getAllQCFG(numeric pageIndex = 1, numeric pageSize = 50, string sort = "", string search = "") {
		ARGUMENTS.limit = false;
		var LOCAL.tmp = GetEntries(argumentCollection: ARGUMENTS);
		var LOCAL['retVal'] = QueryNew('id,title,posted,views');
		if (LOCAL.tmp.success) {
			LOCAL.retVal = LOCAL.tmp.getEntries;
		}
		return QueryConvertForGrid(LOCAL.retVal, ARGUMENTS.pageIndex, ARGUMENTS.pageSize);
	}

	/**
	 *	FUNCTION getAllInStruct
	 *	This function returns the ColdFusion Query object as part of a struct object. We are implicitly
	 *	setting the TOTALROWCOUNT variable to fake out our reader, showing that the totalProperty attribute
	 *	of the meta object will work properly. This also lets us further test the root attribute of the
	 *	meta object, as well as how well the CFQueryReader will map columns to values for later data retrieval
	 *
	 *	@access remote
	 *	@returnType struct
	 *	@output false
	 */
	function getAllInStruct(numeric pageIndex = 1, numeric pageSize = 50, string sort = "", string search = "") {
		return GetEntries(argumentCollection: ARGUMENTS);
	}

	/**
	 *	FUNCTION getWithMeta
	 *	This function returns the ColdFusion Query object as part of a struct object. We are implicitly
	 *	setting the TOTALROWCOUNT variable to fake out our reader, showing that the totalProperty attribute
	 *	of the meta object will work properly. This also lets us further test the root attribute of the
	 *	meta object, as well as how well the CFQueryReader will map columns to values for later data retrieval
	 *
	 *	@access remote
	 *	@returnType struct
	 *	@output false
	 */
	function getWithMeta(numeric pageIndex = 1, numeric pageSize = 50, string sort = "", string search = "") {
		var retVal = {"success" = true, "pageIndex" = ARGUMENTS.pageIndex, "pageCount" = 0, "recordCount" = 0, "message" = "", "getEntries" = "", "metaData" = {"root" = "getEntries", "totalProperty" = "recordCount", "successProperty" = "success", "messageProperty" = "message", "idProperty" = "id", "fields" = []}};
		StructAppend(LOCAL.retVal, GetEntries(argumentCollection: ARGUMENTS), true);
		var colArr = ListToArray(LOCAL.retVal.getEntries.columnList);

		LOCAL.retVal.metaData.fields = [
			{"name" = "id", "type" = "string", "mapping" = JavaCast("int",0)},
			{"name" = "title", "type" = "string", "mapping" = JavaCast("int",3)},
			{"name" = "posted", "type" = "date", "mapping" = JavaCast("int",2)},
			{"name" = "views", "type" = "int", "mapping" = JavaCast("int",1)}
		];
		return LOCAL.retVal;
	}

	/**
	 *	FUNCTION GetEntries
	 *	A function to get paging query of blog entries for layout in jqGrid
	 *
	 *	@access remote
	 *	@returnType struct
	 *	@output false
	 */
	function GetEntries(numeric pageIndex = 1, numeric pageSize = 50, string sort = "", string search = "", boolean limit = true) {
		var LOCAL.retVal = {"success" = true, "pageIndex" = ARGUMENTS.pageIndex, "pageCount" = 0, "recordCount" = 0, "message" = "", "getEntries" = ""};
		var LOCAL.orderby = "posted DESC";
		if(Len(ARGUMENTS.sort) AND IsJSON(ARGUMENTS.sort)){
			ARGUMENTS.sort = DeserializeJSON(ARGUMENTS.sort);
		}
		if(IsArray(ARGUMENTS.sort) AND ArrayLen(ARGUMENTS.sort)){
			LOCAL.orderby = "";
			for(LOCAL.i=1;LOCAL.i<=ArrayLen(ARGUMENTS.sort);LOCAL.i++){
				// Verify that your sort column and direction are valid. If not, then return an error.
				if(ArrayFindNoCase(VARIABLES._COLUMNARRAY, ARGUMENTS.sort[LOCAL.i].property) AND ArrayFindNoCase(VARIABLES._DIRARRAY,ARGUMENTS.sort[LOCAL.i].direction)){
					LOCAL.orderby &= ((Len(LOCAL.orderby))?",":"") & ARGUMENTS.sort[LOCAL.i].property & " " & ARGUMENTS.sort[LOCAL.i].direction;
				}else {
					StructAppend(LOCAL.retVal,{"success" = false, "message" = "Your sort criteria is not valid."},true);
					return LOCAL.retVal;
				}
			}
		}

		if(Len(ARGUMENTS.search) AND IsJSON(ARGUMENTS.search)){
			ARGUMENTS.search = DeserializeJSON(ARGUMENTS.search);
		} else {
			ARGUMENTS.search = {};
		}

		param name="ARGUMENTS.search.title" default="";
		param name="ARGUMENTS.search.from" default="";
		param name="ARGUMENTS.search.to" default="";
		var LOCAL.hasFrom = Len(ARGUMENTS.search.from) AND IsDate(ARGUMENTS.search.from);
		var LOCAL.hasTo = Len(ARGUMENTS.search.to) AND IsDate(ARGUMENTS.search.to);

		// Main data query
		var LOCAL.sql = "SELECT	SQL_CALC_FOUND_ROWS id,
						views,
						posted,
						title
					FROM	tblblogentries
					WHERE 0 = 0
					 ";
		if(Len(ARGUMENTS.search.title)){
			LOCAL.sql &= " AND title LIKE :title
			 ";
		}
		if(LOCAL.hasTo){
			LOCAL.sql &= "AND posted BETWEEN :from
			 AND :to
			 ";
		}
		LOCAL.sql &= "ORDER BY #LOCAL.orderby#";
		if (ARGUMENTS.limit) {
			LOCAL.sql &= " LIMIT	:start,:numRec";
		}
		var LOCAL.q = new Query(sql = LOCAL.sql, datasource = VARIABLES.dsn);
		LOCAL.q.addParam(name = "start", value = (ARGUMENTS.pageIndex-1) * ARGUMENTS.pageSize, cfsqltype = "cf_sql_integer");
		LOCAL.q.addParam(name = "numRec", value = ARGUMENTS.pageSize, cfsqltype = "cf_sql_integer");
		if(Len(ARGUMENTS.search.title)){
			LOCAL.q.addParam(name = "title", value = "%#ARGUMENTS.search.title#%", cfsqltype = "cf_sql_varchar");
		}
		if(LOCAL.hasFrom AND LOCAL.hasTo){
			LOCAL.q.addParam(name = "from", value = CreateODBCDateTime(ARGUMENTS.search.from), cfsqltype = "cf_sql_timestamp");
			LOCAL.q.addParam(name = "to", value = CreateODBCDateTime(ARGUMENTS.search.to & " 23:59:59"), cfsqltype = "cf_sql_timestamp");
		} else if (!LOCAL.hasFrom AND LOCAL.hasTo){
			LOCAL.q.addParam(name = "from", value = CreateODBCDateTime(ARGUMENTS.search.to), cfsqltype = "cf_sql_timestamp");
			LOCAL.q.addParam(name = "to", value = CreateODBCDateTime(ARGUMENTS.search.to & " 23:59:59"), cfsqltype = "cf_sql_timestamp");
		}

		try {
			LOCAL.retVal.getEntries = LOCAL.q.execute().getResult();
			if(LOCAL.retVal.getEntries.recordCount){
				/*
				 * The next statement is used to provide a TotalCount of all matched records.
				 */
				LOCAL.q.setSql("SELECT FOUND_ROWS() as totalCount");
				LOCAL.totResult = LOCAL.q.execute().getResult();
				if(LOCAL.totResult.recordCount){
					LOCAL.retVal.recordCount = LOCAL.totResult.totalCount; // total number of records
					LOCAL.retVal.pageCount = Ceiling(LOCAL.totResult.TotalCount / ARGUMENTS.pageSize); // total number of pages by pageSize
				}
			}
		} catch (any excpt) {
			LOCAL.retVal.success = false;
			LOCAL.retVal.message = excpt.message;
			LOCAL.retVal.getEntries = QueryNew('id,title,posted,views');
		}
		return LOCAL.retVal;
	}

	/**
	 *	FUNCTION GetGroupedEntries
	 *	A function to get paging query of blog entries for layout in jqGrid
	 *
	 *	@access remote
	 *	@returnType struct
	 *	@output false
	 */
	function GetGroupedEntries(numeric pageIndex = 1, numeric pageSize = 50, string sortCol = "ID", string sortDir = "desc", string search = "") {
		var LOCAL.retVal = {"success" = true, "pageIndex" = ARGUMENTS.pageIndex, "pageCount" = 0, "recordCount" = 0, "message" = "", "data" = ""};
		var LOCAL.scArr = ListToArray(ARGUMENTS.sortCol);
		var LOCAL.sortCol = (ArrayLen(LOCAL.scArr) eq 2) ? LOCAL.scArr[2] : ARGUMENTS.sortCol;
		// Verify that your sort column and direction are valid. If not, then return an error.
		if(ArrayFindNoCase(VARIABLES._COLUMNARRAY, Trim(LOCAL.sortCol)) AND ArrayFindNoCase(VARIABLES._DIRARRAY, ARGUMENTS.sortDir)){
			var LOCAL.orderby = ARGUMENTS.sortCol & " " & ARGUMENTS.sortDir;
		} else {
			StructAppend(LOCAL.retVal,{"success" = false, "message" = "Your sort criteria is not valid."},true);
			return LOCAL.retVal;
		}

		if(Len(ARGUMENTS.search) AND IsJSON(ARGUMENTS.search)){
			ARGUMENTS.search = DeserializeJSON(ARGUMENTS.search);
		} else {
			ARGUMENTS.search = {};
		}

		param name="ARGUMENTS.search.title" default="";
		param name="ARGUMENTS.search.from" default="";
		param name="ARGUMENTS.search.to" default="";
		var LOCAL.hasFrom = Len(ARGUMENTS.search.from) AND IsDate(ARGUMENTS.search.from);
		var LOCAL.hasTo = Len(ARGUMENTS.search.to) AND IsDate(ARGUMENTS.search.to);

		// Main data query
		var LOCAL.sql = "SELECT	SQL_CALC_FOUND_ROWS b.id,
						b.title,
						c.categoryname,
						b.posted,
						b.views
					FROM	tblblogentries b
					INNER JOIN tblblogentriescategories bec ON bec.entryidfk = b.id
					INNER JOIN tblblogcategories c ON c.categoryid = bec.categoryidfk
					WHERE 0 = 0
					 ";
		if(Len(ARGUMENTS.search.title)){
			LOCAL.sql &= " AND title LIKE :title
			 ";
		}
		if(LOCAL.hasTo){
			LOCAL.sql &= "AND posted BETWEEN :from
			 AND :to
			 ";
		}
		LOCAL.sql &= "ORDER BY #LOCAL.orderby#
					 LIMIT	:start,:numRec";
		var LOCAL.q = new Query(sql = LOCAL.sql, datasource = VARIABLES.dsn);
		LOCAL.q.addParam(name = "start", value = (ARGUMENTS.pageIndex-1) * ARGUMENTS.pageSize, cfsqltype = "cf_sql_integer");
		LOCAL.q.addParam(name = "numRec", value = ARGUMENTS.pageSize, cfsqltype = "cf_sql_integer");
		if(Len(ARGUMENTS.search.title)){
			LOCAL.q.addParam(name = "title", value = "%#ARGUMENTS.search.title#%", cfsqltype = "cf_sql_varchar");
		}
		if(LOCAL.hasFrom AND LOCAL.hasTo){
			LOCAL.q.addParam(name = "from", value = CreateODBCDateTime(ARGUMENTS.search.from), cfsqltype = "cf_sql_timestamp");
			LOCAL.q.addParam(name = "to", value = CreateODBCDateTime(ARGUMENTS.search.to & " 23:59:59"), cfsqltype = "cf_sql_timestamp");
		} else if (!LOCAL.hasFrom AND LOCAL.hasTo){
			LOCAL.q.addParam(name = "from", value = CreateODBCDateTime(ARGUMENTS.search.to), cfsqltype = "cf_sql_timestamp");
			LOCAL.q.addParam(name = "to", value = CreateODBCDateTime(ARGUMENTS.search.to & " 23:59:59"), cfsqltype = "cf_sql_timestamp");
		}

		try {
			LOCAL.retVal.data = LOCAL.q.execute().getResult();
			if(LOCAL.retVal.data.recordCount){
				/*
				 * The next statement is used to provide a TotalCount of all matched records.
				 */
				LOCAL.q.setSql("SELECT FOUND_ROWS() as totalCount");
				LOCAL.totResult = LOCAL.q.execute().getResult();
				if(LOCAL.totResult.recordCount){
					LOCAL.retVal.recordCount = LOCAL.totResult.totalCount; // total number of records
					LOCAL.retVal.pageCount = Ceiling(LOCAL.totResult.TotalCount / ARGUMENTS.pageSize); // total number of pages by pageSize
				}
			}
		} catch (any excpt) {
			LOCAL.retVal.success = false;
			LOCAL.retVal.message = excpt.message;
		}
		return LOCAL.retVal;
	}

	/**
	 *	FUNCTION deleteEntry
	 *	Used to remove entries from the system
	 *
	 *	@access remote
	 *	@returnType struct
	 *	@output false
	 */
	function deleteEntry(required string recId){
		var LOCAL.retVal = {"success" = true, "message" = "", "data" = ""};

		// BEST PRACTICE: You'll want to verify that the user has the right to do this. Normally, that would go here.

		var LOCAL.sql = "DELETE FROM tblblogentries
					 WHERE id = :recId";
		var LOCAL.q = new Query(sql = LOCAL.sql, datasource = VARIABLES.dsn);
		LOCAL.q.addParam(name = "recId", value = ARGUMENTS.recId, cfsqltype = "cf_sql_varchar");
		try {
			// You would uncomment the following line to actually remove records, and remove the throw statement
			// LOCAL.q.execute();
			throw (message = "Intentional Exception: You didn't really think I'd delete entries, did you?", type = "custom_err", errorCode = "ce1001");
		} catch (any excpt) {
			// In testing, and with the .execute() commented out above, comment out the next line to watch the grid remove a row
			LOCAL.retVal.success = false;
			LOCAL.retVal.message = excpt.message;
		}
		return LOCAL.retVal;
	}
}
