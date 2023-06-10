const { execSync } = require('child_process');

// const data = [[1, 2, 3], [6, 2, 8, 11], [10, 2, -4], [11, 22, 30, 25, 65], [0, 5, 7]];
const data = [[4,1], [1,2,5]];
// const labels = ['true', 'false', 'true', 'false', 'true'];
const labels = ['true', 'false'];
// const input_data = [3, 1, 8];
const input_data = [6.7];

const dataString = JSON.stringify(data);
const labelsString = JSON.stringify(labels);
const inputString = JSON.stringify(input_data);

const command = `python3 LR.py '${dataString}' '${labelsString}' '${inputString}'`;
try {
    // Execute the Python script synchronously
    const result = execSync(command);
    console.log(result.toString().trim());

    const res = result.toString().trim()
    // console.log(res.length)
    console.log(parseFloat(res.slice(1, -1)));
} catch (error) {
    console.error(error);
}

// var data = [];
// var a = [];
// var b = [];

// a.push(1);
// a.push(2);
// a.push(3);

// b.push(10);
// b.push(20);

// data.push(a);
// data.push(b);

// console.log(data);

// a = [];

// a.push(30);
// a.push(40);


// data.push(a);

// console.log(data);