import bcrypt from "bcrypt";

import UserModel from "./../Models/UserModel.js";

const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(401).json("You can update only your account");
  }
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const { password, ...rest } = updateUser._doc;

    res.status(200).json({
      success: true,
      user: rest,
      message: "User Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default updateUser;
