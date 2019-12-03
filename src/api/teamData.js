import axios from "axios";

const teamApi = async () => {
  const { data } = await axios.get("http://api.collegefootballdata.com/teams");
  console.log(data);
  return data;
};

export { teamApi };
