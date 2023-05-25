let fs = require("fs").promises;

async function* extractData(file, groupBy, autoGroup) {
  console.log(file + ".txt");
  let data = await fs.readFile(file + ".txt", "utf-8");
  const regex =
    /(?<sNo>.*) (?<regId>2[1|2].{8}) (?<subjectCode>R.{6}L?) (?<subjectType>lab|subject) (?<subject>.*) (?<credits>\d\.\d|\d) (?<points>\d\d|\d) (?<grade>.\+?)/g;
  let match;
  let obj = { ["1-1"]: {}, _id: "" };
  if (autoGroup) {
    let start = true;
    while ((match = regex.exec(data))) {
      if (match.groups.regId !== obj._id) {
        if (!start) {
          yield obj;
        }
        obj = { ["1-1"]: { subjects: {}, labs: {} }, _id: match.groups.regId };
      }

      start = false;
      if (match.groups.subjectType === "subject")
        obj[`1-1`].subjects[match.groups.subject] = {
          grade: match.groups.grade,
          // internals: match.groups.internals,
          points: match.groups.points,
          credits: match.groups.credits,
        };
      if (match.groups.subjectType === "lab")
        obj[`1-1`].labs[match.groups.subject] = {
          grade: match.groups.grade,
          // internals: match.groups.internals,
          points: match.groups.points,
          credits: match.groups.credits,
        };
    }
  } else if (groupBy) {
    let i = 0;
    let id;
    while ((match = regex.exec(data))) {
      if (i === 0) {
        id = match.groups.regId;
        obj._id = id;
      } else {
        if (id !== match.groups.regId)
          throw new Error(`GroupError: ${id} : ${match.groups.regId}`);
      }
      if (match.groups.subjectType === "subject")
        obj.subjects[match.groups.subject] = {
          grade: match.groups.grade,
          // internals: match.groups.internals,
          points: match.groups.points,
          credits: match.groups.credits,
        };
      if (match.groups.subjectType === "lab")
        obj.labs[match.groups.subject] = {
          grade: match.groups.grade,
          // internals: match.groups.internals,
          points: match.groups.points,
          credits: match.groups.credits,
        };
      i++;

      if (i % groupBy == 0) {
        yield obj;
        i = 0;
        obj = { ["1-1"]: {}, labs: {}, _id: "" };
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
