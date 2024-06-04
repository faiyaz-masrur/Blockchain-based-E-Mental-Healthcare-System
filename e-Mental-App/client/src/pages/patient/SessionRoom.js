import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const SessionRoom = () => {
    const { roomId } = useParams();

    const session = async (element) => {
        const userNid = "3454645";
        const userName = "dfgef";
        const appID = 759841595;
        const serverSecret = "b48499a98bd3cc41ff2a1cfc073a07fa";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            userNid,
            userName
        );
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showPreJoinView: false,
        });
    };

    return (
        <div>
            <div ref={session} style={{ width: "100vw", height: "100vh" }} />
        </div>
    );
};

export default SessionRoom;
