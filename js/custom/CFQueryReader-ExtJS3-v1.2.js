/*
* Ext JS Library 2.0
* Copyright(c) 2006-2007, Ext JS, LLC.
* licensing@extjs.com
*
* http://extjs.com/license
*
*******************************************
* Steve 'Cutter' Blades (CutterBl) no.junkATcutterscrossingDOTcom
* http://blog.cutterscrossing.com
* 
* @@@ Ext.data.CFQueryReader v 1.2 [07.29.09] @@@
*
* Inspired by the CFJsonReader, originally writtin by John Wilson (Daemach)
* http://extjs.com/forum/showthread.php?t=21408&highlight=cfjsonreader
* 
* This Custom Data Reader will take the JSON return of a ColdFusion
* Query object, rather returned straight up, or via the ColdFusion
* QueryConvertForGrid() method, or even as a key within a struct.
* 
* The CFQueryReader constructor takes two arguments
* @meta			: object containing key/value pairs for each record (See ArrayReader Config Options)
* @recordType	: field mapping object
* ------------------------------------------------------------------------------------
* REVISION: [11.17.09]
* The 3.0.3 update to ExtJs changed the base Ext.data.JsonReader class (which is
* extended by Ext.data.ArrayReader, which is extended by the CFQueryReader), and
* renamed a key function from getJsonAccessor() to createAccessor(). I've added
* code to compensate, while maintaining backwards compatibility.
* ------------------------------------------------------------------------------------
* REVISION: [11.09.09]
* One of the frameworks will return lower cased column names, so we include some code
* that uppercases them in the references used to dynamically generate the methods
* for getting column data. This doesn't change the actual JSON object, just by ref
* ------------------------------------------------------------------------------------
* REVISION: [07.29.09]
* Small revisions to support Ext 3.0+, with backwards compatibility for Ext 2.x
* ------------------------------------------------------------------------------------
* REVISON: [05.12.09]
* Tested, and fully functional, with Ext JS 2.2, and a fresh (20:30 CDT) build of Ext 3.0
* ------------------------------------------------------------------------------------
* REVISON: [03.10.09]
* Through the 'meta' argument, you can now define which JSON node is the 'root',
* 'success', or the 'totalProperty', as well as the 'id'. 
* 
* If 'root' is undefined in the meta then it will look for a 'QUERY' node in the 
* object root, otherwise it will assume the object root is the root of the JSON object.
* 
* if the object root contains a 'TOTALROWCOUNT' node, it will apply it's value
* to the totalRowCount. If a 'totalProperty' is defined in the meta, it will
* take the node of that name value, and apply it's value to the totalRowCount. If
* neither is available, it will automatically count all records processed, and 
* apply that count to the value of totalRowCount.
* 
* With this revision, we also remove the requirement for using uppercase values for
* 'mapping' definitions
* -------------------------------------------------------------------------------------
* 
* The recordType object allows you to alias the returned ColdFusion column 
* name (which is always passed in upper case) to any 'name' you wish, as
* well as assign a data type, which your ExtJS app will attempt to cast
* whenever the value is referenced.
* 
* ColdFusion's JSON return, for a ColdFusion Query object, will appear in the
* following format:
* 
* {"COLUMNS":["INTVENDORTYPEID","STRVENDORTYPE","INTEXPENSECATEGORIESID",
* "STREXPENSECATEGORIES"],"DATA" :[[2,"Carpet Cleaning",1,"Cleaining"],
* [1,"Cleaning Service",1,"Cleaining"]]}
* 
* The ColdFusion JSON return on any query that is first passed through
* ColdFusion's QueryConvertForGrid() method will return the object in the
* following format:
* 
* {"TOTALROWCOUNT":3, "QUERY":{"COLUMNS":["MYIDFIELD","DATA1","DATA2"],
* "DATA":[[1,"Bob","Smith"],[6,"Jim","Brown"]]}}
* 
* The Ext.data.CFQueryReader is designed to accomodate either format
* automatically. You would create your reader instance in much the same
* way as the CFJsonReader was created:
* 
* var myDataModel = [
* 	{name: 'myIdField', mapping: 'myIdField'},
* 	{name: 'data1', mapping: 'data1'},
* 	{name: 'data2', mapping: 'data2'}
* ];
* 
* var myCFReader =  new Ext.data.CFQueryReader({id:'myIdField'},myDataModel);
* 
* Notice that the 'id' meta value mirrors the alias 'name' of the record's field.
* 
* You could also define your reader within the Store configuration:
* 
* var myStore = new Ext.data.Store({
* 	reader: new Ext.data.CFQueryReader({
* 		id:'myIdField', // matches the 'name' attribute of your id field
* 		root:'rootOfQueryJSON', // Case Specific
* 		totalProperty:'someTotalsNode' // Case Specific
* 	},[
* 		{name: 'myIdField', mapping: 'myIdField'},
* 		{name: 'data1', mapping: 'data1'},
* 		{name: 'data2', mapping: 'data2'}
* 	]),
* 	url:'/path/to/some/remote/proxy.cfc',
* 	baseParams:{
* 		method:'myMethod',
* 		returnFormat:'JSON'
* 		someMethodArg: numericValue
* 		anotherMethodArg: 'stringValue'
* 	}
* });
*/

