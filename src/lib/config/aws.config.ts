export default () => ({
  aws: {
    connection: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    bucket: process.env.AWS_BUCKET,
  },
});
