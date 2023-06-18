let fs = require("fs").promises;
let d = require("./tools");

console.log(d);
sem = `${d.year}-${d.sem}`;
async function* extractData(file, groupBy, autoGroup) {
  console.log(file + ".txt");
  let data = await fs.readFile(file + ".txt", "utf-8");
  const regex =
    /(?<sNo>.*) (?<regId>2[1|2].{8}) (?<subjectCode>R.{6}L?) (?<subjectType>lab|subject) (?<subject>.*) (?<credits>\d\.\d|\d) (?<points>\d\d|\d) (?<grade>.\+?)/g;
  // /(?<regId>(?!21..5A....)2[1|2].{8}) (?<regulation>R\d*.?) (?<subject>.*) (?<internals>\d\.\d|\d\d|\d) (?<grade>ABSENT|.\+?) (?<credits>\d\.\d|\d)/g;

  let match;
  let obj = { [sem]: { subjects: {}, labs: {} }, _id: "" };
  if (autoGroup) {
    console.log("autoGroup");
    let start = true;
    while ((match = regex.exec(data))) {
      if (match.groups.regId !== obj._id) {
        if (!start) {
          yield obj; // yield obj at the end of the loop
        }
        obj = {
          [sem]: { subjects: {}, labs: {} },
          _id: match.groups.regId,
        };
      }

      start = false;
      if (match.groups.subjectType === "subject")
        // if (match.groups.credits == "3" || match.groups.credits == "0")
        obj[sem].subjects[match.groups.subject] = {
          grade: match.groups.grade,
          credits: match.groups.credits,
          internals: match.groups.internals,
          // points: match.groups.points,
        };
      if (match.groups.subjectType === "lab")
        // if (match.groups.credits == "1.5" || match.groups.credits == "2")
        obj[sem].labs[match.groups.subject] = {
          grade: match.groups.grade,
          credits: match.groups.credits,
          internals: match.groups.internals,
          // points: match.groups.points,
        };
    }
  } else if (groupBy) {
    let i = 0;
    let id;
    while ((match = regex.exec(data))) {
      if (i === 0) {
        id = match.groups.regId;
        console.log(obj);
        obj._id = id;
      } else {
        if (id !== match.groups.regId)
          throw new Error(`GroupError: ${id} : ${match.groups.regId}`);
      }
      if (match.groups.credits == "3" || match.groups.credits == "0")
        // if (match.groups.subjectType === "subject")
        console.log(match.groups.subject);
      console.log(match.groups.grade);
      console.log(match.groups.credits);
      console.log(match.groups.internals);
      console.log(obj);
      obj[sem].subjects[match.groups.subject] = {
        grade: match.groups.grade,
        credits: match.groups.credits,
        internals: match.groups.internals,
        // points: match.groups.points,
      };
      console.log(obj);
      if (match.groups.credits == "1.5" || match.groups.credits == "2")
        // if (match.groups.subjectType === "lab")
        obj[sem].labs[match.groups.subject] = {
          grade: match.groups.grade,
          credits: match.groups.credits,
          internals: match.groups.internals,
          // points: match.groups.points,
        };
      console.log(obj);
      i++;

      if (i % groupBy == 0) {
        yield obj;
        i = 0;
        obj = { [sem]: { subjects: {}, labs: {} }, _id: "" };
      }
    }
  } else
    while ((match = regex.exec(data))) {
      yield match.groups;
    }
}
// if (match.groups.credits == "3" || match.groups.credits == "0")
// if (match.groups.credits == "1.5" || match.groups.credits == "2")

module.exports = { extractData };
