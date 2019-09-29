const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');

const folder = readline.question('Enter path: ');
const ext = readline.question('Enter file extentsion: ');
const count_files = +readline.question('Enter cout files: ');
const count_folders = +readline.question('Enter count folders: ');

console.log(`We will find files with extentsion '${ext}' in ${folder}.\nWe will enter to ${count_folders} folders\nWe will find ${count_files} files with difference < 10 second`);
let arr = [];

function fromDir(startPath, filter) {

    let folders_now = 0;
    if (!fs.existsSync(startPath)) {
        console.log("Error, can't find directory ", startPath);
        return;
    }

    let files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        let filename = path.join(startPath, files[i]);
        let stat = fs.lstatSync(filename);
        if (stat.isDirectory() && folders_now != count_folders) {
            folders_now++;
            fromDir(filename, filter);
        }
        else if (filename.endsWith(`${ext}`)) {
            arr.push(filename);
        };
    };
    if (folders_now != 0 || count_folders == 0) {
        arr.sort(function (a, b) {
            return fs.lstatSync(b).birthtime.getTime() -
                fs.lstatSync(a).birthtime.getTime();
        });
        console.log(`Oldest file is ${arr[0]}`);
		if (count_files != 0){
        console.log('Other files with difference < 10 second')
        let time_base = fs.lstatSync(arr[0]).birthtimeMs;
        for (let i = 1; i <= count_files; i++) {
            let time = fs.lstatSync(arr[i]).birthtimeMs;
            if (time_base - time < 10000) {
                console.log(arr[i]);
            }
        }
		}
    }
};

fromDir(folder, ext);