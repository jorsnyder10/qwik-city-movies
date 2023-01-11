import { z } from "zod";

const schema = z.object({
  VITE_TMDB_API_KEY: z.string(),
});

export const serverEnv = schema.parse({
  VITE_TMDB_API_KEY: "d11a6bd440d4b664e2227838d0119fb9",
});

//  api_key=d11a6bd440d4b664e2227838d0119fb9
// VITE_TMDB_API_KEY: z.string(),
// export const serverEnv = schema.parse(import.meta.env);
