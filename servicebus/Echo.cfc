<cfcomponent name="Echo" ExtDirect="true" >
	<cffunction name="send" ExtDirect="true">
		<cfargument name="data" required="true" />

		<cfreturn data />
	</cffunction>
</cfcomponent>