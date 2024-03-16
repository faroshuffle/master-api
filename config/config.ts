export default () => ({
  port: parseInt(process.env.PORT, 10) || 9090,
  database_url: process.env.DATABASE_URL,
  cloudinary_name: process.env.CLOUDINARY_NAME,
  cloudinary_public: process.env.CLOUDINARY_PUBLIC,
  cloudinary_private: process.env.CLOUDINARY_PRIVATE,
});
