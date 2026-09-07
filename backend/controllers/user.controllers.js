import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import genToken from "../utils/genToken.js";

const cookieOptions = {
  httpOnly: true,
  // we have to avoid XSS and CSRF attacks
};

export const registerUser = async (req, res) => {
  //
  const { name, username, email, password } = req.body;

  // validations

  try {
    if (!username || !name || !password || !email) {
      return res.status(422).json({ message: "All fields Required!" });
    }

    // if username exists

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "username already Exists" });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({ message: "username already Exists" });
    }

    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password length should be greater or Equal to 6" });
    }
    const salt = await bcrypt.genSalt(10);
    // console.log(salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate JWT

    const newUser = await User.create({
      username,
      name,
      password: hashedPassword,
      email,
    });

    const token = genToken(newUser._id);

    res.cookie("token", token, cookieOptions);
    res.status(200).json(newUser);
  } catch {
    res.status(500).json({ message: "Intenal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  // login the user

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: "All fields Required!" });
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(404).json({ message: "User not Found" });
    }

    const correctPassword = bcrypt.compareSync(password, userExists.password);

    if (!correctPassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = genToken(userExists._id);
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login Successfull",
      user: userExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Intenal Server Error" }, error);
  }
};

export const getUser = (req, res) => {
  res.status(200).json(req.user);
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logout successful" });
};

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const userData = await User.findOne({ username }).select("-password");

    if(!userData){
        return res.status(404).json({
            message : "User Not Found"

        })
    }

    res.status(200).json({
      message: "User Found",
      userData: userData,
    });
  } catch (error) {
    res.status(500).json({ message: "Intenal Server Error" }, error);
  }
};

// export const followUser = async(req, res) => {
//     try {
//         const currenUsertId = req.user._id
//         const targetUserId = req.params.id

//         if(currenUsertId.toString() === targetUserId.toString()){
//             return res.status(409).json({
//                 message : "You cannot follow userSelf"
//             })
//         }

         

//     } catch (error) {
        
//     }
// } need to implement also for unfollow