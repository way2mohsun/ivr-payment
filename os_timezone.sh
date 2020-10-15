#!/bin/sh

# Copyright (C) IBM Corp.
SCRIPT_VERSION=06212016

# This variable stores the command line argument, which should be a valid path
JAVA_PATH=$*

# This variable stores the appended path to the java executable (begins with a slash)
JAVA_EXE=/jre/bin/java

# Set TIME_TEST to the class file (without the extension).  So TimeTest.class becomes TimeTest
# Default: TimeTest
TIME_TEST=TimeTest

# Set CP to the classpath used for the location of TimeTest.class, if not in the current directory.
# Default: .
CP=.

echo "Version "$SCRIPT_VERSION
echo "Copyright (C) IBM"
echo 

# Ouptut date, time, timezone, information
echo "Operating System Time: "
date

echo 
echo "TZ variable is set to \"" $TZ "\""
echo 


# Determine Operating System

OS_FLAVOR=`/bin/uname`

case $OS_FLAVOR in
	AIX)
		echo  ;;
	Linux)
		echo "The timezone file/symbolic link: "
		echo "(Not all Linux OS's will have these files)"
		ls -al /etc/timezone
		echo 
		ls -al /etc/localtime
		echo  ;;
		grep ZONE /etc/sysconfig/clock
		echo  ;;
	SunOS)
		echo  ;;
	HP-UX)
		echo  ;;
		
esac

# Confirm if one and only one argument is supplied:

if [ $# -ne 1 ];
then
	
		echo "Usage: os_timezone.sh [JAVA_HOME]"
		echo 
		echo "Number of arguments: "$#
		echo "The number of arguments supplied must be a single argument containing the path"
		echo "to the Java home directory that your WebSphere Application Server uses."
		echo "EXAMPLE: os_timezone.sh \"/opt/IBM/WebSphere/AppServer/java/\""
		echo 
		
		# If you have problems with the script when you supply a directory with spaces, comment out the line below.		
		exit 2

fi

# Confirm if path is valid


if [ -d $JAVA_PATH ];
then
	
	if [ -f $JAVA_PATH$JAVA_EXE ];
	then
		echo "Java executable path: \""$JAVA_PATH$JAVA_EXE"\""
		echo
		echo "Java Version Information:"
		$JAVA_PATH$JAVA_EXE -version
		echo 
		
		if [ -f ./$TIME_TEST.class ];
		then
		
			#TimeTest
			echo "Executing "$TIME_TEST".class:"
			$JAVA_PATH$JAVA_EXE -cp $CP $TIME_TEST
			echo 
			
		else
		
			echo "Usage: os_timezone.sh [JAVA_HOME]"
			echo 
			echo "Cannot find \""$TIME_TEST".class\" . Either put the class in the"
			echo "current directory or change the TIME_TEST and CP (ClassPath)"
			echo "variables to reflect the location and full path of TimeTest.class"
			echo 
		fi
				
	else
		echo "Usage: os_timezone.sh [JAVA_HOME]"
		echo 
		echo "Java executable not found in"
		echo "\"" $JAVA_PATH$JAVA_EXE "\""
		echo "The command-line argument must point to the Java home path"
		echo "that your WebSphere Application Server uses."
		echo "EXAMPLE: os_timezone.sh \"/opt/IBM/WebSphere/AppServer/java/\""
		echo 
	fi
	
else
	echo "Usage: os_timezone.sh [JAVA_HOME]"
	echo 
	echo "The path provided is invalid."
	echo $JAVA_PATH
	echo 
	echo "The parameter must point to the Java home path"
	echo "that your WebSphere Application Server uses."
	echo "EXAMPLE: os_timezone.sh \"/opt/IBM/WebSphere/AppServer/java/\""
	echo 
fi
