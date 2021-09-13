import axios from 'axios';

export type WordCheckResponse = {
  validWords: string[];
};

const getValidWords = async (words: string[]): Promise<string[]> => {
  const response = await axios({
    method: 'post',
    url: `${process.env.FLASK_BACKEND_URL}/get-valid-words`,
    data: {
      words,
    },
  });
  const data = response.data as WordCheckResponse;
  return data.validWords;
};

export default getValidWords;
