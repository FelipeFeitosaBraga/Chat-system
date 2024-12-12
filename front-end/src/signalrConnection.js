import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7076/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

export default connection;
