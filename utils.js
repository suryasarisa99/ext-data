let fs = require("fs").promises;
let { studentSchema } = require("./model/student");
// let { studentSchema } = require("./model/test");
let mongoose = require("mongoose");
let model = mongoose.model;

async function connect(database) {
  return new Promise((resolve, resject) => {
    mongoose
      .connect(
        `mongodb+srv://suryasarisa99:suryamongosurya@cluster0.xtldukm.mongodb.net/${database}?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        resolve("Connected");
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function updateStudentSem(id, obj) {
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

function saveToJson(file, list) {
  fs.writeFile(file + ".json", JSON.stringify(list, null, 3));
}

function groupBranches(list) {
  let groups = {};
  for (obj of list)
    groups[tempSchema(obj._id)]?.push(obj) ||
      (groups[tempSchema(obj._id)] = [obj]);
  return groups;
}

async function addAll(groups) {
  Object.entries(groups).map(async ([schemaName, data]) => {
    await model(schemaName, studentSchema).insertMany(data);
    console.log(schemaName + "is Added to DataBase");
  });

  console.log("Finished");
}

async function getCollectionNames(filter) {
  let db = mongoose.connection.db;
  // if (filter.length === 2)
  let collections = await db.listCollections().toArray();
  collections = collections.map((col) => col.name);
  if (filter?.length === 2)
    return collections.filter((col) => col.endsWith(filter));
  else if (filter?.length === 3)
    return collections.filter((col) => col.startsWith(filter));
  else if (filter?.length === 5)
    return collections.filter((col) => col === filter);
  else return collections;
}

async function getAll(filter) {
  let groups = {};
  let collections = await getCollectionNames(filter);

  let fetchPromise = collections.map(async (col) => {
    groups[col] = await model(col, studentSchema).find();
    console.log("completed: " + col);
  });
  await Promise.all(fetchPromise);
  console.log("finished");
  saveToJson("temp", groups);
}

function getSchema(id) {
  let branchId = id.substring(6, 8);
  let startYear = id.substring(0, 2);
  let isLe = id.substring(4, 6);
  startYear = isLe == "5A" ? startYear - 1 : startYear;

  return model(getBranch[branchId] + startYear, studentSchema);
}

function tempSchema(id) {
  let branchId = id.substring(6, 8);
  let startYear = id.substring(0, 2);
  let isLe = id.substring(4, 6);
  startYear = isLe == "5A" ? startYear - 1 : startYear;

  return getBranch[branchId] + startYear;
}

let getBranch = {
  "01": "CIVIL",
  "02": "EEE",
  "04": "ECE",
  "05": "CSE",
  42: "CSM",
  44: "CSD",
};

module.exports = {
  getBranch,
  getSchema,
  createStudent,
  updateStudentSem,
  connect,
  saveToJson,
  groupBranches,
  getAll,
  addAll,
  getCollectionNames,
};
