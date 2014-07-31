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
	
	var storeBase = {
		model: 'Entry',
		remoteSort: true,
		proxy: {
			type: 'ajax',
			model: 'Entry',
			url: '/com/cc/Blog/Entries.cfc',
			extraParams: {
				returnFormat: 'json'
			},
			limitParam: 'pageSize',
			pageParam: 'pageIndex',
			sortParam: 'sort',
			reader: {
				type: 'cfquery'
			}
		},
		autoLoad: true/*,
		listeners: {
			load: function(st, recs, s, oper, opts){
				console.log('records: ',recs);
			}
		}*/
	};
	
	var gridPanelBase = {
		columns: [
		    {header: 'ID', dataIndex: 'id'},
		    {header: 'Title', dataIndex: 'title'},
		    {header: 'Posted', dataIndex: 'posted'},
		    {header: 'Views', dataIndex: 'views'}
		],
		height: 380,
		width: 600
	}
	
	Ext.create('Ext.data.Store', Ext.Object.merge({}, storeBase,{
			storeId: 'entryStore',
			proxy: {
				extraParams: {
					method: 'GetAllStandard'
				}
			}
		})
	);
	
	Ext.create('Ext.grid.Panel', Ext.Object.merge({}, gridPanelBase, {
			title: 'Testing: GetAllStandard (Basic CF Query object)',
			store: Ext.getStore('entryStore'),
			renderTo: 'demo1',
			columns: [
			    {header: 'ID', dataIndex: 'id', hidden: true},
			    {header: 'Title', dataIndex: 'title', flex: 6},
			    {header: 'Posted', dataIndex: 'posted', flex: 2},
			    {header: 'Views', dataIndex: 'views', align: 'right', flex: 2}
			],
			scroll: 'vertical'
		})
	);
	
	// Second demo, with a ColdFusion Query run through QueryForGrid()
	Ext.create('Ext.data.Store', Ext.Object.merge({}, storeBase,{
			storeId: 'entryStore_2',
			proxy: {
				extraParams: {
					method: 'getAllQCFG'
				}
			}
		})
	);
	
	Ext.create('Ext.grid.Panel', Ext.Object.merge({}, gridPanelBase, {
			title: 'Testing: getAllQCFG (QueryForGrid created struct)',
			store: Ext.getStore('entryStore_2'),
			renderTo: 'demo2',
			dockedItems: [{
				xtype: 'pagingtoolbar',
				dock: 'top',
				store: Ext.getStore('entryStore_2'),
				displayInfo: true
			}]
		})
	);
	
	// Third demo, with a ColdFusion Struct returned
	Ext.create('Ext.data.Store', Ext.Object.merge({}, storeBase,{
			storeId: 'entryStore_3',
			proxy: {
				extraParams: {
					method: 'getAllInStruct'
				},
				reader: {
					rootProperty: 'getEntries',
					totalProperty: 'recordCount',
					successProperty: 'success',
					messageProperty: 'message'
				}
			}
		})
	);
	
	Ext.create('Ext.grid.Panel', Ext.Object.merge({}, gridPanelBase, {
			title: 'Testing: getAllInStruct (query as part of custom struct)',
			store: Ext.getStore('entryStore_3'),
			renderTo: 'demo3',
			dockedItems: [{
				xtype: 'pagingtoolbar',
				dock: 'top',
				store: Ext.getStore('entryStore_3'),
				displayInfo: true
			}]
		})
	);
});