import { component$, Resource } from "@builder.io/qwik";
import { RequestEvent, useEndpoint, useLocation } from "@builder.io/qwik-city";
import { z } from "zod";
import { MediaGrid } from "~/modules/MediaGrid/MediaGrid";
import type { inferPromise } from "~/services/types";
import { getListItem } from "~/utils/format";
import { paths } from "~/utils/paths";

export const onGet = async (event: RequestEvent) => {
  const parseResult = z
    .object({ name: z.string().min(1) })
    .safeParse(event.params);

  if (!parseResult.success) {
    throw event.response.redirect(paths.notFound);
  }

  const { getMovies, getTrending } = await import("~/services/tmdb");
  const name = parseResult.data.name;

  try {
    const movies =
      name === "trending"
        ? await getTrending({ mediaType: "movie", page: 1 })
        : await getMovies({ page: 1, query: name });
    return movies;
  } catch {
    throw event.response.redirect(paths.notFound);
  }
};

export default component$(() => {
  const location = useLocation();

  const resource = useEndpoint<inferPromise<typeof onGet>>();

  return (
    <main>
      <div>
        <div>
          <h2>{getListItem({ query: location.params.name, type: "movie" })}</h2>
        </div>
        <div>
          <Resource
            value={resource}
            onPending={() => <div>Loading...</div>}
            onRejected={() => <div>Rejected</div>}
            onResolved={(data) => (
              <MediaGrid mediaType="movie" collection={data.results || []} />
            )}
          />
        </div>
      </div>
    </main>
  );
});