const fs = require('fs');
const path = require('path');

function organizeFiles(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Unable to read directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file);

            try {
                const stats = fs.lstatSync(filePath);

                if (stats.isDirectory()) {
                    return;
                }

                const fileExt = path.extname(file).slice(1);

                if (!fileExt) {
                    console.log(`File with no extension: ${file}`);
                    return;
                }

                const extDir = path.join(directory, fileExt);

                if (!fs.existsSync(extDir)) {
                    fs.mkdirSync(extDir);
                }

                const newFilePath = path.join(extDir, file);
                fs.rename(filePath, newFilePath, (err) => {
                    if (err) {
                        console.error(`Error moving file ${file} to ${extDir}:`, err);
                    } else {
                        console.log(`Moved file ${file} to ${extDir}`);
                    }
                });
            } catch (err) {
                if (err.code === 'EPERM') {
                    console.error(`Permission denied: ${filePath}`);
                } else {
                    console.error(`Error processing file ${filePath}:`, err);
                }
            }
        });
    });
}

const directory = process.argv[2];

if (!directory) {
    console.error('Please provide a directory path as an argument.');
    process.exit(1);
}

if (!fs.existsSync(directory)) {
    console.error('The provided path does not exist.');
    process.exit(1);
}

if (!fs.lstatSync(directory).isDirectory()) {
    console.error('The provided path is not a directory.');
    process.exit(1);
}

organizeFiles(directory);
