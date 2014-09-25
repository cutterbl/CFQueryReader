/**
 * @author Steve 'Cutter' Blades
 * @class Ext.ux.CFQueryReader.data.reader.CFQuery
 * @version 2.3 [09.25.2014]
 *
 * <p>The CFQuery Reader is used by a Proxy to read a ColdFusion server response that is sent back in JSON format. This usually
 * happens as a result of loading a Store - for example we might create something like this:</p>
 *
 * <pre><code>
 * Ext.define('User', {
 *     extend: 'Ext.data.Model',
 *     fields: ['id', 'name', 'email']
 * });
 *
 * var store = Ext.create('Ext.data.Store', {
 *     model: 'User',
 *     proxy: {
 *         type: 'ajax',
 *         url : '/some/cfc/path.cfc',
 *         extraParams: {
 *          method: 'someMethod',
 *          returnFormat: 'json'
 *         },
 *         reader: {
 *             type: 'cfquery'
 *         }
 *     }
 * });
 * </code></pre>
 *
 * <p>The example above creates a 'User' model. Models are explained in the {@link Ext.data.Model Model} docs if you're
 * not already familiar with them.</p>
 *
 * <p>We created the simplest type of CFQuery possible by simply telling our {@link Ext.data.Store Store}'s
 * {@link Ext.data.proxy.Proxy Proxy} that we want a CFQuery. The Store automatically passes the configured model to the
 * Store, so it is as if we passed this instead:
 *
 * <pre><code>
 * reader: {
 *     type : 'cfquery',
 *     rootProperty: 'data',
 *     totalProperty: 'recordCount',
 *     model: 'User'
 * }
 * </code></pre>
 *
 * <p>The reader we set up is ready to read data from our server - at the moment it will accept a response like this:</p>
 *
 * <pre><code>
 * {
 *  "COLUMNS":["ID","NAME","EMAIL"],
 *  "DATA":[
 *      [1,"Ed Spencer","ed@sencha.com"],
 *      [2,"Abe Elias","abe@sencha.com"],
 *      [3,"Cutter","no@address.giv"]
 *  ]
 * }
 * </code></pre>
 *
 * <p><u>Reading other JSON formats</u></p>
 *
 * <p>If you already have your JSON format defined and it doesn't look quite like what we have above, you can usually
 * pass JsonReader a couple of configuration options to make it parse your format. For example, we can use the
 * {@link #rootProperty} configuration to parse data that comes back like this:</p>
 *
 * <pre><code>
 * {
 *  "recordCount": 2,
 *  "data":{
 *      "COLUMNS":["ID","NAME","EMAIL"],
 *      "DATA":[
 *          [1,"Ed Spencer","ed@sencha.com"],
 *          [2,"Abe Elias","abe@sencha.com"],
 *          [3,"Cutter","no@address.giv"]
 *      ]
 *  }
 * }
 * </code></pre>
 *
 * <p>To parse this we just pass in a {@link #rootProperty} configuration that matches the 'users' above:</p>
 *
 * <pre><code>
 * reader: {
 *     type: 'cfquery',
 *     rootProperty: 'data',
 *     totalProperty: 'recordCount'
 * }
 * </code></pre>
 *
 * <p><u>Response MetaData</u></p>
 *
 * The server can return metadata in its response, in addition to the record data, that describe attributes
 * of the data set itself or are used to reconfigure the Reader. To pass metadata in the response you simply
 * add a `metaData` attribute to the root of the response data. The metaData attribute can contain anything,
 * but supports a specific set of properties that are handled by the Reader if they are present:
 *
 * - {@link #rootProperty}: the property name of the root response node containing the record data
 * - {@link #idProperty}: property name for the primary key field of the data
 * - {@link #totalProperty}: property name for the total number of records in the data
 * - {@link #successProperty}: property name for the success status of the response
 * - {@link #messageProperty}: property name for an optional response message
 * - {@link Ext.data.Model#cfg-fields fields}: Config used to reconfigure the Model's fields before converting the
 * response data into records
 *
 * An initial Reader configuration containing all of these properties might look like this ("fields" would be
 * included in the Model definition, not shown):
 *
 *     reader: {
 *         type : 'cfquery',
 *         rootProperty : 'data',
 *         idProperty     : 'id',
 *         totalProperty  : 'total',
 *         successProperty: 'success',
 *         messageProperty: 'message'
 *     }
 *
 * If you were to pass a response object containing attributes different from those initially defined above, you could
 * use the `metaData` attribute to reconifgure the Reader on the fly. For example:
 *
 *     {
 *         "count": 1,
 *         "ok": true,
 *         "msg": "Users found",
 *      "users":{
 *          "COLUMNS":["ID","NAME","EMAIL"],
 *          "DATA":[
 *              [1,"Ed Spencer","ed@sencha.com"],
 *              [2,"Abe Elias","abe@sencha.com"],
 *              [3,"Cutter","no@address.giv"]
 *          ]
 *      }
 *         "metaData": {
 *             "rootProperty": "users",
 *             "idProperty": 'id',
 *             "totalProperty": 'count',
 *             "successProperty": 'ok',
 *             "messageProperty": 'msg'
 *         }
 *     }
 *
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
 *
 *     // response format:
 *     {
 *         ...
 *         "metaData": {
 *             "fields": [
 *                 { "name": "userId", "type": "int" },
 *                 { "name": "name", "type": "string" },
 *                 { "name": "birthday", "type": "date", "dateFormat": "Y-j-m" },
 *             ],
 *             "columns": [
 *                 { "text": "User ID", "dataIndex": "userId", "width": 40 },
 *                 { "text": "User Name", "dataIndex": "name", "flex": 1 },
 *                 { "text": "Birthday", "dataIndex": "birthday", "flex": 1, "format": 'Y-j-m', "xtype": "datecolumn" }
 *             ]
 *         }
 *     }
 *
 * The Reader will automatically read the meta fields config and rebuild the Model based on the new fields, but to handle
 * the new column configuration you would need to handle the metadata within the application code. This is done simply enough
 * by handling the metachange event on either the store or the proxy, e.g.:
 *
 *         var store = Ext.create('Ext.data.Store', {
 *             ...
 *             listeners: {
 *                 'metachange': function(store, meta) {
 *                     myGrid.reconfigure(store, meta.columns);
 *                 }
 *             }
 *         });
 *
 */
