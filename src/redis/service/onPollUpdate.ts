import popPollQueue from './popPollQueue';
import getPollBox from './getPollBox';

export default async (message: string) => {
  console.log({ message });
  const pollId = await popPollQueue();
  console.log({ pollId });
  const pollBox = await getPollBox(pollId);
  console.log({ pollBox });
};
