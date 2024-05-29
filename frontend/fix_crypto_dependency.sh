#!/bin/bash

# Define the paths to the webpack config file and its backup
webpack_config="./node_modules/react-scripts/config/webpack.config.js"
webpack_config_backup="./node_modules/react-scripts/config/webpack.config.js.bckp"

# Specify the line number where you want to insert the new line
line_number=304

# Define the line to add
line_to_add='fallback: { "crypto": require.resolve("crypto-browserify") }, // Patch realm-web crypto dependency'

# Print a message indicating the script is running
echo "Fixing realm-web crypto dependency..."

# Check if the line is already in the file
if grep -q "$line_to_add" $webpack_config
then
    echo "Crypto fallback already added into the file $webpack_config"
else
    # If the line is not found, create a backup of the webpack config file
    echo "Adding Crypto fallback into the file $webpack_config"
    cp $webpack_config $webpack_config_backup

    # Insert the new line at the specified line number with proper indentation
    sed -i "${line_number}i\\
    \ \ \ \ \ \ $line_to_add" $webpack_config
fi

# Print a completion message
echo "Done! realm-web crypto dependency fixed. You can now run 'npm run build' without warnings :)"
