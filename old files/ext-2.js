let fs = require("fs").promises;
const { create } = require("domain");
const student = require("./model/student");
let { studentSchema } = require("./model/student");
let mongoose = require("mongoose");
let model = mongoose.model;

let data;
let students = [];

async function connect() {
  mongoose
    .connect(
      "mongodb+srv://suryasarisa99:suryamongosurya@cluster0.xtldukm.mongodb.net/Students?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Connected to MongoDB");
      main().then((res) => console.log("Finised"));
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}

let year = 1;
let sem = 1;
let subjects_cnt = 8;

async function main() {
  let data = await fs.readFile(
    // `./${year}-${sem}-results-all.txt`,
    `./${year}-${sem}-res.txt`,
    "utf-8"
  );

  const regex =
    // /(?<regId>(?!21..5A....)2[1|2].{8}) (?<regulation>R\d*.?) (?<subject>.*) (?<internals>\d\.\d|\d\d|\d) (?<grade>ABSENT|.\+?) (?<credits>\d\.\d|\d)/g;
    // /(?<regId>(?!21..5A....)2[1|2].{8}) (?<regulation>R\d*.?) (?<subject>.*) (?<internals>\d\.\d|\d\d|\d) (?<grade>(?!F).\+?) (?<credits>\d\.\d|\d)/g;
    /(?<sNo>.*) (?<regId>2[1|2].{8}) (?<subjectCode>R.{6}) (?<subjectType>lab|subject) (?<subject>.*) (?<credits>\d\.\d|\d) (?<points>\d\d|\d) (?<grade>.\+?)/g;
  let match;
  let obj;
  let i = 0;
  let count = 0;
  obj = { subjects: {}, labs: {} };
  while ((match = regex.exec(data))) {
    let id = match.groups.regId;
    // if (match.groups.credits == "3" || match.groups.credits == "0")
    if (match.groups.subjectType === "subject")
      obj.subjects[match.groups.subject] = {
        grade: match.groups.grade,
        // internals: match.groups.internals,
        points: match.groups.points,
        credits: match.groups.credits,
      };
    // if (match.groups.credits == "1.5" || match.groups.credits == "2")
    if (match.groups.subjectType === "lab")
      obj.labs[match.groups.subject] = {
        grade: match.groups.grade,
        // internals: match.groups.internals,
        points: match.groups.points,
        credits: match.groups.credits,
      };
    i++;

    if (i % subjects_cnt == 0) {
      // console.log(obj);
      await createStudent(id, obj);
      count++;
      // await updateStudent(id, obj);
      i = 0;
      console.log(count);
      obj = { subjects: {}, labs: {} };
    }
  }
}

async function updateStudent(id, obj) {
  console.log(id);
  let student = await getSchema(id).findById(id);
  if (student) {
    student[year + "-" + sem] = obj;
    await student.save();
  } else await createStudent(id, obj);
}

async function createStudent(id, obj) {
  let student = new getSchema(id)({
    _id: id,
    [year + "-" + sem]: obj,
  });
  await student.save();
}

function getSchema(id) {
  let branchId = id.substring(6, 8);
  let startYear = id.substring(0, 2);
  let isLe = id.substring(4, 6);
  startYear = isLe == "5A" ? startYear - 1 : startYear;

  return model(getBranch[branchId] + startYear, studentSchema);
}

let getBranch = {
  "01": "CIVIL",
  "02": "EEE",
  "04": "ECE",
  "05": "CSE",
  42: "CSM",
  44: "CSD",
};

connect();
