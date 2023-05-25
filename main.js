let {
  connect,
  getSchema,
  saveToJson,
  getBranch,
  addAll,
  getAll,
  groupBranches,
  getCollectionNames,
} = require("./utils");
let { extractData } = require("./groupes");
let mongoose = require("mongoose");
const { studentSchema } = require("./model/student");

let year = 1;
let sem = 1;
// let file = `${year}-${sem}-results`;
// let file = `${year}-${sem}-res`;
// let file = `${year}-${sem}-adv-supply`;

let li = [];

connect("Students").then((res) => {
  console.log(res);
  getAll("21");
});

async function main() {
  // for await (let i of extractData(file, null, true)) {
  //   li.push(i);
  // }
  // saveToJson(file, groupBranches(li));
}

main();
