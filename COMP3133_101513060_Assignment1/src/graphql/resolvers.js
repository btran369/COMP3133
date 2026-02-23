import { User } from "../models/User.js";
import { Employee } from "../models/Employee.js";
import { badRequest, notFound } from "../utils/errors.js";
import { signToken, requireAuth } from "./auth.js";
import { uploadImageBuffer } from "../config/cloudinary.js";

function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(str || "").trim());
}

function normalizeGender(g) {
  const v = String(g || "").trim();
  if (["Male", "Female", "Other"].includes(v)) return v;
  return null;
}

//screw it, raw buffer
function isPng(buffer) {
  // 89 50 4E 47 0D 0A 1A 0A
  return (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

function isJpeg(buffer) {
  // FF D8 FF
  return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

async function fileToBuffer(uploadPromise) {
  if (!uploadPromise) return null;

  const upload = await uploadPromise;
  const { filename, mimetype, createReadStream } = upload;

  const stream = createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  // Validate by content (works even if mimetype is missing)
  if (!isPng(buffer) && !isJpeg(buffer)) {
    throw badRequest(
      `Employee photo must be PNG or JPEG (got mimetype: ${mimetype || "unknown"}, filename: ${filename || "unknown"})`
    );
  }

  return { buffer, filename, mimetype };
}

export const resolvers = {
  Query: {
    async Login(_, { input }) {
      const usernameOrEmail = String(input.usernameOrEmail || "").trim();
      const password = String(input.password || "");

      if (!usernameOrEmail || !password) throw badRequest("Username/Email and password are required");

      const user = await User.findOne(
        isEmail(usernameOrEmail)
          ? { email: usernameOrEmail.toLowerCase() }
          : { username: usernameOrEmail }
      );

      if (!user) {
        return { success: "false", message: "Invalid credentials", token: null, user: null };
      }

      const ok = await user.comparePassword(password);
      if (!ok) {
        return { success: "false", message: "Invalid credentials", token: null, user: null };
      }

      const token = signToken(user);
      return { success: "true", message: "Login successful", token, user };
    },

    async GetAllEmployees(_, __, context) {
      requireAuth(context);
      return Employee.find().sort({ created_at: -1 });
    },

    async SearchEmployeeByEid(_, { eid }, context) {
      requireAuth(context);
      const emp = await Employee.findById(eid);
      if (!emp) throw notFound("Employee not found");
      return emp;
    },

    async SearchEmployeeByDesignationOrDepartment(_, { designation, department }, context) {
      requireAuth(context);

      const filter = {};
      if (designation) filter.designation = String(designation).trim();
      if (department) filter.department = String(department).trim();

      if (!filter.designation && !filter.department) {
        throw badRequest("Provide designation or department");
      }

      return Employee.find(filter).sort({ created_at: -1 });
    }
  },

  Mutation: {
    async Signup(_, { input }) {
      const username = String(input.username || "").trim();
      const email = String(input.email || "").trim().toLowerCase();
      const password = String(input.password || "");

      if (username.length < 3) throw badRequest("Username must be at least 3 characters");
      if (!isEmail(email)) throw badRequest("Invalid email");
      if (password.length < 6) throw badRequest("Password must be at least 6 characters");

      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { success: "true", message: "Signup successful", token, user };
      } catch (e) {
        if (e?.code === 11000) {
          const field = Object.keys(e.keyPattern || {})[0] || "field";
          throw badRequest(`Duplicate ${field}`);
        }
        throw e;
      }
    },

    async AddEmployee(_, { input, photo }, context) {
      requireAuth(context);

      // Validate required fields and rules
      const gender = normalizeGender(input.gender);
      if (!gender) throw badRequest("Gender must be Male, Female, or Other");

      if (!isEmail(input.email)) throw badRequest("Invalid employee email");
      if (Number(input.salary) < 1000) throw badRequest("Salary must be >= 1000");

      let photoUrl = "";
      if (photo) {
        const file = await fileToBuffer(photo);
        const result = await uploadImageBuffer(file);
        photoUrl = result.secure_url || result.url || "";
      }

      try {
        const emp = await Employee.create({
          ...input,
          gender,
          email: String(input.email).toLowerCase(),
          date_of_joining: new Date(input.date_of_joining),
          employee_photo: photoUrl
        });

        return { success: "true", message: "Employee created", employee: emp };
      } catch (e) {
        if (e?.code === 11000) throw badRequest("Duplicate employee email");
        if (e?.name === "ValidationError") throw badRequest("Validation failed", e.errors);
        throw e;
      }
    },

    async UpdateEmployeeByEid(_, { eid, input, photo }, context) {
      requireAuth(context);

      const update = { ...input };

      if (update.email) {
        if (!isEmail(update.email)) throw badRequest("Invalid employee email");
        update.email = String(update.email).trim().toLowerCase();
      }

      if (update.gender) {
        const g = normalizeGender(update.gender);
        if (!g) throw badRequest("Gender must be Male, Female, or Other");
        update.gender = g;
      }

      if (update.salary != null && Number(update.salary) < 1000) {
        throw badRequest("Salary must be >= 1000");
      }

      if (update.date_of_joining) {
        update.date_of_joining = new Date(update.date_of_joining);
      }

      if (photo) {
        const file = await fileToBuffer(photo);
        const result = await uploadImageBuffer(file);
        update.employee_photo = result.secure_url || result.url || "";
      }

      try {
        const emp = await Employee.findByIdAndUpdate(eid, update, {
          new: true,
          runValidators: true
        });
        if (!emp) throw notFound("Employee not found");
        return { success: "true", message: "Employee updated", employee: emp };
      } catch (e) {
        if (e?.code === 11000) throw badRequest("Duplicate employee email");
        if (e?.name === "ValidationError") throw badRequest("Validation failed", e.errors);
        throw e;
      }
    },

    async DeleteEmployeeByEid(_, { eid }, context) {
      requireAuth(context);

      const emp = await Employee.findByIdAndDelete(eid);
      if (!emp) throw notFound("Employee not found");
      return { success: "true", message: "Employee deleted" };
    }
  }
};