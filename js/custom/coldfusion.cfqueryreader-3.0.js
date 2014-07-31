Ext.define('ColdFusion.data.reader.CFQueryReader',{
	extend: 'Ext.data.reader.Json',
	alternateClassName: 'ColdFusion.data.CFQueryReader',
	alias: 'reader.cfquery',
	
	config: {
		totalProperty: 'TOTALROWCOUNT',
		transform : function (data) {
			
			var me = this
				, keys = {
					root: me.getRootProperty(),
					//record: me.getRecordProperty(),
					total: me.getTotalProperty(),
					type: me.getTypeProperty(),
					success: me.getSuccessProperty(),
					meta: me.getMetaProperty(),
					message: me.getMessageProperty()
				}
				, columnList = []
				, newRaw = {}
				, lowerCache = {}
			    , metaObj = "";
			
			// QueryForGrid won't have a defined root, but will have a QUERY key as root
			if (!keys.root.length && data.hasOwnProperty("QUERY")){
				keys.root = "QUERY";
				me.setRootProperty(keys.root);
			}
			
			// If root is empty string, then the query should be the object
			if (!keys.root.length) {
				var tmp = me.buildFromCF(data);
				return tmp.records;
			}
			
			for (var key in keys) {
				if (!keys[key].length) {
					delete keys[key];
				}
			}
			
			var parseNode = function (obj) {
				if (typeof(obj) === "string" || typeof(obj) === "number")
			        return obj;

			        var l = obj.length;
			    if (l) {
			        l |= 0;
			        var result = [];
			        result.length = l;
			        for (var i = 0; i < l; i++) {
			            var newVal = obj[i];
			            result[i] = typeof(newVal) === "string" ? newVal : parseNode(newVal);
			        }
			        return result;
			    } else {
			     var ret = {};
			     for (var key in obj) {
			    	 var skip = false;
			         var keyStr = typeof(key) === "string" ? key : String(key);
			         var newKey = lowerCache[keyStr];
			         if (newKey === undefined) {
			             newKey = keyStr.toLowerCase();
			             lowerCache[keyStr] = newKey;
			         }
			         
			         newKey = me.correctKey(newKey, keys);
			         
			         var newVal = obj[key];
			         
			         if (typeof(newVal) === "string") {
			        	 ret[newKey] = newVal;
			         } else if (newKey === keys.root) { // root should always be defined
			        	 var cfRet = me.buildFromCF(newVal);
			        	 columnList = cfRet.columns;
			        	 if (columnList.length) {
			        		 skip = true;
			        	 }
			        	 ret[newKey] = cfRet.records;
			         } else {
			        	 ret[newKey] = parseNode(newVal);
			         }
			         // don't recurse the newly parsed CF, unless CF 11 queryFormat "struct"
			         if (!skip) { 
			        	 ret[newKey] = (typeof(newVal) === "string") ? newVal : parseNode(newVal);
			         }
			     }
			     return ret;
			    }
			};
			
			newData = parseNode(data);
			
			return newData;
		}
	},
	
	/**
	 * Utility method for doing case insensitive comparison of strings
	 */
	compareNoCase: function(str1, str2) {
		return str1.toUpperCase() === str2.toUpperCase();
	},
	
	/**
	 * Builds a standardized JSON record object from the various formats available from
	 * ColdFusion serialization
	 */
	buildFromCF: function (obj) {
		
		var columnList = [];
		
		if (obj.hasOwnProperty("DATA") && obj.hasOwnProperty("COLUMNS")) {
			var newArr = []
				, d = obj.DATA;
			
			columnList = obj.COLUMNS.map(function (val) {
				return val.toLowerCase();
			});
			
			for (var i = 0; i < d.length; i++) {
				var rec = {};
				for (var j = 0; j < columnList.length; j++) {
					rec[columnList[j]] = d[i][j];
				}
				newArr.push(rec);
			}
			
			return {records: newArr, columns: columnList};
		} else {
			return {records: obj, columns: columnList};
		}
	},
	
	/**
	 * Fix key casing, if necessary
	 */
	correctKey: function (key, keys) {
		var me = this;
		for (var i in keys) {
			if (me.compareNoCase(key, keys[i])) {
				return keys[i];
			}
		}
		return key;
	}
});