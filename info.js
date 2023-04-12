const token =
  "BQBpBwgHN7zmfD4mfdavS2wv2KAz-vo7qblKWcG6mxsNxCiDSatdGaz6APBB-VRPCLUwKAZrrFEbOLLp7-0_eePdb4cxlDrxBfBV1jg4IjGTIIPXkOjWdQMG9SYdIBrFMAtJESHiBPHJ8yiJy1iLbHe-3xoS-e-G9DEMJeepKqMUJSpEqxf_747031hs8-5UFXH9O1V-U7V1JZfdLpsXo8aRPNtrWMQTBCk0Z7MrcQGUz3XTD-dDuEWiHk_jbDQn4YImfImHdfqahOTAtKxSg5n56MYMDBTlu8H9YceSZ9WM80Qfh7_lk7gH3Tzc6zodSDjq-t85m54_Asp8Jzr1Hg";
const spotifyWebApi = require("spotify-web-api-node");
const fs = require("fs");

const spotifyApi = new spotifyWebApi();
spotifyApi.setAccessToken(token);

function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    console.log(me.body);

    // console.log(typeof(me.body.id));
    getUserPlaylists(me.body.id);

    // This is not working
    // getUserPlaylists('9cc0cfd4d7d7885102480dd99e7a90d6');
  })().catch((e) => {
    console.error(e);
  });
}

getMyData();

async function getUserPlaylists(userId) {
  const data = await spotifyApi.getUserPlaylists(userId);
  console.log(`--------------------------`);

  for (const playlist of data.body.items) {
    // console.log(playlist);
    console.log(`Name : ${playlist.name}, \nid : ${playlist.id}, \nOwner : ${playlist.owner.display_name}\n\n`
    );
  }
}
