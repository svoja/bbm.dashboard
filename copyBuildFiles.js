const fs = require('fs');
const path = require('path');

console.log('Starting file copy process...');

try {
    // Source and destination paths
    const sourcePath = path.join(__dirname, 'src', 'data_19-24.json');
    const destPath = path.join(__dirname, 'build', 'data_19-24.json');
    
    console.log('Source path:', sourcePath);
    console.log('Destination path:', destPath);

    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
        throw new Error('Source file not found: ' + sourcePath);
    }

    // Create build directory if it doesn't exist
    const buildDir = path.join(__dirname, 'build');
    if (!fs.existsSync(buildDir)) {
        console.log('Creating build directory...');
        fs.mkdirSync(buildDir, { recursive: true });
    }

    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    console.log('Successfully copied data file to build directory');

    // Verify the copy
    if (fs.existsSync(destPath)) {
        console.log('Verified: File exists in destination');
    }
} catch (error) {
    console.error('Error during file copy:', error);
    process.exit(1);
}