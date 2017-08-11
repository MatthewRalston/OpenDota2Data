#!/bin/bash
set -e


# Author: Matt Ralston
# Date: 8/11/17
# Description:
# This is a script for initialization of the Postgres database

VERSION=0.0.1
HELP=0
HOSTNAME=localhost
PORT=1234
USERNAME=$(whoami)
DBNAME=development

BIN_DIR=$(dirname $(which ${BASH_SOURCE[0]}))
POSTGRES=$(dirname $(readlink $BIN_DIR/psql))

#########################
# Command line options
#########################

while [[ $# > 0 ]]
do
    key="$1"
    case $key in
	-h|--help)
	HELP=1
	;;

	-n|--hostname)
	HOSTNAME="$2"
	shift
	;;

	-p|--port)
	PORT="$2"
	shift
	;;

	-u|--username)
	USERNAME="$2"
	shift
	;;

	-d|--dbname)
	DBNAME="$2"
	shift
	;;

	*)
	echo "Unknown option: $key"
	exit 1
	;;
    esac
    shift
done

if [ $HELP == 1 ]
then
    echo "Usage: initialize.sh"
    echo "    Options:"
    echo "              -n|--hostname HOSTNAME"
    echo "              -p|--port PORT"
    echo "              -u|--username USERNAME"
    echo "              -d|--dbname DBNAME"
    echo "              -h|--help"
    exit 1
fi

NOW=$(date +"%Y%m%d_%H%M%S%N")

cmd="echo \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='test';\" | psql --host=$HOSTNAME --port=$PORT --user=$USERNAME 1> >(tee -a logs/database_reset.$NOW.stdout) 2> >(tee -a logs/database_reset.$NOW.stderr >&2)"
echo
echo "              Step 0. Dropping existing connections to database 'DBNAME'"
echo
echo $cmd
echo
#eval $cmd

cmd="$POSTGRES/dropdb --host=$HOSTNAME --port=$PORT --user=$USERNAME $DBNAME 1> >(tee -a logs/database.reset.$NOW.stdout) 2> >(tee -a logs/database_reset.$NOW.stderr >&2)"
echo
echo "              Step 1. Dropping existing database '$DBNAME'"
echo
echo $cmd
echo
eval $cmd

cmd="$POSTGRES/createdb -O $USERNAME --host=$HOSTNAME --port=$PORT --user=$USERNAME $DBNAME 1> >(tee -a logs/database.reset.$NOW.stdout) 2> >(tee -a logs/database_reset.$NOW.stderr >&2)"
echo
echo "              Step 2. Re-creating database '$DBNAME'"
echo
echo $cmd
echo
eval $cmd


cmd="BIN_DIR/psql --host=$HOSTNAME --port=$PORT --user=$USERNAME --dbname=$DBNAME -f $BIN_DIR/../db/initialize.sql 1> >(tee -a logs/database.reset.$NOW.stdout) 2> >(tee -a logs/database_reset.$NOW.stderr >&2)"
echo
echo "              Step 3. Initializing database schema and data"
echo
echo $cmd
echo
eval $cmd

echo
echo "            *** D O N E ***"
echo "            *** D O N E ***" 1>> logs/database_reset.$NOW.stdout
echo

