#!/bin/bash

# Find the PID of the process using port 6969
pid=$(lsof -ti:6969)

if [ -z "$pid" ]; then
    echo "No process found using port 6969"
else
    echo "Killing process $pid using port 6969"
    kill -9 $pid
    echo "Process terminated"
fi