<!--- <cfdbinfo datasource="cfartgallery" name="REQUEST.art" type="columns" table="artists"> --->
<cfset REQUEST.testObj = CreateObject("component","com.cutterscrossing.Test") />
<cfset REQUEST.art = REQUEST.testObj.getAllStandard() />

<cfdump expand="true" var="#REQUEST.art#">