import { useCloudinaryUpload } from "@/features/upload/hooks/use-cloudinary-upload";

export default function Test() {
  const { upload } = useCloudinaryUpload();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const result = await upload(file);

    console.log(result);
  };

  return <input type="file" onChange={handleChange} />;
}
