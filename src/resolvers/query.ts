import { IResolvers } from "graphql-tools";
import JWT from "../lib/jwt";
import bcryptjs from 'bcryptjs';

const query: IResolvers = {
  Query: {
    async users(_: void, __: any, { db }): Promise<any> {
      return await db
        .collection("users")
        .find()
        .toArray();
    },
    async login(_: void, { email, password }, { db }): Promise<any> {
      const user = await db.collection("users").findOne({ email });
      if (user === null) {
        return {
          status: false,
          message: "Login INCORRECTO. No existe el usuario",
          token: null
        };
      }

      if (!bcryptjs.compare(password, user.password)) {
        return {
          status: false,
          message: "Login INCORRECTO. Contraseña incorrecta",
          token: null
        };
      }

      delete user.password;
      //   user.password = "=)";
      return {
        status: true,
        message: "Login Correcto",
        token: new JWT().sign({ user })
      };
    }
  }
};

export default query;
