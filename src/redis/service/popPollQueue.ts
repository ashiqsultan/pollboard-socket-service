import constants from '../../constants';
import redis from '../index';

const { QUEUE_NAME } = constants;

const popPollQueue = async () => {
  const pollId = await redis.rPop(QUEUE_NAME);
  return pollId;
};

export default popPollQueue;
