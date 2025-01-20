import WelcomeIsland from "../islands/WelcomeIsland.tsx";

export default function Welcome() {
  return (
    <div id="app">
      <div class="flex flex-col gap-2 justify-center min-h-screen w-full">
        <WelcomeIsland />
      </div>
    </div>
  );
}
