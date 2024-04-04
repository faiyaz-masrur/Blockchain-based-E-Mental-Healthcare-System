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

    async createUser(
        ctx,
        key,
        name,
        email,
        password,
        userType,
        status,
        createdAt
    ) {
        console.info("============= START : Create User ===========");

        const user = {
            nid: key,
            name,
            email,
            password,
            userType,
            status,
            createdAt,
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
        console.info("============= END : Create User ===========");
    }

    async createDoctor(
        ctx,
        key,
        name,
        email,
        password,
        userType,
        phone,
        address,
        website,
        specialization,
        experience,
        fees,
        consultationStartTime,
        consultationEndTime,
        status,
        createdAt
    ) {
        console.info("============= START : Create Doctor ===========");

        const doctor = {
            nid: key,
            name,
            email,
            password,
            userType,
            phone,
            address,
            website,
            specialization,
            experience,
            fees,
            consultationStartTime,
            consultationEndTime,
            status,
            createdAt,
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(doctor)));
        console.info("============= END : Create Doctor ===========");
    }

    async queryAllUsers(ctx) {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let result;
            try {
                result = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                result = strValue;
            }
            allResults.push(result);
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async userStatus(ctx, userKey, newStatus) {
        console.info("============= START : changeUserStatus ===========");

        const userAsBytes = await ctx.stub.getState(userKey); // get the user from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${userAsBytes} does not exist`);
        }
        const user = JSON.parse(userAsBytes.toString());
        user.status = newStatus;

        await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
        console.info("============= END : changeUserStatus ===========");
    }
}

module.exports = fabMed;
