import { Datetime } from './../lib/datetime';
import { IResolvers } from "graphql-tools";

const mutation : IResolvers = {
    Mutation : {   
        async register(_: void, { user }, { db }) : Promise<any> {
            const lastUser = await db.collection('users').find()
            .limit(1).sort({ registerDate: -1 }).toArray();

            if (lastUser.length === 0) {
                user.id = 1;
            } else {
                user.id = lastUser[0].id + 1;
            }
            user.registerDate = new Datetime().getCurrentDateTime();
            return await db.collection('users').insertOne(user).then((result: any) => {
                return {
                    estatus: true,
                    message: `Usuario ${user.name} ${user.lastname} añadido correctamente`,
                    user
                };
            }).catch((err: any) => {
                return {
                    estatus: false,
                    message: `Usuario NO añadido correctamente`,
                    user: null
                };
            });
        }     
    }
}

export default mutation;