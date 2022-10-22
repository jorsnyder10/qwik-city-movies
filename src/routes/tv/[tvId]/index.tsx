import { component$, Resource } from "@builder.io/qwik";
import { RequestEvent, useEndpoint } from "@builder.io/qwik-city";
import { z } from "zod";
import { TvHero } from "~/modules/TvHero/TvHero";
import type { inferPromise } from "~/services/types";
import { paths } from "~/utils/paths";

export const onGet = async (event: RequestEvent) => {
  const parseResult = z
    .object({ tvId: z.number().min(0).step(1) })
    .safeParse({ tvId: +event.params.tvId });

  if (!parseResult.success) {
    throw event.response.redirect(paths.notFound);
  }

  const { getTvShow } = await import("~/services/tmdb");

  try {
    const movie = await getTvShow({ id: parseResult.data.tvId });
    return movie;
  } catch {
    throw event.response.redirect(paths.notFound);
  }
};

export default component$(() => {
  const resource = useEndpoint<inferPromise<typeof onGet>>();

  return (
    <Resource
      value={resource}
      onPending={() => <div>Loading...</div>}
      onRejected={() => <div>Rejected</div>}
      onResolved={(data) => <TvHero media={data} />}
    />
  );
});