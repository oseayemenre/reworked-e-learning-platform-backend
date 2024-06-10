import "reflect-metadata";

import { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";

import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";

import { Bcrypt } from "./utils/bcrypt";
import { JWT } from "./utils/jwt";
import { Validator } from "./utils/validator";
import { AuthService } from "./service/auth.service";
import { AuthRepository } from "./repository/auth.repository";

import "./controller/auth.controller";
import {
  IAuthRepository,
  IAuthService,
  IBcrypt,
  IJWT,
  IValidator,
} from "./interface/auth.interface";

import { INTERFACE_TYPE } from "./utils/constants";

export class Application {
  private readonly container;
  private readonly server;

  constructor() {
    this.container = new Container();
    this.server = new InversifyExpressServer(this.container);
  }

  public run(port: number) {
    this.container.bind<IBcrypt>(INTERFACE_TYPE.BCRYPT).to(Bcrypt);
    this.container.bind<IJWT>(INTERFACE_TYPE.JWT).to(JWT);
    this.container.bind<IValidator>(INTERFACE_TYPE.IVALIDATOR).to(Validator);
    this.container
      .bind<IAuthService>(INTERFACE_TYPE.AUTHSERVICE)
      .to(AuthService);
    this.container
      .bind<IAuthRepository>(INTERFACE_TYPE.AUTHREPOSITORY)
      .to(AuthRepository);

    this.server.setConfig((app) => {
      app.use(cors());
      app.use(helmet());
      app.use(morgan("dev"));
      app.use(express.json());
      app.use(
        express.urlencoded({
          extended: true,
        })
      );
      app.use(cookieParser());
    });

    const app = this.server.build();

    app.get("/", (req: Request, res: Response) => {
      res.send("Home route Reached");
    });

    app.get("*", (req: Request, res: Response) => {
      res.send("Route doesn't exist");
    });

    app.listen(port, () => {
      console.log(`App is currently listening on PORT: ${port}`);
    });
  }
}
