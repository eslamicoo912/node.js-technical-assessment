import { UserModel } from "../../database/models/user.model";
import { IUser } from "./user.interfaces";

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).exec();
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(userData);
    return await newUser.save();
  }
}
