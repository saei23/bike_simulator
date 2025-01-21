#!/bin/bash

add_trips() {
    CITY=$1
    TRIPS=$2
    
    curl -X POST "http://localhost:4000/add-trips" \
         -H "Content-Type: application/json" \
         -d "{\"city\": \"$CITY\", \"trips\": $TRIPS}"
    
    echo "La till $TRIPS resor i $CITY."
}

CITY=$1
TRIPS=$2

if [ -z "$CITY" ] || [ -z "$TRIPS" ]; then
    echo "Användning: $0 <stad> <resor>"
    echo "       $0 stop"
    exit 1
fi

add_trips $CITY $TRIPS
