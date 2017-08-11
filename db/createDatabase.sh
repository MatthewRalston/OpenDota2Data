#!/bin/bash

echo "You should be a person with createdb permissions, such as the postgres user"


createdb -O opendotauser -E SQL_ASCII opendota


psq -f initialize.sql opendota


echo "Listing tables in \stash:"

psql -c "\d" opendota

echo "Done."
