@echo off
cd editor
sloc -e "[^\.]*json|svg" src && cd ..