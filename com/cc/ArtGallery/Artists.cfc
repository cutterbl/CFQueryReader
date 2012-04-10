/**
 *    ===================================================================
 *    COMPONENT/CLASS
 *    com.cc.ArtGallery.Artists
 *
 *    PURPOSE:
 *    This file is used for supplying ColdFusion Query returns in several different situations.
 *    The Data returns are used to test the CFQueryReader.js functionality, as a custom DataReader
 *    for use with an Ext.data.Store. A special reader is required to properly parse the JSON
 *    format that Adobe used for ColdFusion's JSON implementation of a Query object's serialization
 *
 *    AUTHOR
 *    Steve 'Cutter' Blades [C], webDOTadminATcutterscrossingDOTcom
 *
 *    REVISIONS
 *    ===================================================================
 *    C [05.12.09]:
 *    Initial Creation
 *    ===================================================================
 *    [C 04.08.11]
 *    Convert to scripted component
 *    ===================================================================
 *
 *    @name Artists
 *    @displayName Artists
 *    @output false
 */
component {

	VARIABLES.dsn = 'cfartgallery';

	/**
	 *	FUNCTION GetAllStandard
	 *	A function to return a very basic ColdFusion Query object
	 *
	 *	@access remote
	 *	@returnType query
	 *	@output false
	 */
	function GetAllStandard() {
		// Main data query
		LOCAL.sql = "SELECT 	artistID,
						firstName,
						lastName,
						address,
						city,
						state,
						postalCode,
						email,
						phone,
						fax,
						thePassword
				FROM	Artists";
		LOCAL.q = new Query(sql = LOCAL.sql, datasource = VARIABLES.dsn);
		//try {
			LOCAL.retVal = LOCAL.q.execute().getResult();
		/*} catch (any excpt) {
			LOCAL.retVal = QueryNew('artistID,firstName,lastName,address,city,state,zip,email,phone,fax,thePassword');
		}*/
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
	function getAllQCFG() {
		// Main data query
		LOCAL.sql = "SELECT 	artistID,
						firstName,
						lastName,
						address,
						city,
						state,
						postalCode,
						email,
						phone,
						fax,
						thePassword
				FROM	Artists";
		LOCAL.q = new Query(sql = LOCAL.sql, datasource = VARIABLES.dsn);
		try {
			LOCAL.retVal = LOCAL.q.execute().getResult();
		} catch (any excpt) {
			LOCAL.retVal = QueryNew('artistID,firstName,lastName,address,city,state,zip,email,phone,fax,thePassword');
		}
		return QueryConvertForGrid(LOCAL.retVal,2,10);
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
	function getAllInStruct() {
		LOCAL.retVal = {success = true, totalRowCount = 219, message = '', 'getArtists' = QueryNew('artistID,firstName,lastName,address,city,state,zip,email,phone,fax,thePassword')};
		// Main data query
		LOCAL.sql = "SELECT 	artistID,
						firstName,
						lastName,
						address,
						city,
						state,
						postalCode,
						email,
						phone,
						fax,
						thePassword
				FROM	Artists";
		LOCAL.q = new Query(sql = LOCAL.sql, datasource = VARIABLES.dsn);
		try {
			LOCAL.retVal.getArtists = LOCAL.q.execute().getResult();
		} catch (any excpt) {
			LOCAL.retVal.success = false;
			LOCAL.retVal.message = "There was a failure pulling the information from the database.";
		}
		return LOCAL.retVal;
	}

}