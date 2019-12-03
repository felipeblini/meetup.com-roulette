import axios from "axios";
import jsonpAdapter from "axios-jsonp";
import { apiurl, emptyMemberPhoto } from "../config/constants";

const formatReturn = (result, groupName) =>
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
      ? formatReturn(members.data.data, groupName)
      : () => [];

  return result;
};

const getEventRSVP = async (groupName, eventId) => {
  let res = await axios({
    url: `${apiurl}/${groupName}/events/${eventId}/rsvps`,
    adapter: jsonpAdapter
  });

  res = res.data.data;

  if (res.errors) return [];

  return formatReturn(res.filter(p => p.response === "yes").map(p => p.member));
};

export default {
  getMembers,
  getEventRSVP
};
