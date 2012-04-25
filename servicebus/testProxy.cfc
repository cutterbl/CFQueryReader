<cfcomponent name="testProxy" displayname="testProxy" output="false" extends="com.cc.Blog.Entries" ExtDirect="true">
	<cffunction name="getAllStandard" output="false" access="remote" returntype="any" ExtDirect="true">
		<cfreturn SUPER.getAllStandard(argumentCollection:ARGUMENTS) />
	</cffunction>
</cfcomponent>