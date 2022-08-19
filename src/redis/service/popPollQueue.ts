import redis from '../index';

const QUEUE_NAME = 'queue:polls';

const popPollQueue = async () => {
  const pollId = await redis.rPop(QUEUE_NAME);
  return pollId;
};

export default popPollQueue;
