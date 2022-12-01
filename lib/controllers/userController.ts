import { Request, Response } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IUser } from "../modules/users/model";
import UserService from "../modules/users/service";

export class UserController {
  private user_service: UserService = new UserService();

  public async create_user(req: Request, res: Response) {
    const { originalname } = req.file;
    const profile_image = originalname;
    const { name, email, phone_number } = req.body;
    const { first_name, last_name } = name;
    const isValid =
      name && first_name && last_name && email && phone_number && profile_image;
    if (isValid) {
      const user_params: IUser = {
        name: {
          first_name: req.body.name.first_name,
          last_name: req.body.name.last_name,
        },
        email: req.body.email,
        phone_number: req.body.phone_number,
        profile_image: req.body.profile_image,
        modification_notes: [
          {
            modified_on: new Date(Date.now()),
            modified_by: null,
            modification_note: "New user created",
          },
        ],
      };
      try {
        const user_data = await this.user_service.createUser(user_params);
        if (user_data) {
          successResponse("create user successfull", user_data, res);
        }
      } catch (err) {
        mongoError(err, res);
      }
    } else {
      // error response if some fields are missing in request body
      insufficientParameters(res);
    }
  }

  public async get_user(req: Request, res: Response) {
    if (req.params.id) {
      const user_filter = { _id: req.params.id };
      try {
        const user_data = await this.user_service.filterUser(user_filter);
        if (user_data) {
          successResponse("get user successfull", user_data, res);
        }
      } catch (err) {
        mongoError(err, res);
      }
    } else {
      insufficientParameters(res);
    }
  }

  public async get_users(_req: Request, res: Response) {
    try {
      const users_data: IUser[] = await this.user_service.getUsers({});
      if (users_data) {
        successResponse("get user successfull", users_data, res);
      }
    } catch (err) {
      mongoError(err, res);
    }
  }

  public async update_user(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, phone_number, profile_image } = req.body;
    const { first_name, last_name } = name;
    const isValid =
      id &&
      name &&
      first_name &&
      last_name &&
      email &&
      phone_number &&
      profile_image;

    if (isValid) {
      const user_filter = { _id: id };
      try {
        const user_data = await this.user_service.filterUser(user_filter);
        if (user_data) {
          user_data.modification_notes.push({
            modified_on: new Date(Date.now()),
            modified_by: null,
            modification_note: "User data updated",
          });
          const user_params: IUser = {
            _id: id,
            name: req.body.name
              ? {
                  first_name: req.body.name.first_name
                    ? req.body.name.first_name
                    : user_data.name.first_name,
                  last_name: req.body.name.first_name
                    ? req.body.name.last_name
                    : user_data.name.last_name,
                }
              : user_data.name,
            email: req.body.email ? req.body.email : user_data.email,
            phone_number: req.body.phone_number
              ? req.body.phone_number
              : user_data.phone_number,
            profile_image: req.body.profile_image
              ? req.body.profile_image
              : user_data.profile_image,
            is_deleted: req.body.is_deleted
              ? req.body.is_deleted
              : user_data.is_deleted,
            modification_notes: user_data.modification_notes,
          };
          const updatedData = await this.user_service.updateUser(user_params);
          if (updatedData) {
            successResponse("update user successfull", null, res);
          } else {
            failureResponse("invalid user", null, res);
          }
        }
      } catch (err) {
        mongoError(err, res);
      }
    } else {
      insufficientParameters(res);
    }
  }

  public async delete_user(req: Request, res: Response) {
    const { id } = req.params;
    if (id) {
      try {
        const delete_details = await this.user_service.deleteUser(id);
        if (delete_details.deletedCount !== 0) {
          successResponse("delete user successfull", null, res);
        } else {
          failureResponse("invalid user", null, res);
        }
      } catch (err) {
        mongoError(err, res);
      }
    } else {
      insufficientParameters(res);
    }
  }
}
