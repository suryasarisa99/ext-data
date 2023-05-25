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

let year = 1;
let sem = 2;
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
    // let temp = await getSchema(id).findById(id);
    console.log(id);
    if (id) {
      // if (match.groups.credits == "3" || match.groups.credits == "0")
      //   student[year + "-" + sem].subjects[match.groups.subject] = {
      // let typeOfSubject = match.groups.subject
      const student = await getSchema(id).findByIdAndUpdate(
        id,
        {
          $set: {
            [`${year}-${sem}.subjects.${match.groups.subject}.credits`]:
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

    // await student.save();
    // student[`${year}-${sem}`].match
  }
}

connect();