Ext.data.CFQueryReader = Ext.extend(Ext.data.ArrayReader, {
	read : function(response){
        var json = response.responseText;
        var o = eval("("+json+")");
        if(!o) {
            throw {message: "CFQueryReader.read: Json object not found"};
        }
        return this.readRecords(o);
    },
    
	readRecords : function(o){
        this.jsonData = o;
        var s = this.meta, Record = this.recordType,
            f = Record.prototype.fields, fi = f.items, fl = f.length,reset = false;
        if(typeof this.getJsonAccessor != "function"){
			this.getJsonAccessor = this.createAccessor;
		}
        if (!this.ef || !this.getQueryRoot) {
	        if(s.successProperty) {
	            this.getSuccess = this.getJsonAccessor(s.successProperty);
	        }
	        
	        if(s.root){
	        	this.getRoot = this.getJsonAccessor(s.root + '.DATA');
	        	this.getQueryRoot = this.getJsonAccessor(s.root);
	        } else {
	        	this.getRoot = (o.QUERY) ? this.getJsonAccessor('QUERY.DATA') : this.getJsonAccessor('DATA');
	        	this.getQueryRoot = function(){
	        		return (o.QUERY) ? o.QUERY : o;
	        	};
	        }
	        if(s.totalProperty) {
	            this.getTotal = this.getJsonAccessor(s.totalProperty);
	        } else if(o.TOTALROWCOUNT) {
	        	this.getTotal = this.getJsonAccessor('TOTALROWCOUNT');
	        }
        }
        
        var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
        var cols = this.getQueryRoot(o).COLUMNS;
		
		for (var i = 0;i < cols.length;i++){
			cols[i] = cols[i].toUpperCase();
		}
        
        if(s.totalProperty || o.TOTALROWCOUNT){
            var v = parseInt(this.getTotal(o), 10);
            if(!isNaN(v)){
                totalRecords = v;
            }
        }
		
        if(s.successProperty){
            var v = this.getSuccess(o);
            if(v === false || v === 'false'){
                success = false;
            }
        }
        
    	for(b=0;b < fl; b++){
        	var fMap = (fi[b].mapping !== undefined && fi[b].mapping !== null) ? fi[b].mapping : fi[b].name;
        	fi[b].mapArrLoc = cols.indexOf(fMap.toUpperCase());
        }
    	
    	if (!this.ef || reset === true) {
           if (s.id) {
	       		this.getId = function(rec){
	        		var r = rec[s.id];
	        		return (r === undefined || r === "") ? null : r;
	       		};
	        } else {
	        	this.getId = function(){return null;};
	        }
            this.ef = [];
            for(var i = 0; i < fl; i++){
                f = fi[i];
                var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
                this.ef[i] = function(rec){
                	var r = rec[map];
                	return (r === undefined || r === "") ? null : r;
                };
            }
        }
    	
		var records = [];

	    for(var i = 0; i < c; i++){
		    var n = root[i];
	        var values = {};
	        for(var j = 0, jlen = fl; j < jlen; j++){
                f = fi[j];
                var k = f.mapArrLoc !== undefined && f.mapArrLoc !== null ? f.mapArrLoc : j;
                var v = n[k] !== undefined ? n[k] : f.defaultValue;
                v = f.convert(v, n);
                values[f.name] = v;
            }
            var rec = new this.recordType(values, this.getId(values));
	        rec.json = values;
	        records[i] = rec;
	    }
	    
	    return {
	        success: success,
	        records : records,
	        totalRecords : totalRecords
	    };
    }
});