Ext.define('Ext.ux.CFQueryReader.data.reader.CFQuery', {
    extend: 'Ext.data.reader.Array',
    alias: 'reader.cfquery',

    config: {
        queryProperty: 'QUERY',
        totalProperty: 'TOTALROWCOUNT',
        idProperty: null
    },

    /**
     * Reads a JSON object and returns a ResultSet. Uses the internal getTotal and getSuccess extractors to
     * retrieve meta data from the response, and extractData to turn the JSON data into model instances.
     * @param {Object} data The raw JSON data
     * @return {Ext.data.ResultSet} A ResultSet containing model instances and meta data about the results
     */
    readRecords: function (data) {
        var me;
        var i, ln, pos, fields, model, name;
        var idProperty;
        var results;
        var error;
        var mapit;

        me = this;
        mapit = true;

        // If the query is the root, then wrap it
        if (data.DATA && data.COLUMNS) {
            data = {
                "QUERY": data
            };
        }

        // TODO: Purpose of this? See metaData information from docs above
        // This has to be before the call to super because we use the meta data in the superclass readRecords
        if (data.metaData) {
            me.onMetaChange(data.metaData);
            if (data.metaData.fields)
                mapit = false; // if field info is in the meta, then we don't need to map the columns
        }

        // Perform the following block if the data must be mapped to columns
        if (mapit) {
            results = me.getQuery(data);
            try {
                // Error-checking
                if (Ext.isObject(results) === false) {
                    throw "The \'query\' is not properly mapped to the response.";
                } else if ((results.DATA && Ext.isArray(results.DATA)) === false ||
                    (results.COLUMNS && Ext.isArray(results.COLUMNS)) === false) {
                    // Check the 'query' value to ensure that it is a ColdFusion query object
                    throw "A \'query\' is not defined in the server output.";
                }

                // Create a reference to the Ext.data.Fields objects
                model = me.getModel();
                fields = Ext.Array.clone(model.prototype.fields);

                // Upper case the column names in case a framework changed them
                ln = results.COLUMNS.length;
                for (i = 0; i < ln; i++) {
                    results.COLUMNS[i] = results.COLUMNS[i].toUpperCase();
                }

                // Map the columns. Fields might not map to a column in the response
                ln = fields.length;
                for (i = 0; i < ln; i++) {
                    name = fields[i].getName().toUpperCase();
                    pos = Ext.Array.indexOf(results.COLUMNS, name);
                    if (pos >= 0) {
                        fields[i].mapping = pos;
                    }
                }

                // Put the changes back in the model
                idProperty = me.getIdProperty();
                if (idProperty) {
                    model.idProperty = idProperty;
                }
                // Replace the model's fields, removing all previous fields
                model.replaceFields(fields, true);
                // model.setFields(fields, me.idProperty);
                me.setModel(model, true);

            } catch (err) {
                error = new Ext.data.ResultSet({
                    total: 0,
                    count: 0,
                    records: [],
                    success: false,
                    message: err
                });

                me.fireEvent('exception', me, data, error);

                Ext.Logger.warn(err);

                return error;
            }
        }

        // Store data
        me.rawData = data;
        return me.callParent([data]);
    },

    // Custom buildExtractors, to get 'root' right for CF queries, and create getQuery accessor
    buildExtractors: function () {
        var me = this;
        var config;
        var formattedRootProp;
        var queryProperty;
        var rootProperty;

        // Get config values
        config = me.getConfig();
        queryProperty = config.queryProperty;
        rootProperty = config.rootProperty;

        // Set default rootProperty
        if (queryProperty && !rootProperty) {
            config.rootProperty = rootProperty = queryProperty;
        }

        // Neither <queryProperty> nor <rootProperty> are defined; this should not occur as <queryProperty> is defined by default
        if (!rootProperty) {
            Ext.Error.raise({
                message: "Unable to determine the <rootProperty> value for this reader. Has <queryProperty> been unset?"
            });
        }

        // Remove "DATA" if it is a final sublevel for rootProperty
        formattedRootProp = rootProperty.replace(/(^|\.)DATA$/, "");

        // Set new values
        queryProperty = formattedRootProp;
        rootProperty = (formattedRootProp.length) ? formattedRootProp + ".DATA" : "DATA";
        config.queryProperty = queryProperty;
        config.rootProperty = rootProperty;

        // Create accessors
        me.getQuery = me.createAccessor(queryProperty);
        me.getRoot = me.createAccessor(rootProperty);

        // Build parent extractors
        me.callParent(arguments);
    }
});