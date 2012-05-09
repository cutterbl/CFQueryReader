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
	
	// Fourth demo, with a ColdFusion Struct returned
	Ext.create('Ext.data.Store', {
		storeId: 'entryStore',
		model: 'Entry',
		remoteSort: true,
		proxy: {
			type: 'ajax',
			url: '/com/cc/Blog/Entries.cfc',
			extraParams: {
				returnFormat: 'json',
				method: 'getWithMeta'
			},
			limitParam: 'pageSize',
			pageParam: 'pageIndex',
			sortParam: 'sort',
			reader: {
				type: 'cfquery'
			}
		},
		autoLoad: true
	});
	
	Ext.create('Ext.grid.Panel', {
		title: 'Testing: getWithMeta (query as part of custom struct)',
		store: Ext.getStore('entryStore'),
		renderTo: 'demo',
		columns: [
		    {header: 'ID', dataIndex: 'id'},
		    {header: 'Title', dataIndex: 'title'},
		    {header: 'Posted', dataIndex: 'posted'},
		    {header: 'Views', dataIndex: 'views'}
		],
		height: 380,
		width: 600,
		dockedItems: [{
			xtype: 'pagingtoolbar',
			dock: 'top',
			store: Ext.getStore('entryStore'),
			displayInfo: true
		}]
	});
});