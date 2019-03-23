const Class = require("../../models/class");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const classes = async classIds => {
  try {
    const classes = await Class.find({ _id: { $in: classIds } });
    return classes.map(mtclass => {
      return transformClass(mtclass);
    });
  } catch (err) {
    throw err;
  }
};

const singleClass = async classId => {
  try {
    const mtclass = await Class.findById(classId);
    return transformClass(mtclass);
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdClasses: classes.bind(this, user._doc.createdClasses)
    };
  } catch (err) {
    throw err;
  }
};

const transformClass = mtclass => {
  return {
    ...mtclass._doc,
    _id: mtclass.id,
    date: dateToString(mtclass._doc.date),
    creator: user.bind(this, mtclass.creator)
  };
};

const transformJoining = joining => {
  return {
    ...joining._doc,
    _id: joining.id,
    user: user.bind(this, joining._doc.user),
    mtclass: singleClass.bind(this, joining._doc.mtclass),
    createdAt: dateToString(joining._doc.createdAt),
    updatedAt: dateToString(joining._doc.updatedAt)
  };
};

exports.transformClass = transformClass;
exports.transformJoining = transformJoining;

// exports.user = user;
// exports.classess = classess;
// exports.singleClass = singleClass;
