import { IUser } from "./model";
import users from "./schema";

export default class UserService {
  public async createUser(user_params: IUser) {
    const _session = new users(user_params);
    return _session.save();
  }

  public async filterUser(query: any) {
    return users.findOne(query);
  }

  public async getUsers(query: any) {
    return users.find(query);
  }

  public async updateUser(user_params: IUser) {
    const query = { _id: user_params._id };
    return users.findOneAndUpdate(query, user_params);
  }

  public async deleteUser(_id: String) {
    const query = { _id: _id };
    return users.deleteOne(query);
  }
}
