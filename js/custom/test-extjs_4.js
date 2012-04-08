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
	
	Ext.create('Ext.data.Store', {
		model: 'Entry',
		storeId: 'entryStore',
		remoteSort: true,
		proxy: {
			type: 'ajax',
			url: '/com/cc/Blog/Entries.cfc',
			extraParams: {
				method: 'GetEntries',
				returnFormat: 'json'
			},
			limitParam: 'pageSize',
			pageParam: 'pageIndex',
			sortParam: 'sort',
			reader: {
				type: 'cfquery',
				query: 'data',
				totalProperty: 'recordCount'
			}
		},
		autoLoad: true/*,
		listeners: {
			load: function(st, recs, s, oper, opts){
				console.log('records: ',recs);
			}
		}*/
	});
	
	Ext.create('Ext.grid.Panel',{
		title: 'Blog Entries',
		store: Ext.getStore('entryStore'),
		columns: [
		    {header: 'ID', dataIndex: 'id'},
		    {header: 'Title', dataIndex: 'title'},
		    {header: 'Posted', dataIndex: 'posted'},
		    {header: 'Views', dataIndex: 'views'}
		],
		height: 500,
		width: 600,
		renderTo: Ext.getBody(),
		dockedItems: [{
			xtype: 'pagingtoolbar',
			dock: 'top',
			store: Ext.getStore('entryStore'),
			displayInfo: true
		}]
	});
});