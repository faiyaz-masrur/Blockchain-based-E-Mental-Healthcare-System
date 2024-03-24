/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class fabMed extends Contract {
    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        const patientCount = {
            count: 0,
        };
        const doctorCount = {
            count: 0,
        };
        const researcherCount = {
            count: 0,
        };

        await ctx.stub.putState(
            "patient",
            Buffer.from(JSON.stringify(patientCount))
        );
        await ctx.stub.putState(
            "doctor",
            Buffer.from(JSON.stringify(doctorCount))
        );
        await ctx.stub.putState(
            "researcher",
            Buffer.from(JSON.stringify(researcherCount))
        );
        console.info("============= END : Initialize Ledger ===========");
    }

    async queryUser(ctx, userKey) {
        const userAsBytes = await ctx.stub.getState(userKey); // get the user from chaincode state
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    async createUser(ctx, key, name, email, password, userType) {
        console.info("============= START : Create User ===========");

        const user = {
            name,
            email,
            password,
            userType,
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
        console.info("============= END : Create User ===========");
    }

    async queryAllCars(ctx) {
        const startKey = "CAR0";
        const endKey = "CAR5";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info("============= START : changeCarOwner ===========");

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info("============= END : changeCarOwner ===========");
    }
}

module.exports = fabMed;
