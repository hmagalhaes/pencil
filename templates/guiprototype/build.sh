#!/bin/bash

function resetDir() {
	if [ ! -d $1 ];
		then
			mkdir $1
		else
			cd $1
			count=$(dirContent $1)
			if [ count > 0 ];
				then
					rm -R *
				fi
			cd ..
		fi
}

function dirContent() {
	n=$(ls -l | wc -l)
	n=$(expr $n - 1)
	return $n
}

# $1 Source directory
# $2 Destination directory
function copyTree() {
	current=$(pwd)
	cd "$1"
	copyItem "*.xml" "$2"
	copyItem "*.xslt" "$2"
	copyItem "*.gif" "$2"
	copyItem "*.png" "$2"
	copyItem "*.min.css" "$2"
	copyItem "*.min.js" "$2"
	
	cd "$current"
}

# $1 Source
# $2 Destination
function copyItem() {
	#cp -R $1 $2 2>/dev/null
	find . -name $1 | cpio -pdm "$2"
	return 0
}

#
#
clear
if [ -z "$1" ];
	then
		echo "Please, specify the building language. E.g.:"
		echo "       ./build.sh eng"
		echo " or..."
		echo "       ./build.sh pt"
	else
		lang=$1
		#echo "Selected language: $lang"

		#input checking
		if [ ! -d "src/core" ];
			then
				echo "Source core dir was not found."
				exit 1
			fi
		if [ ! -d "src/lang/$1" ];
			then
				echo "Lang dir for specified language '$1' was not found"
				exit 1;
			fi
		#echo "Input ok"

		#output preparation
		resetDir "dist"
		resetDir "build"
		#echo "Output ok"
			
		#building target
		cd build
		buildPath=$(pwd)
		cd ..
		copyTree "src/core" "$buildPath"
		copyTree "src/lang/$1" "$buildPath"
		#echo "Build ok at ./build"
		
		#dist
		cd build
		zip -9 -y -q -r "../dist/hmagalhaes_gui_prototype-"$lang".zip" *
		cd ..
		#echo "Dist ok at ./dist"
	fi