Ext.onReady(function(){
	Ext.BLANK_IMAGE_URL = "/resources/scripts/extjs/resources/themes/images/default/tree/s.gif";
	
	Ext.define('Entry', {
		extend: 'Ext.data.Model',
		fields: [
		    {name: 'id', type: 'string'},
		    {name: 'title', type: 'string'},
		    {name: 'posted', type: 'date'},
		    {name: 'views', type: 'int'}
		],
		idProperty: 'id'
	});
	
	// First demo, with a ColdFusion Struct returned using the new "struct" queryFormat
	Ext.create('Ext.data.Store', {
		model: 'Entry',
		storeId: 'entryStore_1',
		remoteSort: true,
		proxy: {
			type: 'ajax',
			model: 'Entry',
			url: '/com/cc/Blog/Entries.cfc',
			extraParams: {
				method: 'getAllInStruct',
				returnFormat: 'json',
				queryFormat: "struct"
			},
			limitParam: 'pageSize',
			pageParam: 'pageIndex',
			sortParam: 'sort',
			reader: {
				type: 'cfquery',
				rootProperty: 'getEntries',
				totalProperty: 'recordCount',
				successProperty: 'success',
				messageProperty: 'message'
			}
		},
		autoLoad: true/*,
		listeners: {
			load: function(st, recs, s, oper, opts){
				console.log('records: ',recs);
			}
		}*/
	});
	
	Ext.create('Ext.grid.Panel', {
		columns: [
		    {header: 'ID', dataIndex: 'id', hidden: true},
		    {header: 'Title', dataIndex: 'title', flex: 6},
		    {header: 'Posted', dataIndex: 'posted', flex: 2},
		    {header: 'Views', dataIndex: 'views', align: 'right', flex: 2}
		],
		scroll: 'vertical',
		height: 380,
		width: 600,
		title: 'Testing: getAllInStruct (query as part of custom struct, using CF 11 queryFormat \"struct\")',
		store: Ext.getStore('entryStore_1'),
		renderTo: 'demo1',
		dockedItems: [{
			xtype: 'pagingtoolbar',
			dock: 'top',
			store: Ext.getStore('entryStore_1'),
			displayInfo: true
		}]
	});
});