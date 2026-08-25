import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import genToken from "../utils/genToken.js";

const cookieOptions = {
    httpOnly : true,
    //we have to avoid XSS and CSRF attacks
}

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    if (!username || !name || !email || !password) {
      return res.status(422).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(422).json({
        message: "Username already exists",
      });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(422).json({
        message: "Email already exists",
      });
    }

    if (password.length <= 6) {
      return res.status(422).json({
        message: "Password must be greater than 6 characters",
      });
    }

    //const salt = await bcrypt.genSalt(10)
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = genToken(newUser._id);

    res.cookie("token", token, cookieOptions)
    res.status(200).json(newUser);
  } catch {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const correctPassword = bcrypt.compareSync(password, userExists.password);

    if (!correctPassword) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = genToken(userExists._id)
    res.cookie("token", token, cookieOptions)

    res.status(200).json({
      message: "Login Successfull",
      user: userExists,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const getUser = () => {
    
}
