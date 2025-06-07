import bcrypt from "bcryptjs";
import User from "../models/user.js";
import inngest from "../inngest/client.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { email, password, skills = [] } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, skills });

    await inngest.send({
      name: "user/signup",
      data: {
        email,
      },
    });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (error) {
    console.error("SignUp failed due to some error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: "User Not Found!" });

    const isPasswordSame = await bcrypt.compare(password, user.password);

    if (!isPasswordSame)
      return res.status(400).json({ error: "Invalid credentials! Try again" });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (error) {
    console.error("Error occurred while logging in:", error);
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized Access!" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Unauthorized Access!" });
      else return res.json({ message: "Logged Out Successfully!" });
    });
  } catch (error) {
    console.error("Error occurred while logging out:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, role, skills = [] } = req.body;

    if (req.user?.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findOne({ email });
    if (!user) res.status(401).json({ error: "User Not Found!" });

    const updatedUser = await User.updateOne(
      { email },
      { skills: skills.length ? skills : user, skills, role }
    );

    return res.status(200).json({message: "User updated successfully!",updatedUser})
  } catch (error) {
    console.error("Error occurred while updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ error: "Forbidden" });

    const users = await User.find().select("-passowrd");
    return res.json(users);
  } catch (error) {
    console.error("Error occurred while getting users:", error);
    res.status(500).json({ error: error.message });
  }
};
