import axios from "axios";
import jsonpAdapter from "axios-jsonp";
import { apiurl, emptyMemberPhoto } from "../config/constants";

const _formatResult = (result, groupName) =>
  result.map(item => ({
    ...item,
    profilePhoto: item.photo ? item.photo.thumb_link : emptyMemberPhoto,
    profileLink: `https://www.meetup.com/${groupName}/members/${item.id}`
  }));

const getMembers = async groupName => {
  const members = await axios({
    url: `${apiurl}/${groupName}/members`,
    adapter: jsonpAdapter
  });

  const result =
    members.data.data.errors === undefined
      ? _formatResult(members.data.data, groupName)
      : () => [];

  console.log({ result });

  return result;
};

const getEventRSVP = async (groupName, eventId) => {
  const members = await axios({
    url: `${apiurl}/${groupName}/events/${eventId}/rsvps`,
    adapter: jsonpAdapter
  });

  const result =
    members.data.data.errors === undefined
      ? _formatResult(members.data.data, groupName)
      : () => [];

  console.log({ result });

  return result.filter(p => p.response === "yes").map(p => p.member);
};

export default {
  getMembers,
  getEventRSVP
};
