let fs = require("fs").promises;
const { create } = require("domain");
// const student = require("./model/student");
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

let year = 2;
let sem = 1;
let subjects_cnt = 8;

async function main() {
  let data = await fs.readFile(
    `./${year}-${sem}-results-all.txt`,
    // `./${year}-${sem}-rev.txt`,
    "utf-8"
  );

  const regex =
    // /(?<regId>(?!21..5A....)2[1|2].{8}) (?<regulation>R\d*.?) (?<subject>.*) (?<internals>\d\.\d|\d\d|\d) (?<grade>ABSENT|.\+?) (?<credits>\d\.\d|\d)/g;
    /(?<regId>(?!21..5A....)2[1|2].{8}) (?<regulation>R\d*.?) (?<subject>.*) (?<internals>\d\.\d|\d\d|\d) (?<grade>ABSENT|.\+?) (?<credits>\d\.\d|\d)/g;

  // /(?<regId>(?!21..5A....)2[1|2].{8}) (?<regulation>R\d*.?) (?<subject>.*) (?<internals>\d\.\d|\d\d|\d) (?<grade>(?!F).\+?) (?<credits>\d\.\d|\d)/g;

  let match;
  let i = 0;
  let obj = {};

  while ((match = regex.exec(data))) {
    console.log("===================================");
    let id = match.groups.regId;
    let typeOfSubject;
    if (match.groups.credits == "3" || match.groups.credits == "0") {
      typeOfSubject = "subjects";
      match.groups.credits = "3";
    } else typeOfSubject = "labs";
    console.log(id);
    if (id) {
      const student = await getSchema(id).findByIdAndUpdate(
        id,
        {
          $set: {
            [`${year}-${sem}.${typeOfSubject}.${match.groups.subject}.credits`]:
              match.groups.credits,
            // $set: {
            //   [`${year}-${sem}.subjects.${match.groups.subject}`]: {
            //     grade: match.groups.grade,
            //     internals: match.groups.internals,
            //   },
          },
        }
        // { new: true }
      );
      // console.log(JSON.stringify(student, 4));
    } else console.log("not found Id");
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
