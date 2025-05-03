import { useEffect, useState } from "react";
import { Image as ExpoImage } from "expo-image";

interface AuthorizedImageProps {
  source: string;
  style?: any;
  contentFit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

export const AuthorizedImage = ({
  source,
  style,
  contentFit,
}: AuthorizedImageProps) => {
  const [imageUri, setImageUri] = useState<string>(source);

  useEffect(() => {
    if (source.includes("api.airbuckets.cloud")) {
      setImageUri(source);
    } else {
      setImageUri(source);
    }
  }, [source]);

  return (
    <ExpoImage
      source={{
        uri: imageUri,
        headers: source.includes("api.airbuckets.cloud")
          ? {
              Authorization: `Bearer ${process.env.EXPO_PUBLIC_AIRBUCKETS_API_KEY}`,
            }
          : undefined,
      }}
      style={style}
      contentFit={contentFit}
    />
  );
};
