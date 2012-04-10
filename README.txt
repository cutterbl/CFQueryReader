The CFQueryReader directory should be setup as a site root for testing. 
All pathing relates to this folder as the site root. You will require
the ColdFusion 8 or higher Development server to properly call the CFC,
and thecfartgallery datasource (part of the demo applications).

The 'Artists.cfc' has been upgraded to a fully scripted component, for
ColdFusion 9. There is an unscripted component in the same directory, but
you'll have to change the file names. The examples use the 'cfartgallery'
datasource that is included in the ColdFusion installation.

ColdFusion Download page
http://www.adobe.com/support/coldfusion/downloads.html

There are now two separate query reader files. One is for versions of ExtJS
prior to version 4. There were tested with Ext 2.x and Ext 3.x. The latest
supports Ext 4.x, and has been tested through 4.1 RC2.

Ext JS Downloads
http://www.sencha.com/products/extjs/download?page=a

Minified files of the readers are located in the build, each at 2K in size.
Full usage is detailed in the comments of each file.