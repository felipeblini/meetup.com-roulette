import axios from "axios";
import jsonpAdapter from "axios-jsonp";
import { apiurl } from "../config/constants";

const getMembers = async groupName => {
  const members = await axios({
    url: `${apiurl}/${groupName}/members`,
    adapter: jsonpAdapter
  });

  return members.data.data;
};

const getEventRSVP = async (groupName, eventId) => {
  const participants = await axios({
    url: `${apiurl}/${groupName}/events/${eventId}/rsvps`,
    adapter: jsonpAdapter
  });

  return participants.data.data
    .filter(p => p.response === "yes")
    .map(p => p.member);
};

export default {
  getMembers,
  getEventRSVP
};
