import redis from '../index';

const generatePollBoxId = (entityId: string) => `pollBox:${entityId}`;

const get = async (entityId: string) => {
  const pollBoxId = generatePollBoxId(entityId);
  const pollBox = await redis.hGetAll(pollBoxId);
  return pollBox;
};

export default get;
