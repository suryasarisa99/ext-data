let {
  connect,
  getSchema,
  saveToJson,
  fromJson,
  getBranch,
  addAll,
  getAll,
  groupBranches,
  getCollectionNames,
  startYear,
} = require("./utils");
let d = require("./tools");
let fs = require("fs/promises");
let { extractData } = require("./groupes");
let mongoose = require("mongoose");
const { studentSchema } = require("./model/student");
let li = [];
getPoints = { "A+": 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0, ABSENT: 0, AB: 0 };
// let branches = ["cse", "civil", "eee", "ece", "csm", "csd"];
let branches = ["cses", "civils", "eees", "eces", "csms", "csds"];

connect("Student").then(async (res) => {
  console.log(res);
  let data = await fromJson(d.cmpFile);
  await addAll(data);
  // await getAll("22");
  console.log("Done --get-all");
});

async function main() {
  for await (let i of extractData(d.txtFile, 8, true)) {
    li.push(i);
  }
  saveToJson(d.extFile, groupBranches(li));
}

// main();

async function updateGrades(file) {
  let data = await fromJson(file);
  // let branches = ["22cse", "22civil", "22eee", "22ece", "22csd", "22csm"];
  console.log(data);
  console.log(branches);
  for (let branch of branches)
    for (let std of data[d.startYear + branch]) {
      console.log(std._id);
      total_credits = 0;
      total_backlogs = [];
      total_backlogs_cnt = 0;
      total_points = 0;

      // for (sem of [std["1-1"]])
      for (sem of [std["1-1"], std["1-2"], std["2-1"]])
        if (sem) {
          credits = 0;
          grade = 0;
          backlogs = [];
          backlogs_cnt = 0;
          let points = 0;

          for (obj of [sem?.subjects, sem?.labs])
            if (obj) {
              Object?.entries(obj)?.map(([key, inrObj]) => {
                credits += +inrObj.credits;
                grade += (getPoints[inrObj.grade] || 0) * +inrObj.credits;
                if (inrObj.grade === "F") {
                  backlogs.push(key);
                  backlogs_cnt++;
                  // console.log(backlogs_cnt);
                }
              });
              // console.log(credits);
            }
          // console.log(` cedits-: ${grade / credits} backlog: ${backlogs_cnt}`);
          points = grade / credits;
          sem.points = points;
          sem.backlogs = backlogs;
          sem.backlogs_cnt = backlogs_cnt;

          total_backlogs = total_backlogs.concat(backlogs);
          total_backlogs_cnt += backlogs_cnt;
          if (credits) total_credits += credits;
          if (points) total_points += points;
        }
      std.total_points = total_points;
      std.total_credits = total_credits;
      std.total_backlogs = total_backlogs;
      std.total_backlogs_cnt = total_backlogs_cnt;
    }
  saveToJson(d.cmpFile, data);
}

async function ranks(ass) {
  let data = await fromJson("updated");
  branches = ["cse", "civil", "eee", "ece", "csm", "csd"];
  let x = data.sort((a, b) => {
    return (a["2-1"]?.points - b["2-1"]?.points) * ass;
  });
  console.log(x.map((item) => [item._id, item.total_points]));
}

async function analys() {
  let data = await fromJson(d.cmpFile);
  let analysis = {};
  // let branches = ["cse", "civil", "eee", "ece", "csm", "csd"];
  for (let branch of branches) {
    analysis[d.sy + branch] = data[d.sy + branch].map((std) => {
      return {
        total_backlogs: std.total_backlogs,
        total_backlogs_cnt: std.total_backlogs_cnt,
        total_credits: std.total_credits,
        total_points: std.total_points,
        _id: std._id,

        "1-1": {
          points: std["1-1"]?.points,
          backlogs: std["1-1"]?.backlogs,
          backlogs_cnt: std["1-1"]?.backlogs_cnt,
        },
        "1-2": {
          points: std["1-2"]?.points,
          backlogs: std["1-2"]?.backlogs,
          backlogs_cnt: std["1-2"]?.backlogs_cnt,
        },
        "2-1": {
          points: std["2-1"]?.points,
          backlogs: std["2-1"]?.backlogs,
          backlogs_cnt: std["2-1"]?.backlogs_cnt,
        },
        "2-2": {
          points: std["2-2"]?.points,
          backlogs: std["2-2"]?.backlogs,
          backlogs_cnt: std["2-2"]?.backlogs_cnt,
        },
      };
    });
  }

  saveToJson(d.aysFile, analysis);
}

async function mergeData(file1, file2) {
  let data1 = await fromJson(file1);
  let data2 = await fromJson(file2);
  for (let branch of branches) {
    for (let std2 of data2[d.startYear + branch])
      for (let std1 of data1[d.startYear + branch]) {
        if (std2._id === std1._id) {
          std1[d.fsem] = std2[d.fsem]; // added data from file2 to file1, can't modify both, creates new one
          break;
        }
      }
  }
  saveToJson(d.mergedFile, data1);
}

// mergeData(d.dbFile, d.extFile);
// updateGrades(d.dbFile);
analys();
// 1. extract data
// 2. Merge Respected Data ( before getLatest Data from Db)
// 3. updateGrades
// 4. Analysis Data
