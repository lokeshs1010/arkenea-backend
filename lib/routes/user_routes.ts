import { Application, Request, Response } from "express";
import { UserController } from "../controllers/userController";
import * as multer from 'multer';

const upload = multer({
  dest: "uploads/"
});

export class TestRoutes {
  private user_controller: UserController = new UserController();

  public route(app: Application) {
    app.post("/api/user", upload.single('profile_image'), (req: Request, res: Response) => {
      this.user_controller.create_user(req, res);
    });

    app.get("/api/user/:id", (req: Request, res: Response) => {
      this.user_controller.get_user(req, res);
    });

    app.get("/api/users", (req: Request, res: Response) => {
        this.user_controller.get_users(req, res);
      });

    app.put("/api/user/:id", (req: Request, res: Response) => {
      this.user_controller.update_user(req, res);
    });

    app.delete("/api/user/:id", (req: Request, res: Response) => {
      this.user_controller.delete_user(req, res);
    });
  }
}
