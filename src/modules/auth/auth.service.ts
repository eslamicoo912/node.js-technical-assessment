import bcrypt from "bcrypt";
import { UserRepository } from "../user/user.repository";
import { generateToken } from "../../shared/utils/jwt";
import { IRegisterInput, ILoginInput, IAuthResponse } from "./auth.interfaces";
import { env } from "../../shared/config/env";
import { AppError } from "../../shared/utils/app-error";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(input: IRegisterInput): Promise<IAuthResponse> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError("Email is already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, env.SALT_ROUNDS);

    const newUser = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: "Member",
    });

    const token = generateToken({
      userId: newUser._id.toString(),
      role: newUser.role,
    });

    return {
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

  async login(input: ILoginInput): Promise<IAuthResponse> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordMatch = await bcrypt.compare(input.password, user.password);
    if (!isPasswordMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
