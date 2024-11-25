#!/usr/bin/env bash
echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Copying data file to build directory..."
cp src/data_19-24.json build/

echo "Build completed!"