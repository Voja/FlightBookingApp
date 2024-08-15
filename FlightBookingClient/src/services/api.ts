import axios from "axios";

export const api = ({
  endpoint,
  config,
}: {
  endpoint: string;
  config?: Parameters<typeof axios>[1];
}) => {
  // console.log(endpoint, config);

  return axios(`https://localhost:5001/${endpoint}`, config);
};
