#!/bin/sh
#
# Author: Mike Hill <mike12489@gmail.com>
#
# Compile all package JavaScript files into a single file. In order for Sencha
# Architect to render items correctly, this must be performed after each change
# to package source files.

# Line explanations:
#
# sencha:
# 	Run Sencha CMD program.
#
# -d:
#	Run in debug mode (verbose output).
#
# -s=../../ext/src/:
#	Use given path as SDK path for ExtJS source.
#
# <category command>
# compile --classpath=src/:
#	Compile the code within the given classpath.
#
# <subcategory command>
# exclude -namespace=Ext:
#	Exclude the Ext namespace from the compiled code. Only required Ext classes
#	will be included in the final result.
#
# and:
#	Append an additional subcategory command to the category command (compile).
#
# <subcategory command>
# concat -yui -ou=architect-lib/package-all.js:
#	Concatenate the compiled code into a single file and export this file as
#	the given -ou path using the YUI JavaScript compiler. The Closure JavaScript
#	compiler may be used instead by replacing -yui with -closure.

# Determine package name
PACKAGE=${PWD##*/}

# Compile package
sencha.sh \
	-d \
	-s=../../ext/src/ \
	compile --classpath=src/ \
	exclude -not -namespace=Ext.ux.${PACKAGE} \
	and \
	concat -yui -ou=architect-lib/package-all.js
