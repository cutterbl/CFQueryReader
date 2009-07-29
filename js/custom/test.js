/*
 // ***************************************************************************************
 //		CLASS|TEMPLATE:
 //		/js/custom/test.js
 //
 //		PURPOSE:
 //		This file loads several Ext.data.Store, all with a different CFQueryReader instance.
 //		This is to test how the different CFQueryReader instances work under basic
 //		Store operations. Each Store is configured to call a different method of Test.cfc,
 //		and each method returns it's JSON data in a slightly different format: A standard
 //		CF Query return, a QueryConvertForGrid() return, and the query as part of a struct.
 //		You can look through Test.cfc to get a better idea, or just look at the response
 //		returns in Firebug.
 //
 //		You should, after load, see three Windows, each with test results for each test.
 //		You will also want to use Firefox with Firebug to view all testing. The console.log()
 //		statements in this template will break all functionality within IE.
 //
 //		COPYRIGHT:
 //		Stephen G. 'Cutter' Blades, Jr. (c) 2009
 //
 //		LICENSE:
 //		Modification and use of this template, for any purpose, is strictly encouraged.
 //		There is no license, you are completely permitted to butcher in whatever
 //		fashion you see fit, just take my name off first to protect the horribly guilty.
 //
 //		CHANGE LOG:
 // ***************************************************************************************
 //		SGB [05.12.09]
 //		Template created
 // ***************************************************************************************
 */

Ext.onReady(function(){
	
	Ext.QuickTips.init();
	var numberOfWins = 0;
	
	// Basic function we set up to offset the windows of all the testing results
	function moveIt(win){
		var posArr = win.getPosition();
		win.setPagePosition(posArr[0] + (numberOfWins * 25),posArr[1] + (numberOfWins * 25));
	};
	
	// Called on each Store's 'load' method, this does some tests against each Store
	// and displays those results in it's own modal window
	function testStore(st,recs,opts){
		// A little console output to show you the records of each store, with it's Id
		//console.log(((st.id) ? st.id : st.storeId),recs);
		// The base Window config
		var testWin = new Ext.Window({
			title:'Testing: ' + ((st.id) ? st.id : st.storeId), // Id is stored differently between Ext 2.x and 3.x
			width:300,
			height:300,
			items:[{
				html:'Testing ->'
			}]
		});
		// We'll add each test, one by one, to the Window
		testWin.add({
			// Just a record count of active store records
			html:'getCount() test: ' + st.getCount()
		},{
			// Total count, which could be returned from the server or defaulted to record count
			html:'getTotalCount() test: ' + st.getTotalCount() + ((st.getTotalCount() > 15) ? " faked out through returned property" : "")
		},{
			// Gets the index of the record with an Id of '11'
			html:'IndexOfId(11) test: ' + st.indexOfId(11)
		},{
			// Should pass in all tests, getting the record with an Id of '11'
			html:'getById(11) pass test: ' + ((st.getById(11)) ? 'record retrieved' : 'failed to retrieve')
		},{
			// Should fail in all tests, getting the record with an Id of '16'
			html:'getById(16) fail test: ' + ((st.getById(16)) ? 'record retrieved' : 'failed to retrieve')
		},{
			// Getting the record at the index of (the record with an Id of '11') should always pass
			html:'getAt(st.indexOfId(11)) test: ' + ((st.getAt(st.indexOfId(11))) ? 'record retrieved' : 'failed to retrieve')
		},{
			// This item is at the same index of the record with an Id of '11', and should always pass
			html:'find("lastName","Kunovic") test: record index ' + st.find("lastName","Kunovic")
		});
		
		// Show the window
		testWin.show();
		// Offset the window if not the first
		moveIt(testWin);
		// Increase the window count
		numberOfWins++;
	}
	
	var provider = Ext.Direct.addProvider(com.cc.APIDesc);
	
	// This is the Field Definition to be used by the CFQueryReader of each Store
	var fieldDef = [
    	{name:'city', type:'string'},
		{name:'state', type:'string'},
		{name:'zip', mapping:'postalcode', type:'string'},
    	{name:'email', type:'string'},
		{name:'phone', type:'string'},
		{name:'fax',type:'string'},
		{name:'thepassword',type:'string'},
    	{name:'artistId', type:'int'},
		{name:'firstName', type:'string'},
		{name:'lastName', type:'string'},
		{name:'address', type:'string'}
    ];
	
	// Test GetAllStandard
	var sds = new Ext.data.DirectStore({
        storeId: 'Standard',
        directFn:com.cc.testProxy.getAllStandard,
        paramsAsHash: false,
        reader: new Ext.data.CFQueryReader({
        	id:'artistId'
        },fieldDef),
        listeners: {
            load:{
            	fn: testStore
            },
            loadexception: {
            	fn: function() {
                	//console.log(arguments);
                	//console.log("Response Text?"+response.responseText);
                	//console.log("dgStore Message \n"+proxy+"\n"+store+"\n"+response+"\n"+e.message);
            	}
            }
        }
    });
    sds.load();
    
    // Test getAllQCFG
	var qds = new Ext.data.Store({
            url: '/com/cutterscrossing/Test.cfc',
            id: 'QueryConvertForGrid',
            baseParams:{
            	method: 'getAllQCFG',
            	returnFormat: 'JSON'
            },
            reader: new Ext.data.CFQueryReader({
            	id:'artistId'
            },fieldDef),
            listeners: {
                load:{
                	fn: testStore
                },
                exception: {
                	fn: function() {
                    	console.log(arguments);
                    	console.log("Response Text?"+response.responseText);
                    	console.log("dgStore Message \n"+proxy+"\n"+store+"\n"+response+"\n"+e.message);
                	}
                }
            }
    });
    qds.load();
    
    // Test getAllInStruct
	var stds = new Ext.data.Store({
            url: '/com/cutterscrossing/Test.cfc',
            id: 'Struct',
            baseParams:{
            	method: 'getAllInStruct',
            	returnFormat: 'JSON'
            },
            reader: new Ext.data.CFQueryReader({
            	id:'artistId',
            	root:'getArtists'
            },fieldDef),
            listeners: {
                load:{
                	fn: testStore
                },
                exception: {
                	fn: function() {
                    	console.log(arguments);
                    	console.log("Response Text?"+response.responseText);
                    	console.log("dgStore Message \n"+proxy+"\n"+store+"\n"+response+"\n"+e.message);
                	}
                }
            }
    });
    stds.load();
    
},document);