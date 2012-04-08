/**
 * @author Steve 'Cutter' Blades
 * @class ColdFusion.data.reader.CFQueryReader
 *
 * <p>The CFQueryReader Reader is used by a Proxy to read a ColdFusion server response that is sent back in JSON format. This usually
 * happens as a result of loading a Store - for example we might create something like this:</p>
 *
<pre><code>
Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'email']
});

var store = Ext.create('Ext.data.Store', {
    model: 'User',
    proxy: {
        type: 'ajax',
        url : '/some/cfc/path.cfc',
        extraParams: {
        	method: 'someMethod',
        	returnFormat: 'json'
        },
        reader: {
            type: 'cfquery'
        }
    }
});
</code></pre>
 *
 * <p>The example above creates a 'User' model. Models are explained in the {@link Ext.data.Model Model} docs if you're
 * not already familiar with them.</p>
 *
 * <p>We created the simplest type of CFQueryReader possible by simply telling our {@link Ext.data.Store Store}'s
 * {@link Ext.data.proxy.Proxy Proxy} that we want a CFQueryReader. The Store automatically passes the configured model to the
 * Store, so it is as if we passed this instead:
 *
<pre><code>
reader: {
    type : 'cfquery',
    root: 'data',
    totalProperty: 'recordCount',
    model: 'User'
}
</code></pre>
 *
 * <p>The reader we set up is ready to read data from our server - at the moment it will accept a response like this:</p>
 *
<pre><code>
{
	"COLUMNS":["ID","NAME","EMAIL"],
	"DATA":[
		[1,"Ed Spencer","ed@sencha.com"],
		[2,"Abe Elias","abe@sencha.com"],
		[3,"Cutter","no@address.giv"]
	]
}
</code></pre>
 *
 * <p><u>Reading other JSON formats</u></p>
 *
 * <p>If you already have your JSON format defined and it doesn't look quite like what we have above, you can usually
 * pass JsonReader a couple of configuration options to make it parse your format. For example, we can use the
 * {@link #root} configuration to parse data that comes back like this:</p>
 *
<pre><code>
{
	"recordCount": 2, 
	"data":{
		"COLUMNS":["ID","NAME","EMAIL"],
		"DATA":[
			[1,"Ed Spencer","ed@sencha.com"],
			[2,"Abe Elias","abe@sencha.com"],
			[3,"Cutter","no@address.giv"]
		]
	}
}
</code></pre>
 *
 * <p>To parse this we just pass in a {@link #root} configuration that matches the 'users' above:</p>
 *
<pre><code>
reader: {
    type: 'json',
    root: 'data',
    totalProperty: 'recordCount'
}
</code></pre>
 *
 * <p><u>Response MetaData</u></p>
 *
 * The server can return metadata in its response, in addition to the record data, that describe attributes
 * of the data set itself or are used to reconfigure the Reader. To pass metadata in the response you simply
 * add a `metaData` attribute to the root of the response data. The metaData attribute can contain anything,
 * but supports a specific set of properties that are handled by the Reader if they are present:
 * 
 * - {@link #root}: the property name of the root response node containing the record data
 * - {@link #idProperty}: property name for the primary key field of the data
 * - {@link #totalProperty}: property name for the total number of records in the data
 * - {@link #successProperty}: property name for the success status of the response
 * - {@link #messageProperty}: property name for an optional response message
 * - {@link Ext.data.Model#cfg-fields fields}: Config used to reconfigure the Model's fields before converting the
 * response data into records
 * 
 * An initial Reader configuration containing all of these properties might look like this ("fields" would be
 * included in the Model definition, not shown):

    reader: {
        type : 'cfquery',
        root : 'data',
        idProperty     : 'id',
        totalProperty  : 'total',
        successProperty: 'success',
        messageProperty: 'message'
    }

If you were to pass a response object containing attributes different from those initially defined above, you could
use the `metaData` attribute to reconifgure the Reader on the fly. For example:

    {
        "count": 1,
        "ok": true,
        "msg": "Users found",
		"users":{
			"COLUMNS":["ID","NAME","EMAIL"],
			"DATA":[
				[1,"Ed Spencer","ed@sencha.com"],
				[2,"Abe Elias","abe@sencha.com"],
				[3,"Cutter","no@address.giv"]
			]
		}
        "metaData": {
            "root": "users",
            "idProperty": 'id',
            "totalProperty": 'count',
            "successProperty": 'ok',
            "messageProperty": 'msg'
        }
    }

 * You can also place any other arbitrary data you need into the `metaData` attribute which will be ignored by the Reader,
 * but will be accessible via the Reader's {@link #metaData} property (which is also passed to listeners via the Proxy's
 * {@link Ext.data.proxy.Proxy#metachange metachange} event (also relayed by the {@link Ext.data.AbstractStore#metachange
 * store}). Application code can then process the passed metadata in any way it chooses.
 * 
 * A simple example for how this can be used would be customizing the fields for a Model that is bound to a grid. By passing
 * the `fields` property the Model will be automatically updated by the Reader internally, but that change will not be
 * reflected automatically in the grid unless you also update the column configuration. You could do this manually, or you
 * could simply pass a standard grid {@link Ext.panel.Table#columns column} config object as part of the `metaData` attribute
 * and then pass that along to the grid. Here's a very simple example for how that could be accomplished:

    // response format:
    {
        ...
        "metaData": {
            "fields": [
                { "name": "userId", "type": "int" },
                { "name": "name", "type": "string" },
                { "name": "birthday", "type": "date", "dateFormat": "Y-j-m" },
            ],
            "columns": [
                { "text": "User ID", "dataIndex": "userId", "width": 40 },
                { "text": "User Name", "dataIndex": "name", "flex": 1 },
                { "text": "Birthday", "dataIndex": "birthday", "flex": 1, "format": 'Y-j-m', "xtype": "datecolumn" }
            ]
        }
    }

The Reader will automatically read the meta fields config and rebuild the Model based on the new fields, but to handle
the new column configuration you would need to handle the metadata within the application code. This is done simply enough
by handling the metachange event on either the store or the proxy, e.g.:

        var store = Ext.create('Ext.data.Store', {
            ...
            listeners: {
                'metachange': function(store, meta) {
                    myGrid.reconfigure(store, meta.columns);
                }
            }
        });

 */
