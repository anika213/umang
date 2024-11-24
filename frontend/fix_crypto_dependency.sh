#!/bin/bash

# Path to the webpack.config.js file you want to modify
FILE_PATH="node_modules/react-scripts/config/webpack.config.js"

# Check if the file exists
if [ -f "$FILE_PATH" ]; then
  # Add the resolve fallback modification if it's not already present
  if ! grep -q "fallback: { crypto: false }," "$FILE_PATH"; then
    sed -i '/resolve: {/a\      fallback: { crypto: false },' "$FILE_PATH"
    echo "Modification applied to $FILE_PATH"
  else
    echo "Modification already present in $FILE_PATH"
  fi
else
  echo "File not found: $FILE_PATH"
fi
