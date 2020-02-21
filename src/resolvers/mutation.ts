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
            await db.collection('users').insertOne(user);
            
            return user;
        }     
    }
}

export default mutation;