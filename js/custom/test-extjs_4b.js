Ext.onReady(function(){
Ext.BLANK_IMAGE_URL = "/resources/scripts/extjs/resources/themes/images/default/tree/s.gif";
	
	Ext.define('Artist', {
		extend: 'Ext.data.Model',
		fields: [
			{name:'city', type:'string'},
			{name:'state', type:'string'},
			{name:'postalcode', type:'string'},
			{name:'email', type:'string'},
			{name:'phone', type:'string'},
			{name:'fax',type:'string'},
			{name:'thepassword',type:'string'},
			{name:'artistId', type:'int'},
			{name:'firstName', type:'string'},
			{name:'lastName', type:'string'},
			{name:'address', type:'string'}
		],
		idProperty: 'artistId'
	});
	
	// First demo, with a standard ColdFusion Query object
	Ext.create('Ext.data.Store', {
		model: 'Artist',
		storeId: 'artistStore_1',
		remoteSort: true,
		proxy: {
			type: 'ajax',
			url: '/com/cc/ArtGallery/Artists.cfc',
			extraParams: {
				method: 'GetAllStandard',
				returnFormat: 'json'
			},
			reader: {
				type: 'cfquery'
			}
		},
		autoLoad: true
	});
	
	Ext.create('Ext.grid.Panel',{
		title: 'Testing: GetAllStandard',
		store: Ext.getStore('artistStore_1'),
		columns: [
		    {header: 'ID', dataIndex: 'artistId'},
		    {header: 'First Name', dataIndex: 'firstName'},
		    {header: 'Last Name', dataIndex: 'lastName'},
		    {header: 'Email', dataIndex: 'email'}
		],
		height: 380,
		width: 600,
		renderTo: 'demo1'
	});
	
	// Second demo, with a ColdFusion Query run through QueryForGrid()
	Ext.create('Ext.data.Store', {
		model: 'Artist',
		storeId: 'artistStore_2',
		remoteSort: true,
		proxy: {
			type: 'ajax',
			url: '/com/cc/ArtGallery/Artists.cfc',
			extraParams: {
				method: 'getAllQCFG',
				returnFormat: 'json'
			},
			reader: {
				type: 'cfquery'
			}
		},
		autoLoad: true
	});
	
	Ext.create('Ext.grid.Panel',{
		title: 'Testing: getAllQCFG (QueryForGrid limited)',
		store: Ext.getStore('artistStore_2'),
		columns: [
		    {header: 'ID', dataIndex: 'artistId'},
		    {header: 'First Name', dataIndex: 'firstName'},
		    {header: 'Last Name', dataIndex: 'lastName'},
		    {header: 'Email', dataIndex: 'email'}
		],
		height: 170,
		width: 600,
		renderTo: 'demo2'
	});
	
	// Third demo, with a ColdFusion Struct returned
	Ext.create('Ext.data.Store', {
		model: 'Artist',
		storeId: 'artistStore_3',
		remoteSort: true,
		proxy: {
			type: 'ajax',
			url: '/com/cc/ArtGallery/Artists.cfc',
			extraParams: {
				method: 'getAllInStruct',
				returnFormat: 'json'
			},
			reader: {
				type: 'cfquery',
				query: 'getArtists',
				totalProperty: 'TOTALROWCOUNT',
				successProperty: 'SUCCESS',
				messageProperty: 'MESSAGE'
			}
		},
		autoLoad: true
	});
	
	Ext.create('Ext.grid.Panel',{
		title: 'Testing: getAllInStruct',
		store: Ext.getStore('artistStore_3'),
		columns: [
		    {header: 'ID', dataIndex: 'artistId'},
		    {header: 'First Name', dataIndex: 'firstName'},
		    {header: 'Last Name', dataIndex: 'lastName'},
		    {header: 'Email', dataIndex: 'email'}
		],
		height: 380,
		width: 600,
		renderTo: 'demo3'
	});
});