Ext.define('ColdFusion.data.reader.CFQueryReader',{
	extend: 'Ext.data.reader.Array',
	alternateClassName: 'ColdFusion.data.CFQueryReader',
	alias: 'reader.cfquery',
	
	query: 'QUERY',
	
	totalProperty: 'TOTALROWCOUNT',
	
	/**
	 * Reads a JSON object and returns a ResultSet. Uses the internal getTotal and getSuccess extractors to
	 * retrieve meta data from the response, and extractData to turn the JSON data into model instances.
	 * @param {Object} data The raw JSON data
	 * @return {Ext.data.ResultSet} A ResultSet containing model instances and meta data about the results
	 */
	readRecords: function(data) {
		var obj, error;
		// Creates a reference to the Ext.data.Fields objects
		var fields = this.model.prototype.fields.items;
		//this has to be before the call to super because we use the meta data in the superclass readRecords
		if (data.metaData) {
			this.onMetaChange(data.metaData);
		}
		// Test for base object
		if(data[this.query] !== undefined){
			obj = data[this.query];
		} else {
			obj = data;
			this.query = '';
		}
		// Reset totalProperty if the default doesn't exist
		totalProperty = (data[this.totalProperty] !== undefined)?this.totalProperty:'';
		try {
			if(Ext.isObject(obj)){
				// Check the 'query' value, to ensure that it is a ColdFusion query object
				if((obj.DATA !== undefined && Ext.isArray(obj.DATA)) && (obj.COLUMNS !== undefined && Ext.isArray(obj.COLUMNS))){
					// Map the 'root' to the query's DATA array
					this.root = ((this.query.length > 0)?this.query + '.':'') + 'DATA';
					// Upper case the column names, in case a framework changed them
					for(var i = 0; i <= obj.COLUMNS; i++){
						obj.COLUMNS[i] = obj.COLUMNS[i].toUpperCase();
					}
					// Map the columns. Fields might not map to a column in the response
					for(var i = 0; i < fields.length; i++){
						var pos = obj.COLUMNS.indexOf(fields[i].name.toUpperCase());
						if(pos >= 0){
							fields[i].mapping = obj.COLUMNS.indexOf(fields[i].name.toUpperCase());
						}
					}
				} else {
					throw "The \'query\' is not properly mapped to the response.";
				}
			} else {
				throw "A \'query\' is not defined in the server output.";
			}
		} catch(err) {
			error = new Ext.data.ResultSet({
				total  : 0,
				count  : 0,
				records: [],
				success: false,
				message: err
			});
			
			this.fireEvent('exception', this, response, error);
			
			Ext.Logger.warn(err);
			
			return error;
		}
		
		/**
		 * @deprecated will be removed in Ext JS 5.0. This is just a copy of this.rawData - use that instead
		 * @property {Object} jsonData
		 */
		this.jsonData = data;
		return this.callParent([data]);
	}
});