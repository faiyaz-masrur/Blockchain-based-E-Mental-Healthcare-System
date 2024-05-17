/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
// {
//     nid: "5105687633",
//     name: "Mohit Kamal",
//     email: "mohit.kamal@gmail.com",
//     phone: "016205080624",
//     address: "Popular Diagnostic Center, Shantinagar",
//     degree: "MBBS, MPhil (Psychiatry), PhD (Psychiatry), FWPA (USA), CME-WCP",
//     website: "www.mohitkamal.com",
//     specialization:
//         "Psychiatry (Mental Diseases) Specialist & Psychotherapist",
//     experience: "15 years",
//     fees: "1000",
//     consultationStartTime: "07:00",
//     consultationEndTime: "10:00",
//     consultationDuration: "1 Hour",
//     userType: "doctor",
//     status: "approved",
//     createdAt: "13/07/2021, 09:49",
//     appointment: [],
//     password:
//         "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
// },
// {
//     nid: "5105687634",
//     name: "Redwana Hossain",
//     email: "redwana.hossain@gmail.com",
//     phone: "01711349823",
//     address:
//         "Shaheed Suhrawardy Medical College & Hospital, Panthapath",
//     degree: "MBBS, BCS (Health), MD (Psychiatry)",
//     website: "www.redwanahossain.com",
//     specialization:
//         "Drug Addiction, Dementia & Female Psychosexual Disorder",
//     experience: "12 years",
//     fees: "800",
//     consultationStartTime: "03:00",
//     consultationEndTime: "06:00",
//     consultationDuration: "50 minutes",
//     userType: "doctor",
//     status: "approved",
//     createdAt: "22/04/2020, 05:33",
//     appointment: [],
//     password:
//         "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
// },
// {
//     nid: "5105687635",
//     name: "Waziul Alam Chowdhury",
//     email: "waziul.chowdhury@gmail.com",
//     phone: "01965982200",
//     address:
//         "Anwer Khan Modern Medical College Hospital, Dhanmondi",
//     degree: "MBBS, FCPS (Psychiatry), MACP (USA), WHO Fellowship (India)",
//     website: "www.waziulchowdhury.com",
//     specialization: "Psychiatry & Mental Health Specialist",
//     experience: "14 years",
//     fees: "900",
//     consultationStartTime: "04:30",
//     consultationEndTime: "08:30",
//     consultationDuration: "1 Hour",
//     userType: "doctor",
//     status: "approved",
//     createdAt: "13/07/2020, 10:04",
//     appointment: [],
//     password:
//         "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
// },

const { Contract } = require("fabric-contract-api");

class fabMed extends Contract {
    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        const users = [
            {
                nid: "5104687630",
                name: "John Doe",
                email: "john.doe@gmail.com",
                phone: "01303940674",
                address: "Bangladesh Specialized Hospital, Shyamoli",
                degree: "MBBS, MCPS, MPHIL",
                website: "www.johndoe.com",
                specialization: "Brain, Drug Addiction, Sex",
                experience: "5 years",
                fees: "600",
                consultationStartTime: "17:00 pm",
                consultationEndTime: "20:00 pm",
                consultationDuration: "35",
                userType: "doctor",
                status: "approved",
                createdAt: "17/02/2021, 10:45",
                appointments: [],
                password:
                    "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
            },
            {
                nid: "5104687631",
                name: "Michale Colings",
                email: "michale.colings@gmail.com",
                phone: "01409945671",
                address: "Ibn Sina Diagnostic Center, Dhanmondi",
                degree: "MBBS, MCPS, MPHIL(Psychiatry), MMED",
                website: "www.michalecolings.com",
                specialization: "Brain, Drug Addiction, Anxiety & Depression",
                experience: "7 years",
                fees: "800",
                consultationStartTime: "10:00 am",
                consultationEndTime: "15:00 pm",
                consultationDuration: "50",
                userType: "doctor",
                status: "approved",
                createdAt: "05/11/2022, 01:05",
                appointments: [],
                password:
                    "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
            },
            {
                nid: "5104687632",
                name: "Shanaj Karim",
                email: "shanaj.karim@gmail.com",
                phone: "01747911999",
                address: "Labaid Hospital, Chittagong",
                degree: "MBBS, FCPS, Fellow WPa (Psychiatry)",
                website: "www.shanajkarim.com",
                specialization:
                    "Anxiety, Depression, Psychiatrist & Psychotherapist",
                experience: "4 years",
                fees: "600",
                consultationStartTime: "11:00 am",
                consultationEndTime: "17:00 pm",
                consultationDuration: "35",
                userType: "doctor",
                status: "approved",
                createdAt: "10/12/2022, 04:27",
                appointments: [],
                password:
                    "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
            },
            {
                nid: "5104687636",
                name: "Admin01",
                email: "admin01@example.com",
                userType: "admin",
                status: "approved",
                createdAt: "01/01/2020",
                appointments: [],
                password:
                    "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
            },
            {
                nid: "5104687638",
                name: "Patient01",
                email: "patient01@example.com",
                phone: "01911956372",
                userType: "patient",
                status: "approved",
                createdAt: "06/03/2023",
                appointments: [],
                records: [],
                password:
                    "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
            },
            {
                nid: "5104687639",
                name: "Patient02",
                email: "patient02@example.com",
                phone: "01736112200",
                userType: "patient",
                status: "approved",
                createdAt: "31/08/2023",
                appointments: [],
                records: [],
                password:
                    "$2a$10$4i4cFW1y1EKp0gqYPl3jH.vbPr43OT..l6MgWf.f.AaddQNeaK.WK",
            },
        ];

