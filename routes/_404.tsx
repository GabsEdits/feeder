import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="flex flex-col gap-2 justify-center min-h-screen w-full">
        <div class="flex flex-col gap-2 justify-center items-center">
          <h1 class="text-4xl font-bold">404</h1>
          <p class="text-lg">Page not found</p>
        </div>
      </div>
    </>
  );
}