        for (let i = 0; i < users.length; i++) {
            await ctx.stub.putState(
                users[i].nid,
                Buffer.from(JSON.stringify(users[i]))
            );
            console.info(
                `User ${users[i].name} type ${users[i].userType} is added`
            );
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    async queryUser(ctx, userKey) {
        try {
            const userAsBytes = await ctx.stub.getState(userKey); // get the user from chaincode state
            console.log(userAsBytes.toString());
            return userAsBytes.toString();
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async createUser(
        ctx,
        key,
        name,
        email,
        phone,
        password,
        userType,
        status,
        createdAt
    ) {
        try {
            console.info("============= START : Create User ===========");

            const user = {
                nid: key,
                name,
                email,
                phone,
                password,
                userType,
                status,
                createdAt,
                appointments: [],
                records: [],
            };

            await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
            console.info("============= END : Create User ===========");
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async storeDoctor(
        ctx,
        key,
        name,
        email,
        password,
        userType,
        phone,
        degree,
        address,
        website,
        specialization,
        experience,
        fees,
        consultationStartTime,
        consultationEndTime,
        consultationDuration,
        status,
        createdAt
    ) {
        try {
            console.info("============= START : Create Doctor ===========");

            const doctor = {
                nid: key,
                name,
                email,
                password,
                userType,
                phone,
                degree,
                address,
                website,
                specialization,
                experience,
                fees,
                consultationStartTime,
                consultationEndTime,
                consultationDuration,
                status,
                createdAt,
                appointments: [],
            };

            await ctx.stub.putState(key, Buffer.from(JSON.stringify(doctor)));
            console.info("============= END : Create Doctor ===========");
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async queryAllUsers(ctx) {
        try {
            const startKey = "";
            const endKey = "";
            const allResults = [];
            for await (const { value } of ctx.stub.getStateByRange(
                startKey,
                endKey
            )) {
                const strValue = Buffer.from(value).toString("utf8");
                let result = JSON.parse(strValue);
                allResults.push(result);
            }
            console.info(allResults);
            return JSON.stringify(allResults);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async changeUserStatus(ctx, userKey, otherKey, newStatus, createdAt) {
        try {
            console.info("============= START : changeUserStatus ===========");

            const userAsBytes = await ctx.stub.getState(userKey); // get the user from chaincode state
            if (!userAsBytes || userAsBytes.length === 0) {
                throw new Error(`${userAsBytes} does not exist`);
            }
            const user = JSON.parse(userAsBytes.toString());
            user.status = newStatus;

            await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
            console.info("============= END : changeUserStatus ===========");
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async queryAppointment(ctx, userKey) {
        try {
            const userAsBytes = await ctx.stub.getState(userKey); // get the user from chaincode state
            const user = JSON.parse(userAsBytes.toString());
            return user.appointments;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async storeAppointment(
        ctx,
        doctorKey,
        patientKey,
        doctorName,
        doctorEmail,
        doctorPhone,
        patientName,
        patientEmail,
        patientPhone,
        date,
        startTime,
        endTime,
        status,
        createdAt,
        sessionId
    ) {
        try {
            const doctorAsBytes = await ctx.stub.getState(doctorKey); // get the user from chaincode state
            const doctor = JSON.parse(doctorAsBytes.toString());
            const patientAsBytes = await ctx.stub.getState(patientKey); // get the user from chaincode state
            const patient = JSON.parse(patientAsBytes.toString());
            const appointment = {
                doctorKey,
                patientKey,
                doctorName,
                doctorEmail,
                doctorPhone,
                patientName,
                patientEmail,
                patientPhone,
                date,
                startTime,
                endTime,
                status,
                createdAt,
                sessionId,
            };
            doctor.appointments.push(appointment);
            patient.appointments.push(appointment);

            await ctx.stub.putState(
                doctorKey,
                Buffer.from(JSON.stringify(doctor))
            );
            await ctx.stub.putState(
                patientKey,
                Buffer.from(JSON.stringify(patient))
            );
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async removeAppointment(ctx, userKey, doctorKey, patientKey, createdAt) {
        try {
            const userAsBytes = await ctx.stub.getState(userKey);
            const user = JSON.parse(userAsBytes.toString());
            const appointments = user.appointments;
            for (let i = 0; i < appointments.length; i++) {
                if (
                    appointments[i].doctorKey === doctorKey &&
                    appointments[i].patientKey === patientKey &&
                    appointments[i].createdAt === createdAt
                ) {
                    appointments.splice(i, 1);
                    break;
                }
            }
            user.appointments = appointments;
            await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async changeAppointmentStatus(ctx, key, otherKey, newStatus, createdAt) {
        try {
            const userAsBytes = await ctx.stub.getState(key);
            const user = JSON.parse(userAsBytes.toString());
            const otherUserAsBytes = await ctx.stub.getState(otherKey);
            const otherUser = JSON.parse(otherUserAsBytes.toString());
            const userAppointments = user.appointments;
            const otherUserAppointments = otherUser.appointments;
            for (let i = 0; i < userAppointments.length; i++) {
                if (
                    userAppointments[i].doctorKey === key &&
                    userAppointments[i].patientKey === otherKey &&
                    userAppointments[i].createdAt === createdAt
                ) {
                    userAppointments[i].status = newStatus;
                    break;
                }
            }
            for (let i = 0; i < otherUserAppointments.length; i++) {
                if (
                    otherUserAppointments[i].doctorKey === key &&
                    otherUserAppointments[i].patientKey === otherKey &&
                    otherUserAppointments[i].createdAt === createdAt
                ) {
                    otherUserAppointments[i].status = newStatus;
                    break;
                }
            }
            user.appointments = userAppointments;
            otherUser.appointments = otherUserAppointments;
            await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
            await ctx.stub.putState(
                otherKey,
                Buffer.from(JSON.stringify(otherUser))
            );
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async storeRecord(
        ctx,
        doctorKey,
        patientKey,
        doctorName,
        disease,
        dataHash,
        fileName,
        createdAt
    ) {
        try {
            const patientAsBytes = await ctx.stub.getState(patientKey); // get the user from chaincode state
            const patient = JSON.parse(patientAsBytes.toString());
            const data = {
                doctorKey,
                doctorName,
                disease,
                dataHash,
                fileName,
                createdAt,
            };
            patient.records.push(data);
            await ctx.stub.putState(
                patientKey,
                Buffer.from(JSON.stringify(patient))
            );
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async removeRecord(ctx, doctorKey, patientKey, dataHash, createdAt) {
        try {
            const userAsBytes = await ctx.stub.getState(patientKey);
            const user = JSON.parse(userAsBytes.toString());
            const records = user.records;
            for (let i = 0; i < records.length; i++) {
                if (
                    records[i].doctorKey === doctorKey &&
                    records[i].dataHash === dataHash &&
                    records[i].createdAt === createdAt
                ) {
                    records.splice(i, 1);
                    break;
                }
            }
            user.records = records;
            await ctx.stub.putState(
                patientKey,
                Buffer.from(JSON.stringify(user))
            );
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

module.exports = fabMed;
